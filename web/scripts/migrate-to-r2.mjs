#!/usr/bin/env node
/**
 * Migrate local static assets to the production R2 bucket (liberty).
 *
 * Usage:
 *   node scripts/migrate-to-r2.mjs              # dry-run (list files)
 *   node scripts/migrate-to-r2.mjs --execute    # actually upload
 *
 * Reads R2 credentials from web/.env
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

// ── Load .env ────────────────────────────────────────────────────
const envPath = join(ROOT, '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  env[key] = val
}

const R2_ENDPOINT = env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = env.R2_BUCKET_NAME

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing R2 credentials in .env')
  process.exit(1)
}

console.log(`\nR2 Config:`)
console.log(`  Endpoint: ${R2_ENDPOINT}`)
console.log(`  Bucket:   ${R2_BUCKET_NAME}`)
console.log(`  Key ID:   ${R2_ACCESS_KEY_ID.slice(0, 8)}...`)

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// ── Content-Type mapping ─────────────────────────────────────────
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
}

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

// ── Recursively collect files ────────────────────────────────────
function walkDir(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walkDir(full))
    } else {
      results.push(full)
    }
  }
  return results
}

// ── Check if object already exists in R2 ─────────────────────────
async function existsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
    return true
  } catch {
    return false
  }
}

// ── Upload a single file ─────────────────────────────────────────
async function uploadFile(localPath, key) {
  const body = readFileSync(localPath)
  const contentType = getMimeType(localPath)
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return { size: body.length, contentType }
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const execute = process.argv.includes('--execute')
  const skipExisting = !process.argv.includes('--force')
  const publicDir = join(ROOT, 'public')

  const dirs = [
    { local: join(publicDir, 'images'), prefix: 'images' },
    { local: join(publicDir, 'videos'), prefix: 'videos' },
  ]

  // Collect all files
  const files = []
  for (const { local, prefix } of dirs) {
    try {
      const paths = walkDir(local)
      for (const p of paths) {
        const relPath = relative(local, p)
        const key = `${prefix}/${relPath}`
        files.push({ localPath: p, key })
      }
    } catch (err) {
      console.warn(`  Skipping ${local}: ${err.message}`)
    }
  }

  console.log(`\nFound ${files.length} files to migrate\n`)

  if (!execute) {
    console.log('DRY RUN — files that would be uploaded:\n')
    for (const { localPath, key } of files) {
      const stat = statSync(localPath)
      const sizeKB = (stat.size / 1024).toFixed(1)
      console.log(`  ${key} (${sizeKB} KB, ${getMimeType(localPath)})`)
    }
    console.log(`\nRun with --execute to upload.`)
    console.log(`Add --force to overwrite existing files.\n`)
    return
  }

  // Execute uploads
  let uploaded = 0
  let skipped = 0
  let errors = 0
  const totalSize = { bytes: 0 }

  for (const { localPath, key } of files) {
    try {
      if (skipExisting) {
        const exists = await existsInR2(key)
        if (exists) {
          console.log(`  SKIP  ${key} (already exists)`)
          skipped++
          continue
        }
      }

      const { size, contentType } = await uploadFile(localPath, key)
      totalSize.bytes += size
      uploaded++
      const sizeKB = (size / 1024).toFixed(1)
      console.log(`  ✅ ${key} (${sizeKB} KB, ${contentType})`)
    } catch (err) {
      errors++
      console.error(`  ❌ ${key}: ${err.message}`)
    }
  }

  const totalMB = (totalSize.bytes / 1024 / 1024).toFixed(2)
  console.log(`\n── Summary ──────────────────────────────`)
  console.log(`  Uploaded: ${uploaded}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Errors:   ${errors}`)
  console.log(`  Total:    ${totalMB} MB`)
  console.log(`─────────────────────────────────────────\n`)

  if (errors > 0) process.exit(1)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})

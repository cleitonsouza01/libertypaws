#!/bin/bash
set -euo pipefail

# ============================================================
# Cloudflare R2 Sync Script
# Syncs local images and videos to Cloudflare R2 bucket
# ============================================================

# --- Configuration Variables --------------------------------
# Override these via environment variables or .env.r2 file

# Paths (relative to this script's directory)
IMAGES_LOCAL_DIR="web/public/images"
VIDEOS_LOCAL_DIR="web/public/videos"

# R2 Bucket settings
R2_BUCKET="libertypaws-assets"
R2_IMAGES_PREFIX="images"
R2_VIDEOS_PREFIX="videos"

# S3-compatible settings
S3_PROVIDER="Cloudflare"
S3_REGION="auto"

# Credentials - loaded from .env.r2 or environment variables
# DO NOT hardcode credentials here. Use .env.r2 file instead.
R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID:-}"
R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY:-}"
R2_ENDPOINT="${R2_ENDPOINT:-}"

# --- End Configuration --------------------------------------

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Resolve script directory (works from any working directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Helper Functions ---------------------------------------

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }

load_env() {
    local env_file="${SCRIPT_DIR}/.env.r2"
    if [[ -f "$env_file" ]]; then
        info "Loading credentials from .env.r2"
        # Export variables from .env.r2 (skip comments and empty lines)
        while IFS='=' read -r key value; do
            # Skip comments and empty lines
            [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue
            # Remove surrounding quotes from value
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            export "$key=$value"
        done < "$env_file"
        # Re-read variables after loading
        R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID:-}"
        R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY:-}"
        R2_ENDPOINT="${R2_ENDPOINT:-}"
    fi
}

check_rclone() {
    if ! command -v rclone &>/dev/null; then
        error "rclone is not installed or not in PATH."
        echo ""
        echo "  Setup instructions:"
        echo "  ─────────────────────────────────────────────────"
        echo "  macOS (Homebrew):   brew install rclone"
        echo "  Linux (apt):        sudo apt install rclone"
        echo "  Linux (script):     curl https://rclone.org/install.sh | sudo bash"
        echo "  Windows (scoop):    scoop install rclone"
        echo "  Manual download:    https://rclone.org/downloads/"
        echo ""
        echo "  After installing, run this script again."
        echo "  For Cloudflare R2 docs: https://rclone.org/s3/#cloudflare-r2"
        echo "  ─────────────────────────────────────────────────"
        exit 1
    fi
    success "rclone found: $(rclone version | head -1)"
}

create_env_template() {
    local env_file="${SCRIPT_DIR}/.env.r2"
    cat > "$env_file" <<'TEMPLATE'
# Cloudflare R2 Credentials
# Fill in your values below, then run the sync script again.
#
# Get credentials from:
#   https://dash.cloudflare.com → R2 → Manage R2 API Tokens
#
# 1. Create an API token with "Object Read & Write" permission
# 2. Copy the Access Key ID and Secret Access Key
# 3. Your Account ID is in the R2 dashboard URL or Overview page

R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
TEMPLATE
    success "Created .env.r2 template at: ${env_file}"
}

check_credentials() {
    local env_file="${SCRIPT_DIR}/.env.r2"

    # If .env.r2 doesn't exist at all, create it and exit
    if [[ ! -f "$env_file" ]]; then
        warn "No .env.r2 file found."
        echo ""
        create_env_template
        echo ""
        echo "  Next steps:"
        echo "  ─────────────────────────────────────────────────"
        echo "  1. Open .env.r2 and fill in your R2 credentials"
        echo "  2. Run this script again"
        echo "  ─────────────────────────────────────────────────"
        exit 1
    fi

    # File exists — check each variable
    local missing=0

    if [[ -z "$R2_ACCESS_KEY_ID" || "$R2_ACCESS_KEY_ID" == "your_access_key_id_here" ]]; then
        error "R2_ACCESS_KEY_ID is not set"
        missing=1
    fi
    if [[ -z "$R2_SECRET_ACCESS_KEY" || "$R2_SECRET_ACCESS_KEY" == "your_secret_access_key_here" ]]; then
        error "R2_SECRET_ACCESS_KEY is not set"
        missing=1
    fi
    if [[ -z "$R2_ENDPOINT" || "$R2_ENDPOINT" == *"YOUR_ACCOUNT_ID"* ]]; then
        error "R2_ENDPOINT is not set"
        missing=1
    fi

    if [[ $missing -eq 1 ]]; then
        echo ""
        echo "  Your .env.r2 file has placeholder values."
        echo "  ─────────────────────────────────────────────────"
        echo "  1. Open .env.r2 and replace the placeholders"
        echo "  2. Get credentials from Cloudflare Dashboard:"
        echo "     https://dash.cloudflare.com → R2 → Manage R2 API Tokens"
        echo "  3. Run this script again"
        echo "  ─────────────────────────────────────────────────"
        exit 1
    fi
    success "Credentials loaded"
}

check_directories() {
    local has_error=0

    if [[ ! -d "${SCRIPT_DIR}/${IMAGES_LOCAL_DIR}" ]]; then
        error "Images directory not found: ${IMAGES_LOCAL_DIR}"
        has_error=1
    fi
    if [[ ! -d "${SCRIPT_DIR}/${VIDEOS_LOCAL_DIR}" ]]; then
        error "Videos directory not found: ${VIDEOS_LOCAL_DIR}"
        has_error=1
    fi

    if [[ $has_error -eq 1 ]]; then
        echo "  Make sure you're running this script from the project root."
        exit 1
    fi
    success "Local directories verified"
}

sync_to_r2() {
    local local_dir="$1"
    local remote_prefix="$2"
    local label="$3"

    info "Syncing ${label}: ${local_dir} → s3://${R2_BUCKET}/${remote_prefix}"

    if rclone sync \
        "${SCRIPT_DIR}/${local_dir}" \
        ":s3:${R2_BUCKET}/${remote_prefix}" \
        --s3-provider="${S3_PROVIDER}" \
        --s3-access-key-id="${R2_ACCESS_KEY_ID}" \
        --s3-secret-access-key="${R2_SECRET_ACCESS_KEY}" \
        --s3-endpoint="${R2_ENDPOINT}" \
        --s3-region="${S3_REGION}" \
        --s3-no-check-bucket \
        --s3-env-auth=false \
        --progress \
        --stats-one-line \
        2>&1; then
        success "${label} synced successfully"
        return 0
    else
        error "${label} sync FAILED (exit code: $?)"
        return 1
    fi
}

# --- Main Execution -----------------------------------------

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║    Cloudflare R2 Asset Sync          ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Pre-flight checks
load_env
check_rclone
check_credentials
check_directories

echo ""
info "Bucket:  ${R2_BUCKET}"
info "Images:  ${IMAGES_LOCAL_DIR} → ${R2_IMAGES_PREFIX}/"
info "Videos:  ${VIDEOS_LOCAL_DIR} → ${R2_VIDEOS_PREFIX}/"
echo ""

# Confirmation prompt
read -p "Proceed with sync? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    warn "Sync cancelled by user."
    exit 0
fi

echo ""

# Track results
ERRORS=0

# Sync images
if ! sync_to_r2 "$IMAGES_LOCAL_DIR" "$R2_IMAGES_PREFIX" "Images"; then
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Sync videos
if ! sync_to_r2 "$VIDEOS_LOCAL_DIR" "$R2_VIDEOS_PREFIX" "Videos"; then
    ERRORS=$((ERRORS + 1))
fi

# Final summary
echo ""
echo "  ──────────────────────────────────────"
if [[ $ERRORS -eq 0 ]]; then
    success "All assets synced successfully"
else
    error "${ERRORS} sync operation(s) failed. Check the output above for details."
    exit 1
fi

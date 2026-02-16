#!/bin/bash

# Ask for confirmation before proceeding
read -p "This will sync the local images to the S3 bucket. Do you want to continue? (y/n) " -n 1 -r
echo    # move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Sync cancelled."
    exit 1
fi

rclone sync ./public/images :s3:libertypaws-assets/videos  --s3-provider=Cloudflare  --s3-access-key-id="aa0e21d15a2aac9254f25b80cd2d6980"  --s3-secret-access-key="feeb081455be3a1c9fed9979a930c68705ccbbf8081ddee3b0f053e4d019c2d7"  --s3-endpoint="https://dd9fe118d22b7c55c15f304c016e223f.r2.cloudflarestorage.com"  --s3-region=auto  --s3-no-check-bucket  --s3-env-auth=false

rclone sync ./public/images :s3:libertypaws-assets/videos  --s3-provider=Cloudflare  --s3-access-key-id="aa0e21d15a2aac9254f25b80cd2d6980"  --s3-secret-access-key="feeb081455be3a1c9fed9979a930c68705ccbbf8081ddee3b0f053e4d019c2d7"  --s3-endpoint="https://dd9fe118d22b7c55c15f304c016e223f.r2.cloudflarestorage.com"  --s3-region=auto  --s3-no-check-bucket  --s3-env-auth=false
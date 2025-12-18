#!/bin/bash

# Check if site and command parameters are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <site> <command> [aws_profile]"
  exit 1
fi

site=$1
command=$2
aws_profile=$3

# Define environment variables for each site
case $site in
  staging)
    # Staging environment configuration
    S3_BUCKET=learn-hathor-network-staging
    CLOUDFRONT_ID=EH3J6VVGDO86Q
    VITE_BINDERHUB_URL=https://binder.staging.learn.hathor.network
    ;;
  production)
    # Production environment configuration
    S3_BUCKET=learn-hathor-network-production
    CLOUDFRONT_ID=E2PZDB3T8EMYOC
    VITE_BINDERHUB_URL=https://binder.learn.hathor.network
    ;;
  *)
    echo "Unknown site: $site"
    echo "Available sites: staging, production"
    exit 1
    ;;
esac

export S3_BUCKET
export CLOUDFRONT_ID
export VITE_BINDERHUB_URL

case $command in
  build)
    echo "Building for site: $site"
    echo "S3_BUCKET: $S3_BUCKET"
    echo "CLOUDFRONT_ID: $CLOUDFRONT_ID"
    echo "VITE_BINDERHUB_URL: $VITE_BINDERHUB_URL"
    cd "$(dirname "$0")/.." || exit 1
    npm run build
    ;;
  sync)
    echo "Syncing for site: $site"
    cd "$(dirname "$0")/.." || exit 1
    
    # Sync all files except index.html and JSON with long cache
    if [ -n "$aws_profile" ]; then
      aws s3 sync ./dist/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "index.html" \
        --exclude "*.json" \
        --profile $aws_profile
      
      # Upload index.html with no-cache
      aws s3 cp ./dist/index.html s3://$S3_BUCKET/index.html \
        --cache-control "no-cache, no-store, must-revalidate" \
        --profile $aws_profile
    else
      aws s3 sync ./dist/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "index.html" \
        --exclude "*.json"
      
      # Upload index.html with no-cache
      aws s3 cp ./dist/index.html s3://$S3_BUCKET/index.html \
        --cache-control "no-cache, no-store, must-revalidate"
    fi
    ;;
  clear_cache)
    echo "Clearing CloudFront cache for site: $site"
    if [ -n "$aws_profile" ]; then
      aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --profile $aws_profile
    else
      aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
    fi
    ;;
  *)
    echo "Unknown command: $command"
    echo "Available commands: build, sync, clear_cache"
    exit 1
    ;;
esac

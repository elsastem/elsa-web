#!/bin/bash

set -eo pipefail

S3_BUCKET_DEST=s3://elsadev.stripysock.com.au
LOCAL_SITE_DIR=./eoi-site/build
AWS_PROFILE=elsa
 
echo "Building Site"
cd eoi-site
npm install
npm run gulp
cd ..

echo "Uploading Site "
aws s3 sync $LOCAL_SITE_DIR $S3_BUCKET_DEST --profile $AWS_PROFILE

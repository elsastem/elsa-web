#!/bin/bash

set -eo pipefail

S3_BUCKET_DEST=s3://elsa-website
LOCAL_SITE_DIR=./eoi-site/build
AWS_PROFILE=elsa_prod_web

echo "Removing existing build directories"
rm -rf $LOCAL_SITE_DIR

echo "Building Site"
cd eoi-site
npm install
npm run gulp
cd ..

echo "Uploading Site to AWS"
if [[ -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
    echo "Using profile ${AWS_PROFILE}"
    aws s3 sync $LOCAL_SITE_DIR $S3_BUCKET_DEST --profile $AWS_PROFILE --delete
else
    echo "Using AWS_ACCESS_KEY_ID(${AWS_ACCESS_KEY_ID})"
    aws s3 sync $LOCAL_SITE_DIR $S3_BUCKET_DEST --delete 
fi


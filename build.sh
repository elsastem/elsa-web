#!/bin/bash

set -eo pipefail

S3_BUCKET_DEST=s3://dev.elsa.edu.au
LOCAL_SITE_DIR=./site

echo "Uploading Site"
aws s3 sync $LOCAL_SITE_DIR $S3_BUCKET_DEST
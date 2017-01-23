#!/bin/bash

set -eo pipefail

S3_BUCKET_DEST=s3://dev.elsa.edu.au
LOCAL_SITE_DIR=./site
AWS_PROFILE=elsa

echo "Uploading Site "
aws s3 sync $LOCAL_SITE_DIR $S3_BUCKET_DEST --profile $AWS_PROFILE
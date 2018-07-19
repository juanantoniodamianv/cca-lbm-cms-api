#!/bin/bash -xe

#
# INSTALLING NPM LIBRARIES
#

cd /home/ubuntu/api-release

echo "$(date '+%F %T') Installing NPM libraries" >> /home/ubuntu/deployment_logs/npm-install.log 2>&1
npm install >> /home/ubuntu/deployment_logs/npm-install.log 2>&1

echo "$(date '+%F %T') Copying documentation file to s3 bucket" >> /home/ubuntu/deployment_logs/s3-doc.log 2>&1
aws s3 cp /home/ubuntu/cca-lbm-cms-api/api/swagger/swagger.yaml \
s3://cca-lbm-api-dev.ballastlane.com \
>> /home/ubuntu/deployment_logs/s3-doc.log 2>&1

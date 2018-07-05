#!/bin/bash -xe

#
# INSTALLING NPM LIBRARIES
#

cd /home/ubuntu
rm -fr api-release
mkdir api-release
cd /home/ubuntu/api-release

echo "$(date '+%F %T') Installing NPM libraries" >> /home/ubuntu/deployment_logs/npm-install.log 2>&1
npm install >> /home/ubuntu/deployment_logs/npm-install.log 2>&1

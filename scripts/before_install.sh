#!/bin/bash -xe

cd /home/ubuntu/cca-lbm-cms-api
echo "$(date '+%F %T') Stopping server" >> /home/ubuntu/deployment_logs/stop_server.log 2>&1
lsof -ti:1337 | xargs kill >> /home/ubuntu/deployment_logs/stop_server.log 2>&1 || true

cd /home/ubuntu
rm -fr api-release
mkdir api-release

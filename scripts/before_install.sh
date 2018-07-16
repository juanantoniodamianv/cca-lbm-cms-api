#!/bin/bash -xe

cd /home/ubuntu/cca-lbm-cms-api
echo "$(date '+%F %T') Stopping server" >> /home/ubuntu/deployment_logs/stop_server.log 2>&1
sudo kill $(sudo lsof -t -i:1337) >> /home/ubuntu/deployment_logs/stop_server.log 2>&1 || true
sudo service nginx stop >> /home/ubuntu/deployment_logs/stop_server.log 2>&1

cd /home/ubuntu
rm -fr api-release
mkdir api-release

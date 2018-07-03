#!/bin/bash -xe

echo "$(date '+%F %T') rsyncing release folder with api folder" >> /home/ubuntu/deployment_logs/rsync.log 2>&1
rsync -arv --delete \
  /home/ubuntu/api-release/ \
  /home/ubuntu/ask_method/cca-lbm-cms-api \
  >> /home/ubuntu/deployment_logs/rsync.log 2>&1

echo "$(date '+%F %T') Starting server" >> /home/ubuntu/deployment_logs/start_server.log 2>&1
cd /home/ubuntu/cca-lbm-cms-api && npm start --development >> /home/ubuntu/deployment_logs/start_server.log > /dev/null 2> /dev/null < /dev/null &

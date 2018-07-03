#!/bin/bash -xe

#
# RSYNC Release files to api directory
#

echo "$(date '+%F %T') rsyncing release folder with api folder" >> /home/ubuntu/deployment_logs/rsync.log 2>&1
sudo rsync -arv --delete \
  /home/ubuntu/api-release/ \
  /home/ubuntu/cca-lbm-cms-api/ \
  >> /home/ubuntu/deployment_logs/rsync.log 2>&1

#
# STARTING NODE SERVER
#

cd /home/ubuntu/cca-lbm-cms-api
echo "$(date '+%F %T') Starting server" >> /home/ubuntu/deployment_logs/start_server.log 2>&1
npm start --development >> /home/ubuntu/deployment_logs/start_server.log > /dev/null 2> /dev/null < /dev/null &

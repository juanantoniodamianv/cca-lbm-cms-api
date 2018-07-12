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

SecurityGroup=`/usr/bin/curl -s http://169.254.169.254/latest/meta-data/security-groups`

if [ "$SecurityGroup" = "cca-lbm-cms-api-production" ]; then
  cd /home/ubuntu/cca-lbm-cms-api
  echo "$(date '+%F %T') Starting server" >> /home/ubuntu/deployment_logs/start_server.log 2>&1
  sudo npm start --production >> /home/ubuntu/deployment_logs/start_server.log > /dev/null 2> /dev/null < /dev/null &
fi

if [ "$SecurityGroup" = "cca-lbm-cms-api-develop" ]; then
  cd /home/ubuntu/cca-lbm-cms-api
  echo "$(date '+%F %T') Starting server" >> /home/ubuntu/deployment_logs/start_server.log 2>&1
  sudo npm start --development >> /home/ubuntu/deployment_logs/start_server.log > /dev/null 2> /dev/null < /dev/null &
fi

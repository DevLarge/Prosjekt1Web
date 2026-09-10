#!/bin/bash
cd ~/T18-Project-1
git pull
npm install
npm run build
sudo rsync -av --delete dist/ /var/www/html/project1/
echo "Deploy ferdig!" 
#!/bin/bash
set -ex
npm install -g appium@1.20.2 --unsafe-perm=true --allow-root
appium -v
# appium &>/dev/null &
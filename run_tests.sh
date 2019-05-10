#!/bin/bash

if [ -f accumulator.pid ]; then
  # Ensure the Accumulator is not already running
  process_exist=`pgrep -F accumulator.pid`
  old_process=`cat accumulator.pid`

  if [ "$process_exist" ==  "$old_process" ]; then
    kill -9 `cat accumulator.pid`
    rm accumulator.pid
  fi
fi

echo "Starting accumulator ..."
node ./notifications/accumulator.js > accumulator.log & 
echo $! > ./accumulator.pid

sleep 2

echo "Accumulator started ..."

jest --runInBand

# Killing the Accumulator
curl -X POST $ACC_ENDPOINT/kill 

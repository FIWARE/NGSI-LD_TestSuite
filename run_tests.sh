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

ACC_ENDPOINT=${ACC_ENDPOINT:-http://localhost:3000}
TEST_ENDPOINT=${TEST_ENDPOINT:-http://localhost:1026}
NOTIFY_ENDPOINT=${NOTIFY_ENDPOINT:-http://host.docker.internal:3000/acc}

echo "Starting accumulator ..."
node ./notifications/accumulator.js $ACC_ENDPOINT > accumulator.log & 
echo $! > ./accumulator.pid

sleep 2

echo "Accumulator started ... at $ACC_ENDPOINT"
echo "NGSI-LD Broker endpoint ... at $TEST_ENDPOINT"
echo "The notification endpoint ... at $NOTIFY_ENDPOINT"

while [ `curl -s -o /dev/null -w %{http_code} $TEST_ENDPOINT` -eq 000 ]
do 
  echo -e "Context Broker HTTP state: " `curl -s -o /dev/null -w %{http_code} $TEST_ENDPOINT` " (waiting for 200)"
  sleep 1
done

jest --runInBand

# Killing the Accumulator
curl -X POST $ACC_ENDPOINT/kill 

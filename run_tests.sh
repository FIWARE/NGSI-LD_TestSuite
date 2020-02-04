#!/bin/bash

#Zero pad to length 2, right-justified
function zero_pad() { 
    paddedWithZero=$(echo $1 | sed -e :a -e 's/^.\{1,2\}$/0&/;ta');  
}

# Set excluded test to not run a numbered test - defaults to 999 only
EXCLUDED_TESTS=${EXCLUDED_TESTS:-"999"};

# Create the regex to use with Jest
regex=".*(";
for i in `seq 1 299`;
do
  zero_pad $i
  if [[ $EXCLUDED_TESTS != *$paddedWithZero* ]]; then
    regex+=$paddedWithZero"|"
  fi   
done
regex+="999)$"

TEST_REGEX_PATTERN=${TEST_REGEX_PATTERN:-$regex}
echo "The following tests will be excluded: $EXCLUDED_TESTS"

ACC_ENDPOINT=${ACC_ENDPOINT:-http://localhost:8080}
NOTIFY_ENDPOINT=${NOTIFY_ENDPOINT:-http://accumulator:8080/acc}
#NOTIFY_ENDPOINT=${NOTIFY_ENDPOINT:-http://host.docker.internal:8080/acc}

echo "The Accumulator endpoint listens on $ACC_ENDPOINT"
echo "Subscriptions will notify the accumulator using $NOTIFY_ENDPOINT"

# To run an accumulator locally run:
#
# export WEB_APP_PORT=8080
# node accumulator/accumulator.js

while [ `curl -s -o /dev/null -w %{http_code} $ACC_ENDPOINT` -eq 000 ]
do 
  echo -e "Accumulator HTTP state: " `curl -s -o /dev/null -w %{http_code} $ACC_ENDPOINT` " (waiting for 200)"
  sleep 1
done



TEST_ENDPOINT=${TEST_ENDPOINT:-http://localhost:1026}
echo "NGSI-LD Broker endpoint ... at $TEST_ENDPOINT"

while [ `curl -s -o /dev/null -w %{http_code} $TEST_ENDPOINT` -eq 000 ]
do 
  echo -e "Context Broker HTTP state: " `curl -s -o /dev/null -w %{http_code} $TEST_ENDPOINT` " (waiting for 200)"
  sleep 1
done

jest  --runInBand --verbose   -t $TEST_REGEX_PATTERN


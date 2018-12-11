#!/bin/bash

siege -c 50 -t 5M -d 5 -i -f server-urls.txt
#siege -c 50 -t 5M -d 5 -i -f test-endpoint.txt

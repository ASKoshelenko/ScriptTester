#!/bin/bash

### Find your IP address using the command line

ip -o addr | grep inet | cut -d ' ' -f2,7 | tail -n +3

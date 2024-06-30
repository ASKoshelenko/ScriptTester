#!/bin/bash

### Search for script files from under a specific user

sudo -u root -H find . -type f -executable -exec sh -c 'head -c2 "$1" | grep -q "#!" && echo "$1"' _ {} \;

# If it means scripts of specific owner
# find . -type f -executable -user root -exec sh -c 'head -c2 "$1" | grep -q "#!" && echo "$1"' _ {} \;

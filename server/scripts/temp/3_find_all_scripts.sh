#!/bin/bash

### Find all scripts in the specified directory and its subdirectories

find . -type f -executable -exec sh -c '[ "$(head -c2 "$1")" = "#!" ] && echo "$1"' _ {} \;

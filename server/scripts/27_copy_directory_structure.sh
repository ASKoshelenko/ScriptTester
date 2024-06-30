#!/bin/bash

### Recursively copy the directory structure from the specified directory (without files)

find dir1/ -type d -print | xargs -I{} mkdir -p dir_structure/{}

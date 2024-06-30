#!/bin/bash

### Recursively delete files of the specified size and name pattern from the corresponding directory

find dir1/ -type f -size 22c -name '*.txt' -delete

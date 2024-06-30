#!/bin/bash

### Recursively change file permissions (file mask is specified) in a given directory

find . -type f -perm 644 -exec chmod 640 {} \;

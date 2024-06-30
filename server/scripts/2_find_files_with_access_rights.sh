#!/bin/bash

### Find all files and directories that have access rights for the corresponding user and group

find . -perm -u=x,g=w
# find . -perm -u=x,g=w -printf "%M %p\n"

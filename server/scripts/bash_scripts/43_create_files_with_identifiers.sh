#!/bin/bash

### There is a file in which there are 2 columns separated by a space:
### the file name and the identifier in the form of a hash value (4 bytes).
### Create all files and write the corresponding identifiers to them

xargs -a hash_file_list -n2 sh -c 'mkdir -p $(dirname $1) && echo $2 > $1'

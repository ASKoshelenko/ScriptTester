#!/bin/bash

### There is a directory in which folders and files (*.txt and *.jpeg) exist.
### The *.txt and *.jpeg files are uniquely linked by their name prefix.
### The files can be located in different places in this directory.
### You need to delete all jpegs for which there is no *.txt file

find . -type f -name '*.jpeg' \
| xargs -I{} sh -c 'pname="$(dirname {})/$(basename -s .jpeg {})"; [ ! -e ${pname}.txt ] && rm ${pname}.jpeg'

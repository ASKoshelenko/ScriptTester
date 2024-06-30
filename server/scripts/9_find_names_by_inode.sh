#!/bin/bash

### Given only an inode file, find all its names

ls -i dir1/file1.txt | cut -d' ' -f1 | xargs find . -inum

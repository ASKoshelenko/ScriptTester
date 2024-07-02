#!/bin/bash

### Given only an inode file, find all its names. Note that there may be several partitions

ls -i dir1/file1.txt | cut -d' ' -f1 | xargs find . -xdev -inum

# grep '/dev/sda' /proc/mounts | cut -d' ' -f1

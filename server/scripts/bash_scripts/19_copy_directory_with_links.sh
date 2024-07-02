#!/bin/bash

### Copy the directory, taking into account that it contains both direct and relative symbolic links to files and directories.
### It is assumed that the copying is performed for backup on removable storage.
### Do it in two versions, without rsync and with rsync

cp -a dir1/ backup/
rsync -al dir1/ rsync_backup/

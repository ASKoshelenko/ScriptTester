#!/bin/bash

### Find all system groups and get only their unique names and id. Save the data to a file.

# output_file=${1:-task_01.txt}
# login_defs='/etc/login.defs'

# [ -f $login_defs ] && eval $(cat $login_defs | grep -E "^SYS_GID_MIN|^SYS_GID_MAX|^GID_MIN" | xargs | tr ' ' '=')
# [ -z $SYS_GID_MIN ] && SYS_GID_MIN=1
# [ -n $GID_MIN ] && SYS_GID_MAX=$((GID_MIN-1))
# [ -z $SYS_GID_MAX ] && SYS_GID_MAX=999

# getent group $(seq $SYS_GID_MIN $SYS_GID_MAX) | cut -d: -f1,3 > $output_file

# One liners:
getent group {1..999} | cut -d: -f1,3 > sys_groups
cut -d: -f1,3 /etc/group | grep -E ':[0-9]{1,3}$' > sys_groups

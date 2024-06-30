#!/bin/bash

### Print a list of all system users sorted by id, in 'login id' format

cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -nk2 | tr ':' ' '

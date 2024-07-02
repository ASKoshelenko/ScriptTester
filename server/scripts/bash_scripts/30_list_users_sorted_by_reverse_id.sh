#!/bin/bash

### Print a list of all users of the system (only names) sorted by id in reverse order

cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -rnk2 | cut -d: -f1

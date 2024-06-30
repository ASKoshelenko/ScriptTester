#!/bin/bash

### Print a list of all users of the system (only names) in alphabetical order

cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{4,}$" | cut -d: -f1 | sort

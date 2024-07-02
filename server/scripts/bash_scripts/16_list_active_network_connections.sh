#!/bin/bash

### Display the list of active network connections in the form of a table

ss -atOH | cut -d' ' -f1 | sort | xargs -n1 | uniq -c

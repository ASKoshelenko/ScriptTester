#!/bin/bash

### Print the list of users authorized in the system at the moment

sudo users | xargs -n1 | sort -u

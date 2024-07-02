#!/bin/bash

### Stop processes that have been running for more than 5 days
### a) use killall
### b) do not use ps or killall

ps -eo comm= | xargs -n1 killall -o 5d
find /proc -maxdepth 1 -type d -ctime +5 | grep -oP '/\K[0-9]+' | xargs kill -9

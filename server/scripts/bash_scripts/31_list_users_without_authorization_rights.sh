#!/bin/bash

### Display all users who have the right or do not have the right to authorize in the system (two commands)

sudo cut -d: -f1,2 /etc/shadow | grep -vE ':\!\*' | cut -d: -f1
sudo cut -d: -f1,2 /etc/shadow | grep -E ':\!\*' | cut -d: -f1

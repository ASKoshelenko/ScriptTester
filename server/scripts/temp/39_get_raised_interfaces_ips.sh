#!/bin/bash

### Get IPs of raised interfaces

ip a | grep 'state UP' | cut -d ' ' -f2 | xargs -n1 ip a show | grep inet | cut -d ' ' -f5,6
sudo grep -P '\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b' /etc/netplan/*.yaml | xargs

#!/bin/bash

### Find all active hosts in the specified network, IP list (hosts-server.txt) (using or not using nmap)

nmap -sn 192.168.56.0/24
nmap -sn -iL hosts-server.txt
printf "192.168.1.%d\n" {1..254} | xargs -I{} ping -c1 {} > /dev/null; ip -4 n | grep REACHABLE | cut -d ' ' -f1
cat hosts-server.txt | xargs -I{} ping -c1 {} > /dev/null; ip -4 n | grep REACHABLE | cut -d ' ' -f1

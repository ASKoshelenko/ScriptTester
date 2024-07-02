#!/bin/bash

### Get the MAC addresses of network interfaces

ip link | grep ether | xargs -n4 | cut -d' ' -f2

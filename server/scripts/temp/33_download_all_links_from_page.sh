#!/bin/bash

### From the page from the Internet, download all the links to the href resources that are on the page

wget -qO - https://abc.xyz/ | grep -oP 'href="\K[^"]+' | xargs -I{} wget -P downloads/ {}

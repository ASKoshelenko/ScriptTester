#!/bin/bash

### Display all users who (have/don't have) a terminal (bash, sh, zsh, etc... which are installed on the system) (two commands)

cut -d: -f1,7 /etc/passwd | grep -E "/(bash|sh|zsh)$" | cut -d: -f1
cut -d: -f1,7 /etc/passwd | grep -vE "/(bash|sh|zsh)$" | cut -d: -f1

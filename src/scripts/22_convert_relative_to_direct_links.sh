#!/bin/bash

### In the project directory, convert all relative links to direct links

find . -type l | xargs -I{} sh -c 'ln -sf $(realpath {}) {}'

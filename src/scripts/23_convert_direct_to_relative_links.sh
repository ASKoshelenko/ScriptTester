#!/bin/bash

### In the project directory, convert all direct links to relative links to the project directory

find . -type l | xargs -I{} sh -c 'ln -srf $(readlink {}) {}'

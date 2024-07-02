#!/bin/bash

### Extract the path, name, and extension of a file in Bash from a string

string='./dir1/file1.txt'
realpath $(dirname $string)
basename ${string%.*}
basename ${string##*.}

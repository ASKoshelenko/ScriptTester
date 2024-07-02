#!/bin/bash

### Recursively search for words or phrases for a specific file type

grep -r --include=*.txt "file" .

# Output only file names
# grep -ro --include=*.txt "file" .

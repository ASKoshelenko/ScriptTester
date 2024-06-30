#!/bin/bash

### Correctly delete a file, taking into account the possibility of the existence of symbolic or hard links

sudo find -L . -samefile dir2/file2.txt > remove_checklist
# sudo find -L . -samefile dir1/file1.txt -exec rm -ir {} +

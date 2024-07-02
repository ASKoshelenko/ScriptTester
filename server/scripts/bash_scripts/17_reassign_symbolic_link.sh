#!/bin/bash

### Re-recognize the existing symbolic link

readlink dir1/link_to_file1 | xargs -I {} ln -srf {} link_to_file1

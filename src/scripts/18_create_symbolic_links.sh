#!/bin/bash

### There is a list of files with a relative path and the path to the directory where the symbolic link to the file. Create symbolic links to these files

mkdir sym_dir && cat file_list | xargs -I{} sh -c 'ln -sbrf {} sym_dir/link_to_$(basename {})'

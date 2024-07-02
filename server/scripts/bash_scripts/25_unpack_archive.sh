#!/bin/bash

### Unpack a specific directory/file from a tar, gz, bz2, lz, lzma, xz archive to a specified location

# tar --remove-files -cvf arc.tar dir1/ dir2/
tar -xvf arc.tar dir1/
# tar -zcvf arc.tar.gz dir1/ dir2/
# tar -zxvf arc.tar.gz dir1/
# tar -jcvf arc.tar.bz2 dir1/ dir2/
# tar -jxvf arc.tar.bz2 dir1/
# tar -Jcvf arc.tar.xz dir1/ dir2/
# tar -Jxvf arc.tar.xz dir1/
# tar --lzma -cvf arc.tar.lzma dir1/ dir2/
# tar --lzma -xvf arc.tar.lzma dir1/

# -z --gzip, --gunzip, --ungzip
# Filter the archive through gzip
# -j --bzip2
# Filter the archive through bzip2
# -J --xz
# Filter the archive through xz
# --lzma
# Filter the archive through lzma
# --lzop
# Filter the archive through lzop
# -Z --compress, --uncompress
# Filter the archive through compress

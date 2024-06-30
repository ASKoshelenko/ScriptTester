#!/bin/bash

### Find duplicate files in the specified directories. First, compare by size, then by option (choose a CRC32, MD5, SHA-1, sha224sum hash function). The result should be sorted by file name

find . -type f -exec md5sum {} + | sort | uniq -D -w32 | sort -k2

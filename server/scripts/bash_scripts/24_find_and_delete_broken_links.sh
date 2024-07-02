#!/bin/bash

### In the specified directory, find all broken links and delete them

find . -xtype l -delete

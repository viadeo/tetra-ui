#!/usr/bin/env bash

#
# Add git hooks symlinks
#
rm -rf .git/hooks
ln -s ../tasks/hooks .git/hooks

#!/bin/bash

test_app_folder_name="clay-test"
if [ "$(basename $(pwd))" != "$test_app_folder_name" ]; then
    echo "Must be executed from $test_app_folder_name folder"
    exit
fi

pebble clean && cd .. && npm run pebble-build || { cd $test_app_folder_name && exit; } && cd $test_app_folder_name && pebble build

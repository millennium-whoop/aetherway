#!/bin/bash

for file in *.md; do
  if ! grep -q "^layout *= *'blog-single'" "$file"; then
    sed -i "0,/^+++/{/^+++/a layout = 'blog-single'
}" "$file"
  fi
done

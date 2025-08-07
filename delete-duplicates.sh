#!/usr/bin/env bash

# Find all files, compute their SHA256 hash, and sort by hash
find . -type f ! -path '*/.git/*' -exec sha256sum {} + | sort > /tmp/allfiles.sha256

# For each hash, keep the first file and delete the rest
awk '{print $1}' /tmp/allfiles.sha256 | uniq -d | while read hash; do
  files=($(grep "^$hash" /tmp/allfiles.sha256 | awk '{print $2}'))
  # Keep the first file, delete the rest
  for ((i=1; i<${#files[@]}; i++)); do
    echo "Deleting duplicate: ${files[$i]}"
    rm -f "${files[$i]}"
  done
done

echo "Duplicate deletion complete."

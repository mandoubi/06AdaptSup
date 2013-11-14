#!/bin/bash
PNG_IMAGES=./*.png

for png in $PNG_IMAGES
do
  echo "Processing $png file..."
  tesseract $png $png -l fra
done

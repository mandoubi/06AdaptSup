#!/bin/bash

base="Nathan_transmath_2nde_"
#echo "base = $base"
lengthOfBase=`expr length "$base"`
#echo "lengthOfBase = $lengthOfBase"
files=$base*

for file in $files
do
    #echo "Processing $file file..."
    fullSuffix=${file:lengthOfBase}
    #echo "  fullSuffix = $fullSuffix"
    indexOfDash=`expr index "$fullSuffix" -`
    #echo "  indexOfDash = $indexOfDash"
    if [ $indexOfDash -gt 0 ]
    then
      pageNumber=${fullSuffix:0:indexOfDash-1}
      #echo "  pageNumber = $pageNumber"
      directoryName=$base$pageNumber
      # echo "  directoryName = $directoryName"
      mkdir -p $directoryName
      mv $directoryName-* $directoryName/ 2>/dev/null || true
      mv $directoryName.* $directoryName/ 2>/dev/null || true
    fi
done
    

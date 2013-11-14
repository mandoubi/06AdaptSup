#!/bin/bash

# Oops, I misnamed my bliotux page files :
# Instead of filePrefix-A-B-C-D-E-F.png
# they are names filePrefix-B-A-D-C-F-E.png
# this script will rename files appropriately

base="Nathan_transmath_2nde_"
#echo "base = $base"
directories=$base*
lengthOfBase=`expr length "$base"`
#echo "lengthOfBase = $lengthOfBase"

for directory in $directories
do
    for file in $directory/*
    do
        echo "Processing $file..."
        indexOfDash=`expr index "$file" -`
        echo "  indexOfDash = $indexOfDash"
        if [ $indexOfDash -gt 0 ]
        then
            fileNameBeforeDash=${file:0:indexOfDash - 1}
            echo "  fileNameBeforeDash = $fileNameBeforeDash"
            fileNameAfterDash=${file:indexOfDash}
            echo "  fileNameAfterDash = $fileNameAfterDash"
            indexOfDot=`expr index "$fileNameAfterDash" .`
            echo "  indexOfDot = $indexOfDot"
            fileNameBetweenDashAndDot=${fileNameAfterDash:0:indexOfDot - 1}
            echo "  fileNameBetweenDashAndDot = $fileNameBetweenDashAndDot"
            fileExtension=${fileNameAfterDash:$indexOfDot}
            echo "  fileExtension = $fileExtension"
            indices=$(echo $fileNameBetweenDashAndDot | tr "-" "\n")
            echo "  indices = $indices"
            newIndices=""
            verticalIndex=-1
            horizontalIndex=-1            
            for index in $indices
            do
                 if [ $verticalIndex -gt -1 ]
                 then
                     horizontalIndex=$index
                     newIndices+="-$horizontalIndex-$verticalIndex"
                     verticalIndex=-1
                     horizontalIndex=-1
                else
                    verticalIndex=$index
                fi
            done
            if [ `expr length "$newIndices"` -gt 0 ]
            then
                newIndices=${newIndices:1}
            fi
            echo "  newIndices = $newIndices"
            newFileName="$fileNameBeforeDash-$newIndices.$fileExtension"
            echo "  newFileName = $newFileName"
            echo "            was $file"
            echo
            mv $file $newFileName.tmp
        fi
    done
    for file in $directory/*.tmp
    do
        mv $file ${file:0:`expr length $file` - 4}
    done
done

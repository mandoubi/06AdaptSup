#!/bin/bash

base="Nathan_transmath_2nde_"
#echo "base = $base"
directories=$base*

for directory in $directories
do
    for textFile in $directory/*.txt
    do
        echo "Processing $textFile..."
        rm $textFile.au $textFile.au.wav $textFile.au.wav.ogg 2>/dev/null || true
        espeak -v mb/mb-fr4 -s 150 -f $textFile | mbrola -e /usr/share/mbrola/voices/fr4 - $textFile.au && \
        sox $textFile.au $textFile.au.wav && \
        oggenc $textFile.au.wav && rm $textFile.au $textFile.au.wav && echo "  $textFile converted to $textFile.au.ogg"
    done
done
    

1) take the djvu (or pdf file) of your textbook

2) import it into gscan2pdf or GIMP

3) select all pages and export them as individual .PNG files

4) open all pages with GIMP (it has to have its guillotine plugin available)

5) for each page, pull horizontal and/or horizontal guides from GIMP rulers and put them where needed on the page

6) slice the page using the guillotine plugin : Alt+I, then T, then M (shortcuts for the French version)

7) for each slice, further pull guides and slice as long as necessary

8) close and save images of the slices and accept their file names : Ctrl+W, then Alt+E then Return

Further steps are optional and require linux, go directory to the last step if
you don't have linux or are not interested in these options :

9) run the tesseract OCR on this images using the following command line :

for f in *.png; do tesseract $f $f -l fra; done

10) then group files by page (one directory per page) using the directorize.sh script
(you first have to edit the 'basename' variable in the script file)

11) then prepare the audio files using the 3.tts.sh script
(requires sox, oggenc and espeak, available under linux ubuntu)

12) open index.xhtml?page=theNameOfTheDirectoryOfYourFirstPage

TODO :
- how to automatically put all pages in separate directories named after the number of the page
- how to insert tesseract-detected text as description of the images
- how to allow text-to-speech reading of this text
- how to display the OCRed text using a text template instead of the image
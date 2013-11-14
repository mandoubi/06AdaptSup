How to prepare an image for magic coloring ?

The objective is to build a bliotux-based page which will display
a given image (image.jpg) and allow its magic coloring.

Linux requirements :
- "convert" utility which allows image conversions
- "potrace" utility which can vectorize images

Requirements using other OS :
- imagemagick should be available for image conversions
- inkscape may offer a vectorization function (using potrace, too ?)

Here are the steps to follow :

1) Pick a name for your new coloring page
 And create the corresponding folder.
 For instance :
 wecena.bliotux/pages/NAME-OF-YOUR-PAGE/

1) Convert your image to bitmap format
   convert -background "#FFFFFF" image.gif -resize 600x600 -extent 600x600 image.pnm
   The image will be resized to a max of 600 pixels-high or 600
   pixels-wide and extended (with white color) until it's exactly
   600x600 pixels.
   Put these files under the folder of your new page.

2) Vectorize to image.svg
   potrace --svg -t 30 -n -O 100 -W 6 -H 6 -r 100 --cleartext --blacklevel=0.6 --invert image.pnm
 
 The goal, here, is to obtain a good enough tessellation of your
 image (see http://en.wikipedia.org/wiki/Tessellation). So you'll
 have to check the quality of the SVG image you get : is the
 tessellation "clean" enough ? it it complete ? are enough pathes
 closed? did the process discard too many meaningful graphical
 features?
 If not, you'll have to fine tune the vectorization parameters. One
 parameter of high influence on the quality of the tessellation is
 the "blacklevel" parameter.
 Save this file as wecena.bliotux/pages/NAME-OF-YOUR-PAGE/image.svg

 Tip : in case the vectorization is not optimal (some pathes are not close for instance)
 then you may edit image.pnm with Gimp and redraw some edges with a black pencil (or
 enhance the contrast of the image). Then rerun potrace as indicated above.

3) Convert your image to png format
   convert image.jpg image.png
   Save this file as wecena.bliotux/pages/NAME-OF-YOUR-PAGE/image.png

4) Configure your colors
   In wecena.bliotux/pages/NAME-OF-YOUR-PAGE/data.js, you have to
   indicate the colors you want to add to the palette.
   For instance :

var data = {
    'color1': '#ff0000',
    'color2': '#00ff00',
    'color3': '#00ff00',
    'color4': '#123456'
}

5) Enjoy the result
  Point your web browser to the proper local URL :
  
  file:///SOME-PATH-TO-BLIOTUX/wecena.bliotux/index.xhtml?page=NAME-OF-YOUR-PAGE   
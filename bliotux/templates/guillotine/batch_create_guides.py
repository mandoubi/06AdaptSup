#!/usr/local/bin/python
# 
# This script is distributed to you under the GPL v.3 licence.
#
# It is part of the bliotux package available at http://gna.org/projects/bliotux/
#
# It is a script intended to be run as a gimp plugin.
#
#  On WINDOWS :
#  1) you have to replace the first line of this script (#!/usr/local/bin/python)
# with the following line :
#!c:\Python26\python.exe
#
#  (adapt this line to path of your python interpreter if needed)
#
#  2) then you can run this script from the command line (cmd.exe) like this:
#
# "C:\Program Files\GIMP-2.0\bin\gimp-2.6.exe" --verbose -ibdfc "(python-fu-batch-create-guides RUN-NONINTERACTIVE \"*.png\" \"output\" 80 40 12 220 255)""(gimp-quit 1)"
# or
# "C:\Program Files\GIMP-2.0\bin\gimp-2.6.exe" --verbose -ibdfc "(python-fu-batch-guillotine-and-save RUN-NONINTERACTIVE \"*.png.xcf\" 1 \"output\" 80 40 12 220 255)""(gimp-quit 1)"
#
#
#  On GNU/LINUX, you can run this script from the command line like this :
#
# gimp --verbose -ibdfc '(python-fu-batch-create-guides RUN-NONINTERACTIVE "*.png" "output" 80 40 12 220 255)''(gimp-quit 1)'
# or
# gimp --verbose -ibdfc '(python-fu-batch-guillotine-and-save RUN-NONINTERACTIVE "*.png.xcf" 1 \"output\" 80 40 12 220 255)""(gimp-quit 1)"

from gimpfu import *
import glob
import os

def create_guides(fileName,
                  outputDirectory,
                  minWidth,
                  minHeight,
                  numberOfErosions,
                  lowBinarizationThreshold,
                  highBinarizationThreshold):

    # open the image
    filename = fileName
    raw_filename=filename
    print "Processing ", fileName, " Please wait..."

    # We are looking for sliceable horizontal segments
    # and for sliceable horizontal.
    # We'll first try with the given number of erosions. But if it does not
    # give any sliceable segment, then we'll decrement this number and retry until
    # we find some guide (or the number is too low).
    horizontalSliceableSegments = []
    verticalSliceableSegments = []
    numberOfErosions += 2
    while (horizontalSliceableSegments + verticalSliceableSegments == [] and numberOfErosions > 4):
        numberOfErosions += -2
            
        #path=FILEPATH
        #filename=path + "/" + filename
        image = pdb.file_png_load(filename, raw_filename)
        drawable = pdb.gimp_image_get_active_drawable(image)
    
        # do a binary threshold on grayscale
        try:
            pdb.gimp_image_convert_grayscale(image)
            pdb.gimp_threshold(drawable, lowBinarizationThreshold, highBinarizationThreshold)
        except:
            pass
    
        # erode the image several times
        propagate_mode=0
        propagating_channel=0
        propagating_rate=1.0
        direction_mask=0
        lower_limit=0
        upper_limit=255
        for i in range(numberOfErosions + 1):
            pdb.plug_in_erode(image, drawable, propagate_mode, propagating_channel, propagating_rate, direction_mask, lower_limit, upper_limit)
    
        # Select contiguous zones from the background of the image
        # starting from a pixel near the lower right corner
        # without antialiasing and with a 0 threshold
        height = pdb.gimp_image_height(image)
        width = pdb.gimp_image_width(image)
        # lower right corner :
        x = width - 2
        y = height - 2
        threshold = 0
        operation = 2 # CHANNEL-OP-REPLACE
        antialias = False
        feather = False
        feather_radius = 0
        sample_merged = False
        #pdb.gimp_fuzzy_select(drawable, x, y, threshold, operation, antialias, feather, feather_radius, sample_merged)
        white = (255, 255, 255)
        color = white
        pdb.gimp_by_color_select(drawable, color, threshold, operation, antialias, feather, feather_radius, sample_merged)
    
        # Invert selection
        pdb.gimp_selection_invert(image)
    
        # Make the selection a set of vectors
        sample_average = False
        average_radius = 0
        color = pdb.gimp_image_pick_color(image, drawable, x, y, sample_merged, sample_average, average_radius)
        background = color
        pdb.gimp_context_set_background(background)
        pdb.plug_in_sel2path(image, drawable)
        active_vectors = pdb.gimp_image_get_active_vectors(image)
    
        if active_vectors:
    
            # Extract each stroke into a new vectors object
            # then add it to the image
            num_strokes, stroke_ids = pdb.gimp_vectors_get_strokes(active_vectors)
            horizontalUnsliceableSegments = []
            verticalUnsliceableSegments = []
            position = 0
            closed = True
            feather_radius_x = 0
            feather_radius_y = 0
            for srokeId in stroke_ids:
                temporaryVectors = pdb.gimp_vectors_new(image, "Temp")
                pdb.gimp_image_add_vectors(image, temporaryVectors, position)
                type, num_points, controlpoints, closed = pdb.gimp_vectors_stroke_get_points(active_vectors, srokeId)
                tempStrokeId = pdb.gimp_vectors_stroke_new_from_points(temporaryVectors, type, num_points, controlpoints, closed)
                # then create a selection from this new vectors object
                pdb.gimp_vectors_to_selection(temporaryVectors, operation, antialias, feather, feather_radius_x, feather_radius_y)
                # get the bounds of this selection and use them to define an horizontal and a vertical unsliceable segment if the selection is big enough
                non_empty, x1, y1, x2, y2 = pdb.gimp_selection_bounds(image)
                if x2 - x1 > minWidth and y2 - y1 > minHeight and [x1, x2, y1, y2] != [0, width, 0, height]:
                    horizontalUnsliceableSegments.append((x1, x2))
                    verticalUnsliceableSegments.append((y1, y2))
            # Free some memory by deleting the image
            pdb.gimp_image_delete(image)
    
    
            # Identify x and y where x and y are not in any unsliceable segment
            sliceableXs = []
            for x in range(width):
                xIsSliceable = True
                for horizontalUnsliceableSegment in horizontalUnsliceableSegments:
                    a, b = horizontalUnsliceableSegment
                    if x >= a and x <= b:
                        # x is in an unsliceable segment
                        xIsSliceable = False
                        break
                if xIsSliceable is True:
                    sliceableXs.append(x)
    
            sliceableYs = []
            for y in range(height):
                yIsSliceable = True
                for verticalUnsliceableSegment in verticalUnsliceableSegments:
                    a, b = verticalUnsliceableSegment
                    if y >= a and y <= b:
                        # y is in an unsliceable segment
                        yIsSliceable = False
                        break
                if yIsSliceable is True:
                    sliceableYs.append(y)
    
            # Build sliceable segments
            lastX = None
            for x in sliceableXs:
                if lastX is None or x - lastX > minWidth:
                    if lastX is not None:
                        # this is a new sliceable segment
                        horizontalSliceableSegments.append(lastX)
                    horizontalSliceableSegments.append(x)
                lastX = x
    
    
            if lastX is not None:
                horizontalSliceableSegments.append(lastX)
    
    
            lastY = None
            for y in sliceableYs:
                if lastY is None or y - lastY > minHeight:
                    if lastY is not None:
                        # this is a new sliceable segment
                        verticalSliceableSegments.append(lastY)
                    verticalSliceableSegments.append(y)
                lastY = y
    
    
            if lastY is not None:
                verticalSliceableSegments.append(lastY)
    
            # Remove segments touching any border of the image
            if horizontalSliceableSegments:
                leftSeg = horizontalSliceableSegments[:2]
                if leftSeg[0] - 0 < minWidth:
                    horizontalSliceableSegments.pop(0)
                    horizontalSliceableSegments.pop(0)
    
    
            if horizontalSliceableSegments:
                rightSeg = horizontalSliceableSegments[-2:]
                if width - 1 - rightSeg[1] < minWidth:
                    horizontalSliceableSegments.pop()
                    horizontalSliceableSegments.pop()
    
    
            if verticalSliceableSegments:
                topSeg = verticalSliceableSegments[:2]
                if topSeg[0] - 0 < minHeight:
                    verticalSliceableSegments.pop(0)
                    verticalSliceableSegments.pop(0)
    
    
            if verticalSliceableSegments:
                bottomSeg = verticalSliceableSegments[-2:]
                if height - 1 - bottomSeg[1] < minHeight:
                    verticalSliceableSegments.pop()
                    verticalSliceableSegments.pop()
                    
            # end of the while loop : do we have sliceable segments ?
            # or do we have to retry with a lower number of erosions ?

    # Reload the original image
    image = pdb.file_png_load(filename, raw_filename)
    drawable = pdb.gimp_image_get_active_drawable(image)

    # Create guides at the middle of the remaining sliceable segments

    x1 = None
    for x in horizontalSliceableSegments:
        if x1 is None:
            x1 = x
        else:
            x2 = x
            xposition = (x2 + x1) / 2
            guide = pdb.gimp_image_add_vguide(image, xposition)
            x1 = None


    y1 = None
    for y in verticalSliceableSegments:
        if y1 is None:
            y1 = y
        else:
            y2 = y
            yposition = (y2 + y1) / 2
            yGuide = pdb.gimp_image_add_hguide(image, yposition)
            y1 = None

    # Save the file as XCF with the guides ready to be used
    dummy_param = False
    try:
        os.mkdir(outputDirectory)
    except OSError:
        pass
    filename = outputDirectory + "/" + filename + ".xcf"
    raw_filename = outputDirectory + "/" + raw_filename + ".xcf"
    pdb.gimp_xcf_save(dummy_param, image, drawable, filename, raw_filename)
    print "Done with " + raw_filename
    # Free memory
    pdb.gimp_image_delete(image)
    
"""
Additional notes : if I wanted to detect vertical and horizontal colored lines (and not only horizontal or vertical whitespaces), here is an algo :

# load the image
image = pdb.file_png_load(filename, raw_filename)
drawable = pdb.gimp_image_get_active_drawable(image)
imageWidth = pdb.gimp_image_width(image)
imageHeight = pdb.gimp_image_height(image)

# binarize the image with thresholds at 255 and 255
pdb.gimp_threshold(drawable, 255, 255)

# pixelize2 the binarized image using a 1 pixel-high and a <image-width> pixels-wide pixel
pixel_width = imageWidth
pixel_height = 1
pdb.plug_in_pixelize2(image, drawable, pixel_width, pixel_height)

# apply a new binarization with a relatively low threshold (around 40 for instance,  much less than 70 anyway), if needed define it by dichotomization
pdb.gimp_threshold(drawable, 40, 255)

# black lines are matches
x = 0
sample_merged = False
sample_average = False
average_radius = 0
horizontalSeparators = []
for y in range(imageHeight):
    color = pdb.gimp_image_pick_color(image, drawable, x, y, sample_merged, sample_average, average_radius)
    if color is (0,0,0):
        horizontalSeparators.append(y)
pdb.gimp_image_delete(image)

# group contiguous separators as blocks
lastSep = None
horizontalGuides = []
for sep in horizontalSeparators:
    if lastSep is None:
        # no blocks known yet
        # let's create a new block here
        newGuide = sep - 1
        if newGuide < 0:
            newGuide == 0
        horizontalGuides.append(newGuide)
        lastSep = sep
    elif sep == lastSep + 1:
        # still in the last block
        lastSep = sep
    else:
        # new block here
        # close the last block
        horizontalGuides.append(lastSep + 1)
        horizontalGuides.append(sep - 1)
        
# prepare guides before and after blocks
for block in horizontalBlocks:
    

    
# do the same vertically (1-px-wide and max-px-high pixelization)
image = pdb.file_png_load(filename, raw_filename)
drawable = pdb.gimp_image_get_active_drawable(image)
pdb.gimp_threshold(drawable, 255, 255)
pixel_width = 1
pixel_height = imageHeight
pdb.plug_in_pixelize2(image, drawable, pixel_width, pixel_height)
pdb.gimp_threshold(drawable, 40, 255)
x = 0
sample_merged = False
sample_average = False
average_radius = 0
verticalSeparators = []
for x in range(imageWidth):
    color = pdb.gimp_image_pick_color(image, drawable, x, y, sample_merged, sample_average, average_radius)
    if color is (0,0,0):
        verticalSeparators.append(x)
pdb.gimp_image_delete(image)
"""



def batch_create_guides(file_pattern,
                        outputDirectory,
                        minWidth,
                        minHeight,
                        numberOfErosions,
                        lowBinarizationThreshold,
                        highBinarizationThreshold):
    """ This script will take files whose names match file_pattern and create
    slicing guides in .xcf GIMP files from these files : it takes the input
    image and adds guides whenever it recognizes a wide-enough column of
    whitespace or a high-enough line of whitespace. The simplistic image
    segmentation algorithm used here is based on erosion (performed an
    numberOfErosions of times) and on a binarization (hence the low and high
    thresholds given as parameters. The resulting xcf GIMP image is saved in
    outputDirectory. """

    file_list=glob.glob(file_pattern)
    file_list.sort()
    for file_name in file_list:
        create_guides(file_name,
                      outputDirectory,
                      minWidth,
                      minHeight,
                      numberOfErosions,
                      lowBinarizationThreshold,
                      highBinarizationThreshold)
    force = True # without asking
    #pdb.gimp_quit(force)

def guillotine_and_save(fileName,
                        file_pattern,
                        createGuides, # = True,
                        outputDirectory,
                        minWidth,
                        minHeight,
                        numberOfErosions,
                        lowBinarizationThreshold,
                        highBinarizationThreshold):
        # open the image
        filename = fileName
        raw_filename = filename
        print "Processing ", fileName, " Please wait..."
        #path=FILEPATH
        #filename=path + "/" + filename
        dummy_param = False
        image = pdb.gimp_xcf_load(dummy_param, filename, raw_filename)
        drawable = pdb.gimp_image_get_active_drawable(image)
        
        # find the guides
        horizontalGuides = []
        verticalGuides = []
        guide = pdb.gimp_image_find_next_guide(image, 0)
        while guide != 0:
            position = pdb.gimp_image_get_guide_position(image, guide)
            orientation = pdb.gimp_image_get_guide_orientation(image, guide)
            # ORIENTATION-HORIZONTAL (0), ORIENTATION-VERTICAL (1)
            if orientation == 0:
                horizontalGuides.append(position)
            else:
                verticalGuides.append(position)
            guide = pdb.gimp_image_find_next_guide(image, guide)

        # slice along the guides
        horizontalGuides.sort()
        height = pdb.gimp_image_height(image)
        horizontalGuides.append(height)
        verticalGuides.sort()
        width = pdb.gimp_image_width(image)
        verticalGuides.append(width)
        horizontalIndex = 0
        verticalIndex = 0
        slicedImages = []
        top = 0
        suffixLength = len(file_pattern) - 1
        for bottom in horizontalGuides:
            left = 0
            for right in verticalGuides:
                # select the top left rectangle next to the guides
                x = left
                y = top
                width = right - left
                height = bottom - top
                operation = 2 # CHANNEL-OP-REPLACE (2)
                feather = False
                feather_radius = 0
                pdb.gimp_rect_select(image, x, y, width, height, operation, feather, feather_radius)
                # copy with a name for future pasting
                buffer_name = fileName[:-suffixLength] # dummy.png.xcf => dummy
                buffer_name += "-" + str(horizontalIndex) + "-" + str(verticalIndex)
                real_name = pdb.gimp_edit_named_copy(drawable, buffer_name)
                print buffer_name, real_name
                slicedImages.append(real_name)
                horizontalIndex += 1
                left = right
            horizontalIndex = 0
            verticalIndex += 1
            top = bottom
        
        # done with the image
        pdb.gimp_image_delete(image)

        # save with proper file names
        if len(slicedImages) > 1:
            for slicedImage in slicedImages:
                image = pdb.gimp_edit_named_paste_as_new(slicedImage)
                drawable = pdb.gimp_image_get_active_drawable(image)
                filename = slicedImage + ".png"
                raw_filename = filename
                pdb.file_png_save_defaults(image, drawable, filename, raw_filename)
                # and close
                pdb.gimp_image_delete(image)  
                pdb.gimp_buffer_delete(slicedImage)
                if createGuides in [None, True]:
                    create_guides(filename,
                                  outputDirectory,
                                  minWidth,
                                  minHeight,
                                  numberOfErosions,
                                  lowBinarizationThreshold,
                                  highBinarizationThreshold)


def batch_guillotine_and_save(file_pattern, # = "*.png.xcf",
                              createGuides, # = True,
                              outputDirectory,
                              minWidth,
                              minHeight,
                              numberOfErosions,
                              lowBinarizationThreshold,
                              highBinarizationThreshold):
    """" This algorithm opens all image files with filenames matching
    file_pattern then slices and dices the images along the GIMP guides in these
    files then saves the resulting images as .png files in the same directory.
    """

    # find matching files
    if file_pattern in [None, ""]:
        file_pattern = "*.png.xcf"
    fileList=glob.glob(file_pattern)
    fileList.sort()
    for fileName in fileList:
        guillotine_and_save(fileName,
                            file_pattern,
                            createGuides,
                            outputDirectory,
                            minWidth,
                            minHeight,
                            numberOfErosions,
                            lowBinarizationThreshold,
                            highBinarizationThreshold)


register(
    "batch_create_guides",
    "Creates slicing guides for all *.png files in the current dir",
    "Creates slicing guides for all *.png files in the current dir",
    "Jean Millerat",
    "Jean Millerat",
    "2011",
    "<Toolbox>/Xtns/Languages/Book slicer/_Batch create guides...",
    "",
    [
      (PF_STRING, "file_pattern", "Process all files with names matching this pattern", "*.png"),
      (PF_STRING, "outputDirectory", "Save resulting files into this sub-directory", "output"),
      (PF_INT32, "minWidth", "Minimum width of whitespaces to be significant", 80),
      (PF_INT32, "minHeight", "Minimum height of whitespaces to be significant", 40),
      (PF_INT32, "numberOfErosions", "Number of erosions", 12),
      (PF_INT32, "lowBinarizationThreshold", "Low threshold", 220),
      (PF_INT32, "highBinarizationThreshold", "High threshold", 255),
    ],
    [],
    batch_create_guides
)

register(
    "batch_guillotine_and_save",
    "Slices images along pre-created guides and saves the results",
    "Slices images along pre-created guides and saves the results",
    "Jean Millerat",
    "Jean Millerat",
    "2011",
    "<Toolbox>/Xtns/Languages/Book slicer/_Batch slice along guides...",
    "",
    [
      (PF_STRING, "file_pattern", "Process all files with names matching this pattern", "*.png.xcf"),
      (PF_INT32, "createGuides", "1 if xcf files with guides are to be created, 0 otherwise", 1),
      (PF_STRING, "outputDirectory", "Save resulting files into this sub-directory", "output"),
      (PF_INT32, "minWidth", "Minimum width of whitespaces to be significant", 80),
      (PF_INT32, "minHeight", "Minimum height of whitespaces to be significant", 40),
      (PF_INT32, "numberOfErosions", "Number of erosions", 12),
      (PF_INT32, "lowBinarizationThreshold", "Low threshold", 220),
      (PF_INT32, "highBinarizationThreshold", "High threshold", 255),
    ],
    [],
    batch_guillotine_and_save
)

main()

"""
If I had to automate the slicing more using a machine-learning-powered classifier.

The overall idea : automatically classify images which deserve human intervention
and classify the need for slicing at several candidate spots.

Objects = given x or y coordinate in a given image
Classes = Slice here (or not)
Confidence = requires human intervention or not

Requires 2 sets of algorithms :
1) propose candidates xs and ys for slicing
2) classify candidates

Would-be useful tokens (clues/hints to base the classification on) :

- location of the image : level of slicing (image-a-b-c-d-e-f-g-h is at level 4)
- location of the image : horizontal and vertical indices at the levels above (a, b, c, d, e, f, g, h)
- location of the image : page number
- location of the image : page number / total number of pages

- proposal : horizontal or vertical guide
- proposal : identity of the algorithm proposing this candidate
- proposal : additional clues provided by this algorithm
- proposal : x (or y) in the image
- proposal : x/width (or y/height) in the image
- proposal : total number of candidates in this image
- proposal : number of candidates in this image, for each proposing algorithm
- proposal : distribution of colors along the guide (how many colors ? more than x% in 1 color only ?

- for the image itself, and for the 1st and 2nd slices of the proposed candidate :
    geometry : width
    geometry : height
    geometry : width/height
    geometry : location in the page
    colors : number of colors
    colors : other colors statistics
    colors : contrast/light ratio or statistics (average, median, min, 5th, 25th, 50th, 75th, 95th percentiles, max)
    binarization : black/white surface ratio
    OCR : number of characters
    OCR : first character
    OCR : last character
    OCR : number of lines
    OCR : additional clues provided by the OCR if available
    OCR : is a lowercase letter
    OCR : is an uppercase letter

For the algorithms proposing candidates, 2 subsets :
1.1) smart algorithms trying to perform layout analysis
1.2) dumb algorithms like "is this a mono-color row/columns of pixels ?"

In order to train the candidate classifier : on a given set of images already manually sliced compare candidates classification with manual slicing.
- But how to compare ?
- Use a distance function.
- OK, which one ?
- Err... minimum distance of the candidate to manual guides ?
- What if, in 1 image, we have 100 candidates but only 1 manual guide ?

Problem : should we classify would-be guides (1 classification per guide) or would-be slicing (1 classification per image) ?

"""

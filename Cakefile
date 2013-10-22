#
# Module Dependencies
#
{exec} = require 'child_process'
fs     = require 'fs'
path   = require 'path'
jade   = require 'jade'
stylus = require 'stylus'
nib    = require 'nib'

# Output directory
OUTPUT = path.resolve path.join('.', 'build')

# Source Files
files = [
  'src/www/index.jade'
  'src/www/cdn/accueil.styl'
]

#
# Build source files
#
task 'build', 'compiles source files', ->
  console.log 'building...'

  files.forEach (file) ->

    content = fs.readFileSync(file).toString()        # get contents of file

    switch path.extname file                          # do something based on file extension

      when '.jade'
        buff     = jade.compile content               # create buffer of jade content
        html     = buff { title: 'async-flow' }       # jade => html
        filename = file.replace /\.jade$/, '.html'   # get file name
        saveto   = path.join OUTPUT, filename
        compiled = fs.writeFileSync saveto, html    # save compiled .jade to .html

      when '.coffee'
        coffee = ['coffee', '-bco', OUTPUT, file]     # coffee --bare --compile --output OUTPUT <file>
        exec coffee.join(' '),
          (err, stdout, stderr) ->
            throw err          if err
            console.log stdout if stdout
            console.log stderr if stderr

      when '.styl'

        filename = file.replace /\.styl/, '.css'      # get file name
        saveto   = path.join OUTPUT, filename         # where we save the file to

        stylus(content)
          .set('filename', filename)                  # for debugging
          .use(do nib)                                # include nib in compile
          .render (err, css) ->                       # stylus => css
            throw err if err
            fs.writeFileSync saveto, css              # write compiled css to file

      else
        console.log "don't know what to do with", file

#
# Watch for changes in source files
#
task 'watch', 'watches for changes in source files', ->
  console.log 'watching...'

  watch = (file) ->
    fs.watchFile file, (curr,prev) ->
      if +curr.mtime isnt +prev.mtime                 # if the current time isn't the last modified
        console.log 'change found in', file
        invoke 'build'                                # trigger build

  watch file for file in files                        # add watcher to each source file

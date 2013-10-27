fs							= require 'fs'
ps							= require 'path'
{exec,spawn}		= require 'child_process'
util						= require 'util'
watch						= require 'watch'
glob						= require 'glob'
Q								= require 'q'
coffee					= require 'coffee-script'
mkdirp					= require 'mkdirp'
Mocha						= require 'mocha'
rimraf					= require 'rimraf'
jade						= require 'jade'
stylus					= require 'stylus'
nib							= require 'nib'
require 'colors'

# internal globals
untestedChange = false
verbose = false
debug = false


#config
exports.fichierATester 			= 'cakeLib' # .js ajouté automatiquement
exports.appSourceDir				= ''
exports.appCompiledDir			= ''
exports.specDir							= ''
exports.specCompiledDir			= ''
exports.testConfigFile			= ''
exports.oneShotReporter			= 'nyan' #"progress"
exports.watchReporter				= 'min' #"dot"
exports.runTestDelay				= 500 # latence entre la détection d'un fichier modifié et l'execution des test (pour éviter les test en cascade lors des enregistrement de masse)
exports.reglesDeConversion	= {}

exports.watchTask = (options)->
	setGlobalOptions options
	Q(exports.buildTask options).then ->
		exports.testTask options
		new Monitor(exports.appSourceDir,appFileChange,appFileChange,rmAppFile)
		new Monitor(exports.specDir,specFileChange,specFileChange,rmSpecFile)

exports.testTask = (options, reporter=exports.oneShotReporter)->
	q = Q.defer()
	setGlobalOptions options
	util.log 'Préparation des tests'.cyan if debug
	require ps.resolve '.', exports.testConfigFile

	# TODO: arboressance applicative à inclure pour lancer les test dessus.
	delete require.cache[ps.resolve('.', exports.appCompiledDir+exports.fichierATester+'.js')] # chemin absolue nécessaire
	require ps.resolve '.', exports.appCompiledDir+exports.fichierATester+'.js'

	mocha = new Mocha
	mocha.reporter reporter
	testFilesPattern = exports.specCompiledDir+'**/*.js'
	util.log 'Liste les fichiers répondant au motif '.cyan + testFilesPattern if debug
	glob testFilesPattern, (err, fileList)->
		for file in fileList
			util.log 'spec : '.cyan + file if debug
			delete require.cache[ps.resolve('.', file)] # chemin absolue nécessaire
			mocha.addFile file
		util.log 'Execution des tests'.cyan if verbose
		runner = mocha.run ->
			util.log 'Tests terminés'.cyan if verbose
			q.resolve()
	q.promise

exports.buildTask = (options)->
	q = Q.defer()
	setGlobalOptions options
	Q.all([
		compileTree exports.specDir, exports.specCompiledDir
		compileTree exports.appSourceDir, exports.appCompiledDir
	]).done ->
		util.log 'Compilation terminée'.cyan
		q.resolve()
	q.promise

exports.cleanTask = (options)->
	setGlobalOptions options
	util.log "Nétoyage du projet...".cyan
	Q.all([
		rmRecursive exports.specCompiledDir
		rmRecursive exports.appCompiledDir
	]).done ->
		util.log "Nétoyage Terminé".cyan

exports.coffee2js = (srcContent, srcFileName) ->
	q = Q.defer()
	q.resolve coffee.compile srcContent
	q.promise
exports.jade2html = (srcContent, srcFileName)->
	q = Q.defer()
	buff = jade.compile srcContent               # create buffer of jade content
	q.resolve buff({ title: 'async-flow' })      # jade => html
	q.promise
exports.stylus2css = (srcContent, srcFileName)->
	q = Q.defer()
	stylus(srcContent)
		.set('filename', srcFileName)                  # for debugging
		.use(do nib)                                # include nib in compile
		.render (err, css) ->                       # stylus => css
			throw err if err
			q.resolve css              # write compiled css to file
	q.promise


appFileChange = (file) ->
	# recompiler puis lancer les test
	compileIt(file, exports.appSourceDir, exports.appCompiledDir).then ->
		untestedChange = true
		setTimeout runTestIfChange, exports.runTestDelay
specFileChange = (file) ->
	# recompiler puis lancer les test
	compileIt(file, exports.specDir, exports.specCompiledDir).then ->
		untestedChange = true
		setTimeout runTestIfChange, exports.runTestDelay
rmSpecFile = (file) ->
	# supprimer la version compiler puis lancer les test
	rmCompiled(file, exports.specDir, exports.specCompiledDir).then ->
		untestedChange = true
		setTimeout runTestIfChange, exports.runTestDelay
rmAppFile = (file) ->
	# supprimer la version compiler puis lancer les test
	rmCompiled(file).then ->
		untestedChange = true
		setTimeout runTestIfChange, exports.runTestDelay

compileTree = (originFolder, destinationFolder) ->
	q = Q.defer()
	pattern = originFolder+'**'
	util.log 'liste les fichiers répondant au motif '.cyan + pattern if debug
	glob pattern, (err, fileList)->
		q.reject err if err
		promesse = []
		for file in fileList
			promesse.push compileIt(file, originFolder, destinationFolder)
		Q.all(promesse).then ->
				q.resolve originFolder + ' -> ' + destinationFolder + ' OK'
	q.promise

compileIt = (srcFile, originFolder=exports.appSourceDir, destinationFolder=exports.appCompiledDir) ->
	#path.extname file
	fileType = fileExtension srcFile
	# determination du nom de fichier en sortie
	if exports.reglesDeConversion[fileType] # s'il y a changement d'extension
		conversion = exports.reglesDeConversion[fileType]
		compiledFile = pathConvertor(srcFile, originFolder, destinationFolder, fileType, conversion.finalType)
	else
		compiledFile = pathConvertor(srcFile, originFolder, destinationFolder)

	# on n'intervient que si l'original est plus récent que le fichier en sortie
	isNewer(srcFile,compiledFile).then (res)->
		if !res
			util.log compiledFile + ' déjà à jour'.grey if debug
		else
			util.log 'Compile '.yellow + srcFile + ' to '.yellow + compiledFile if verbose
			file2string(srcFile).then (res)->
				srcContent = res
				if conversion # s'il y a un traitement spécifique pour ce format
					promesse = conversion.func srcContent, srcFile # on compile
				else
					promesse = justreturnContent srcContent
				promesse.then (compiledContent) ->
					string2file compiledFile, compiledContent

rmCompiled = (srcFile, originFolder=exports.appSourceDir, destinationFolder=exports.appCompiledDir) ->
	fileType = fileExtension srcFile
	if exports.reglesDeConversion[fileType] # s'il y a une conversion de format
		compiledFile = pathConvertor(srcFile, originFolder, destinationFolder, fileType, exports.reglesDeConversion[fileType].finalType)
	else
		compiledFile = pathConvertor(srcFile, originFolder, destinationFolder)
	rmRecursive(compiledFile)

Monitor = (folder, changeCallBack, newCallBack, rmCallBack) ->
	this.lastStamp = 'static var'
	this.lastFileList = []
	watch.watchTree folder, (file, curr, prev) ->
		this.lastFileList = [] if this.lastStamp isnt (new Date).toLocaleTimeString()
		this.lastStamp = (new Date).toLocaleTimeString()
		if prev is null and curr is null and file instanceof Object
			util.log "Finished walking ".cyan + folder + " tree".cyan if debug
		else
			if lastFileList[file]
				util.log ('echo '+file).grey if debug
			else
				if prev is null
					util.log 'new '.green + file if verbose
					newCallBack(file)
				else if curr.nlink is 0
					util.log 'rm '.red + file if verbose
					rmCallBack(file)
				else
					util.log 'change '.yellow + file if verbose
					changeCallBack(file)
			this.lastFileList[file]=true

setGlobalOptions = (options) ->
	if options
		if options.verbose then verbose = true
		if options.veryverbose
			verbose = true
			debug = true
isNewer = (file1, file2) ->
	# si seul un fichier existe il est considéré comme le plus récent
	q = Q.defer()

	Q.allSettled([
		fs_stat file1
		fs_stat file2
	]).then (res)->
		if res[0].state is "fulfilled"
			file1Time = res[0].value.mtime.getTime()
		else
			file1Time = 0
		if res[1].state is "fulfilled"
			file2Time = res[1].value.mtime.getTime()
		else
			file2Time = 0
		if !file1Time and !file2Time
			q.reject res[0].reason
		q.resolve file1Time>file2Time
	q.promise
file2string = (file, encoding='utf8') -> fs_readFile file, encoding
string2file = (file, string) ->
	filePath = file2path file
	mkdirRecursive(filePath).then ->
		fs_writeFile(file, string)
justreturnContent = (srcContent)->
	q = Q.defer()
	q.resolve srcContent
	q.promise
fileExtension = (file)->
	tmp = file.split('.')
	tmp[tmp.length-1]
pathConvertor = (oldPath, originFolder, destinationFolder, originFileType='', destinationFileType='')->
	newPath = unixifyPath(oldPath).replace(originFolder, destinationFolder)
	if originFileType
		pattern = new RegExp '.'+originFileType+'$', 'i'
		newPath = newPath.replace(pattern, '.'+destinationFileType)
		util.log "regexp de changement d'extension : ".cyan+pattern+' -> '.cyan+'.'+destinationFileType if debug
	newPath
unixifyPath = (oldPath)->
	oldPath.replace(/\\/g,'/')
	# correction de la coloration syntaxique de sublime text 2 '
delay = (ms, func) -> setTimeout func, ms
fs_stat = (file)->
	q = Q.defer()
	fs.stat file, (err, stat)->
		q.reject err if err
		q.resolve stat
	q.promise
fs_readFile = (file, encoding='utf8') ->
	q = Q.defer()
	fs.readFile file, encoding, (err, data) ->
		q.reject err if err
		q.resolve data
	q.promise
fs_writeFile = (file, string) ->
	q = Q.defer()
	fs.writeFile file, string, (err) ->
		q.reject err if err
		q.resolve()
	q.promise
file2path = (file) ->
	# extract path from path+filename
	filePath = file.split('/')
	filePath.pop()
	filePath.join('/')
rmRecursive = (folder)->
	q = Q.defer()
	rimraf folder, (err)->
		if err
			q.reject err
		else
			util.log folder + ' supprimé'.yellow if verbose
			q.resolve()
	q.promise
mkdirRecursive = (folder)->
	q = Q.defer()
	mkdirp folder, (err)->
		q.reject err if err
		q.resolve()
	q.promise

runTestIfChange = ->
	if untestedChange
		untestedChange = false
		exports.testTask null, exports.watchReporter

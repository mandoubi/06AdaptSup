
cl										= require './src/cakeLib'

#config
cl.appSourceDir				= 'src/'
cl.appCompiledDir			= 'build/'
cl.appTestablePattern	= cl.appCompiledDir + 'cakeLib.js' #'lib/'
cl.specDir						= 'test/spec/'
cl.specCompiledDir		= 'build/test/'
cl.testConfigFile			= 'test/config.coffee'
cl.oneShotReporter		= 'nyan' #"progress"
cl.watchReporter			= 'min' #"dot"
cl.runTestDelay				= 200 # latence entre la détection d'un fichier modifié et l'execution des test (pour éviter les test en cascade lors des enregistrement de masse)

bsOrg = 'bower_components/bootstrap/dist/'
bsFinal = 'build/www/cdn/vendors/'
cl.aDeplacer					= [
	[bsOrg+'css/bootstrap.min.css',										bsFinal+'bootstrap.css']
	[bsOrg+'css/bootstrap-theme.min.css',							bsFinal+'bootstrap-theme.css']
	[bsOrg+'fonts/glyphicons-halflings-regular.eot',	bsFinal+'../fonts/glyphicons-halflings-regular.eot']
	[bsOrg+'fonts/glyphicons-halflings-regular.svg',	bsFinal+'../fonts/glyphicons-halflings-regular.svg']
	[bsOrg+'fonts/glyphicons-halflings-regular.ttf',	bsFinal+'../fonts/glyphicons-halflings-regular.ttf']
	[bsOrg+'fonts/glyphicons-halflings-regular.woff',	bsFinal+'../fonts/glyphicons-halflings-regular.woff']
	[bsOrg+'js/bootstrap.min.js',											bsFinal+'bootstrap.js']
	['bower_components/jquery/jquery.min.js',					bsFinal+'jquery.js']
]


# formats géré
cl.reglesDeConversion =
	coffee:
		func: cl.coffee2js
		finalType: 'js'
	jade:
		func: cl.jade2html
		finalType: 'html'
	styl:
		func: cl.stylus2css
		finalType: 'css'
	stylus:
		func: cl.stylus2css
		finalType: 'css'


option '-v', '--verbose', 'affichage détaillé'
option '-V', '--veryverbose', 'affichage très détaillé (debug)'

task 'watch', "A chaque changement sauvegardé, recompile les fichiers concernés et exécute les tests".cyan, (options)->
	cl.watchTask options
task "test", "exécute les tests".cyan, (options)->
	cl.testTask options
task 'build', 'compile tous les fichiers des dossiers '.cyan + cl.appSourceDir + ' dans '.cyan + cl.appCompiledDir + ' et '.cyan + cl.specDir + ' dans '.cyan + cl.specCompiledDir, (options)->
	cl.buildTask options
task "clean", "supprime les dossiers ".cyan + cl.specDir + ' et '.cyan + cl.appSourceDir, (options)->
	cl.cleanTask options

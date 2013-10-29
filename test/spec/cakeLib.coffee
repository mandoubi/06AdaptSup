cl = require '../../src/cakeLib'

describe "L'Interface publique", ->
	it "permet d'accéder et de modifier les modes d'affichage des test", ->
		# accès au donnée
		osr = cl.oneShotReporter
		wr = cl.watchReporter
		# verification des données par défaut
		osr.should.equal 'nyan'
		wr.should.equal 'min'
		# modification des données
		cl.oneShotReporter = 'progress'
		cl.watchReporter = 'dot'
		# vérification de la prise en compte des modif
		cl.oneShotReporter.should.equal 'progress'
		cl.watchReporter.should.equal 'dot'
		# retour au paramêtres d'origine pour éviter les déconvenues.
		cl.oneShotReporter = osr
		cl.watchReporter = wr

	it "permet d'utiliser la fonction de compilation coffee2js", (done)->
		srcSample = 'dummy = -> 5'
		expectedResult = "(function() {\n  var dummy;\n\n  dummy = function() {\n    return 5;\n  };\n\n}).call(this);\n"
		cl.coffee2js(srcSample)
			.should.become(expectedResult)
			.notify done
	it "permet d'utiliser la fonction de compilation jade2html", (done)->
		srcSample = '!!! 5'
		expectedResult = "<!DOCTYPE html>"
		cl.jade2html(srcSample)
			.should.become(expectedResult)
			.notify done
	it "permet d'utiliser la fonction de compilation stylus2css", (done)->
		srcSample = "*\n	color red"
		expectedResult = "* {\n  color: #f00;\n}\n"
		cl.stylus2css(srcSample)
			.should.become(expectedResult)
			.notify done


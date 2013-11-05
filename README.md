Dys'doc
=======

Dys'doc, Dys'Doc, Dys*doc, Dys-doc, CnedBook, CnedLivre, AccessiCned, AccessiLivre, AccessiBook, Accessi'doc, AcessiScan (le nom n'est pas définitif) est une plateforme à double objectifs :
- Transformer simplement et rapidement des documents scannés en documents structurés et accessibles tout en mutualisant les efforts d'accessibilisation.
- Consulter les documents rendus accessibles depuis une interface à l'ergonomie conçue pour faciliter l'apprentissage chez les dyspraxiques, dyslexiques et autres dys* ou autistes, et ce, à l'aide de profils utilisateurs configurés pour correspondre au mieux aux besoins de chacun.

Fonctions principales
---------------------

**Pour les Tuteurs** (et autres personnes s'occupant de rendre accessibles les contenus)
- Découpage en blocs sémantiques et tagage des documents scannés
- Rédaction et/ou génération par OCR des alternatives textuelles aux images des blocs sémantiques extraits des scans
- Enregistrement vocal et synthèse vocale des alternatives audio aux images des blocs sémantiques extraits des scans
- Recherche de documents déjà accessibilisés
- Création et gestion de profils utilisateurs (élèves dys*) avec :
  + Mise à disposition d'une collection spécifique de documents par profil d'élève
  + Partage de profils entre plusieurs tuteurs
  + Configuration des adaptations nécessaires à l'interface de navigation pour accéder aux documents
  + Configuration des adaptations nécessaires pour faciliter la lecture des documents

**Pour les élèves** (et tous ceux pour qui les adaptations proposées sont utiles)
 - accès facilité aux documents utiles
 - navigation hors ligne et responsive
 - lecture des documents mis à disposition dans une interface spécialement adaptée selon le profil de l'élève pour faciliter son apprentissage.


## Liens utiles
- [Maquette en ligne](http://cneddi.github.io/06AdaptSup)
- [Signaler un problème ou faire une suggestion](https://github.com/cnedDI/06AdaptSup/issues)

## Installation

- Installez [git](http://git-scm.com/) et [node (avec npm)](http://nodejs.org/) (lors de l'installation de git, si vous êtes sous windows, cochez la 3ème option avec le warning en rouge, c'est celle qui vous permettra d'accéder aux commandes utiles le plus facilement et je n'ai constaté aucun problème avec).

- Ouvrez une console/un terminal où les commandes Git sont accessibles (Git bash sous windows).

- Effectuez la [configuration initale de Git](http://git-scm.com/book/fr/D%C3%A9marrage-rapide-Param%C3%A9trage-%C3%A0-la-premi%C3%A8re-utilisation-de-Git) en tapant dans la console les commandes suivantes :

```bash
git config --global user.name "Votre nom"
git config --global user.email votre@email.com
# et éventuellement si vous savez quoi y mettre :
git config --global core.editor commande-de-lancement-de-votre-editeur-de-texte-en-ligne-de-commande
git config --global merge.tool votre-outil-de-diff-préféré
```

- Installez ungit et coffee-script de façon globale avec la commande :

```
npm install -g ungit coffee-script
```

Félicitations, votre environnement est prêt. Maintenant importons le projet :

- Ouvrez ungit en tapant `ungit` dans une console ou dans **Démarrer, Exécuter** pour les utilisateurs Windows.

- Indiquez dans la partie haute le dossier où vous souhaitez que se trouve le projet, puis importez le (clonez le) en mettant dans le champ **url** : `git@github.com:cnedDI/06AdaptSup.git` et dans le champ **destination folder** : nom que vous souhaitez donner au projet. Validez en cliquant sur **Clone repository!**

- Ouvrez une console/un terminal où les commandes Git sont accessibles (Git bash sous windows).

- Déplacez vous dans le dossier du projet à l'aide de la commande `cd chemin-du-dossier-tel-qu-il-apparait-en-haut-dans-ungit`

- Tapez les commandes :

```
npm install
bower install
cake build
```

Vous voici prêt !

## Contribuer au code :

- Si ce n'est pas encore le cas créez un compte sur github et selon ce qui vous semble pertinent, demandez à faire partie de l'entité CnedDI sur github ou faites un fork du projet pour pouvoir publier vos modifications et nous envoyer des pull request.

- Ouvrez une console/un terminal où les commandes Git sont accessibles (Git bash sous windows).

- Déplacez vous dans le dossier du projet à l'aide de la commande `cd chemin-du-dossier-tel-qu-il-apparait-en-haut-dans-ungit`

- Tapez : `cake watch`

- Gardez la fenêtre ouverte, elle se chargera de mettre à jour les fichiers html/css/js que vous pouvez tester en local dans votre navigateur en ouvrant index.html. Elle permet également de réexécuter les tests unitaires à la moindre modification.

- Ouvrez votre éditeur de texte favori (sublime-text pour ma part ces derniers temps) et importez le dossier du projet.

	+ les tests unitaires se trouvent dans test/spec
	+ les sources dans src/
	+ les options de build dans le CakeFile
	+ si votre éditeur le supporte, je vous recommande le plugin **editorConfig** pour que votre éditeur utilse les règles syntaxiques définies pour le projet.

- Quand vous avez effectué les modifications souhaitées, retournez dans ungit, créez un commit avec les fichiers concernés et publiez en glissant le nom de la branche sur **push** (qui apparaitra quand vous commencerez à déplacer le nom de branche) pour plus d'info sur l'usage d'ungit, vous pouvez consulter [un tuto vidéo en français](http://www.grafikart.fr/tutoriels/internet/ungit-437) ou [le site officiel](https://github.com/FredrikNoren/ungit).

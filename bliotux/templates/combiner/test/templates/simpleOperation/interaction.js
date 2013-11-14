/* File: interaction.js
 * 
 * Copyright (c) 2009
 * by Jean Millerat, 8 square de Batz, 78310 MAUREPAS
 * (Jean.Bliotux@wecena.com)
 * 
 * GNU Affero General Public License (AGPL)
 * 
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * 
 */

function clickReponse(event, reponse){
    //alert('clickReponse: ' + event + ', ' + reponse);
    var unite = $('.resultatUnite', svg.root());
    var dizaine = $('.resultatDizaine', svg.root());
    var centaine = $('.resultatCentaine', svg.root());
    if (unite.text() == "") {
        unite.html(reponse);
        storageSave('.resultatUnite', reponse);
    }
    else 
        if (dizaine.text() == "") {
            dizaine.html(reponse);
            storageSave('.resultatDizaine', reponse);
        }
        else 
            if (centaine.text() == "") {
                centaine.html(reponse);
                storageSave('.resultatCentaine', reponse);
            }
}

function clickOups(event){
    //alert('click Oups');
    $('.resultatCentaine', svg.root()).html('');
    $('.resultatDizaine', svg.root()).html('');
    $('.resultatUnite', svg.root()).html('');
    storageSave('.resultatCentaine', '');
    storageSave('.resultatDizaine', '');
    storageSave('.resultatUnite', '');
}

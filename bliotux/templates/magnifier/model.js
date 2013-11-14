/* File: interaction.js
 * 
 * Copyright (c) 2010
 * by Valentin Robert, 13 avenue Trianon 64000 PAU
 * (val <dot> rob <at> free <dot> fr)
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

data = {
    'illustration':     'illustration.svg',
    'illustration_id':  'illustration'
};

function manipulate(root) {
    $('#picture').attr("xlink:href",
            "pages/" + pageName + "/" + data['illustration'] + "#" +
            data['illustration_id']);
    $('#zoomed').attr("xlink:href",
            "pages/" + pageName + "/" + data['illustration'] + "#" +
            data['illustration_id']);
};
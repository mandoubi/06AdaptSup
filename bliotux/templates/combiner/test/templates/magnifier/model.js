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

onModelLoad("model.js loaded");

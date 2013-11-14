//alert('test loading');
// First, we must tell jStore where to find the HTML file which embeds our flash script.  
// If you move the jStore.swf or jStore.Flash.html files out of their default directories (document root),  
// use this variable to define where to access the .html file. Within the .html file, you can set up the  
// path to the .swf file.  
// Then, set up the default engine we wish to use.  
jQuery.extend(jQuery.jStore.defaults, {
    project: 'demo',
    engine: 'gears'}) /*,
    flash: 'jStore.Flash.html',
    autoload: true
})*/

jQuery.jStore.fail(function(engine){
    alert("failed ! with " + engine.jri);
    
    // Next, we need to wait for jStore to prepare the storage engine  
})
jQuery.jStore.ready(function(engine){
    //alert('jStore ready');
    //jQuery.jStore.CurrentEngine.connect();
    var engine = jQuery.jStore.CurrentEngine;
    //alert(engine.jri + ' is available ? ' + engine.isAvailable());
    jQuery.jStore.flashReady(function(){
        alert('flashReady');
        // Finally, we need to wait for the storage engine to be ready.  
        // Once this function is called, you can use the jStore interface synchronously  
    });
    //alert('flashReady defined');
    engine.ready(function(){
        alert('engine ready');
        var engine = this, counter = (engine.get('counter') || 0) * 1, original = counter;
        counter++; // Incrememnt the counter  
        alert('Original Value: ' + original + "\n" +
        'New Value: ' +
        counter +
        "\n" +
        'Setting Value: ' +
        engine.set('counter', counter) +
        "\n" +
        'Fetching Value: ' +
        engine.get('counter'));
        
        if (counter == 5) {
            var lastValue = engine.rem('counter'); // Clear the value  
            alert('Resetting Counter at ' + counter); // Alert the last value of the counter                
        }
    });
    //alert('engine ready defined');
    engine.included(function(){
        alert(engine.jri + ' included');
    });
    //alert('engine included defined');
    //engine.connect();
    //alert('connection attempt done');
});

// Finally, we trigger jStore's load function. This is a new step in the   
// activation procedure of jStore, since Version 1.1  
$(function(){
    // Once the engine is prepared, we can do whatever we need with it  
    $('a').click(function(){
        alert('click');
        jQuery.jStore.set('link_title', jQuery(this).attr('title'));
        
        // And, if you find it necessary, you can access the storage engine in a jQuery chain.  
        // Storing values will allow you to keep chaining, but requesting a variable will return  
        //    that value, stopping the chain.  
        jQuery(this).css('display', 'block').store('myval', 30).attr('href', '#').store('myval');
        
        return false;
    });
    
    $('img').click(function(){
        alert('click');
        jQuery.jStore.set('img_alt', jQuery(this).attr('alt'));
        
        // And, if you find it necessary, you can access the storage engine in a jQuery chain.  
        // Storing values will allow you to keep chaining, but requesting a variable will return  
        //    that value, stopping the chain.  
        jQuery(this).css('display', 'block').store('myval', 30).attr('href', '#').store('myval');
        
        return false;
    });
    
    //	jQuery.jStore.load();
});

/*function flash_ready(){
    alert('flash_ready');
}*/

jQuery(document).ready(function(){
    //alert('document ready');
    jQuery.jStore.load();
})
//alert('test loaded');

function blocky_is_active(settings) {
	if(settings === undefined) {
		console.info("blocky: undefined settings");
		return;
	}
	
	if(settings.is_active !== '1') {
		console.info("blocky: not active");
		return;
	}
	
	return true;
}

function insert_content(tab_id) {
	chrome.tabs.insertCSS(tab_id, {file: "bower_components/webui-popover/dist/jquery.webui-popover.min.css"});
	chrome.tabs.insertCSS(tab_id, {file: "content_scripts/content.css"});
	chrome.tabs.executeScript(tab_id, {file: "bower_components/jquery/dist/jquery.min.js"});
	chrome.tabs.executeScript(tab_id, {file: "bower_components/webui-popover/dist/jquery.webui-popover.min.js"});
	chrome.tabs.executeScript(tab_id, {file: "js/jquery.blocky.js"});
	chrome.tabs.executeScript(tab_id, {file: "content_scripts/content.js"});
}

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-blocky') {
    	chrome.tabs.query(
    		{currentWindow: true, active : true},
    		function(tabs) {
    			var tab = tabs[0],
    				host = new URL(tab.url).host,
    				settings_key = 'settings-'+host;
    			
    			chrome.storage.local.get(settings_key, function(data) {
    				// TODO: error management
    	    		settings = data[settings_key];
    				if (blocky_is_active(settings)) {
    					insert_content(tab.id)
    				}
    	    	});
    		}
    	);

    }
});  
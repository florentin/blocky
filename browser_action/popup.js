; (function(window, document, $, Settings, undefined) {
	var settings_key_tpl = 'settings-{0}',
		store_key_tpl = 'data-{0}';
    
    function flash_message(msg) {
        $('#message').hide().html(msg).fadeIn().delay(2000).fadeOut();
    }
    
    $(document).ready(function() {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        	var tab = tabs[0],
        		$form = $("#settings_form"),
        		host = new URL(tab.url).host,
        		store_key = $.format(store_key_tpl, host),
        		settings_key = $.format(settings_key_tpl, host);
        	
        	function reset_storage(event) {
            	chrome.storage.local.remove(store_key);
                chrome.storage.local.remove(settings_key);
                $form.trigger('reset');
                flash_message('Storage cleared.')
            }
            
            function download_storage(event) {
                chrome.storage.local.get(null, function(items) { // null implies all items
                    // Convert object to a string.
                    var result = JSON.stringify(items);

                    // Save as file
                    var url = 'data:application/json;base64,' + btoa(result);
                    chrome.downloads.download({
                        url: url,
                        filename: 'blocky.json'
                    });
                });
            }
            
            function populate_settings(data) {
                $.chrome_last_error();
                if(!$.isEmptyObject(data)) { 
                    $.populate($form, data[settings_key]);
                } else { // if key not found, try to find some defaults
                    if(settings_key in Settings) {
                        $.populate($form, Settings[settings_key]);
                    }
                }
            }
            
            function on_submit(event) {
                event.preventDefault();
                var $form = $(this), 
                	formData = $form.serializeJSON(),
                	settings_obj = (obj={}, obj[settings_key]=formData, obj);
                
                chrome.storage.local.set(settings_obj, function(data) {
                    $.chrome_last_error();
                    flash_message('Settings saved.')
                });
            }
        	
	        // use this to send unchecked checkbox values
	        //$form.checkbox_extras();
	        
	        $('#close_window').click(function(event) {
	        	window.close();
	        });
	        $('#reset_storage').click(reset_storage);
	        $('#download_storage').click(download_storage);

            $("span[data-source='host']").html(host);
            $form.on("submit", on_submit);
            
            chrome.storage.local.get(settings_key, populate_settings);
        });
    });
	
})(window, document, jQuery, Settings);
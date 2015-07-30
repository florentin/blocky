;(function ( window, document, $, undefined  ) {
	"use strict";
	
	var settings_key, settings, store_key, store, 
		settings_key_tpl = 'settings-{0}', // settings-www.amazon.com
		store_key_tpl = 'data-{0}',  // data-www.amazon.com
		buttons_tpl = '<span class="blocky-actions">'+
						'<button data-tag="green">green</button> '+
						'<button data-tag="yellow">yellow</button> '+
						'<button data-tag="red">red</button> '+
						'</span>';

	function container_dom_modified(event) {
		event.preventDefault();
		event.stopPropagation();

		var $container = $(this);
		$container.off('DOMSubtreeModified');
		
		var $units = $($.eval_ctx({'container': this}, settings.unit_selector));
		$.each($units, parse_unit);
		
		$container.on('DOMSubtreeModified', container_dom_modified_thr);
		return false;
	};

	var container_dom_modified_thr = $.throttle(container_dom_modified, 1000);
	
	function parse_unit(i, unit) {
		var $unit, $id_item, unit_id, cls_name;

		$unit = $(unit);

		// skip this unit if it has been already marked
		if($unit.data('blocky-id')) {
			return;
		}

		unit_id = get_unit_id(unit);
		// mark the unit with blocky-id and set classes
		$unit.data('blocky-id', unit_id).addClass('blocky');
		if (unit_id in store) {
			$unit.addClass($.format("blocky-tag-{0}", store[unit_id]['tag']));
		}
		on_unit_popover($unit);
	}

	function get_unit_id(unit) {
		var unit_id;

		unit_id = $.eval_ctx({'unit': unit}, settings.unit_id_selector );
		// save some storage space by removing the scheme and HOST from the href
		if(unit_id.indexOf('http') === 0) {
			unit_id = unit_id.split('/').slice(3).join('/'); 
		}
		return unit_id;
	}

	function on_unit_popover($unit) {
		// show popover for additional actions on the unit
		$unit.webuiPopover({
			title:'Actions',
			cache: true,
			content: function() {
				// this refers to the $unit dom element
				var content = $(buttons_tpl);
				content.find('button').click(popover_tag_clicked(this));
				return content;
			},
			trigger:'hover'
		});
	}

	function popover_tag_clicked(unit) {
		return function(event) {
			//	"this" refers to the button clicked
			var unit_meta={}, unit_meta_raw, $unit = $(unit),
				unit_id = $unit.data('blocky-id'),
				tag = $(this).data('tag');
			
			if(settings.unit_meta) {
				unit_meta_raw = $.eval_ctx({'unit_id': unit_id, 'unit': unit}, settings.unit_meta);
				if (typeof unit_meta_raw !== "object" ) {
					console.error("blocky: 'unit_meta' must evaluate to an object.");
				} else {
					unit_meta = unit_meta_raw;
				}
			}

			store[unit_id] = $.extend({}, unit_meta, {'tag': tag});
			var obj = (obj={}, obj[store_key]=store, obj);
			chrome.storage.local.set(obj, function() {
				$.chrome_last_error();
				$unit.removeClassRegex(/^blocky-tag-/);
				$unit.addClass($.format("blocky-tag-{0}", tag));
			});
		};
	};

	function init() {
		settings_key = $.format(settings_key_tpl, window.location.host);
		store_key = $.format(store_key_tpl, window.location.host);

		chrome.storage.local.get(settings_key, function(data) {
			$.chrome_last_error();
			settings = data[settings_key];

			var $container = $($.eval_ctx(document, settings.container_selector));

			if ($container.length!=1) {
				console.error("blocky: container_selector last expression must return a single jQuery object or a Dom element");
				return;
			}

			chrome.storage.local.get(store_key, function(data) {
				$.chrome_last_error();
				store = data[store_key] || {};

				// 	simulate a DOMSubtreeModified event
				container_dom_modified.call($container.get(0), new Event('DOMSubtreeModified'));
			});
		});
	}
	
	init();
	
}( window, document, jQuery ));
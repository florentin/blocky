;(function ( $ ) {
	
	$.fn.extend({
		removeClassRegex: function(regex) {
			return this.removeClass(function(index, classes) {
				return classes.split(/\s+/).filter(function(c) {
					return regex.test(c);
				}).join(' ');
			});
		},

		checkbox_extras: function() {
			var checkboxes = this.find('input[type="checkbox"]');
			checkboxes.each(function() {
				var v = $(this).attr('checked') == 'checked' ? 1:0;
				$(this).after('<input type="hidden" name="'+$(this).attr('rel')+'" value="'+v+'" />');
			});
			checkboxes.change(function(){
				var v = $(this).is(':checked') ? 1:0;
				$(this).next('input[type="hidden"]').val(v);
			});
		}
	});

	$.extend({
		format: function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		},

		eval_ctx: function(ctx, expr) {
			ctx = ctx || {};
			return function(expr) {
				return eval(expr);
			}.call(ctx, expr);
		},

		curry: function(fn, scope) {
			var scope = scope || window;
			var args = [];

			for (var i=2, len = arguments.length; i < len; ++i) {
				args.push(arguments[i]);
			};

			return function() {
				fn.apply(scope, args);
			};
		},

		throttle: function(fn, delay) {
			var timer = null;
			return function () {
				var context = this, args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
				}, delay);
			};
		},

		slugify: function(text) {
			return text.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of text
			.replace(/-+$/, '');            // Trim - from end of text
		},

		populate: function(frm, data) {
			// receives an object from serializeArray()
			$.each(data, function(name, value) {
				if(name.startsWith('is_')) {
					var checked = value == 1 ? true:false;
					$('[name='+name+']', frm).prop("checked", checked);
				} else {
					$('[name='+name+']', frm).val(value);
				}

			});
		},

		chrome_last_error: function() {
			if (chrome.runtime.lastError) {
				console.error("chrome.runtime.lastError: " + chrome.runtime.lastError);
			};
		},
		
		is_node: function(elem) { return (typeof elem.nodeType !== 'undefined') },
		is_jquery: function(elem) {return (elem instanceof $)}
	});
}( jQuery ));

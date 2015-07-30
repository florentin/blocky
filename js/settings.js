;var Settings = (function ( ) {
    return {
    	'settings-www.bestjobs.ro': {
    		container_selector: "$('div#content-results');",
    		unit_selector: "$(this.container).find('div.job-card').not('.blocky');",
    		unit_id_selector: "$(this.unit).find('a.job-link').first().attr('href');",
    		unit_meta: "obj={}; obj.href=this.unit_id; obj;",
    		is_active: "0"
    	},
    	'settings-www.amazon.co.uk': {
    		container_selector: "$('div#zg_centerListWrapper');",
    		unit_selector: "$(this.container).find('div.zg_itemWrapper').not('.blocky');",
    		unit_id_selector: "$(this.unit).find('div.zg_title a').first().attr('href');",
    		unit_meta: "obj={}; obj.href=this.unit_id; obj;",
    		is_active: "0"
    	}
    };
}( ));

// Using xpath:
//container_selector: "$.xpath(this, '//div[@id=\"content-results\"]');",
//block_selector: "$.xpath(this, './/div[contains(@class, \" job-card\")]');",
//id_selector: "$.xpath(this, './/a[@class=\"job-link\"]/@href')[0].textContent;",
(function($) {
    
    $.timeFormat = function( timestamp ) {
        var time = handleDate( timestamp );
        return time;
    };
    
    $.timeFormatMin = function( timestamp ) {
    	var date = new Date( parseInt( timestamp ) );
    	return date.getDate() + ' tháng ' + months[ date.getMonth() ];
    };
    
    $.timeFormatSolr = function ( timestr )	{
    	timestr = timestr.replace(/[TZ]/g, ' ').trim();
    	var dt = timestr.split(' ');
    	var d = dt[0].split('-');
    	var t = dt[1].split(':');
    	var timestamp = Date.UTC(d[0], d[1]-1, d[2], t[0], t[1], t[2], 0) - 7 * 3600 * 1000;
    	var time = handleDate( timestamp );
    	return time;
    };
    
    function handleDate( timestamp ) {
        var n=new Date(), t, ago = " ";
        if( timestamp ) {
        	t = Math.round( (n.getTime() - timestamp)/60000 );
        	ago += handleSinceDateEndings( t, timestamp );
        } else {
            ago += "";
        }
        return ago;
    }
    
    function handleSinceDateEndings( t, original_timestamp ) {
        var ago = " ", date;
        date = new Date( parseInt( original_timestamp ) );
        if( t <= 1 ) {
            ago += "Vài giây trước";
        } else if( t<60) {
            ago += t + " phút trước";
        } else if( t>= 60 && t<= 120) {
            ago += Math.floor( t / 60 ) + " giờ trước";
        } else if( t<1440 ) {
            ago += Math.floor( t / 60 )  + " giờ trước";
        } else if( t< 2880) {
            ago +=  "1 ngày trước lúc "+ date.getUTCHours()+'h:'+date.getUTCMinutes();
        } else if( t > 2880  && t < 4320 ) {
            ago +=  "2 ngày trước lúc "+ date.getUTCHours()+'h:'+date.getUTCMinutes();
        } else {
            ago += "ngày " + date.getDate() + "-" + months[ date.getMonth() ] + "-"+ (1900+date.getYear()) +" lúc "+ date.getUTCHours()+'h:'+date.getUTCMinutes();
        }
        return ago;
    }
    
    var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
})(jQuery);

/**
 * Get the ISO week date week number
 */
getWeek = function (date) {
	// Create a copy of this date object
	var target  = new Date(date.valueOf());

	// ISO week date weeks start on monday
	// so correct the day number
	var dayNr   = (date.getDay() + 6) % 7;

	// ISO 8601 states that week 1 is the week
	// with the first thursday of that year.
	// Set the target date to the thursday in the target week
	target.setDate(target.getDate() - dayNr + 3);

	// Store the millisecond value of the target date
	var firstThursday = target.valueOf();

	// Set the target to the first thursday of the year
	// First set the target to january first
	target.setMonth(0, 1);
	// Not a thursday? Correct the date to the next thursday
	if (target.getDay() != 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
	}

	// The weeknumber is the number of weeks between the 
	// first thursday of the year and the thursday in the target week
	return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
}
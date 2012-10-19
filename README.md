SoundCloud JS

==================================

Handles the SoundCloud music player
----------------------------------


Requirements
----------------------------------
* jQuery
* jQuery UI
* SoundManager 2

Instructions
----------------------------------

Simply enqueue soundcloud.js into your website's HTML <head> tag and call soundcloud.init() inside a jQuery document ready

Example Initialization
----------------------------------

    jQuery(function() {
        soundcloud.init({
        	path : '/path/to/soundcloud/folder/',
        	consumer_key : 'adcc1dfaf678b58c7171d2c539635c16',
        	preload : {
        		jquery : true,
        		jqueryUI : true
        	}
        });
    });



HTML DOM and CSS Controld
----------------------------------

##Basic Player Controls
.soundcloud-is-playing						This class is appended to the anchor that is currently playing the music
.soundcloud-play-set						This class handles the playing/pausing of a set player
* data-set-id
* data-dom-id
.soundcloud-play-track						This class handles the playing/pausing of a track in a set
* data-set-id
* data-track-id
* data-dom-id
.soundcloud-prev							This class handles the previous track button
.soundcloud-next							This class handles the next track button

##Progress Bars
.soundcloud-progres							The progress bar parent
.soundcloud-progress-position				The current progress bar position (srubber)
.soundcloud-progress-bar					The current progress bar fillter

##Duration Timers
.soundcloud-duration-elapsed				The currently elapsed time
.soundcloud-duration-remaining				The currently remaining time
SoundCloud JS

==================================

Handles the SoundCloud music player
----------------------------------


#Requirements
* jQuery
* SoundManager 2

#Instructions

Simple enqueue soundcloud.js into your website's HTML <head> tag and call soundcloud.init() inside a jQuery document ready

#Example Initialization

    jQuery(function() {
        soundcloud.init(site.opts.templateUrl+'/js/soundcloud', 'adcc1dfaf678b58c7171d2c539635c16');
    });


#CSS Binded Elements
* .soundcloud-is-playing						This class is appended to the anchor that is currently playing the music
* .soundcloud-play-set						This class handles the playing/pausing of a set player
* * data-set-id
* * data-dom-id
* .soundcloud-play-track						This class handles the playing/pausing of a track in a set
* * data-set-id
* * data-track-id
* * data-dom-id
* .soundcloud-prev							This class handles the previous track button
* .soundcloud-next							This class handles the next track button
* .soundcloud-progres						The progress bar parent
* .soundcloud-progress-position				The current progress bar position (srubber)
* .soundcloud-progress-bar					The current progress bar fillter
* .soundcloud-progress-duration				The progress bar duration parent
* .soundcloud-progress-duration-elapsed		The currently elapsed time
* .soundcloud-progress-duration-remaining	The currently remaining time
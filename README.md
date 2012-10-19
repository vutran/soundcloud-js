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

**.soundcloud-is-playing**

This class is appended to the anchor that is currently playing the music.

**.soundcloud-play-set**

Plays a SoundCloud set.

####Required Attributes
* data-set-id
* data-dom-id

**.soundcloud-play-track**

Toggles play/pause of the current active set.

####Required Attributes
* data-set-id
* data-track-id
* data-dom-id

**.soundcloud-prev**

Progress the previous track on the active set.

**.soundcloud-next**

Progress to the next track on the active set.

##Playlists

**.soundcloud-playlists**

Gets auto-populated with tracks when a set is loaded.

##Progress Bars

**.soundcloud-progress**

The progress bar parent container which contains the filler and scrubber.

**.soundcloud-progress-position**

The scrubber's position.

#####Requirements
* Must be a child of **.soundcloud-progress**

**.soundcloud-progress-bar**

The progress bar filler.

#####Requirements
* Must be a child of **.soundcloud-progress**

##Duration Timers

**.soundcloud-duration-elapsed**

Displays the elapsed time of the currently playing track.

**.soundcloud-duration-remaining**

Displays the remaining time of the currently playing track.
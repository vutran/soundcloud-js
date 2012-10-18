/**
 * Handles the SoundCloud music player
 *
 * #Requirements
 * * jQuery
 * * SoundManager 2
 *
 * #Instructions
 *
 * Simple enqueue soundcloud.js into your website's HTML <head> tag and call soundcloud.init() inside a jQuery document ready
 *
 * #Example Initialization
 *
 * <code>
 * jQuery(function() {
 *  soundcloud.init(site.opts.templateUrl+'/js/soundcloud', 'adcc1dfaf678b58c7171d2c539635c16');
 * });
 * </code>
 *
 * #CSS Binded Elements
 * * .soundcloud-is-playing						This class is appended to the anchor that is currently playing the music
 * * .soundcloud-play-set						This class handles the playing/pausing of a set player
 * * * data-set-id
 * * * data-dom-id
 * * .soundcloud-play-track						This class handles the playing/pausing of a track in a set
 * * * data-set-id
 * * * data-track-id
 * * * data-dom-id
 * * .soundcloud-prev							This class handles the previous track button
 * * .soundcloud-next							This class handles the next track button
 * * .soundcloud-progres						The progress bar parent
 * * .soundcloud-progress-position				The current progress bar position (srubber)
 * * .soundcloud-progress-bar					The current progress bar fillter
 * * .soundcloud-progress-duration				The progress bar duration parent
 * * .soundcloud-progress-duration-elapsed		The currently elapsed time
 * * .soundcloud-progress-duration-remaining	The currently remaining time
 *
 */
var soundcloud = {
	/**
	 * The path to the JS folder
	 *
	 * @param string path
	 */
	path : false,
	/**
	 * Internal API properties
	 */
	api : {
		/**
		 * The API consumer key or client ID
		 *
		 * @param string consumer_key
		 * @link https://soundcloud.com/login?return_to=%2Fyou%2Fapps
		 */
		consumer_key : false,
		/**
		 * The API endpoint
		 *
		 * @param string endpoint
		 */
		endpoint : 'http://api.soundcloud.com',
		/**
		 * The API resources endpoints
		 *
		 * @link http://developers.soundcloud.com/docs/api/reference
		 * @param object resources
		 */
		resources : {
			tracks : '/tracks',
			sets : '/playlists'
		},
		/**
		 * Retrieves the API URI for the given resource
		 *
		 * @param string type			A resource type (key specified in soundcloud.api.resources)
		 * @param int id				An object ID
		 */
		getURI : function(type, id) {
			return soundcloud.api.endpoint + soundcloud.api.resources[type] + '/' + id;
		}
	},
	/**
	 * Conditionals, these should return only true or false
	 *
	 * @param object conditionals
	 */
	conditionals : {
		/**
		 * The playing status of the music player
		 *
		 * @param bool
		 */
		is_playing : false
	},
	/**
	 * Currently active objects and elements
	 *
	 * #Keys
	 * * object|bool		track
	 * * object|bool		set
	 *
	 * @param object current
	 */
	current : {
		anchor : false,
		set : false,		// The current SoundCloud set object
		track : false,		// The current SoundCloud track object
		sound : false,		// The current SMSound object
		index : 0,			// The current index of of soundcloud.current.sound in soundcloud.smObjects
	},
	eq : {
		left : 0,			// left wave form data
		right : 0,			// right wave form data
		average : 0,		// the current average wave length
		scale : 255			// max number of the equalizer
	},
	smObjects : [],			// An array containing SMSound objects
	/**
	 * Contains callbacks for SMSound objects
	 */
	callbacks : {
		/**
		 * An array of functions that gets called for SMSounds
		 */
		whileplaying : []
	},
	/**
	 * Initializes the music player
	 *
	 * @param string path			The path of the package folder
	 * @param string consumer_key	The API key
	 */
	init : function(path, consumer_key) {

		soundcloud.path = path;
		soundcloud.api.consumer_key = consumer_key;

		soundcloud.sm2.init();

		// Register SoundCloud events
		soundcloud.registerEvents();
	},
	/**
	 * SoundManager2 Handlers
	 */
	sm2 : {
		intervals : {
			loader :false
		},
		/**
		 * Loads SoundManager 2 asynchronously and sets up the object
		 *
		 * @return void
		 */
		init : function() {
			(function() {
			    var s = document.createElement('script');
			    s.type = 'text/javascript';
			    s.async = true;
			    s.src = soundcloud.path + '/soundmanager/script/soundmanager2-nodebug-jsmin.js';
			    var x = document.getElementsByTagName('script')[0];
			    x.parentNode.insertBefore(s, x);
			    s.onload = function() {
					soundcloud.sm2.intervals.loader = setInterval(function() {
						if(typeof soundManager == 'object') {
							soundcloud.sm2.setup();
							clearInterval(soundcloud.sm2.intervals.loader);
						}
					}, 500);
			    };
		    })();
		},
		setup : function() {
	    	soundManager.setup({
	    		url : soundcloud.path + '/soundmanager/swf/soundmanager2_flash9.swf',
	    		flashVersion : 9,
	    		flash9Options : {
	    			useWaveFormData : true
	    		},
	    		useHTML5Audio : false,
	    		preferFlash : true,
	    		debugMode : false,
	    		debugFlash : false
	    	});
		}
	},
	reinitialize : function() {
		if(soundcloud.isPlaying()) {
			var setID = soundcloud.current.anchor.data('set-id');
			var domID = soundcloud.current.anchor.data('dom-id');
			// Retrieve the parent
			var theParent = jQuery('.' + domID);
			if(theParent.length) {
				// Retrieve the anchor
				var theAnchor = jQuery('.soundcloud-play-set[data-set-id=' + setID + '][data-dom-id=' + domID + ']');
				// Make is playing
				theAnchor.addClass('soundcloud-is-playing');
				// Update the current anchor to the found one
				soundcloud.current.anchor = theAnchor;
				// Updat track listings
				soundcloud.updateTrackListings();
			}
		}
		// Initialize srubber
		soundcloud.scrubber.init();
	},
	/**
	 * Register events
	 *
	 * @return void
	 */	
	registerEvents : function() {
		jQuery('.soundcloud-play-set').live('click', soundcloud.events.onClickPlaySet);
		jQuery('.soundcloud-play-track').live('click', soundcloud.events.onClickPlayTrack);
		jQuery('.soundcloud-prev').live('click', soundcloud.events.onClickPrevious);
		jQuery('.soundcloud-next').live('click', soundcloud.events.onClickNext);
	},
	/**
	 * Handles soundcloud-related events
	 */
	events : {
		/**
		 * Onclick callback when a set play button is clicked
		 *
		 * #Data Attributes
		 * * int		set-id			The SoundCloud set ID
		 * * string		dom-id			The DOM element ID
		 *
		 * @param Event e
		 * @return void
		 */
		onClickPlaySet : function(e) {
			e.preventDefault();
			var theAnchor = jQuery(this);
			var setID = theAnchor.data('set-id');
			var domID = theAnchor.data('dom-id');
			// If the player is currently playing something
			if(soundcloud.isPlaying()) {
				// If the current set ID is the anchor's set ID and the DOM ID matches, pause it!
				if(soundcloud.getCurrentSetId() == setID && soundcloud.getCurrentDomId() == domID) { soundcloud.pause(); }
				// If the anchor clicked is a new anchor, load the new set and play it!
				else {
					// Set the current anchor
					soundcloud.current.anchor = theAnchor;
					// Plays the set
					soundcloud.play('set', setID);
				}
			}
			// If the player is not currently playing something, load and play the new set/track
			else {
				// If the current set ID is the same is the anchor's set ID, resume the player
				if(soundcloud.getCurrentSetId() == setID) { soundcloud.resume(); }
				// If the current set ID and the anchor's set ID is different, load the new set and play it!
				else {
					// Set the current anchor
					soundcloud.current.anchor = theAnchor;
					// Plays the set
					soundcloud.play('set', setID);
				}
			}
		},
		onClickPlaySetLoaded : function(e) {
			// Stops all current sound
			soundcloud.stopAll();
			// Set the current sound
			soundcloud.current.sound = soundcloud.smObjects[0];
			// Set the current track
			soundcloud.current.track = soundcloud.current.sound.track;
			// Set the current anchor
			soundcloud.current.anchor.addClass('soundcloud-is-playing');
			// Play the first song in the loaded set
			soundcloud.current.sound.play();
			// Update track listings
			soundcloud.updateTrackListings();
		},
		/**
		 * Onclick callback when a track play button is clicked
		 *
		 * #Data Attributes
		 * * int		track-id			The SoundCloud track ID
		 * * string		dom-id				The DOM element ID
		 *
		 * @param Event e
		 * @return void
		 */
		onClickPlayTrack : function(e) {
			e.preventDefault();
			var theAnchor = jQuery(this);
			var setID = theAnchor.data('set-id');
			var trackID = theAnchor.data('track-id');
			var domID = theAnchor.data('dom-id');
			
			// If the set matches and DOM matches
			if(soundcloud.getCurrentSetId() == setID && soundcloud.getCurrentDomId() == domID) {
				var index = -1;
				jQuery.each(soundcloud.current.set.tracks, function(idx, el) {
					if(el.id == trackID) {
						index = idx;
						return false; // breaks out of the loop
					}
				});
				if(index > -1) { soundcloud.playIndex(index); }
			}
			// If it doesn't match, load the new set and find and play!
			else {
				soundcloud.loadSet(setID, function() {
					// Set the anchor if available
					var theAnchor = jQuery('.soundcloud-play-set[data-set-id=' + setID + '][data-dom-id=' + domID + ']');
					soundcloud.current.anchor = theAnchor;
					
					var index = -1;
					jQuery.each(soundcloud.current.set.tracks, function(idx, el) {
						if(el.id == trackID) {
							index = idx;
							return false; // breaks out of the loop
						}
					});
					if(index > -1) { soundcloud.playIndex(index); }
				});
			}
		},
		/**
		 * Onclick callback when a previous button is clicked
		 *
		 * @param Event e
		 * @return void
		 */
		onClickPrevious : function(e) {
			e.preventDefault();
			soundcloud.previous();
		},
		/**
		 * Onclick callback when a next button is clicked
		 *
		 * @param Event e
		 * @return void
		 */
		onClickNext : function(e) {
			e.preventDefault();
			soundcloud.next();
		},
		/**
		 * Onload callback when a set has been loaded via AJAX
		 *
		 * @param object data			The SoundCloud set object
		 * @param function callback		The callback function when the set has finished loading
		 * @return void
		 */
		onLoadSetData : function(data, callback) {
			// Set the current set
			soundcloud.current.set = data;
			// Loop through each track and load the tracks
			jQuery.each(soundcloud.current.set.tracks, function(idx, track) {
				soundcloud.load(track);
				// Call onload complete callback
				if(idx==(soundcloud.current.set.tracks.length-1)) {
					if(callback) { callback.call(this, data); }
				}
			});
		},
	},
	/** 
	 * Checks to see if the music player is currently playing or not
	 *
	 * @return bool
	 */
	isPlaying : function() {
		return soundcloud.conditionals.is_playing;
	},
	/**
	 * Retrieves the current set ID
	 *
	 * @return int
	 */
	getCurrentSetId : function() {
		return soundcloud.current.set.id;
	},
	/**
	 * Retrieves the current track ID
	 *
	 * @return int
	 */
	getCurrentTrackId : function() {
		return soundcloud.current.track.id;
	},
	/**
	 * Retrieves the current anchor's dom ID
	 *
	 * @return object
	 */
	getCurrentDomId : function() {
		return soundcloud.current.anchor.data('dom-id');
	},
	/**
	 * Loads and plays a track or set
	 *
	 * @param	string			type			"set", or "track"
	 * @param	int				id				The SoundCloud track or set ID
	 * @return	void
	 */
	play : function(type, id) {
		switch(type) {
			case 'track':
				break;
			case 'set':
				soundcloud.loadSet(id, soundcloud.events.onClickPlaySetLoaded);
				break;
		}
	},
	/**
	 * Plays the sound specified by the index
	 *
	 * @param	int				index			The index of the sound in soundcloud.smObjects
	 * @return void
	 */
	playIndex : function(index) {
		// Stop all sounds
		soundcloud.stopAll();
		// Set the index
		soundcloud.current.index = index;
		// Set the current anchor
		soundcloud.current.anchor.addClass('soundcloud-is-playing');
		// Set the sound
		soundcloud.current.sound = soundcloud.smObjects[soundcloud.current.index];
		// Set the track
		soundcloud.current.track = soundcloud.current.sound.track;
		// Play the next sound
		soundcloud.current.sound.play();
		// Update track listings
		soundcloud.updateTrackListings();
	},
	/**
	 * Clears the current queue in the player
	 *
	 * @return void
	 */
	clearQueue : function() {
		// Resets the array
		soundcloud.smObjects = new Array();
	},
	/**
	 * Finds all track listings in the set's DOM ID and make it active/inactive
	 *
	 * @return void
	 */
	updateTrackListings : function() {
		if(soundcloud.isPlaying()) {
			var setID = soundcloud.current.anchor.data('set-id');
			var domID = soundcloud.current.anchor.data('dom-id');

			// Retrieve the parent
			var theParent = jQuery('.' + domID);

			// Select active tracks (within the parent)
			var activeTracks = jQuery('.soundcloud-play-track[data-track-id=' + soundcloud.getCurrentTrackId() + ']', theParent);
			// Select inactive tracks (globally)
			var inactiveTracks = jQuery('.soundcloud-play-track:not(.soundcloud-play-track[data-track-id=' + soundcloud.getCurrentTrackId() + '])');

			// Add is playing to active tracks
			activeTracks.addClass('soundcloud-is-playing');
			inactiveTracks.removeClass('soundcloud-is-playing');
		}
		else {
			var allTracks = jQuery('.soundcloud-play-track');
			allTracks.removeClass('soundcloud-is-playing');
		}
	},
	/**
	 * Updates the progress bar
	 *
	 * @return void
	 */
	updateProgressBar : function() {
		var theParent = jQuery('.' + soundcloud.getCurrentDomId());
		var progressParent = jQuery('.soundcloud-progress', theParent);
		var fullWidth = progressParent.outerWidth();
		var percentage = soundcloud.current.sound.position / soundcloud.current.sound.durationEstimate;
		var leftPos = Math.ceil(fullWidth * percentage);
		// Cap the left position at full width
		if(leftPos > fullWidth) { leftPos = fullWidth; }

		// Update position (if not scrubbing)
		if(!soundcloud.scrubber.isScrubbing) {
			var progressPosition = jQuery('.soundcloud-progress-position', progressParent);
			progressPosition.css('left', leftPos);
		}

		// Update bar
		var progressBar = jQuery('.soundcloud-progress-bar', progressParent);
		progressBar.css('width', leftPos);
		
		// Update timer
		var elapsed = soundcloud.parseDuration(soundcloud.current.sound.position);
		var remaining = soundcloud.parseDuration(soundcloud.current.sound.durationEstimate - soundcloud.current.sound.position);
		var progressElapsed = jQuery('.soundcloud-progress-duration-elapsed', progressParent);
		var progressRemaining = jQuery('.soundcloud-progress-duration-remaining', progressParent);
		progressElapsed.html(elapsed);
		progressRemaining.html(remaining);
		
		// Update title
		var title = jQuery('.soundcloud-title', theParent);
		title.html(soundcloud.current.track.title);
	},
	/**
	 * Updates the equalizer wave data
	 *
	 * @return void
	 */
	updateEqualizer : function() {
		soundcloud.eq.left = Math.abs(soundcloud.current.sound.waveformData.left[0] * soundcloud.eq.scale);
		soundcloud.eq.right = Math.abs(soundcloud.current.sound.waveformData.right[0] * soundcloud.eq.scale);
		soundcloud.eq.average = (soundcloud.eq.left + soundcloud.eq.right) / 2;
	},
	/**
	 * Converts a seconds string into the format of XX:XX
	 *
	 * @param int duration		Seconds
	 * @return void
	 */
	parseDuration : function(duration) {
		var sec = duration/1000;
		t = soundcloud.padDigit(Math.floor(sec / 60), 2) + ':' + soundcloud.padDigit(Math.ceil(sec % 60), 2);
		return t;
	},
	/**
	 * Adds zero-padding to a number in the front
	 *
	 * @return void
	 */
	padDigit : function(number, length) {
		var str = '' + number;
		while(str.length < length) { str = '0' + str; }
		return str;
	},
	/**
	 * Creates and load the set URL into the music player
	 *
	 * @param	string			set_id			The set ID
	 * @param	function		callback		The callback function when the music player starts playing
	 * @return void
	 */
	loadSet : function(set_id, callback) {
		// Clear the current queue
		soundcloud.clearQueue();
		var endpoint = soundcloud.api.getURI('sets', set_id);
		var data = {
			client_id : soundcloud.api.consumer_key
		};
		jQuery.getJSON(endpoint, data, function(response) {
			soundcloud.events.onLoadSetData.call(this, response, callback);
		});
	},
	/**
	 * Creates and load the track URL into the music player
	 *
	 * @param	object			track		The SoundCloud track
	 * @return void
	 */
	load : function(track) {
		var endpoint = soundcloud.api.getURI('tracks', track.id);
		var stream_url = endpoint + '/stream' + '?client_id=' + soundcloud.api.consumer_key;
		// Create the SMSound
		var sound = soundManager.createSound({
			id : track.id,
			url : stream_url,
			whileplaying : function() {
				var sound = this;
				soundcloud.updateProgressBar();
				soundcloud.updateEqualizer();
				// Call each callback
				jQuery.each(soundcloud.callbacks.whileplaying, function(idx, callback) {
					if(typeof callback == 'function') { callback.call(sound); }
				});
			},
			onplay : function() {
				// Sets the current track
				soundcloud.conditionals.is_playing = true;
			},
			onresume : function() {
				soundcloud.conditionals.is_playing = true;
			},
			onstop : function() {
				soundcloud.conditionals.is_playing = false;
			},
			onpause : function() {
				soundcloud.conditionals.is_playing = false;
			},
			onfinish : function() {
				soundcloud.conditionals.is_playing = false;
			}
		});

		// Extend the SMSound object
		sound.track = track;

		// Append to global smObjects array
		soundcloud.smObjects.push(sound);
	},
	/**
	 * Pauses the player
	 *
	 * @return void
	 */
	pause : function() {
		// Pauses the current sound
		soundcloud.current.sound.pause();
		// Pauses the anchor
		soundcloud.current.anchor.removeClass('soundcloud-is-playing');
		// Update track listings
		soundcloud.updateTrackListings();
	},
	/**
	 * Resumes the player
	 *
	 * @return void
	 */
	resume : function() {
		// Resumes the current sound
		soundcloud.current.sound.resume();
		// Resumes the anchor
		soundcloud.current.anchor.addClass('soundcloud-is-playing');
		// Update track listings
		soundcloud.updateTrackListings();
	},
	/**
	 * Plays the previous song (if available)
	 */
	previous : function() {
		var previous = (soundcloud.current.index - 1);
		// If the next track exists
		if(typeof soundcloud.smObjects[previous] != 'undefined') { soundcloud.playIndex(previous); }
	},
	/**
	 * Plays the next song (if available)
	 *
	 * @return void
	 */
	next : function() {
		var next = (soundcloud.current.index + 1);
		// If the next track exists
		if(typeof soundcloud.smObjects[next] != 'undefined') { soundcloud.playIndex(next); }
	},
	/**
	 * Stops all music and clears anchors
	 *
	 * @return void
	 */
	stopAll : function() {
		// Removes all classes
		jQuery('.soundcloud-is-playing').removeClass('soundcloud-is-playing');
		// Stops SM2
		soundManager.stopAll();
	},
	/** 
	 * Seeks to a place in the sound
	 *
	 * @param float percentage
	 * @return void
	 */
	seekTo : function(percentage) {
		if(soundcloud.current.sound) {
			var position = percentage * soundcloud.current.sound.durationEstimate;
			soundcloud.current.sound.setPosition(position);
		}
	},
	scrubber : {
		/**
		 * Is the user currently scrubbing?
		 *
		 * @bool isScrubbing
		 */
		isScrubbing : false,
		/**
		 * Initializes the scrubber
		 * @return void
		 */
		init : function() {
			jQuery('.soundcloud-progress-position').draggable({
				axis : 'x',
				containment : jQuery('.soundcloud-progress'),
				start : function(e,ui) {
					soundcloud.scrubber.isScrubbing = true;
				},
				stop : function(e,ui) {
					// If currently playing
					if(soundcloud.current.sound) {
						var scrubberWidth = jQuery(this).width() / 2;
						var full = jQuery('.soundcloud-progress').width() - scrubberWidth;
						var percentage = (ui.position.left / full);
						soundcloud.seekTo(percentage);
						soundcloud.scrubber.isScrubbing = false;
					}
				}
			});
		}
	},
	/**
	 * Add an SMSound callback
	 *
	 * #Types
	 * * whileplaying
	 *
	 * @param string type
	 * @param function callback
	 * @return void
	 */
	addCallback : function(type, callback) {
		switch(type) {
			case 'whileplaying':
				// Add only if callback is a function
				if(typeof callback == 'function') { soundcloud.callbacks.whileplaying.push(callback); }
				break;
		}
	}

};
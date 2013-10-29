# SoundCloud JS

Create a custom SoundCloud music player

## Requirements
* jQuery
* jQuery UI
* SoundManager 2

## Instructions

Simply enqueue `soundcloud.js` into your website's HTML `<head>` tag and call `soundcloud.init()` inside a jQuery document ready callback.

## Example Initialization

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

# HTML DOM and CSS Controls

## Basic Player Controls

### `.soundcloud-is-playing`

This class is appended to the anchor that is currently playing the music.

### `.soundcloud-play-set`

Plays a SoundCloud set.

#### Data Attributes
| Name | Type | Description | Required? |
| :-- | :-- | :-- | :-- |
| data-set-id | integer | The SoundCloud set ID | Yes |
| data-do-id | string | The ID of the DOM element | Yes |

### `.soundcloud-play-track`

Toggles play/pause of the current active set.

#### Data Attributes
| Name | Type | Description | Required? |
| :-- | :-- | :-- | :-- |
| data-set-id | integer | The SoundCloud set ID | Yes |
| data-track-id | integer | The SoundCloud track ID | Yes |
| data-do-id | string | The ID of the DOM element | Yes |

`.soundcloud-prev`

Progress the previous track on the active set.

`.soundcloud-next`

Progress to the next track on the active set.

## Playlists

### `.soundcloud-playlists`

Gets auto-populated with tracks when a set is loaded.

## Progress Bars

### `.soundcloud-progress`

The progress bar parent container which contains the filler and scrubber.

### `.soundcloud-progress-position`

The scrubber's position.

**Note:** This must be a child element of `.soundcloud-progress`

### `.soundcloud-progress-bar`

The progress bar filler.

**Note:** This must be a child element of `.soundcloud-progress`

## Duration Timers

### `.soundcloud-duration-elapsed`

Displays the elapsed time of the currently playing track.

### `.soundcloud-duration-remaining`

Displays the remaining time of the currently playing track.

# Changelog

## 0.2.0

* In development

## 0.1.0
* Initial version
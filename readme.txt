=== gMapTip ===
Contributors: Sirlon
Tags: google maps, map, google, maps, tooltip
Donate Link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7198162
Requires at least: 2.8
Tested up to: 2.8.4
Stable tag: 1.3.5

Add Google Maps Tooltips to your Posts & Pages.

== Description ==

gMapTip is a Google Maps Plug-in. With gMapTip you can easily add Tooltips to your post to let everyone know where he/she can find shops, restaurants, etz. in his/her environment or just show everyone where something in this world is located.
For more information visit: http://www.gnomx.at/gmaptip

== Installation ==

1. Upload all the files in `/wp-content/plugins/gmaptip/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Start writing posts with a much easier way to post Google Maps.
 
== Frequently Asked Questions ==

= How to use ? =
Select a word and click the button or click "Quick Local Search" in the menu. This Option will automatically add a local search Tooltip to the Word. (e.g.. "Starbucks" - will search all Starbucks Shops in the viewers city.)
You can also Customize Local Search by clicking "Custom Local Search" where you can show everyone where to find a Starbucks somewhere else around the world.

If you didn't use the Rich Text editor or any other Editor you can add a Map Tip by this Tag:
`[gmt MAPLINKTYPE:MAPOPTIONS: ] Link Text [/gmt]«

MAPLINKTYPE - For Local Searche you use 'ls', for any other 'ma'.

MAPOPTIONS - For a Map showing the Viewers Location use 'auto' e.g.: `ls:auto:« or with a Search value different to the Linktext e.g.: 'ls:auto//Searchtext:'.
	- Otherwise it looks like this: 'ma:Latitude//Longitude//Zoom//MapType:' e.g.: `ls:53.4338464//-37.4566//12//hybride«.

There is another Option to add a Tooltip which shows a specific Point you chose.

== Screenshots ==

1. Local search for "Starbucks".
2. The Button.

== Changelog ==
= 1.3.5 =
* Changed Editor functions, it looks now like a Link and you can now edit already inserted Links.
* Changed Tooltip Anchoring to fix some issues with some Themes.

= 1.3.3 =
* Fixed a Problem with Safari and Google Gears installed, where the auto Mode didn't worked.

= 1.3.1 =
* Fixed IE Issue, should now work with Internet Explorer to (damn ",").

= 1.3 =
* Added styling Options, you can add some own style to the Tip.
* Have done a nasty fix for the problem that the local search markers didn't show up when hover a second time over the link.

= 1.2 =
* Completely rewritten it with Google Maps API v3 it should now run on nearly all browsers.
* Because it's v3, you didn't need a api key any longer.

= 1.1 =
* Fixed Tooltip position
* 2 minor bug fixes

= 1.0 =
* Initial Release.
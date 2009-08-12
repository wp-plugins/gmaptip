<?php
/*
Plugin Name: gMapTip
Plugin URI: http://www.gnomx.at/gmaptip
Description: You can select a word and search google map POIs and add a tooltip to your text showing the map. 
Version: 1.0
Author: Sirlon
Author URI: http://www.gnomx.at

*/

/*  
	Copyright
	----------
	
	gMapTip©2009 by Gnomx.at.
	
    This file is part of gMapTip.

    gMapTip is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    gMapTip is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with gMapTip.  If not, see <http://www.gnu.org/licenses/>.
*/

define( 'GMT_VERSION', '1.0' );

if ( ! defined( 'GMT_PLUGIN_DIR' ) )
	define( 'GMT_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . plugin_basename( dirname( __FILE__ ) ) );

if ( ! defined( 'GMT_PLUGIN_URL' ) )
	define( 'GMT_PLUGIN_URL', WP_PLUGIN_URL . '/' . plugin_basename( dirname( __FILE__ ) ) );



function gmt_addLink($o,$q)
{
	$s = "<a href=\"JavaScript:void(null);\" class=\"gmt_link\" >";
		if(!is_feed()) $s = $s."<span style=\"display:none\">".$o."</span>";
	$s = $s."".$q."</a>";
	
	return 	$s;
}

function gmt_content($content)
{
	//$replace="%\[gmt.*(?:/([^'/]*)/)?\s*(?:/([^'/]*)/)?\s*\](.*)\[/gmt\]%isU";
	$replace="%\[gmt\s*(.*)\s*\](.*)\[/gmt\]%isU";
	
	$content = preg_replace($replace, gmt_addLink('\\1','\\2'), $content);
	
	return $content;
}

function gmt_addJS()
{ 
	$home = get_settings('siteurl');
	$key = get_option('gmt_key');
	
	if(!empty($key)) $key = "?key=".$key;
	
	wp_enqueue_script('googleapi','http://www.google.com/jsapi'.$key);
	wp_enqueue_script('googlegears',GMT_PLUGIN_URL.'/gears_init.js');
	wp_enqueue_script('jquery');
	wp_enqueue_script('gmaptip',GMT_PLUGIN_URL.'/gmaptip.js',array('jquery'));

}

function gmt_addstyle()
{
	echo"<!-- gMapTip Style -->
	<style type=\"text/css\">
	a.gmt_link {
	border-bottom: dashed 1px #09F;
	text-decoration:none;
	}

	a.gmt_link:hover {
		text-decoration:none;
	}

	.gmt_tip {
		display:none;
		background:#FFF;
		border:solid 1px #CCC;
		position:absolute;
		margin-top:-268px;
		margin-left:5px;
	}

	#gmt_map {
	width:325px;
	height:250px;
	}
	</style>";
}

//Create Options

function gmt_addoptions()
{
	add_options_page("gMapTip", "gMapTip", 8, __FILE__, "gmt_options_page");
}

function gmt_options_page()
{
	$gkey = get_option('gmt_key');
	if( $_POST[ 'gmt_hidden_field' ] == 'Y' ) {
		$key = $_POST[ 'gmt_map_key' ];
		
		if(!empty($key))
		{
			if(!isset($gkey))
				add_option('gmt_key', $key);
			else 
				update_option('gmt_key', $key);
			
			?>
				<div class="updated"><p><strong><?php _e('Key Updated.', 'gmt' ); ?></strong></p></div>
			<?php
		}
	
}
	?>
    <div class="wrap">
    <h2>gMapTip Options</h2>
    <p>
    	 <form style="margin-top:5px;" name="form1" method="post" action="<?php $_SERVER['PHP_SELF'];?>" >
         <input type="hidden" name="gmt_hidden_field" id="gmt_hidden_field" value="Y" />
         <label> Google Maps API Key:
         <input type="text" name="gmt_map_key" id="gmt_map_key" style="width:300px" value="<?php if(!empty($gkey)) echo $gkey; ?>" /></label>
         <p class="submit">
         <input type="submit" name="Submit" value="<?php _e('Save Changes', 'gmt' ); ?>" />
         </p>
         </form>
         <p>The Plugin works without a key but its's better to have one for Google Support. You can get A Key <a href="http://code.google.com/intl/en/apis/maps/signup.html" title="Get a Google Maps API Key" >here</a>.</p>
         <p><small>For more Information about this Plug-in visit my <a href="www.gnomx.at/gmaptip" title="gMapTip Site">Site</a>.</small></p>
    </p>
    </div>
    <?php
}

// Register Editor Button
function gmt_addbutton()
{
	if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;
 
   if ( get_user_option('rich_editing') == 'true') {
    	add_filter("mce_external_plugins", "add_gmt_tinymce_plugin");
     	add_filter("mce_buttons", "register_gmt_button");
   }	
}

function register_gmt_button($buttons) 
{
   array_push($buttons, "separator", "gmaptip");
   return $buttons;
}

function add_gmt_tinymce_plugin($plugin_array) {
   $plugin_array['gmaptip'] = GMT_PLUGIN_URL."/editor_plugin.js";
   return $plugin_array;
}

// Register With WP

add_action('init','gmt_addJS');
add_action('wp_head','gmt_addstyle');
add_action('admin_menu',"gmt_addoptions");
add_action('init', 'gmt_addbutton');

add_filter('the_content','gmt_content');

?>
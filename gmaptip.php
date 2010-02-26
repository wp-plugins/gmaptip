<?php
/*
Plugin Name: gMapTip
Plugin URI: http://www.gnomx.at/gmaptip
Description: You can select a word and search google map POIs and add a tooltip to your text showing the map. 
Version: 1.5
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

define( 'GMT_VERSION', '1.5' );

if ( ! defined( 'GMT_PLUGIN_DIR' ) )
	define( 'GMT_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . plugin_basename( dirname( __FILE__ ) ) );

if ( ! defined( 'GMT_PLUGIN_URL' ) )
	define( 'GMT_PLUGIN_URL', WP_PLUGIN_URL . '/' . plugin_basename( dirname( __FILE__ ) ) );
	

$sdefault = array(
				  'link-color' => '#09F',
				  'link-border' => 'dashed 1px #09F',
				  'link-hover-color' => '',
				  'link-hover-border' => '',
				  'tooltip-width' => '325px',
				  'tooltip-height' => '250px',
				  'tooltip-bgcolor' => '#FFF',
				  'tooltip-border' => 'solid 1px #CCC'
				  );



function gmt_addLink($o,$q)
{
	$s = "<a href=\"JavaScript:void(null);\" class=\"gmt_link\" >";
		if(!is_feed()) $s = $s."<span style=\"display:none\">".$o."</span>";
	$s = $s."".$q."</a>";
	
	return 	$s;
}

function gmt_content($content)
{
	
	$replace="%\[gmt\s*(.*)\s*\](.*)\[/gmt\]%isU";
	
	$content = preg_replace($replace, gmt_addLink('\\1','\\2'), $content);
	
	return $content;
}


function gmt_addJS()
{ 
	$home = get_settings('siteurl');
	
	wp_enqueue_script('googlmaps3','http://maps.google.com/maps/api/js?sensor=false');
	wp_enqueue_script('googlls','http://www.google.com/uds/api?file=uds.js&amp;v=1.0&amp;');
	wp_enqueue_script('googlegears','http://code.google.com/apis/gears/gears_init.js');
	wp_enqueue_script('jquery');
	wp_enqueue_script('gmaptip',GMT_PLUGIN_URL.'/gmaptip.js',array('jquery'));

}

function gmt_admin_head(){
	
	wp_enqueue_style('gmt_colorpickercss',GMT_PLUGIN_URL.'/cp/cp.css',false, false, 'all');
	wp_enqueue_script('gmt_colorpickerjs',GMT_PLUGIN_URL.'/cp/cp.js', array('jquery'), false);
	wp_enqueue_script('gmt_adminjs',GMT_PLUGIN_URL.'/gmaptip_admin.js', array('jquery','gmt_colorpickerjs'), false);
}

function gmt_addstyle()
{	
	global $sdefault;
	
	$style = get_option('gmt_tipstyle');
	
	if(empty($style)){
		add_option('gmt_tipstyle', $sdefault);
		$style = $sdefault;
	}
	
	$stylesheet = "<!-- gMapTip Style -->\n
	<style type=\"text/css\">
	a.gmt_link {\n";
	if(!empty($style['link-color']))
	$stylesheet .= "color: ".$style['link-color'].";\n";
	if(!empty($style['link-border']))
	$stylesheet .= "border-bottom: ".$style['link-border'].";\n";
	$stylesheet .= "text-decoration:none;\n
	}

	a.gmt_link:hover {\n";
	if(!empty($style['link-hover-color']))
	$stylesheet .= "color: ".$style['link-hover-color'].";\n";
	if(!empty($style['link-hoverlborder']))
	$stylesheet .= "border-bottom: ".$style['link-hover-border'].";\n";
	$stylesheet .="	text-decoration:none;\n
	}
	
	#gmt_tip {\n";
	$stylesheet .= "height: ".$style['tooltip-height'].";\n";
	$stylesheet .= "width: ".$style['tooltip-width'].";\n";
	if(!empty($style['tooltip-bgcolor']))
	$stylesheet .= "background-color: ".$style['tooltip-bgcolor'].";\n";
	if(!empty($style['tooltip-border']))
	$stylesheet .= "border: ".$style['tooltip-border'].";\n";
	$stylesheet .= "position:absolute; \n
	display:none;\n
	font-size: 10px;\n
	color:black;\n
	}\n
	
	.gmt_Info {
		position:absolute; \n
		background-color:white; \n
		border: 1px solid #111; \n
		padding: 5px; \n
		margin: 30px auto 0 auto;
		-moz-border-radius: 6px; 
		-webkit-border-radius: 6px; \n
		z-index:5; \n
		opacity: 0.9;
	}
	
	#gmt_map a {
		color:black;\n
		font-weight:bold;\n
		font-size: 12px;\n
	}\n
	</style>\n
	<!-- End gMapTip Style -->";
	
	echo $stylesheet;
}

//Create Options

function gmt_addoptions()
{
	add_options_page("gMapTip", "gMapTip", 8, __FILE__, "gmt_options_page");
}

function gmt_options_page()
{
	global $sdefault;
	
	$style = get_option('gmt_tipstyle');
	
	if(empty($style)){
		add_option('gmt_tipstyle', $sdefault);
		$style = $sdefault;
	}
	
	$f_link_border = explode(' ', $style['link-border']);
	$f_hover_border = explode(' ', $style['link-hover-border']);
	$f_tooltip_border = explode(' ', $style['tooltip-border']);
	
	
	if( $_POST[ 'gmt_hidden_field' ] == 'Y' ) {
		$link_color = $_POST[ 'gmt_link_color' ];
		$link_border_color = $_POST[ 'gmt_link_border_color' ];
		$link_border_thick = $_POST[ 'gmt_link_border_thick' ];
		$link_border_type = $_POST[ 'gmt_link_border_type' ];
		$hover_color = $_POST[ 'gmt_hover_color' ];
		$hover_border_color = $_POST[ 'gmt_hover_border_color' ];
		$hover_border_thick = $_POST[ 'gmt_hover_border_thick' ];
		$hover_border_type = $_POST[ 'gmt_hover_border_type' ];
		$tooltip_width = $_POST[ 'gmt_tooltip_width' ];
		$tooltip_height = $_POST[ 'gmt_tooltip_height' ];
		$tooltip_bgcolor = $_POST[ 'gmt_tooltip_bgcolor' ];
		$tooltip_border_color = $_POST[ 'gmt_tooltip_border_color' ];
		$tooltip_border_thick = $_POST[ 'gmt_tooltip_border_thick' ];
		$tooltip_border_type = $_POST[ 'gmt_tooltip_border_type' ];
	
		if(isset($link_border_type) && isset($link_border_thick) && isset($link_border_color))
			$link_border = $link_border_type." ".$link_border_thick." ".$link_border_color;
		else
			$link_border = '';
		
		if(isset($hover_border_type) && isset($hover_border_thick) && isset($hover_border_color))
			$hover_border = $hover_border_type." ".$hover_border_thick." ".$hover_border_color;
		else
			$hover_border = '';
		
		if(isset($tooltip_border_type) && isset($tooltip_border_thick) && isset($tooltip_border_color))
			$tooltip_border = $tooltip_border_type." ".$tooltip_border_thick." ".$tooltip_border_color;
		else
			$tooltip_border = '';
		
		if(isset($tooltip_width) && isset($tooltip_height))
		{
		/*	$wpt = substr($tooltip_width, -2);
			if( $wpt != 'px' || $wpt != 'pt' || $wpt != 'em')
				$tooltip_width .= 'px';
				
			$hpt = substr($tooltip_height, -2);
			if( $hpt != 'px' || $hpt != 'pt' || $hpt != 'em')
				$tooltip_height .= 'px';
				*/
			$style = array(
				  'link-color' => $link_color,
				  'link-border' => $link_border,
				  'link-hover-color' => $hover_color,
				  'link-hover-border' => $hover_border,
				  'tooltip-width' => $tooltip_width,
				  'tooltip-height' => $tooltip_height,
				  'tooltip-bgcolor' => $tooltip_bgcolor,
				  'tooltip-border' => $tooltip_border
							);
				update_option('gmt_tipstyle', $style);
			
			?>

<div class="updated">
  <p><strong>
    <?php _e('Options Updated.', 'gmt' ); ?>
    </strong></p>
</div>
<?php
		} else {
			?>
<div class="error">
  <p><strong>
    <?php _e('You must fill the Fields for Height an Width.', 'gmt' ); ?>
    </strong></p>
</div>
<?php
		}
	
}
	?>
<div class="wrap">
  <h2>gMapTip Options</h2>
  <p>
  <form style="margin-top:5px;" name="form1" method="post" action="<?php $_SERVER['PHP_SELF'];?>" >
    <input type="hidden" name="gmt_hidden_field" id="gmt_hidden_field" value="Y" />
    <p>
    <h3>Text Style</h3>
    <label>Text Color:
      <input type="text" name="gmt_link_color" id="gmt_link_color" class="gmt_colorp" style="width:175px" maxlength="7" value="<?php echo $style['link-color']; ?>" />
    </label>
    <br />
    <label>Underline Type:
      <select name="gmt_link_border_type" id="gmt_link_border_type" >
        <option <?php if($f_link_border[0] == 'solid')echo "selected=\"selected\""; ?> value="solid">Solid</option>
        <option <?php if($f_link_border[0] == 'dashed')echo "selected=\"selected\""; ?> value="dashed">Dashed</option>
        <option <?php if($f_link_border[0] == 'dotted')echo "selected=\"selected\""; ?> value="dotted">Dotted</option>
        <option <?php if($f_link_border[0] == 'double')echo "selected=\"selected\""; ?> value="double">Double</option>
        <option <?php if($f_link_border[0] == 'thin')echo "selected=\"selected\""; ?> value="thin">Thin</option>
        <option <?php if($f_link_border[0] == 'medium')echo "selected=\"selected\""; ?> value="medium">Medium</option>
        <option <?php if($f_link_border[0] == 'thick')echo "selected=\"selected\""; ?> value="thick">Thick</option>
      </select>
    </label>
    <label>Thickness:
      <input type="text" name="gmt_link_border_thick" id="gmt_link_border_thick" maxlength="4" style="width:50px" value="<?php echo $f_link_border[1]; ?>" />
    </label>
    <label>Color:
      <input type="text" class="gmt_colorp" name="gmt_link_border_color" id="gmt_link_border_color" maxlength="7" style="width:125px" value="<?php echo $f_link_border[2]; ?>" />
    </label>
    </p>
    <p>
    <h3>Text hovered Style</h3>
    <label>Text Color:
      <input type="text" name="gmt_hover_color" id="gmt_hover_color" class="gmt_colorp" style="width:125px" maxlength="7" value="<?php echo $style['link-hover-color']; ?>" />
    </label>
    <br />
    <label>Underline Type:
      <select name="gmt_hover_border_type" id="gmt_hover_border_type" >
        <option <?php if($f_hover_border[0] == 'solid')echo "selected=\"selected\""; ?> value="solid">Solid</option>
        <option <?php if($f_hover_border[0] == 'dashed')echo "selected=\"selected\""; ?> value="dashed">Dashed</option>
        <option <?php if($f_hover_border[0] == 'dotted')echo "selected=\"selected\""; ?> value="dotted">Dotted</option>
        <option <?php if($f_hover_border[0] == 'double')echo "selected=\"selected\""; ?> value="double">Double</option>
        <option <?php if($f_hover_border[0] == 'thin')echo "selected=\"selected\""; ?> value="thin">Thin</option>
        <option <?php if($f_hover_border[0] == 'medium')echo "selected=\"selected\""; ?> value="medium">Medium</option>
        <option <?php if($f_hover_border[0] == 'thick')echo "selected=\"selected\""; ?> value="thick">Thick</option>
      </select>
    </label>
    <label>Thickness:
      <input type="text" name="gmt_hover_border_thick" id="gmt_hover_border_thick" maxlength="4" style="width:50px" value="<?php echo $f_hover_border[1]; ?>" />
    </label>
    <label>Color:
      <input type="text" class="gmt_colorp" name="gmt_hover_border_color" id="gmt_hover_border_color" maxlength="7" style="width:175px" value="<?php echo $f_hover_border[2]; ?>" />
    </label>
    </p>
    <p>
    <h3>Tooltip Style</h3>
    <label>Width:
      <input type="text" name="gmt_tooltip_width" id="gmt_tooltip_width" style="width:150px" maxlength="6" value="<?php echo $style['tooltip-width']; ?>" />
    </label>
    <label>Height:
      <input type="text" name="gmt_tooltip_height" id="gmt_tooltip_height" style="width:150px" maxlength="6" value="<?php echo $style['tooltip-height']; ?>" />
    </label>
    <br />
    <label>Background Color:
      <input type="text" name="gmt_tooltip_bgcolor" id="gmt_tooltip_bgcolor" class="gmt_colorp" style="width:175px" maxlength="7" value="<?php echo $style['tooltip-bgcolor']; ?>" />
    </label>
    <br />
    <label>Border Type:
      <select name="gmt_tooltip_border_type" id="gmt_tooltip_border_type" >
        <option <?php if($f_tooltip_border[0] == 'solid')echo "selected=\"selected\""; ?> value="solid">Solid</option>
        <option <?php if($f_tooltip_border[0] == 'dashed')echo "selected=\"selected\""; ?> value="dashed">Dashed</option>
        <option <?php if($f_tooltip_border[0] == 'dotted')echo "selected=\"selected\""; ?> value="dotted">Dotted</option>
        <option <?php if($f_tooltip_border[0] == 'double')echo "selected=\"selected\""; ?> value="double">Double</option>
        <option <?php if($f_tooltip_border[0] == 'thin')echo "selected=\"selected\""; ?> value="thin">Thin</option>
        <option <?php if($f_tooltip_border[0] == 'medium')echo "selected=\"selected\""; ?> value="medium">Medium</option>
        <option <?php if($f_tooltip_border[0] == 'thick')echo "selected=\"selected\""; ?> value="thick">Thick</option>
      </select>
    </label>
    <label>Border Thickness:
      <input type="text" name="gmt_tooltip_border_thick" id="gmt_tooltip_border_thick" maxlength="4" style="width:50px" value="<?php echo $f_tooltip_border[1]; ?>" />
    </label>
    <label> Border Color:
      <input type="text" class="gmt_colorp" name="gmt_tooltip_border_color" id="gmt_tooltip_border_color" maxlength="7" style="width:125px" value="<?php echo $f_tooltip_border[2]; ?>" />
    </label>
    </p>
    <p class="submit">
      <input type="submit" name="Submit" value="<?php _e('Save Changes', 'gmt' ); ?>" />
    </p>
  </form>
  <hr />
  <p>The only necessary Fields are thw <b>with</b> and <b>height</b> of the Tooltip, if you didn't want to style it, let it blank.</p>
  <p><small>For more Information about this Plug-in visit my <a href="http://www.gnomx.at/gmaptip" title="gMapTip Site">Site</a>. Or want to try my other Plugins ? <a href="http://www.gnomx.at/mlang/" title="Languge switcher Plugin">mLanguge</a>, <a href="http://www.gnomx.at/infolink/" title="Quikly link Wiki, IMDB or Google search results.">InfoLink</a> </small></p>
  </p>
</div>
<?php
}

// Register Editor Button
function gmt_addbutton()
{
	if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;
 
   //if ( get_user_option('rich_editing') == 'true') {
    	add_filter("mce_external_plugins", "add_gmt_tinymce_plugin");
     	add_filter("mce_buttons", "register_gmt_button");
  // }	
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
add_action('admin_head','gmt_addstyle');
add_action('admin_enqueue_scripts', 'gmt_admin_head');
add_action('admin_menu',"gmt_addoptions");
add_action('init', 'gmt_addbutton');

add_filter('the_content','gmt_content');

?>

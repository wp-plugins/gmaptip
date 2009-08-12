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

google.load("maps", "2");
google.load("elements", "1", {packages : ["localsearch"]});

var map;

jQuery(document).ready(function($) {
			
			var shown = false;
			var mins = false;
			var t1, d;
	
			$('.gmt_link').mouseover(function(e){
											  clearTimeout(t1);
											 if(!shown){
												 shown = true;
												 mins = true;
												
											  $(this).prepend('<div class="gmt_tip" id="gmt_map"></div>');
											  var s = $(this).text();
											  var th = $('div:first',this).height();
											  $('div',this).css("top", (e.pageY - (th+10))+"px");
											  $('div',this).css("left", (e.pageX + 3)+"px");
											  var lopt = s.split(':');
											  var gmtype = lopt[0].replace(' ', '');
											  var place = lopt[1];
											  var lonlng = place.split('//');
											  var q = lopt[2];
																		
												if(lonlng[0] == 'auto'){
													place = 'home';
													if(typeof(lonlng[1]) != 'undefined')
														q = lonlng[1];
												 }
												  
											   
											  $('div:hidden',this).fadeIn("slow", function(){
																						    
																							
																							d = this;
																							var mopt = {
																								backgroundColor: $(this).css("background-color"),
																								};
																							map = new GMap2(this, mopt);
																							map.enableScrollWheelZoom();
																							
																							var blueIcon = new GIcon(G_DEFAULT_ICON);
																							blueIcon.image = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png";
																							
																							var hmo = {
																									title : 'Home',
																									icon : blueIcon,
																								};
																								
																						if(gmtype == 'ls'){
																							
																							var options = {
																								searchFormHint: q,
																								resultList: 'suppress'
																							}
													
																							var lsc = new google.elements.LocalSearch(options);
																							map.addControl(lsc);
																							$('.gels', this).hide();
																							
																							GEvent.addListener(map, "load", function() {
  																								setTimeout(function(){
																							
																							$(':submit',d).click();
																								}, 500);
																							});
																								
																							if (navigator.geolocation && place == 'home') {  
																							function showPosition(position) {
																							
    																								 map.setCenter(new GLatLng(position.coords.latitude, position.coords.longitude), 13);
    																								map.addOverlay(new GMarker(new GLatLng(position.coords.latitude, position.coords.longitude), hmo));
  																									} 
  																								function report(error){
    																							alert(error.message);
  																								}
																								navigator.geolocation.getCurrentPosition(showPosition, report);
																							} else if (typeof(google.gears) != "undefined"  && place == 'home') {
																								var geo = google.gears.factory.create('beta.geolocation');

  																								function updatePosition(position) {
																									 
   																									  map.setCenter(new GLatLng(position.latitude, position.longitude), 13);
    																								  map.addOverlay(new GMarker(new GLatLng(position.latitude, position.longitude), hmo));
 																								 }
																								function handleError(error) {
    																								alert(error.message);
 																								 }


    																								geo.getCurrentPosition(updatePosition, handleError);
  
																							} else {
																								
																								if(typeof(lonlng[3]) != 'undefined')
																									q = lonlng[3];
																								map.setCenter(new GLatLng( lonlng[0], lonlng[1]), parseInt(lonlng[2]));
																							
																							}
								
																							
																							} else if(gmtype == 'ma'){
																								
																								if (navigator.geolocation && place == 'home') {  
																									
																									function showPosition(position) {
																							
    																									map.setCenter(new GLatLng(position.coords.latitude, position.coords.longitude), 13);
    																									map.addOverlay(new GMarker(new GLatLng(position.coords.latitude, position.coords.longitude), hmo));
  																									} 
  																									
																									function report(error){
    																									alert(error.message);
  																									}
																									
																									navigator.geolocation.getCurrentPosition(showPosition, report);
																									
																							} else if (typeof(google.gears) != "undefined"  && place == 'home') {	
																							
																								var geo = google.gears.factory.create('beta.geolocation');

  																								function updatePosition(position) {
																									 
   																									  map.setCenter(new GLatLng(position.latitude, position.longitude), 13);
    																								  map.addOverlay(new GMarker(new GLatLng(position.latitude, position.longitude), hmo));
 																								 }
																								 
																								function handleError(error) {
    																								alert(error.message);
 																								 }


    																								geo.getCurrentPosition(updatePosition, handleError);
																									
  
																							} else {
																								
																								
																								map.setCenter(new GLatLng( lonlng[0], lonlng[1]), parseInt(lonlng[2]));
																								map.addOverlay(new GMarker(new GLatLng(lonlng[0], lonlng[1]), hmo));
																							
																							}
																							if(lonlng[3] == 'Hybrid'){
																								var mt = G_HYBRID_MAP;
																							} else if(lonlng[3] == 'Satellite'){
																								var mt = G_SATELLITE_MAP;
																							} else {
																								var mat = G_NORMAL_MAP;
																							}
																							
																							map.setMapType(mt);
																								
																							}
																						   });
											  
											 
												
											  }
											  
									});
			$('.gmt_link').mouseout(function(e){
											 if(shown){
											 
											 if(typeof map != undefined){
											t1 = setTimeout(function(){ 
											  $('div:visible',d).fadeOut("slow", function(){
																			shown = false;
																			
																			$(d).remove();
																			});}, 500); 
											 }
											  
											 }
										
											  });
			$('body').unload(GUnload());
								})

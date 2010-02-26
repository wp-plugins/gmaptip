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

function pluginP() {
	var p;
	var fname = 'gmaptip.js';
	var e = document.getElementsByTagName('script');
	
		for(i=0; i< e.length; i++){
			var s = e[i].src.search(fname);
			if (s != -1) {
				p = e[i].src.substring(0,e[i].src.lastIndexOf("/") + 1);
				break;
			}
		}
	return p;
}


var map;


jQuery(document).ready(function($) {
			function gmtCloseInfo() {
				$('.gmt_Info').fadeOut('slow', function(){ $(this).remove();});
			}
			function sizeInfo() {
				
				var mw = $('#gmt_map').width();
				var iw = 248;
				
				if(mw <= 250)
					iw = '96%';
					
				$('.gmt_Info').css('width', iw);
				$('.gmt_Info').css('left', (mw -  $('.gmt_Info').width()) / 2);
			}
								
			function addInfowindow(marker, content, number) {
				google.maps.event.addListener(marker, "click", function() {
									
									if($('.gmt_Info').length == 0){
											
											$('#gmt_tip').prepend(content);
											sizeInfo();
											$('.gmt_Info').fadeIn();
									} else {
										
										$('.gmt_Info').replaceWith(content);
										sizeInfo();
										$('.gmt_Info').fadeIn();
									}
			});
}
			
			var t1;
			var ls;
      		
				
				ls = new GlocalSearch();
      			ls.setSearchCompleteCallback(null, OnLocalSearch);
			
			function ExelocalSearch(query) {
				
				
				ls.setCenterPoint(map.getCenter());
      			ls.execute(query);
    			
			}
			
			
			
			function OnLocalSearch() {
      			if (!ls.results) return;
				
			
      			// Move the map to the first result
      			var first = ls.results[0];
      				map.setCenter(new google.maps.LatLng(parseFloat(first.lat),
                                             parseFloat(first.lng)));
				var lsmarker = [];
				
				for(m=0; m<ls.results.length; m++){
					
					var pos = new google.maps.LatLng(parseFloat(ls.results[m].lat),
                                             parseFloat(ls.results[m].lng));
					
					
					var img = pluginP()+'marker.png';
					var mark = new google.maps.Marker({
      						position: pos, 
      						map: map,
							icon: img,
							title: ls.results[m].titleNoFormatting
  					})
					
					var phonelist = '';
					
					if(typeof(ls.results[m].phoneNumbers) != 'undefined'){
						for(pn = 0; pn < ls.results[m].phoneNumbers.length; pn++){
						
							phonelist = phonelist+''+ls.results[m].phoneNumbers[pn].number;
							var pnt = ls.results[m].phoneNumbers[pn].type;
							if(pnt != '')
								phonelist = phonelist+' ('+pnt+')';
							phonelist = phonelist+'<br />';
						}
					}
					
					var dtolink = '';
					
					if (ls.results[m].ddUrlToHere && ls.results[m].ddUrlToHere != null)
					dtolink = '<a style="text-align:left;float:left" href="'+ls.results[m].ddUrlToHere+'">Drive here.</a>';
					
					var container = '<div class="gmt_Info" style="display:none"><b>'+ls.results[m].title+'</b><br /><p>'+ls.results[m].streetAddress+'<br />'+ls.results[m].city+'<br />'+ls.results[m].country+'<br />'+phonelist+'</p><span style="display:block;text-align:right;color:#333">'+dtolink+'<a style="font-weight:bold;" href="JavaScript:void(null)" onclick="jQuery(\'.gmt_Info\').fadeOut(\'slow\', function(){ jQuery(this).remove();});" >Close</a></span></div>';
					
					addInfowindow(mark, container, m);
						
				}

   			 }
			
			$('.gmt_link').hover(function(e){
						clearTimeout(t1);
						if($('#gmt_tip').length == 0){
						$(this).prepend('<div id="gmt_tip"><div id="gmt_map"></div></div>');
						
						var mapData = $('span', this).text();
						
						//Some Tooltip Arangments
						var th = $('div#gmt_tip',this).height();
						var tt = $('#gmt_tip', this).parent();
						$('#gmt_tip', this).css("top", ((tt.position().top - th) - 2)+"px");
						$('#gmt_tip', this).css("left", (tt.position().left + 15)+"px");
						
						$('#gmt_map', this).css("width", $('div#gmt_tip',this).width());
						$('#gmt_map', this).css("height", $('div#gmt_tip',this).height());
						
						//Get the Map Data
						var d = mapData.split(':');
						var gmtype = d[0].replace(' ', '');
						var place = d[1];
						var latlng = place.split('//');
						var marks;
						var q = latlng[3];
						if(d[2]) {
						 marks = d[2].split('**');
						}
																		
						if(latlng[0] == 'auto'){
								place = 'home';
								
								if(typeof(latlng[1]) != 'undefined')
									q = latlng[1];
						}
						
						
						$('#gmt_tip').fadeIn('slow', function(){
															  
						//Create the Map
						var loc = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
						var zoom = parseInt(latlng[2]);
						var mt = google.maps.MapTypeId.ROADMAP;
						
						if(latlng[3] == 'roadmap'){
							mt = google.maps.MapTypeId.ROADMAP;
						} else if(latlng[3] =='hybrid'){
							mt = google.maps.MapTypeId.HYBRID;
						} else if(latlng[3] =='satellite'){
							mt = google.maps.MapTypeId.SATELLITE;
						} else {
							mt = google.maps.MapTypeId.TERRAIN;
						}
						
						var mopt = {
							zoom: zoom,
							center: loc,
							mapTypeId: mt,
							mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
							navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
							backgroundColor: $('#gmt_tip').css("background-color")
						};
						
						 map = new google.maps.Map(document.getElementById('gmt_map'), mopt);
						
														//Set Marks
															var pluginPath = pluginP();
															  if(marks){
															  for(mcount=0;mcount< marks.length; mcount++){
																  var mark = marks[mcount].split('/+/');
																  var mlatlng = new google.maps.LatLng(mark[0], mark[1]);
																  var mimage = ' ';
																  
																   if(mark[3]){
																	   	mimage = 'http://'+mark[3];
																	   if(mimage.substr(0,7) != 'http://')
																	  		mimage = 'http://'+mimage;
																	}else {
																	  	mimage = pluginPath+'marker.png';
																	  }
																  var marker = new google.maps.Marker({
      																position: mlatlng, 
      																map: map,
																	icon: mimage,
      																title:mark[2]
  																});  
															  }
															  }
				// Set Autoposition
						var initialLocation;
						var browserSupportFlag =  new Boolean();
						
						if(place == 'home') {
	
  						if(navigator.geolocation) {
    						browserSupportFlag = true;
    						navigator.geolocation.getCurrentPosition(function(position) {
       						initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      						map.setCenter(initialLocation);
    					}, function() {
      						handleNoGeolocation(browserSupportFlag);
    					});
							
  					// Try Google Gears Geolocation
  						} else if (google.gears) {
    						browserSupportFlag = true;
    						var geo = google.gears.factory.create('beta.geolocation');
    						geo.getCurrentPosition(function(position) {
      						initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      						map.setCenter(initialLocation);
    					}, function() {
      						handleNoGeoLocation(browserSupportFlag);
    					});
  					// Browser doesn't support Geolocation
  						} else {
    						browserSupportFlag = false;
    						handleNoGeolocation(browserSupportFlag);
  						}
						
						function handleNoGeolocation(errorFlag) {
    						if (errorFlag == true) {
      							alert("Geolocation service failed.");
      							initialLocation = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
    						} else {
      							alert("Your browser doesn't support geolocation.");
      							initialLocation = new google.maps.LatLng(60, 105);    					
								}
    						map.setCenter(initialLocation);
 						 }
						
						}
						// Do Local Search
						if(gmtype == 'ls')
							ExelocalSearch(q);
						});
						}
										  }, function(e) {
											  if(typeof(map) != "undefined"){
												t1 = setTimeout(function(){ 
											  $('#gmt_tip:visible').fadeOut("slow", function(){
																			
																			google.maps.event.clearInstanceListeners(map);
																			map
																			$('#gmt_tip').remove();
												});}, 300); 
											  }
											  	
											  });
			
								});
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


var gLocalSearch;
var map;
var gInfoWindow;
    var gSelectedResults = [];
    var gCurrentResults = [];
    var gSearchForm;

var gYellowIcon, gRedIcon, gSmallShadow;

jQuery(document).ready(function($) {
			
			var shown = false;
			var t1;
			
		function makemap(div, latlng, zoom, mt, ls){
			
			// Create our "tiny" marker icon
     gYellowIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_yellow.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
     gRedIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_red.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
     gSmallShadow = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_shadow.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
			
			var mopt = {
						zoom: zoom,
						center: latlng,
						mapTypeId: mt,
						disableDefaultUI: true,
						navigationControl: true,
						navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
						backgroundColor: $(div).css("background-color"),
					};
					
					var m = new google.maps.Map(div, mopt);
					
					if(typeof(ls) != 'undefined'){
						
						//google.maps.event.addListener(m, 'tilesloaded', function(){
																				 
																						setTimeout(function(){doSearch(ls);},1200);
																						
																					// });
					}
			return m;
			
		}
			
		gInfoWindow = new google.maps.InfoWindow;
      google.maps.event.addListener(gInfoWindow, 'closeclick', function() {
        unselectMarkers();
      });
			
		gLocalSearch = new GlocalSearch();
      	gLocalSearch.setSearchCompleteCallback(null, OnLocalSearch);
		
		function unselectMarkers() {
      for (var i = 0; i < gCurrentResults.length; i++) {
        gCurrentResults[i].unselect();
      }
    }
		
		
	function doSearch(query) {
      gLocalSearch.setCenterPoint(map.get_center());
      gLocalSearch.execute(query);
    }
	
	function OnLocalSearch() {
      if (!gLocalSearch.results) return;

      // Clear the map and the old search well
  /*    for (var i = 0; i < gCurrentResults.length; i++) {
       // if (!gCurrentResults[i].selected()) {
          gCurrentResults[i].marker().set_map(null);
        //}
      }*/

      gCurrentResults = [];
      for (var i = 0; i < gLocalSearch.results.length; i++) {
        gCurrentResults.push(new LocalResult(gLocalSearch.results[i]));
      }

      // Move the map to the first result
      var first = gLocalSearch.results[0];
      map.set_center(new google.maps.LatLng(parseFloat(first.lat),
                                             parseFloat(first.lng)));

    }
	
	   // A class representing a single Local Search result returned by the
    // Google AJAX Search API.
    function LocalResult(result) {
      var me = this;
      me.result_ = result;
      me.resultNode_ = me.node();
      me.marker_ = me.marker();
      google.maps.event.addDomListener(me.resultNode_, 'mouseover', function() {
        // Highlight the marker and result icon when the result is
        // mouseovered.  Do not remove any other highlighting at this time.
        me.highlight(true);
      });
      google.maps.event.addDomListener(me.resultNode_, 'mouseout', function() {
        // Remove highlighting unless this marker is selected (the info
        // window is open).
        if (!me.selected_) me.highlight(false);
      });
      google.maps.event.addDomListener(me.resultNode_, 'click', function() {
        me.select();
      });
      
    }

    LocalResult.prototype.node = function() {
      if (this.resultNode_) return this.resultNode_;
      return this.html();
    };

    // Returns the GMap marker for this result, creating it with the given
    // icon if it has not already been created.
    LocalResult.prototype.marker = function() {
      var me = this;
      if (me.marker_) return me.marker_;
      var marker = me.marker_ = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(me.result_.lat),
                                         parseFloat(me.result_.lng)),
        icon: gYellowIcon, shadow: gSmallShadow, map: map});
      google.maps.event.addListener(marker, "click", function() {
        me.select();
      });
      return marker;
    };

    // Unselect any selected markers and then highlight this result and
    // display the info window on it.
    LocalResult.prototype.select = function() {
      unselectMarkers();
      this.selected_ = true;
      this.highlight(true);
      gInfoWindow.set_content(this.html(true));
      gInfoWindow.open(map, this.marker());
    };

    // Remove any highlighting on this result.
    LocalResult.prototype.unselect = function() {
      this.selected_ = false;
      this.highlight(false);
    };

    // Returns the HTML we display for a result before it has been "saved"
    LocalResult.prototype.html = function() {
      var me = this;
      var container = document.createElement("div");
      container.className = "unselected";
      container.appendChild(me.result_.html.cloneNode(true));
      return container;
    }

    LocalResult.prototype.highlight = function(highlight) {
      this.marker().setOptions({icon: highlight ? gRedIcon : gYellowIcon});
      this.node().className = "unselected" + (highlight ? " red" : "");
    }
    
	
			$('.gmt_link').hover(function(e){
											  clearTimeout(t1);
											 if(!shown){
												 shown = true;
												 
												
											  $(this).prepend('<div id="gmt_map"></div>');
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
												  
											   
											  $('#gmt_map:hidden').fadeIn("slow", function(){
																						    
																							
																
																						
																								
																						if(gmtype == 'ls'){
																							
																				if (navigator.geolocation && place == 'home') {  
																					
																							function showPosition(position) {
																							
    																								map = makemap(document.getElementById('gmt_map'),new google.maps.LatLng(position.coords.latitude, position.coords.longitude),13,'roadmap', q);																		
																									var hmark = new google.maps.Marker({
																																	   position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
																																	   title: 'Home',
																																	   map: map
																																	   });
																									
  																									} 
  																								function report(error){
    																							alert(error.message);
  																								}
																								navigator.geolocation.getCurrentPosition(showPosition, report);
																							} else if (typeof(google.gears) != "undefined"  && place == 'home') {
																								
																								

  																								function updatePosition(position) {
																									 	
   																									  map = makemap(document.getElementById('gmt_map'),new google.maps.LatLng(position.latitude, position.longitude), 13, 'roadmap', q);
																									 var hmark = new google.maps.Marker({
																																	   position: new google.maps.LatLng(position.latitude, position.longitude),
																																	   title: 'Home',
																																	   map: map
																																	   });
    																							 }
																								function handleError(error) {
    																								alert(error.message);
 																								 }
																								 var geolocation = google.gears.factory.create('beta.geolocation');
																								 geolocation.getCurrentPosition(updatePosition, handleError, { enableHighAccuracy: true, gearsRequestAddress: true });
																								 
  
																							} else {
																								
																								if(typeof(lonlng[3]) != 'undefined')
																									q = lonlng[3];
																									
																								if(google.loader.ClientLocation && place == 'home')
																								map = makemap(document.getElementById('gmt_map'),new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude), 13, 'roadmap', q);
																								else
																								map = makemap(document.getElementById('gmt_map'),new google.maps.LatLng( lonlng[0], lonlng[1]), parseInt(lonlng[2]), 'roadmap', q);
																								
																							
																							}
																							
																							
																						
																							
								
																							
																							} else if(gmtype == 'ma'){
																								
																								if (navigator.geolocation && place == 'home') {  
																									
																									function showPosition(position) {
																							
    																									map = makemap(this, new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 13, 'roadmap');
    																									var hmark = new google.maps.Marker({
																																	   position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
																																	   title: 'Home',
																																	   map: map
																																	   });
  																									} 
  																									
																									function report(error){
    																									alert(error.message);
  																									}
																									
																									navigator.geolocation.getCurrentPosition(showPosition, report);
																									
																							} else if (typeof(google.gears) != "undefined"  && place == 'home') {	
																							
																								var geo = google.gears.factory.create('beta.geolocation');

  																								function updatePosition(position) {
																									 
   																									  map = makemap(this, new google.maps.LatLng(position.coords.latitude, position.coords.longitude),13, 'roadmap');
    																								var hmark = new google.maps.Marker({
																																	   position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
																																	   title: 'Home',
																																	   map: map
																																	   });
 																								 }
																								 
																								function handleError(error) {
    																								alert(error.message);
 																								 }


    																								geo.getCurrentPosition(updatePosition, handleError);
																									
  
																							} else {
																								
																								if(google.loader.ClientLocation && place == 'home'){
																								map = makemap(document.getElementById('gmt_map'),new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude), 13, 'roadmap');
																							}else {
																								map = makemap(this,new google.maps.LatLng( lonlng[0], lonlng[1]), parseInt(lonlng[2]), lonlng[3]);
								
																								var hmark = new google.maps.Marker({
																																	   position: new google.maps.LatLng( lonlng[0], lonlng[1]),
																																	   map: map
																																	   });
																								}
																							}
											
																								
																							}
																						   });
											  
											 
												
											  }
											  
									},function(e){
										if(typeof(map) != "undefined"){
										t1 = setTimeout(function(){ 
											  $('#gmt_map:visible').fadeOut("slow", function(){
																			shown = false;
																			google.maps.event.clearInstanceListeners(map);
																			$('#gmt_map').remove();
																			});}, 300); 
										}
			
			});
								});


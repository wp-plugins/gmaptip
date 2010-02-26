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

	
	var map;
	var geocoder;
	var type = tinyMCEPopup.getWindowArg('maptype');
	var mtid = google.maps.MapTypeId.ROADMAP;
	var mzoom = 8;
	var mpos = new google.maps.LatLng(-34.397, 150.644);
	var lsc = false;
	var Amarks = new Array();
	var MarkersA = new Array();
	
	function pluginP() {
	var p;
	var fname = 'gmaptip_admin.js';
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

function openAddMWin(location) {
	var lat = location.lat();
	var lng = location.lng();
	document.getElementById('gmt_addmark_lat').value = lat;
	document.getElementById('gmt_addmark_lng').value = lng;
	jQuery('#gmt_addMarkW').fadeIn();
}

function clearMarks() {
	for(e=0;e<MarkersA.length;e++){
		MarkersA[e].setMap(null);
	}
	Amarks = [];
}
	
function addMark() {
	var lat = document.getElementById('gmt_addmark_lat').value;
	var lng = document.getElementById('gmt_addmark_lng').value;
	var mtitle = document.getElementById('gmt_addmark_title').value;
	var mimg = document.getElementById('gmt_addmark_img').value;
	var markstring = lat+'/+/'+lng;
	
	if(mtitle != '')
		markstring = markstring+'/+/'+mtitle;
	
	if(mimg != ''){
		if(mimg.substr(0,7) == 'http://')
			mimg = mimg.substr(7);
			
		markstring = markstring+'/+/'+mimg;
	}else{
		mimg = 'marker.png';
	}
	Amarks.push(markstring);
	var marker = new google.maps.Marker({
      																position: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)), 
      																map: map,
																	icon: mimg,
      																title:mtitle
				});  
	MarkersA.push(marker);
	  	jQuery('#gmt_addMarkW').fadeOut();	
	
}
	function initialize() {
		var ed = tinyMCEPopup.editor;
		Amarks = [];
			var mtc =  false;
			var marks;
			if(type == 'ls_auto' || type == 'normal_map'){
			document.getElementById('gmt_searchtext').style.display = "none";
			document.getElementById('gmt_stl').style.display = "none";
			document.getElementById('gmt_sth').style.display = "none";
			mtc = true;
		} else if( type == 'edit') {
			var element = ed.selection.getNode();
			var vars = element.firstChild.lastChild.data.split(':');
			var mvar;
			document.getElementsByName('insert')[0].value = 'Update';
			if(vars[2]) {
						 marks = vars[2].split('**');
						}
			
			if(vars[0] == 'ls' && vars[1] == 'auto'){
				
				document.getElementById('gmt_auto').checked = 'checked';
			
			}else if(vars[0] == 'ls'){
				mvar = vars[1].split('//');
				lsc = true;
				if(mvar[0] == 'auto'){
					document.getElementById('gmt_auto').checked = 'checked';
				
				if(mvar[1] == 'roadmap')
					mtid = google.maps.MapTypeId.ROADMAP;
				else if(mvar[1] == 'satellite') 
					mtid = google.maps.MapTypeId.SATELLITE;
				else if(mvar[1] == 'hybrid')
					mtid = google.maps.MapTypeId.HYBRID;
				else if(mvar[1] == 'terrain') 
					mtid = google.maps.MapTypeId.TERRAIN;
				else 
					document.getElementById('gmt_searchtext').value = mvar[1];
					
				}else {
					
					document.getElementById('gmt_lat').value = mvar[0];
					document.getElementById('gmt_long').value = mvar[1];
					document.getElementById('gmt_zoom').value = mvar[2];
					document.getElementById('gmt_searchtext').value = mvar[3];
					
					mzoom = parseInt(mvar[2].replace(' ',''));
					mpos = new google.maps.LatLng(mvar[0], mvar[1]);
					
				}
					
				
				
			} else {
				
				document.getElementById('gmt_searchtext').style.display = "none";
			document.getElementById('gmt_stl').style.display = "none";
			document.getElementById('gmt_sth').style.display = "none";
			mtc = true;
				
				mvar = vars[1].split('//');
				
				if(mvar[0] == 'auto'){
					document.getElementById('gmt_auto').checked = 'checked';
				
				if(mvar[1] == 'roadmap')
					mtid = google.maps.MapTypeId.ROADMAP;
				else if(mvar[1] == 'satellite') 
					mtid = google.maps.MapTypeId.SATELLITE;
				else if(mvar[1] == 'hybrid')
					mtid = google.maps.MapTypeId.HYBRID;
				else 
					mtid = google.maps.MapTypeId.TERRAIN;
					
				}else {
					
					document.getElementById('gmt_lat').value = mvar[0];
					document.getElementById('gmt_long').value = mvar[1];
					document.getElementById('gmt_zoom').value = mvar[2];
					document.getElementById('gmt_mt').value = mvar[3];
					
					if(mvar[3] == 'roadmap')
						mtid = google.maps.MapTypeId.ROADMAP;
					else if(mvar[3] == 'satellite') 
						mtid = google.maps.MapTypeId.SATELLITE;
					else if(mvar[3] == 'hybrid')
						mtid = google.maps.MapTypeId.HYBRID;
					else 
						mtid = google.maps.MapTypeId.TERRAIN;
						
					mzoom = parseInt(mvar[2].replace(' ',''));
					mpos = new google.maps.LatLng(mvar[0], mvar[1]);
						
					
				}
				
			}
		}
		
		var mo = {
			zoom: mzoom,
			center: mpos,
			mapTypeId: mtid,
			mapTypeControl: true,
    		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			navigationControl: mtc,
			navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
			};
        map = new google.maps.Map(document.getElementById("map"), mo);
		geocoder = new google.maps.Geocoder();
		
		//Set Marks 
		var pluginPath = pluginP();
															  if(marks){
															  for(mcount=0;mcount< marks.length; mcount++){
																  Amarks.push(marks[mcount]);
																  var mark = marks[mcount].split('/+/');
																  var mlatlng = new google.maps.LatLng(mark[0], mark[1]);
																  var mimage;
																  
																  if(mark[3]){
																	   	mimage = 'http://'+mark[3];
																	   if(mimage.substr(0,7) != 'http://')
																	  		mimage = 'http://'+mimage;
																	}else {
																	  	mimage = 'marker.png';
																	  }
																  var marker = new google.maps.Marker({
      																position: mlatlng, 
      																map: map,
																	icon: mimage,
      																title:mark[2]
  																});  
																  MarkersA.push(marker);
															  }}
		
    
		document.getElementById('gmt_linktext').value = ed.selection.getContent();
		
		google.maps.event.addListener(map, 'click', function(event) {
    openAddMWin(event.latLng);
  });
		
}	


  function geocode() {
    var address = document.getElementById("address").value;
    geocoder.geocode({
      'address': address,
      'partialmatch': true}, geocodeResult);
  }

  function geocodeResult(results, status) {
    if (status == 'OK' && results.length > 0) {
      map.fitBounds(results[0].geometry.viewport);
    } else {
      alert("Search was not successful for the following reason: " + status);
    }
  }
	
function setpos(){
	var latlng = map.getCenter();
	var zoom = map.getZoom();
	var mapt = map.getMapTypeId();
	document.getElementById('gmt_lat').value = latlng.lat();
	document.getElementById('gmt_long').value = latlng.lng();
	document.getElementById('gmt_zoom').value = zoom;
	document.getElementById('gmt_mt').value = mapt;
}

function insert_tip() {
	var ed = tinyMCEPopup.editor;
	var lt = document.getElementById('gmt_linktext').value;
	var st = document.getElementById('gmt_searchtext').value;
	var lat = document.getElementById('gmt_lat').value;
	var lng = document.getElementById('gmt_long').value;
	var zoom = document.getElementById('gmt_zoom').value;
	var auto = document.getElementById('gmt_auto').checked;
	var mt = document.getElementById('gmt_mt').value;
	var ms;
	
	if(Amarks.length > 0)
		ms = Amarks.join('**');
		
	if(typeof(ms) == 'undefined')
		ms = '';
	
	if(lt != ''){
	if(auto){
		if(type == 'ls_custom' || lsc == true){
		if(st != '')
			var os = "ls:auto//"+st+":";
		else
			var os = "ls:auto:";
		} else {
			var os = "ma:auto//"+mt+":";	
		}
		
		if(type == 'edit'){
			var nspan = document.createElement('SPAN');
			nspan.style.display = 'none';
			nspan.innerHTML = os;
			ed.selection.getNode().replaceChild(nspan, ed.selection.getNode().firstChild);
			var nlt = document.createTextNode(lt);
			ed.selection.getNode().replaceChild(nlt, ed.selection.getNode().lastChild);
		}else
			ed.selection.setContent('<a href=\"JavaScript:void(null)\" class=\"gmt_link\"><span style=\"display:none\" >'+os+'</span>'+lt+'</a>');
		tinyMCEPopup.close();
	} else {
		if(lat != '' && lng != '' && zoom != ''){
			if(type == 'ls_custom' || lsc == true){
		if(st != '')
			var os = "ls:"+lat+"//"+lng+"//"+zoom+"//"+st+":"+ms;
		else
			var os = "ls:"+lat+"//"+lng+"//"+zoom+":"+ms;
			} else {
				var os = "ma:"+lat+"//"+lng+"//"+zoom+"//"+mt+":"+ms;
			}
		
		if(type == 'edit'){
			var nspan = document.createElement('SPAN');
			nspan.style.display = 'none';
			nspan.innerHTML = os;
			ed.selection.getNode().replaceChild(nspan, ed.selection.getNode().firstChild);
			var nlt = document.createTextNode(lt);
			ed.selection.getNode().replaceChild(nlt, ed.selection.getNode().lastChild);
		}else
			ed.selection.setContent('<a href=\"JavaScript:void(null)\" class=\"gmt_link\"><span style=\"display:none\" >'+os+'</span>'+lt+'</a>');
			
		tinyMCEPopup.close();
		} else {
			ed.windowManager.alert('Please insert Coordinates or check "Auto"');
		}
	}
	} else {
		ed.windowManager.alert('Please insert a Link Text.');
	}
}
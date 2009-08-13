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
	
	function initialize() {
		var ed = tinyMCEPopup.editor;
			var mtc =  false;
			if(type != 'ls_custom'){
			document.getElementById('gmt_searchtext').style.display = "none";
			document.getElementById('gmt_stl').style.display = "none";
			document.getElementById('gmt_sth').style.display = "none";
			mtc = true;
		}
		var mo = {
			zoom: 8,
			center: new google.maps.LatLng(-34.397, 150.644),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
    		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			navigationControl: mtc,
			navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
			};
        map = new google.maps.Map(document.getElementById("map"), mo);
		geocoder = new google.maps.Geocoder();
		
    
		document.getElementById('gmt_linktext').value = ed.selection.getContent();
		
		
		
    
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
	var latlng = map.get_center();
	var zoom = map.get_zoom();
	var mapt = map.get_mapTypeId();
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
	
	if(lt != ''){
	if(auto){
		if(type == 'ls_custom'){
		if(st != '')
			var os = "ls:auto//"+st+":";
		else
			var os = "ls:auto:";
		} else {
			var os = "ma:auto//"+mt+":";	
		}
		ed.selection.setContent('[gmt '+os+']'+lt+'[/gmt]');
		tinyMCEPopup.close();
	} else {
		if(lat != '' && lng != '' && zoom != ''){
			if(type == 'ls_custom'){
		if(st != '')
			var os = "ls:"+lat+"//"+lng+"//"+zoom+"//"+st+":";
		else
			var os = "ls:"+lat+"//"+lng+"//"+zoom+":";
			} else {
				var os = "ma:"+lat+"//"+lng+"//"+zoom+"//"+mt+":";
			}
		ed.selection.setContent('[gmt '+os+']'+lt+'[/gmt]');
		tinyMCEPopup.close();
		} else {
			ed.windowManager.alert('Please insert Coordinates or check "Auto"');
		}
	}
	} else {
		ed.windowManager.alert('Please insert a Link Text.');
	}
}
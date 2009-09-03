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

(function(){
		  
	tinymce.create('tinymce.plugins.gmaptipPlugin', {
		
		getInfo : function() {
			return {
				longname : 'gMapTip',
				author : 'Sirlon',
				authorurl : 'http://www.gnomx.at',
				infourl : 'http://www.gnomx.at/gmaptip',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},
		
		init : function(ed, url) {
			var t = this, cm;

			t.url = url;
			t.editor = ed;
			t.bimg = url+'/button.gif';
			
		},
		
		createControl: function(n, cm) {
			var t = this, ed = t.editor;
			var f = 'ls_auto';
				
			switch(n){
				case 'gmaptip':
				
				var c = cm.createSplitButton('gmaptip', {
							title : 'gMapTip',
							image : t.bimg ,
							onclick : function() {
									addmap(f, t);
								}
						});
					
					c.onRenderMenu.add(function(c, m) {
												
						var lsa = m.add({
								  title : 'Quick Local Search',
								  onclick : function() {
									  		f = 'ls_auto';
									  		addmap(f, t);
											unselect();
											lsa.setSelected(1);
									  }
						});
						
						m.addSeparator();
						
						var nm = m.add({
								  title : 'Custom Map',
								  onclick : function() {
									  		f = 'normal_map';
									  		addmap(f, t);
											unselect();
											nm.setSelected(1);
									  }
						});
						
						var lsc = m.add({
								  title : 'Custom Local Search',
								  onclick : function() {
									  		f = 'ls_custom';
									  		addmap(f, t);
											unselect();
											lsc.setSelected(1);
									  }
						});
						
						lsa.setSelected(1);
						mitems = new Array(lsa, lsc, nm);
							function unselect(){
								for(i=0; i < mitems.length; i++){
									mitems[i].setSelected(0);
			
								}
							}
					
					});
			
					return c;
				
				}
				
				function addmap(o, t){
					var ed = t.editor;
					var se = ed.selection.getNode();
					
					
					
					if(se.nodeName == 'A' && se.getAttribute('class') == 'gmt_link')
						o = 'edit';
						
					if(o == 'ls_auto'){
						if(ed.selection.getContent() == ''){
							ed.windowManager.alert('Nothing Selected! Please use the Custom Local Search Option or select a Text to search.');
						} else {
						ed.selection.setContent('<a href=\"JavaScript:void(null)\" class=\"gmt_link\"><span style=\"display:none\" >ls:auto:</span>'+ed.selection.getContent()+'</a>');
						}
					} else {
						
					ed.windowManager.open({
					url : t.url+'/window.html',
   					width : 450,
   					height : 475,
					inline: 1
				}, {
   					url : t.url,
					maptype : o
				});
					}
					
				}
				
				return null;
		},
  });
		tinymce.PluginManager.add('gmaptip', tinymce.plugins.gmaptipPlugin);
		  })();
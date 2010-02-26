	
//Admin Panel
jQuery(document).ready(function($) {
$('#gmt_link_color, #gmt_link_border_color, #gmt_hover_color, #gmt_hover_border_color, #gmt_tooltip_bgcolor, #gmt_tooltip_border_color').ColorPicker({
	onSubmit: function(hsb, hex, rgb, el) {
		$(el).val('#'+hex);
		$(el).ColorPickerHide();
	},
	onBeforeShow: function () {
		$(this).ColorPickerSetColor(this.value);
	}
})
.bind('keyup', function(){
	$(this).ColorPickerSetColor(this.value);
});
								})
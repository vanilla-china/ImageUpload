$(function(){

	var uploader = new plupload.Uploader({
		runtimes : 'html5,html4',
		browse_button : 'btn_imageupload',
		multi_selection:gdn.definition('ImageUpload_Multi'),
		max_file_size : '2mb',
		file_data_name: 'image_file',
		url : gdn.definition('ImageUpload_Url', '/post/imageupload'),
		// flash_swf_url : '/plugins/ImageUpload/js/plupload.flash.swf',
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
		]
	});

	uploader.bind('Init', function(up, params) {
		console.log("Current runtime: " + params.runtime );
	});

	uploader.init();

	uploader.bind('FilesAdded', function(uploader, files) {
		uploader.start();
		$('#imageupload_loading').show();
	});

	uploader.bind('FileUploaded',function(uploader,file,response){
		var url = response.response;
		$('#Form_Body').focus();
		var inputFormat = getInputFormat();
		var imageCode;
		switch(inputFormat) {
			case 'Html':
				imageCode = '<img src="'+url+'"/>\r\n';
				break;
			case 'BBCode':
				imageCode = '[img]'+url+'[/img]\r\n';
				break;
			case 'Markdown':
				imageCode = '![]('+url+')\r\n';
				break;
			default:
				imageCode = url+'\r\n';
				break;
		}
		$('#Form_Body').val($('#Form_Body').val() + imageCode);
		var editor = $('#Form_Body').get(0).editor;
        if (editor) {
            // Update the frame to match the contents of textarea
            editor.updateFrame();
        }
	});

	uploader.bind('UploadComplete',function(uploader,files){
		$('#imageupload_loading').hide();
	});

	function getInputFormat() {
		var editor = $('#Form_Body').get(0).editor;
		if(editor) return 'Html';
		var format = $('#Form_Body').attr('format');
		if (!format) format = gdn.definition('ImageUpload_InputFormatter', 'Html');
		if (!format) format = gdn.definition('InputFormat', 'Html');
		if (format == 'Raw' || format == 'Wysiwyg')
		format = 'Html';
        return format;
	}
});
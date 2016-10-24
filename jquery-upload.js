/**
 * @summary     jquery-upload
 * @description Upload of files 
 * @version     0.1.0
 * @file        jquery.upload.js
 * @author      Raphael Cardoso (www.raphaelcardoso.com.br)
 * @contact     www.raphaelcardoso.com.br/contato
 *
 * @copyright Copyright 2016 Raphael Cardoso, all rights reserved.
 *
 */
(function ($) {
    $.fn.Upload = function (options) {
        var config = {
            url: null,
            show_icon_button: true,
            class_icon_button: 'glyphicon glyphicon-open',
            text_button: 'Selecionar arquivos',
            class_button: 'btn btn-success',
            class_progressbar: 'progress-bar-success'
        };
        if (options) { $.extend(config, options); }

        var $inputFile = $("#txtArquivo");
        $inputFile.css('display', 'none');

        var icon_button = config.show_icon_button ? '<i class="' + config.class_icon_button + '"></i>&nbsp;' : '';

        var $panel = $('<div class="panel panel-default"></div>');
        var $panelBody = $('<div class="panel-body"></div>');
        var $buttonUpload = $('<button type="button" id="btnUpload" name="btnUpload" class="' + config.class_button + '">' + icon_button + config.text_button + '</button>');
        $buttonUpload.appendTo($panelBody);
        $panelBody.appendTo($panel);
        $panel.insertAfter(this);

        var modelList = [];

        var updateProgress = function () {
            for (var i = 0; i < modelList.length; i++) {
                var model = modelList[i];
                var id = model.id;
                var name = model.name;
                var perc = parseInt(model.perc);

                var class_progressbar = config.class_progressbar == null ? '' : (' ' + config.class_progressbar);

                $('#panel_' + id).remove();

                $('<div id="panel_' + id + '" class="panel panel-default"><div class="panel-body">' +
                  '<div class="col-xs-4"><label>' + name + '</label></div>' +
                  '<div class="col-xs-8">' +
                  '<div id="' + id + '" class="progress">' +
                  '<div class="progress-bar' + class_progressbar + '" role="progressbar" aria-valuenow="' + perc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + perc + '%;">' + perc + '%</div>' +
                  '</div></div></div></div>').appendTo('#progress-container');
            }

            if (modelList.length == 0) {
                $buttonUpload.removeClass('disabled');
                $inputFile.val('');
            }
        };

        var uploadListProgress = function (model, perc) {
            var model = {
                id: model.id,
                name: model.name,
                size: model.size,
                perc: perc
            };

            var result = $.grep(modelList, function (e) { return e.id == model.id; });

            if (result.length == 0) {
                modelList.push(model);
            } else {
                var idx = modelList.indexOf(result[0]);
                modelList[idx].perc = perc;
            }

            modelList = modelList.sort(function (o1, o2) { return o1.id - o2.id; });

            updateProgress();
        };

        var sendData = function (model) {
            $.ajax({
                url: config.url,
                cache: true,
                type: 'POST',
                data: model.data,
                processData: false,
                contentType: false,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var perc = evt.loaded / evt.total * 100;
                            uploadListProgress(model, perc);
                        }
                    }, false);

                    return xhr;
                },
                success: function (response) {
                    modelList = $.grep(modelList, function (e) { return e.id != model.id });

                    $('#panel_' + model.id).remove();

                    updateProgress();
                },
                error: function (xmlHttpRequest, status, err) {
                    console.error(err);
                }
            });
        };

        var upload = function (selector) {
            var $selector = $(selector);
            var files = $selector[0].files;

            if (window.FormData !== undefined) {
                for (var x = 0; x < files.length; x++) {                  
                    var formData = new FormData();
                    formData.append('file' + x, files[x]);

                    var name = files[x].name;
                    var size = files[x].size;

                    sendData({
                        id: x,
                        name: name,
                        size: size,
                        data: formData
                    });
                }
            }
        };

        $buttonUpload.click(function () {
            $inputFile.click();
        });

        $inputFile.on('change', function () {
            if (config.url != null) {
                $buttonUpload.addClass('disabled');
                upload($inputFile);
            } else {
                alert('Enter the url to upload.');
                $buttonUpload.removeClass('disabled');
                $inputFile.val('');
            }
        });
    };
})(jQuery);

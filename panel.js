var isChrome = !browser;
var browser = browser || chrome;
var config = config || { urls: ['http://localhost:4502'], isEnable: true, editorType: "editorType-vs" };

$(function () {
	$('#chkStatus').on("change", function () {
		var isCheck = $(this).is(":checked");
		setLabelStatus(isCheck);
	});

	$('#txtUrl').on("keypress", function (e) {
		if (e.key == 13) {
			getUrl();
			e.preventDefault();
		}
	});

	$('#btnAdd').on('click', function () {
		getUrl();
	});

	$('#btnSave').on("click", function () {
		var isCheck = $('#chkStatus').is(":checked");
		config.isEnable = isCheck;
		config.editorType = $('.editor-toggle.active input').attr("id");
		var urls = [];
		$('.url-regex').each(function (index) {
			urls.push($(this).text());
		});
		console.log(urls);
		config.urls = urls;
		browser.storage.local.set({ config: config });
		window.close();
	});

	$('#btnCancel').on("click", function () {
		initPopup(config);
	});
});

function setLabelStatus(isEnable) {
	if (isEnable) {
		$('#lbStatus').text('Enable')
			.parent()
			.removeClass('btn-danger')
			.addClass('btn-success');

		$('.mCSB_container').removeClass('disabled');
	} else {
		$('#lbStatus').text('Disable')
			.parent()
			.removeClass('btn-success')
			.addClass('btn-danger');
		$('.mCSB_container').addClass('disabled');
	}
}

function getUrl() {
	var url = $('#txtUrl').val();
	if (isValidHttpUrl(url)) {
		$('#txtUrl').val('');
		addUrlSection('new', url);
	} else {
		console.log('invalid url');
	}

}

function addUrlSection(id, value) {
	var content = '<div id="' + id + '" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><span class="url-regex">' + value + '<span/></div>';
	$('.list-url .mCSB_container').prepend(content);
}

function isValidHttpUrl(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

function initPopup(config) {
	console.log('Init popup');
	$('#chkStatus').prop('checked', config.isEnable);
	setLabelStatus(config.isEnable);

	$('.list-url .mCSB_container').html('');
	var urls = config.urls;
	for (var i = urls.length - 1; i >= 0; i--) {
		var url = urls[i];
		addUrlSection('index', url);
	};
	$('.settings').hide();
	$('.editor-toggle').removeClass("active");
	$('.settings-' + config.editorType).show();
	$('#' + config.editorType).parent().addClass("active");
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function initialize() {
	console.log('Run init');
	if (isChrome) {
		browser.storage.local.get('config', (results) => {
			loadConfig(results);
		});
	} else {
		var storageSetting = browser.storage.local.get('config');
		storageSetting.then((results) => {
			loadConfig(results);
		}, onError);
	}
}

function loadConfig(results) {
	console.log(results)
	if (results.config) {
		config = results.config;
	}
	initPopup(config);
}

$(window).on('load', function () {
	initialize();
	$(".list-url").mCustomScrollbar({
		theme: "dark",
		scrollbarPosition: "outside"
	});
	$(".editor-toggle").click(function () {
		$(".settings").hide();
		$(".settings-" + $(this).find("input").attr("id")).show();
	});
});
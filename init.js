var isChrome = !browser;
var browser = browser || chrome;
if (window.location.href.indexOf("crx/de") === -1) {
    console.log("Power CRX Editor - Not on CRX DE");
}
execute();

function execute() {
    let isEnable = false;
    browser.storage.local.get('config', (results) => {
        if (results.config) {
            isEnable = results.config.isEnable;
            if (!isEnable) {
                console.log("Power Editor is not enabled...");
                return;
            }
            if (results.config.urls.length <= 0) {
                console.log("No site is allowed.");
                return;
            }
            if (results.config.urls.indexOf(window.location.origin) === -1) {
                console.log("Site is excluded => " + window.location.origin);
                return;
            }
            console.log("Initializing power editor...");

            createElement();
            var require = { paths: { vs: 'monaco-editor' } };
            createEditorCssLink();
            createScript(chrome.runtime.getURL("jquery-3.4.1.min.js"));
            createScript(chrome.runtime.getURL("vs/loader.js"));
            createScript(chrome.runtime.getURL("vs/editor/editor.main.nls.js"));
            createScript(chrome.runtime.getURL("vs/editor/editor.main.js"));
            console.log("Power Editor initialized.");
            createScript(chrome.runtime.getURL("editor.init.js"));

        }
    });
}

function createScript(url) {
    if (url) {
        const script = document.createElement('script');
        script.setAttribute('src', url);
        script.setAttribute('type', "text/javascript");
        document.body.appendChild(script);
    }
}
function createElement() {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('id', 'plugin-prefix');
    input.setAttribute('value', 'chrome-extension://' + chrome.runtime.id + "/");
    document.body.appendChild(input);
}
function createEditorCssLink() {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('data-name', 'vs/editor/editor.main');
    link.setAttribute('href', chrome.runtime.getURL('vs/editor/editor.main.css'));
    document.head.appendChild(link);
}
function initEditor(id, codeMirror, extension) {
    const editor = monaco.editor.create(document.getElementById(id), {
        value: codeMirror.getValue(),
        language: getName(extension),
        automaticLayout: true,
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12
        }
    });
    editor.getModel().onDidChangeContent((event) => {
        codeMirror.setValue(editor.getValue());
    });
}
function executeHook() {
    console.log("Exe hook");
    const editors = document.getElementById("editors");
    if (editors != null && editors.getAttribute("editor-progress") === null) {
        const loader = document.createElement("div");
        loader.setAttribute("class", "loading editor");
        loader.innerHTML = `<div class="progress progress-striped active">
            <div class="bar"></div>
        </div>`;
        editors.prepend(loader);
        editors.setAttribute("editor-progress", "true");
    }
    document.querySelectorAll('.x-tab-strip-closable').forEach(tab => {
        if (tab.id) {
            const editorInitiazed = tab.getAttribute("editor-initialzed");
            if (editorInitiazed === null) {
                document.querySelector('.loading.editor').style.display = 'block';
                const id = tab.id.replace("editors__", "");
                const editorElement = document.getElementById(id);
                const editorHeight = document.getElementById("editors").clientHeight;
                const codeMirror = editorElement.querySelector(".CodeMirror").CodeMirror;
                const container = document.createElement("div");
                container.setAttribute("class", "monaco-container");
                container.id = id + "_container"
                container.style.height = (editorHeight - 57) + "px";
                //Get x-panel-bwrap
                const panelWrap = editorElement.querySelector(".x-panel-bwrap");
                const strip = panelWrap.childNodes[0];
                if (panelWrap.childNodes.length === 3) {
                    panelWrap.childNodes[1].style.display = 'none';
                    panelWrap.childNodes[2].style.display = 'none';
                }
                strip.setAttribute("editor-strip", "");
                strip.parentNode.insertBefore(container, strip.nextSibling);
                const extension = id.split(".")[id.split(".").length - 1];
                if (codeMirror.getValue() != "") {
                    if (typeof monaco !== 'undefined') {
                        initEditor(container.id, codeMirror, extension);
                    }
                    tab.setAttribute("editor-initialzed", "true");
                    document.querySelector('.loading.editor').style.display = 'none';
                } else {
                    tab.setAttribute("editor-initialzed", "");
                }
            } else if (editorInitiazed !== "true") {
                const id = tab.id.replace("editors__", "");
                const editorElement = document.getElementById(id);
                const codeMirror = editorElement.querySelector(".CodeMirror").CodeMirror;
                const extension = id.split(".")[id.split(".").length - 1];
                initEditor(id + "_container", codeMirror, extension);
                tab.setAttribute("editor-initialzed", "true");
                document.querySelector('.loading.editor').style.display = 'none';
            }
            handleResize(tab.id.replace("editors__", "") + "_container");
        }
    });
}
function handleResize(containerId) {
    const codeMirrorContainer = document.getElementById(containerId);
    const parentHeight = codeMirrorContainer.closest(".x-tab-panel-body").clientHeight;
    if(parentHeight - 25 !== codeMirrorContainer.clientHeight) {
        codeMirrorContainer.style.height = (codeMirrorContainer.closest(".x-tab-panel-body").clientHeight - 25) + "px";
        console.log("adjusted");
    }
}

function getName(extension) {
    switch (extension) {
        case 'js': return 'javascript';
    }
    return extension;
}
function waitLoader() {
    const loader = document.getElementById("load-indicator");
    if (loader === null) {
        clearInterval(loaderInterval);
        setInterval(function () {
            executeHook();
        }, 750);
    }
}
var loaderInterval = setInterval(waitLoader, 2000);

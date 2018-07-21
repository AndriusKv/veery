import { removeElement, removeElementClass, getElementByAttr } from "./../utils.js";
import { togglePanel } from "../panels.js";
import { isGoogleAPIInitialized, changeGoogleAuthState, initGoogleAPI } from "../google-auth.js";
import { showDropboxChooser } from "../dropbox.js";
import { selectLocalFiles } from "../local.js";
import { fetchYoutubeItem } from "../youtube.js";
import { getSidebarEntry } from "../sidebar.js";
import { getSyncBtn } from "./playlist.entries.js";

const importOptionsElement = document.getElementById("js-import-options");
let importOption = "";

function setImportOption(option = "") {
    importOption = option;
}

function isNewImportOption(option) {
    return importOption !== option;
}

function changeImportOptionState({ children }, state) {
    Array.from(children).forEach(element => {
        if (element.hasAttribute("data-item")) {
            element.disabled = state;
        }
    });
}

function resetImportOption() {
    setImportOption();
    removeImportForm();
}

function toggleStatusIndicator(id, state) {
    const entry = getSidebarEntry(id);
    const btn = getSyncBtn(id);

    if (entry) {
        entry.classList.toggle("show-spinner", state);
    }

    if (btn) {
        btn.disabled = state;
    }
}

function importPlaylist(option, { url, type }) {
    if (option === "youtube") {
        fetchYoutubeItem(url, type);
    }
}

function createImportForm(container, item) {
    const id = "js-import-form";
    const form = `
        <form id=${id} class="import-form" data-for="${item}">
            <input type="text" name="url" class="input" placeholder="URL" required>
            <button class="btn">Import</button>
        </form>
    `;

    container.insertAdjacentHTML("afterend", form);

    const element = document.getElementById(id);

    element.elements.url.focus();
    element.addEventListener("submit", handleImportFormSubmit);
}

function removeImportForm() {
    const form = document.getElementById("js-import-form");

    if (form) {
        form.removeEventListener("submit", handleImportFormSubmit);
        removeElement(form);
        removeElementClass(".import-option-btn.active", "active");
    }
}

function createImportProgessContainer() {
    importOptionsElement.insertAdjacentHTML("afterend", `
        <div id="js-import-progess" class="import-progess">
            <p id="js-import-progess-label" class="import-progess-label"></p>
            <div class="import-progess-bar">
                <div id="js-import-progess-bar-inner" class="import-progess-bar-inner"></div>
                <div id="js-import-progess-bar-label" class="import-progess-bar-label"></div>
            </div>
        </div>
    `);
}

function removeImportProgessContainer() {
    const element = document.getElementById("js-import-progess");
    element.classList.add("collapsing");
    setImportProgessLabel();

    setTimeout(() => {
        removeElement(element);
    }, 1200);
}

function setImportProgessLabel(label = "") {
    document.getElementById("js-import-progess-label").textContent = label;
}

function updateProgess(label, current, total) {
    setImportProgessLabel(label);
    document.getElementById("js-import-progess-bar-inner").style.transform = `scaleX(${current / total})`;
    document.getElementById("js-import-progess-bar-label").textContent = `${current}/${total}`;
}

function handleChangeOnFileInput({ target }) {
    selectLocalFiles([...target.files]);
    target.value = "";
    target.removeEventListener("change", handleChangeOnFileInput);
    removeElement(target);
}

function createFileInput() {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("id", "js-file-picker");
    input.setAttribute("accept", "audio/*");
    input.classList.add("file-picker");
    input.addEventListener("change", handleChangeOnFileInput);
    document.body.appendChild(input);
    return input;
}

function showFilePicker(item) {
    const filePicker = document.getElementById("js-file-picker") || createFileInput();

    if (item === "file") {
        filePicker.removeAttribute("webkitdirectory");
        filePicker.removeAttribute("directory");
        filePicker.removeAttribute("allowdirs");
        filePicker.setAttribute("multiple", "");
    }
    else if (item === "folder") {
        filePicker.removeAttribute("multiple");
        filePicker.setAttribute("webkitdirectory", "");
        filePicker.setAttribute("directory", "");
        filePicker.setAttribute("allowdirs", "");
    }
    filePicker.click();
}

function handleImportFormSubmit(event) {
    const url = event.target.elements.url.value.trim();

    if (url) {
        const option = event.target.getAttribute("data-for");

        resetImportOption();
        importPlaylist(option, { url });
    }
    event.preventDefault();
}

function createYouTubeInfoPanel(id, { element }) {
    element.insertAdjacentHTML("afterend", `
        <div id="${id}" class="panel info-panel">
            <h3 class="panel-title">Accepted formats</h3>
            <ul>
                <li class="info-panel-content-item">youtube.com/playlist?list={playlistId}</li>
                <li class="info-panel-content-item">youtube.com/watch?v={videoId}</li>
            </ul>
        </div>
    `);
}

function handleYouTubeOptionClick({ attrValue, elementRef }) {
    if (attrValue === "form-toggle") {
        const option = "youtube";

        if (isNewImportOption(option)) {
            elementRef.classList.add("active");
            createImportForm(elementRef, option);
            setImportOption(option);

            if (!isGoogleAPIInitialized()) {
                initGoogleAPI();
            }
        }
        else {
            resetImportOption();
        }
    }
    else if (attrValue === "google-sign-in-or-out") {
        changeGoogleAuthState(elementRef);
    }
    else if (attrValue === "youtube-info") {
        togglePanel(`js-${attrValue}-panel`, createYouTubeInfoPanel, { element: elementRef });
    }
}

importOptionsElement.addEventListener("click", ({ currenTarget, target }) => {
    const element = getElementByAttr("data-item", target, currenTarget);

    if (!element || element.elementRef.disabled) {
        return;
    }
    const { attrValue } = getElementByAttr("data-option", target, currenTarget);

    if (attrValue === "local") {
        showFilePicker(element.attrValue);
    }
    else if (attrValue === "dropbox") {
        showDropboxChooser();
    }
    else if (attrValue === "youtube") {
        handleYouTubeOptionClick(element);
    }
});

window.addEventListener("import", ({ detail }) => {
    const { importing, option, playlistId } = detail;
    const element = document.querySelector(`[data-option=${option}]`);

    changeImportOptionState(element, importing);
    toggleStatusIndicator(playlistId, importing);

    if (option === "local") {
        if (importing) {
            createImportProgessContainer();
        }
        else {
            removeImportProgessContainer();
        }
    }
});

export {
    importPlaylist,
    resetImportOption,
    updateProgess
};

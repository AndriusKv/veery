import { removeElement, getElementByAttr, getImage, shuffleArray } from "../utils.js";
import { editSidebarEntryTitle } from "../sidebar.js";
import { postMessageToWorker } from "../web-worker.js";
import { togglePanel } from "../panels.js";
import { isGoogleAPIInitialized, initGoogleAPI } from "../google-auth.js";
import { getPlaylistById, updatePlaylist, getPlaylistDuration } from "./playlist.js";
import { deletePlaylist } from "./playlist.manage.js";
import { importPlaylist, disableImportOption, resetImportOption } from "./playlist.import.js";

function createContainer(id) {
    document.getElementById("js-tab-home").insertAdjacentHTML("beforeend", `
        <div class="pl-entry-container">
            <h2 class="home-tab-section-title">Playlists</h2>
            <ul id="${id}"></ul>
        </div>
    `);
    const element = document.getElementById(id);

    element.addEventListener("click", handleContainerClick);
    element.addEventListener("focus", handleContainerFocus, true);

    return element;
}

function removeContainer(container) {
    container.removeEventListener("click", handleContainerClick);
    container.removeEventListener("focus", handleContainerFocus, true);
    removeElement(container.parentElement);
}

function getContainer() {
    const id = "js-pl-entries";

    return document.getElementById(id) || createContainer(id);
}

function getSyncBtn(id) {
    const entry = document.querySelector(`[data-entry-id="${id}"]`);

    if (entry) {
        return entry.querySelector("[data-action='sync']");
    }
    return null;
}

function enableSyncBtn(id) {
    const element = getSyncBtn(id);

    if (element) {
        element.disabled = false;
    }
}

function disableSyncBtn(id) {
    const element = getSyncBtn(id);

    if (element) {
        element.disabled = true;
    }
}

function getEntryBtn({ action, title, iconId }) {
    return `
        <button class="btn-icon pl-entry-btn" data-action="${action}" title="${title}">
            <svg viewBox="0 0 24 24">
                <use href="#${iconId}">
            </svg>
        </button>
    `;
}

function getStatusIcon() {
    return `
        <svg viewBox="0 0 24 24" class="pl-entry-stats-item">
            <use href="#lock"></use>
        </svg>
    `;
}

function parsePlaylistDuration(duration) {
    let hours = Math.floor(duration / 3600);
    let minutes = Math.ceil(duration / 60 % 60);

    if (minutes === 60) {
        minutes = 0;
        hours += 1;
    }
    return `${hours} hr ${minutes} min`;
}

function getPlaylistThumbnailContent(tracks) {
    const images = getPlaylistThumbnailImages(tracks);

    return images.map(image => `
        <div class="pl-entry-thumb-image-container">
            <img src="${getImage(image)}" class="pl-entry-thumb-image" alt="">
        </div>
    `).join("");
}

function updatePlaylistStats(entry, tracks) {
    const duration = getPlaylistDuration(tracks);

    entry.querySelector(".track-count").textContent = `${tracks.length} tracks`;
    entry.querySelector(".playlist-duration").textContent = parsePlaylistDuration(duration);
}

function updatePlaylistThumbnail(entry, tracks) {
    const thumbnail = entry.querySelector(".pl-entry-thumbnail");

    thumbnail.innerHTML = getPlaylistThumbnailContent(tracks);
}

function updatePlaylistEntry(id, tracks) {
    const { children } = document.getElementById("js-pl-entries");

    for (const entry of children) {
        if (id === entry.getAttribute("data-entry-id")) {
            updatePlaylistStats(entry, tracks);
            updatePlaylistThumbnail(entry, tracks);
            break;
        }
    }
}

function createPlaylistEntry(pl) {
    const element = getContainer();
    const duration = getPlaylistDuration(pl.tracks);
    const syncBtn = pl.url ? getEntryBtn({
        action: "sync",
        title: "Synchronize playlist",
        iconId: "sync"
    }) : "";
    const settingsPanel = pl.url ? `
        <div class="pl-entry-panel-container">
            ${getEntryBtn({ action: "settings", title: "Settings", iconId: "settings" })}
        </div>
    ` : "";
    const removeBtn = getEntryBtn({
        action: "remove",
        title: "Remove playlist",
        iconId: "trash"
    });

    element.insertAdjacentHTML("beforeend", `
        <li class="pl-entry" data-entry-id=${pl.id}>
            <div class="pl-entry-thumbnail">${getPlaylistThumbnailContent(pl.tracks)}</div>
            <div class="pl-entry-content">
                <div class="pl-entry-input-container" data-action="edit">
                    <input type="text" class="input pl-entry-input" value="${pl.title}">
                    <svg viewBox="0 0 24 24" class="pl-entry-input-icon">
                        <use href="#edit">
                    </svg>
                </div>
                <div class="pl-entry-footer">
                    <div class="pl-entry-stats">
                        ${pl.isPrivate ? getStatusIcon() : ""}
                        <span class="pl-entry-stats-item track-count">${pl.tracks.length} tracks</span>
                        <span class="pl-entry-stats-item playlist-duration">${parsePlaylistDuration(duration)}</span>
                    </div>
                    ${syncBtn}
                    ${settingsPanel}
                    ${removeBtn}
                </div>
            </div>
        </li>
    `);
}

function getPlaylistThumbnailImages(tracks) {
    const placeholder = "assets/images/album-art-placeholder.png";
    const thumbnails = shuffleArray(tracks.map(track => track.thumbnail));
    const images = [];

    for (const thumbnail of thumbnails) {
        if (images.length === 4) {
            break;
        }
        else if (thumbnail !== placeholder) {
            images.push(thumbnail);
        }
    }

    while (images.length < 4) {
        images.push(placeholder);
    }
    return images;
}

function createSettingsPanel(id, { element, pl }) {
    element.insertAdjacentHTML("afterend", `
        <div id="${id}" class="panel pl-entry-panel">
            <h3 class="panel-title">Playlist settings</h3>
            <label class="pl-entry-setting">
                <input type="checkbox" class="checkbox-input" ${pl.syncOnInit ? "checked" : ""}>
                <div class="checkbox"></div>
                <span>Synchronize playlist on startup</span>
            </label>
        </div>
    `);
    document.getElementById(id).addEventListener("change", handleSettingChange);
}

function removePlaylistEntry(element) {
    const { parentElement } = element;

    removeElement(element);

    if (!parentElement.children.length) {
        removeContainer(parentElement);
    }
}

async function syncPlaylists(playlists) {
    if (!playlists.length) {
        return;
    }

    if (!isGoogleAPIInitialized()) {
        playlists.forEach(pl => {
            disableSyncBtn(pl.id);
        });
        await initGoogleAPI();
        playlists.forEach(pl => {
            enableSyncBtn(pl.id);
        });
    }
    resetImportOption();
    disableImportOption("youtube");

    playlists.forEach(({ player, url }) => {
        importPlaylist(player, {
            url,
            type: "sync"
        });
    });
}

function editPlaylistTitle({ currentTarget }) {
    const { attrValue: playlistId } = getElementByAttr("data-entry-id", currentTarget);
    const { _id, title } = getPlaylistById(playlistId);
    const newTitle = currentTarget.value;

    currentTarget.removeEventListener("blur", editPlaylistTitle);
    currentTarget.removeEventListener("keyup", blurEntryInput);

    if (!newTitle) {
        currentTarget.value = title;
        return;
    }

    if (newTitle !== title) {
        editSidebarEntryTitle(playlistId, newTitle);
        updatePlaylist(playlistId, { title: newTitle });
        postMessageToWorker({
            action: "change-title",
            playlist: {
                _id,
                title: newTitle
            }
        });
    }
}

function blurEntryInput({ currentTarget, which }) {
    if (which === 13) {
        currentTarget.blur();
    }
}

function handleContainerClick({ target }) {
    const entry = getElementByAttr("data-entry-id", target);
    const element = getElementByAttr("data-action", target);

    if (!entry || !element || element.elementRef.disabled) {
        return;
    }
    const { attrValue, elementRef } = element;
    const pl = getPlaylistById(entry.attrValue);

    if (attrValue === "remove") {
        deletePlaylist(pl);
        removePlaylistEntry(entry.elementRef);
    }
    else if (attrValue === "sync") {
        syncPlaylists([pl]);
    }
    else if (attrValue === "settings") {
        togglePanel("js-pl-entry-panel", createSettingsPanel, {
            element: elementRef,
            pl
        });
    }
    else if (attrValue === "edit") {
        elementRef.querySelector(".input").focus();
    }
}

function handleContainerFocus({ target }) {
    const element = getElementByAttr("data-action", target);

    if (element && element.attrValue === "edit") {
        target.addEventListener("blur", editPlaylistTitle);
        target.addEventListener("keyup", blurEntryInput);
    }
}

function handleSettingChange({ target }) {
    const { attrValue } = getElementByAttr("data-entry-id", target);
    const pl = getPlaylistById(attrValue);

    pl.syncOnInit = target.checked;

    postMessageToWorker({
        action: "change-sync",
        playlist: {
            _id: pl._id,
            syncOnInit: pl.syncOnInit
        }
    });
}

export {
    createPlaylistEntry,
    enableSyncBtn,
    disableSyncBtn,
    updatePlaylistEntry,
    syncPlaylists
};

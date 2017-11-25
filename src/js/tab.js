import { renderPlaylist, changePlaylistType, togglePlaylistTypeBtn } from "./playlist/playlist.view.js";
import { removeElementClass, getElementById, getElementByAttr } from "./utils.js";
import { getSidebarEntry } from "./sidebar.js";
import { togglePanel } from "./panels.js";
import { getPlaylistById } from "./playlist/playlist.js";
import { updatePlaylistStats } from "./playlist/playlist.entries.js";
import { enableTrackSelection } from "./playlist/playlist.track-selection.js";
import { setSortOptions, createSortPanel, changePlaylistOrder } from "./playlist/playlist.sorting.js";
import { createMoveToPanel } from "./playlist/playlist.move-to.js";
import { resetFilteredPlaylist } from "./playlist/playlist.filter.js";

let visiblePlaylistId = "";

function setVisiblePlaylistId(id = "") {
    visiblePlaylistId = id;
}

function getVisiblePlaylistId() {
    return visiblePlaylistId;
}

function toggleToPlaylistTab(id) {
    const isSmallestBreakpoint = window.innerWidth <= 540;
    const pl = getPlaylistById(id);

    if (!pl.rendered) {
        renderPlaylist(pl);
    }

    if (pl.type === "list" && isSmallestBreakpoint) {
        changePlaylistType("grid", pl);
    }
    else {
        togglePlaylistTypeBtn(pl.type);
    }
    setSortOptions(pl);
    enableTrackSelection(pl);
    resetFilteredPlaylist();
}

getElementById("js-tab-header").addEventListener("click", ({ currentTarget, target }) => {
    const element = getElementByAttr("data-item", target, currentTarget);

    if (element && element.attrValue === "sidebar-toggle") {
        getElementById("js-sidebar-container").classList.remove("hidden");
    }
});

getElementById("js-playlist-tab-header").addEventListener("click", ({ currentTarget, target }) => {
    const element = getElementByAttr("data-item", target, currentTarget);

    if (!element) {
        return;
    }
    const pl = getPlaylistById(getVisiblePlaylistId());
    const item = element.attrValue;

    if (item === "move-to") {
        togglePanel("js-move-to-panel", createMoveToPanel, {
            playlistId: pl.id,
            element: element.elementRef
        });
    }
    else if ((item === "list" || item === "grid") && item !== pl.type) {
        changePlaylistType(item, pl);
    }
    else if (item === "sorting") {
        togglePanel("js-sort-panel", createSortPanel, {
            sortedBy: pl.sortedBy,
            element: element.elementRef
        });
    }
    else if (item === "order" && pl.sortedBy) {
        changePlaylistOrder(pl);
    }
});

window.addEventListener("route-change", ({ detail: { isPlaylistTab, tabId } }) => {
    removeElementClass(".sidebar-entry.active", "active");
    removeElementClass(".tab.active", "active");
    setVisiblePlaylistId(isPlaylistTab ? tabId: "");

    if (isPlaylistTab) {
        toggleToPlaylistTab(tabId);
        getElementById("js-tab-playlist-container").classList.add("active");
        getElementById("js-tab-container").classList.remove("active");
    }
    else {
        updatePlaylistStats();
        getElementById("js-tab-container").classList.add("active");
        getElementById("js-tab-playlist-container").classList.remove("active");
    }
    getElementById(`js-tab-${tabId}`).classList.add("active");
    getSidebarEntry(tabId).classList.add("active");
});

export {
    setVisiblePlaylistId,
    getVisiblePlaylistId
};

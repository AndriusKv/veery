/* global YT */

import * as settings from "./../settings.js";
import * as playlist from "./../playlist/playlist.js";
import * as playlistManage from "./../playlist/playlist.manage.js";
import * as player from "./player.js";

let ytPlayer = null;
window.onYouTubeIframeAPIReady = initPlayer;

function getTime(player) {
    return {
        currentTime: player.getCurrentTime(),
        duration:  player.getDuration()
    };
}

function onPlayerStateChange({ data: currentState }) {
    if (currentState === YT.PlayerState.PLAYING) {
        const track = playlist.getCurrentTrack() || playlist.getNextTrack(0);

        console.log(track);
        setVolume(settings.get("volume"));
        player.onTrackStart(track, getTime(ytPlayer))
        .then(() => {
            const play = ytPlayer.playVideo.bind(ytPlayer);

            player.onTrackEnd(play);
        });
    }
}

function onPlayerReady() {
    playlistManage.initStoredTrack("yt-pl-");
}

function onError(error) {
    console.log(error);
}

function initPlayer() {
    ytPlayer = new YT.Player("yt-player", {
        height: "390",
        width: "640",
        videoId: "",
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError
        }
    });
}

function togglePlaying() {
    const play = ytPlayer.playVideo.bind(ytPlayer);
    const pause = ytPlayer.pauseVideo.bind(ytPlayer);

    player.toggleTrackPlaying(play, pause);
}

function playTrack(track) {
    if (ytPlayer) {
        ytPlayer.loadVideoById(track.id);
        return;
    }
}

function queueTrack(trackId, startTime) {
    ytPlayer.cueVideoById(trackId, startTime);
}

function stopTrack() {
    ytPlayer.stopVideo();
}

function setVolume(volume) {
    ytPlayer.setVolume(volume * 100);
}

function getElapsed(percent) {
    const duration = ytPlayer.getDuration();
    const elapsed = duration / 100 * percent;

    ytPlayer.seekTo(elapsed, true);
    return elapsed;
}

export {
    stopTrack as stop,
    playTrack,
    queueTrack,
    togglePlaying,
    getElapsed,
    setVolume
};

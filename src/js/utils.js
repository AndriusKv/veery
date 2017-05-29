const scriptLoader = (function() {
    const loaded = [];

    function loadScript(attrs) {
        if (loaded.includes(attrs.src)) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            const script = document.createElement("script");

            Object.keys(attrs).forEach(attr => {
                script.setAttribute(attr, attrs[attr]);
            });
            document.getElementsByTagName("body")[0].appendChild(script);
            loaded.push(attrs.src);

            script.onload = resolve;
        });
    }

    return {
        load: loadScript
    };
})();

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function replaceElement(newElement, oldElement) {
    oldElement.parentElement.replaceChild(newElement, oldElement);
}

function removeElement(element) {
    element.parentElement.removeChild(element);
}

function removeElements(elements) {
    elements.forEach(removeElement);
}

function removeElementClass(className, classToRemove) {
    const elements = Array.from(document.querySelectorAll(`.${className}.${classToRemove}`));

    elements.forEach(element => {
        element.classList.remove(classToRemove);
    });
}

function getElementById(id) {
    return document.getElementById(id);
}

function getElementByAttr(element, attr) {
    while (element) {
        const attrValue = element.getAttribute(attr);

        if (attrValue) {
            return {
                elementRef: element,
                attrValue
            };
        }
        element = element.parentElement;
    }
}

function isOutsideElement(element, targetElement) {
    return targetElement ? !targetElement.contains(element) : false;
}

function getSeconds(time) {
    const seconds = time % 60;

    return seconds < 10 ? `0${seconds}` : seconds;
}

function getMinutes(time) {
    const minutes = Math.floor(time / 60 % 60);

    return time >= 3600 && minutes < 10 ? `0${minutes}` : minutes;
}

function getHours(time) {
    const hours = Math.floor(time / 3600);

    return hours ? `${hours}:` : "";
}

function formatTime(time) {
    const seconds = getSeconds(time);
    const minutes = getMinutes(time);
    const hours = getHours(time);

    return `${hours}${minutes}:${seconds}`;
}

function dispatchCustomEvent(eventName, data) {
    let event = null;

    try {
        event = new CustomEvent(eventName, { detail: data });
    }
    catch (error) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, data);
    }
    window.dispatchEvent(event);
}

function getTrackArt(thumbnail = "assets/images/album-art-placeholder.png") {
    return typeof thumbnail === "object" ? URL.createObjectURL(thumbnail) : thumbnail;
}

function setElementIconAndTitle(element, { id, title }) {
    const icon = element.querySelector(".js-icon");

    icon.setAttribute("href", `#${id}`);
    element.setAttribute("title", title);
}

export {
    scriptLoader,
    capitalize,
    getElementById,
    getElementByAttr,
    replaceElement,
    removeElement,
    removeElements,
    removeElementClass,
    formatTime,
    isOutsideElement,
    dispatchCustomEvent,
    getTrackArt,
    setElementIconAndTitle
};

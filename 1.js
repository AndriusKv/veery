webpackJsonp([1],{208:function(r,e,n){"use strict";function t(r){if(Array.isArray(r)){for(var e=0,n=Array(r.length);e<r.length;e++)n[e]=r[e];return n}return Array.from(r)}function o(r){return r[1]<<16|r[2]<<8|r[3]}function i(r,e,n){return new Uint8Array(r.slice(e,e+n))}function a(r){return r[0]|r[1]<<8|r[2]<<16|r[3]<<24}function u(r,e){var n=0,t=new TextDecoder("utf-8"),o=a(r.slice(n,n+4));n+=4,n+=o;var i=a(r.slice(n,n+4));for(n+=4;i;){var u=a(r.slice(n,n+4));n+=4;var f=t.decode(r.slice(n,n+u)),c=f.split("="),l=d(c,2),s=l[0],y=l[1];e[s.toLowerCase()]=y,n+=u,i-=1}return e}function f(r,e){return o(r.slice(e,e+4))}function c(r){return r.reduce(function(r,e){return(r<<8)+e},0)}function l(r,e){var n=4,o=f(r,n);n+=4;var i=r.slice(n,n+o),a=String.fromCharCode.apply(String,t(i));n+=o;var u=f(r,n);n+=4,n+=u,n+=16;var c=f(r,n);return n+=4,e.picture=new Blob([r.slice(n,n+c)],{type:a}),e}function s(r,e,n,a,f){for(var y=!1;!y;){var d=function(){var v=i(e,a,4),d=o(v),p=v[0],m=127&p;if(y=128==(128&p),(a+=4)+d>n)return{v:new Promise(function(e){n+=a+d+4;var t=r.slice(a-4,n),o=new FileReader;o.onloadend=function(r){s(t,r.target.result,n,0,f).then(e)},o.readAsArrayBuffer(t)})};if(0===m){var b=i(e,a,d),h=c(b.slice(10,13))>>4,w=[15&b[13]].concat(t(b.slice(14,18))),A=c(w);h&&(f.duration=Math.floor(A/h))}else if(4===m){var S=i(e,a,d);f=u(S,f)}else if(6===m){var g=i(e,a,d);f=l(g,f)}a+=d}();if("object"===(void 0===d?"undefined":v(d)))return d.v}return Promise.resolve(f)}function y(r){return new Promise(function(e){var n=Math.min(32768,r.size),o=new FileReader;o.onloadend=function(o){var a=o.target.result,u=i(a,0,4);if("fLaC"!==String.fromCharCode.apply(String,t(u)))throw Error("Not a valid flac file.");e(s(r,a,n,4,{}))},o.readAsArrayBuffer(r.slice(0,n))})}Object.defineProperty(e,"__esModule",{value:!0});var v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},d=function(){function r(r,e){var n=[],t=!0,o=!1,i=void 0;try{for(var a,u=r[Symbol.iterator]();!(t=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);t=!0);}catch(r){o=!0,i=r}finally{try{!t&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return r(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();e.default=y}});
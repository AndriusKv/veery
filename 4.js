(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{75:function(e,n,t){"use strict";function r(e,n,t){return new Uint8Array(e,n,t)}function o(e,n){const t=r(e,n,4);return(t[0]<<21)+(t[1]<<14)+(t[2]<<7)+t[3]}function i(e,n,t){const i=r(e,n,4);return 3===t?(i[0]<<24)+(i[1]<<16)+(i[2]<<8)+i[3]:o(e,n)}function c(e,n,t){const o=r(e,n,t),[i]=o;if(0===i){return new TextDecoder("iso-8859-1").decode(o).slice(1)}if(1===i){const e=255===o[1]&&254===o[2]?"utf-16le":"utf-16be",n=new TextDecoder(e),t=o.length%2==0?o.slice(3,-1):o.slice(3);return"utf-16be"===e&&(t[0]=0),n.decode(t)}if(2===i){const e=new TextDecoder("utf-16le"),n=o.length%2==0?o.slice(1,-1):o.slice(1);return e.decode(n)}if(3===i){const e=new TextDecoder("utf-8").decode(o);return 0===o[o.length-1]?e.slice(1,-1):e.slice(1)}return new TextDecoder("iso-8859-1").decode(o)}function u(e,n){const t=String.fromCharCode(...r(e,n,4));return/\w{4}/.test(t)?t:null}function s(e,n){let t=0;for(;e[n];)n+=1,t+=1;return t}function f(e,n,t){let o=1;const i=r(e,n,t),c=s(i,o),u=r(e,n+o,c),f=String.fromCharCode(...u),a=s(i,o+=c+2)+1;return 0===i[(o+=a)+a+1]&&(o+=1),new Blob([i.slice(o)],{type:f})}function a(e,{bitrate:n,sampleRate:t}){const r=(2&e)>0?1:0;return Math.floor(144e3*n/t)+r}function l(e,n){const t=[0,32,48,56,64,80,96,112,128,144,160,176,192,224,256,0],r=[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0],o=[[null,r,r,t],null,[null,r,r,t],[null,[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0],[0,32,48,56,64,80,96,112,128,160,192,224,256,320,384,0],[0,32,64,96,128,160,192,224,256,288,320,352,384,416,448,0]]],i=e[1]>>3&3,c=e[1]>>1&3,u=e[2]>>2&3,s=e[2]>>4&15;return n.sampleRate=[[11025,12e3,8e3],null,[22050,24e3,16e3],[44100,48e3,32e3]][i][u],n.samplesPerFrame=[[384,1152,576],null,[384,1152,576],[384,1152,1152]][i][c],n.bitrate=o[i][c][s],n}function d(e,{samplesPerFrame:n,sampleRate:t}){return Math.floor(e*n/t)}function w(e,n,t){const o=function(e,n){const t=r(e,n,4);return t[0]<<24|t[1]<<16|t[2]<<8|t[3]}(e,n+8);return t.duration=d(o,t),t}function h(e){return{TIT2:"title",TPE1:"artist",TALB:"album",APIC:"picture"}[e]}function m(e,n){return new Promise(t=>{const r=new FileReader,o=n?e.slice(0,Math.min(n,e.size)):e;r.onloadend=function({target:e}){t(e.result)},r.readAsArrayBuffer(o)})}t.r(n),n.default=function(e){return new Promise(n=>{const t=new FileReader,s=Math.min(32768,e.size);t.onloadend=function(t){const s=t.target.result,g=String.fromCharCode(...r(s,0,3)),p=new DataView(s,3,1).getUint8(0);if("ID3"!==g)throw new Error("Can't find ID3v2 tag");if(p<3)throw new Error("Unsupported version");n(async function e(n,t,s,g=0,p={}){const C=g,b=o(t,g+=6)+10;for(g+=4,C+b>t.byteLength&&(t=await m(n,C+b+t.byteLength));;){const o=u(t,g),a=i(t,g+=4,s);g+=4;const[l]=r(t,g+1,2),d=(l>>1)%2!=0;if(g+=2,!o){if(g=C+b,"ID3"===String.fromCharCode(...r(t,g,3)))return e(n,t,s,g,p);break}{const e=h(o);let n=g,r=a;d&&(r=i(t,n,s),n+=4),e&&!p[e]&&(p[e]="picture"===e?f(t,n,r):c(t,n,r))}g+=a}for(;0===new DataView(t,g,1).getUint8(0);)g+=1;let D=0,T=!0;for(;;){const e=r(t,g,4);if(255!==e[0]||e[1]<112)return p.duration=d(D,p),p;if(T){p=l(e,p);const o=36,i=String.fromCharCode(...r(t,g+o,4));if("Xing"===i||"Info"===i)return w(t,g+o,p);t=await m(n),T=!1}D+=1,g+=a(e[2],p)}}(e,s,p))},t.readAsArrayBuffer(e.slice(0,s))})}}}]);
webpackJsonp([1],{27:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(10);t.n(r);function o(e){return e[1]<<16|e[2]<<8|e[3]}function i(e,n,t){return new Uint8Array(e.slice(n,n+t))}function c(e){return e[0]|e[1]<<8|e[2]<<16|e[3]<<24}function s(e,n){let t=0;const r=new TextDecoder("utf-8"),o=c(e.slice(t,t+4));t+=4,t+=o;let i=c(e.slice(t,t+4));for(t+=4;i;){const o=c(e.slice(t,t+4));t+=4;const s=r.decode(e.slice(t,t+o)).split("="),l=s[0],u=s[1];n[l.toLowerCase()]=u,t+=o,i-=1}return n}function l(e,n){return o(e.slice(n,n+4))}function u(e){return e.reduce((e,n)=>(e<<8)+n,0)}function f(e,n){let t=4;const r=l(e,t);t+=4;const o=e.slice(t,t+r),i=String.fromCharCode(...o),c=l(e,t+=r);t+=4,t+=c;const s=l(e,t+=16);return t+=4,n.picture=new Blob([e.slice(t,t+s)],{type:i}),n}n.default=function(e){return new Promise(n=>{const t=Math.min(32768,e.size),r=new FileReader;r.onloadend=function(r){const c=r.target.result,l=i(c,0,4);if("fLaC"!==String.fromCharCode(...l))throw new Error("Not a valid flac file.");n(function e(n,t,r,c,l){let a=!1;for(;!a;){const d=i(t,c,4),w=o(d),h=d[0],m=127&h;if(a=128==(128&h),(c+=4)+w>r)return new Promise(t=>{r+=c+w+4;const o=n.slice(c-4,r),i=new FileReader;i.onloadend=function(n){e(o,n.target.result,r,0,l).then(t)},i.readAsArrayBuffer(o)});if(0===m){const e=i(t,c,w),n=u(e.slice(10,13))>>4,r=u([15&e[13],...e.slice(14,18)]);n&&(l.duration=Math.floor(r/n))}else if(4===m){const e=i(t,c,w);l=s(e,l)}else if(6===m){const e=i(t,c,w);l=f(e,l)}c+=w}return Promise.resolve(l)}(e,c,t,4,{}))},r.readAsArrayBuffer(e.slice(0,t))})}}});
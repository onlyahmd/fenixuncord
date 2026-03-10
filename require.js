// ==UserScript==
// @name Euiz Tools Loader
// @namespace http://tampermonkey.net/
// @version 3.0
// @match https://discord.com/*
// @run-at document-start
// @grant none
// ==/UserScript==

(function () {
'use strict';

const url = "https://cdn.jsdelivr.net/gh/onlyahmd/Fenix-Discord-Tool@main/quest.js?v=1";

const s = document.createElement("script");
s.src = url + "?t=" + Date.now();
s.type = "text/javascript";

document.documentElement.appendChild(s);

console.log("Euiz Tools injected");

})();
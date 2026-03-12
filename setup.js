// ==UserScript==
// @name         Fenix Procord
// @description  Developed By @onlyahmd — All rights reserved 2019 ©
// @version      1.0.0
// @author       @onlyahmd
// @match        https://discord.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://cdn.jsdelivr.net/gh/onlyahmd/fenix@main/procord/icon.png
// @updateURL    https://cdn.jsdelivr.net/gh/onlyahmd/fenix@main/procord/home.js
// @downloadURL  https://cdn.jsdelivr.net/gh/onlyahmd/fenix@main/procord/home.js
// @require      https://cdn.jsdelivr.net/gh/onlyahmd/fenix@main/procord/home.js
// ==/UserScript==

(function() {

'use strict';

console.log('Fenix Procord loaded via @require')

fetch("https://cdn.jsdelivr.net/gh/onlyahmd/fenix@main/procord/home.js")
.then(r => r.text())
.then(code => console.log(code))

})();
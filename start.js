// ==UserScript==
// @name         Private Repo Loader
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

const GITHUB_OWNER = "onlyahmd"
const GITHUB_REPO = "Fenix-Discord-Tool"
const GITHUB_PATH = "quest-home.js"
const GITHUB_TOKEN = "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"

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3.raw"
        },
        onload: function(response) {
            if(response.status === 200){
                // شغل الكود مباشرة
                const code = response.responseText;
                eval(code); 
            } else {
                console.error("Failed to load private repo:", response.status, response.responseText);
            }
        }
    });
})();
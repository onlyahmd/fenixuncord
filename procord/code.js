(function() {

"use strict"

//══════[ Font Setup ]══════

const globalStyle = document.createElement("style")
globalStyle.textContent = `
.fenix-tool *{
font-family:"IBM Plex Sans", sans-serif;
font-weight:bold;
}
`
document.head.appendChild(globalStyle)

//══════[ Toast Container ]══════

const toastContainer = document.createElement("div")
toastContainer.style = "position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:999999;display:flex;flex-direction:column;align-items:center;pointer-events:none;"
document.body.appendChild(toastContainer)

const toastIcons = {
success:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
error:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
}

function showToast(msg, success = true) {
const t = document.createElement("div")
t.innerHTML = `<span style="display:flex;align-items:center;gap:6px;">${success?toastIcons.success:toastIcons.error}<span>${msg}</span></span>`
t.style = "background:#2F3136;color:#FFF;padding:6px 12px;margin:4px 0;border-radius:6px;font-size:13px;font-weight:bold;display:flex;align-items:center;opacity:0;transform:translateY(-6px);transition:all 0.2s ease;"
toastContainer.appendChild(t)
requestAnimationFrame(() => {
t.style.opacity = "1";
t.style.transform = "translateY(0)"; })
setTimeout(() => {
t.style.opacity="0";
t.style.transform="translateY(-8px)";
setTimeout(()=> t.remove(), 2000 )}, 2000 )}

//══════[ Toggle Button (external) ]══════

const toggleBtn = document.createElement("button")
toggleBtn.textContent = "Fenix Procord"
toggleBtn.style = `
position:fixed;
top:15px;
left:50%;
transform:translateX(-50%);
z-index:999999;
padding:8px 16px;
background:#2F3136;
color:#FFF;
font-size:15px;
font-weight:bold;
border:1px solid #FFF;
border-radius:6px;
cursor:pointer;
user-select:none;
transition: all 0.2s ease;
`;
toggleBtn.onmouseenter = () => toggleBtn.style.filter = "brightness(1.1)";
toggleBtn.onmouseleave = () => toggleBtn.style.filter = "brightness(1)";
document.body.appendChild(toggleBtn)

//══════[ Overlay Panel ]══════

const panel = document.createElement("div")
panel.style = `
position:fixed;
font-weight:bold;
top:50px;
left:50%;
transform:translateX(-50%);
z-index:99999;
display:flex;
flex-direction:column;
align-items:center;
padding:14px 18px;
border-radius:12px;
background:#2F3136;
color:#FFF;
text-align:center;
gap:8px;
min-width:320px;
`;
panel.style.display = "none"; 
document.body.appendChild(panel)

//===== Internal Header inside panel =====

const header = document.createElement("div")
header.textContent = "Fenix Procord"
header.style = `
font-size:15px;
font-weight:bold;
color:#FFF;
margin-bottom:6px;
cursor:pointer;
`;
panel.appendChild(header)

//===== Button container & Wrapper & Footer =====

const btnContainer = document.createElement("div")
btnContainer.style = "display:flex;flex-direction:row;gap:8px;justify-content:center;flex-wrap:nowrap;overflow-x:auto;"
panel.appendChild(btnContainer)

const bottomBtnWrapper = document.createElement("div")
bottomBtnWrapper.style = `
display:flex;
justify-content:center;
width:100%;
margin-top:8px;
gap:6px;
`;
panel.appendChild(bottomBtnWrapper)

const footer = document.createElement("div")
footer.style = "font-size:12px;color:#b9bbbe;margin-top:4px;margin-bottom:4px;font-weight:bold;text-align:center;"
footer.innerHTML = `Developed By <a href="https://onlyahmd.github.io/io" target="_blank" style="color:#FFF;text-decoration:none;font-weight:bold;">@onlyahmd</a> — All rights reserved 2019 ©`;
panel.appendChild(footer)

//===== SVG Icons =====

const icons = {
tokens:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
tokenSet:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M1 12h22"/></svg>`,
tokenCopy:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9"/></svg>`,
questRun: `<img src="https://cdn.discordapp.com/emojis/1463601255552385173.png" width="18" height="18" style="object-fit:contain;">`,
login:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`,
delete:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
}

//===== Buttons Helper =====

function createButton(text, color, iconSVG, onClick) {
const btn = document.createElement("button")
btn.innerHTML = `<span style="display:flex;align-items:center;gap:6px;white-space:nowrap;text-align:center;">${iconSVG}<span>${text}</span></span>`
btn.style = `border:1px solid #FFF;outline:none;cursor:pointer;color:#FFF;background:#2F3136;padding:7px 14px;border-radius:6px;font-size:13px;font-weight:bold;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;white-space:nowrap;`
btn.onmouseenter = () => {
if (!btn.disabled) btn.style.filter = "brightness(1.1)" }
btn.onmouseleave = () => {
if (!btn.disabled) btn.style.filter = "brightness(1)" }
btn.onmousedown = () => {
if (!btn.disabled) btn.style.transform = "scale(0.97)" }
btn.onmouseup = () => {
if (!btn.disabled) btn.style.transform = "scale(1)" }
if (onClick) btn.onclick = onClick
return btn }

//===== Tokens Storage =====

const storedTokens = JSON.parse(localStorage.getItem("discordToolTokens") || "[]")
function saveTokens() { localStorage.setItem("discordToolTokens",JSON.stringify(storedTokens))}

//===== Validate Tokens (check active/invalid) =====
async function validateTokens() {
if (storedTokens.length === 0) return;

const validTokens = [];
for (let tokenObj of storedTokens) {
try {
const res = await fetch("https://discord.com/api/v9/users/@me", {
headers: { Authorization: tokenObj.token }
});
if (res.ok) validTokens.push(tokenObj)
} catch {}
}

if (validTokens.length !== storedTokens.length) {
storedTokens.length = 0;
storedTokens.push(...validTokens);
saveTokens();
showToast("تم حذف التوكنات منتهية الصلاحية", true);
}
}

//===== Token List =====

let tokenListContainer = null
function createTokenList() {
validateTokens().then(() => {
if (storedTokens.length === 0 ) {
showToast("قائمة التوكنات فارغة", false)
return }
if (tokenListContainer) {
validateTokens()
tokenListContainer.remove()
tokenListContainer = null;
return }
tokenListContainer = document.createElement("div")
tokenListContainer.style = "display:flex;flex-direction:column;gap:4px;max-height:150px;overflow-y:auto;width:100%;background:#2F3136;padding:4px 6px;border-radius:6px;border:1px solid #FFF;"

storedTokens.forEach((tokenObj, idx) => {
let item = document.createElement("div")
item.style = "display:flex;align-items:center;justify-content:space-between;padding:4px 6px;background:#202225;border-radius:6px;gap:16px;"

let avatar = document.createElement("img")
avatar.src = tokenObj.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"
avatar.style = "width:28px;height:28px;border-radius:50%;flex-shrink:0;"

let username = document.createElement("span")
username.textContent = (tokenObj.username || "Unknown")
username.style = "flex:1;font-size:13px;color:#FFF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:6px;font-weight:bold;display:block;"

let btnLogin = document.createElement("button")
btnLogin.innerHTML = icons.login
btnLogin.style = "border:none;background:none;cursor:pointer;"
btnLogin.title = "Login"
btnLogin.onclick = () => {
try {
document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token = `"${tokenObj.token}"`
showToast(`${tokenObj.username} تم تسجيل الدخول إلى`, true)
setTimeout(() => location.reload(), 1000)
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}}

let btnCopy = document.createElement("button")
btnCopy.innerHTML = icons.tokenCopy
btnCopy.style = "border:none;background:none;cursor:pointer;"
btnCopy.title = "Copy Token"
btnCopy.onclick = () => {
navigator.clipboard.writeText(tokenObj.token)
.then(() => showToast(`من القائمة ${tokenObj.username} تم نسخ توكن`, true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))}

let btnDelete = document.createElement("button")
btnDelete.innerHTML = icons.delete
btnDelete.style = "border:none;background:none;cursor:pointer;"
btnDelete.title = "Delete"
btnDelete.onclick =() => {
storedTokens.splice(idx, 1)
saveTokens()
tokenListContainer.remove()
tokenListContainer = null
createTokenList()
showToast(`من القائمة ${tokenObj.username} تم حذف توكن`, true)}

item.appendChild(avatar)
item.appendChild(username)
item.appendChild(btnLogin)
item.appendChild(btnCopy)
item.appendChild(btnDelete)
tokenListContainer.appendChild(item)})
panel.appendChild(tokenListContainer)})}

//===== Buttons inside panel =====

btnContainer.appendChild(createButton("Tokens", "#2F3136", icons.tokens, () => { createTokenList()}))

btnContainer.appendChild(createButton("Add Token", "#2F3136", icons.tokenSet, () => {
const token = prompt("Enter Your Discord Token :")
if (!token) {
showToast("لم يتم إدخال أي توكن", false);
return;
}
try {
document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token = `"${token}"`

fetch("https://discord.com/api/v9/users/@me", {
headers: { Authorization: token }
})
.then(async (res) => {
if (!res.ok) {
showToast("التوكن غير صالح أو منتهي الصلاحية", false);
return;
}

const data = await res.json();

const exists = storedTokens.some(t => t.token === token);
if (exists) {
showToast("التوكن محفوظ بالقائمة من قبل", false);
return;
}

storedTokens.push({
token: token,
username: data.username,
avatar: data.avatar
? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
: "https://cdn.discordapp.com/embed/avatars/0.png"
});

saveTokens();
showToast("تم حفظ التوكن بنجاح", true);
})
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}
}))

btnContainer.appendChild(createButton("Copy Token", "#2F3136", icons.tokenCopy, () => {
try {
const token = document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token?.replace(/^"|"$/g,"")
if (!token) {
showToast("لم يتم العثور على أي توكن", false)
return }
navigator.clipboard.writeText(token)
.then(() => showToast("تم نسخ التوكن بنجاح", true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}}))

//===== Validate Key =====
async function validateKey(input) {
try {
const res = await fetch("https://raw.githubusercontent.com/onlyahmd/keys/main/keys.json");
const data = await res.json();
return data.keys.some(k => k.code === input);
} catch (error) {
console.error("حدث خطأ أثناء تنفيذ الأمر", error);
return false;
}
}

//===== Global Access Key Box (Reusable) =====
let globalKeyBox = null;

function requestAccessKey(onSuccess) {
if (globalKeyBox) {
globalKeyBox.remove();
globalKeyBox = null;
return;
}

globalKeyBox = document.createElement("div");
globalKeyBox.id = "global-access-key-box";
globalKeyBox.style = `
background:#202225;
border:1px solid #FFF;
padding:12px;
border-radius:8px;
display:flex;
flex-direction:column;
gap:8px;
width:100%;
`;

globalKeyBox.innerHTML = `
<div style="font-size:13px;color:#FFF;">
Enter Access Key
</div>
<input type="password" id="global-access-key-input"
maxlength="100"
style="
width:100%;
padding:6px;
border-radius:6px;
border:1px solid #444;
background:#111;
color:#FFF;
outline:none;
font-size:13px;
text-align:center;
box-sizing:border-box;
">
<button id="global-access-key-btn" style="
padding:6px;
border-radius:6px;
border:1px solid #FFF;
background:#2F3136;
color:#FFF;
cursor:pointer;
font-size:13px;
">
Confirm
</button>
`;

panel.appendChild(globalKeyBox);

document.getElementById("global-access-key-btn").onclick = async () => {
const input = document.getElementById("global-access-key-input").value.trim();

if (!input) return showToast("لم يتم إدخال أي كلمة مرور", false);

const valid = await validateKey(input);

if (!valid) {
return showToast("كلمة مرور خاطئة أو غير صالحة", false);
}

showToast("تم التحقق من المفتاح بنجاح", true);
globalKeyBox.remove();
globalKeyBox = null;

if (typeof onSuccess === "function") {
onSuccess();
}
};
}

//===== Run Quest Button with Key =====
const runQuestBtn = createButton("Run Quest", "#2F3136", icons.questRun, () => {
requestAccessKey(() => {
chrome.runtime.sendMessage({ action: "executeQuestCode" }, (response) => {
if (chrome.runtime.lastError) {
showToast("حدث خطأ أثناء تنفيذ الأمر", false);
} else if (response && response.success) {
showToast("تم تنفيذ الكود بنجاح", true);
} else {
showToast("حدث خطأ أثناء تنفيذ الأمر", false);
}
});
});
})

btnContainer.appendChild(runQuestBtn);


//===== New Quest List Expand Button (زر السهم الجديد) =====

let questListExpanded = false;
let questListPanel = null;

const expandQuestBtn = createButton(
"",
"#2F3136",
'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
() => {
if (!questListPanel) {
questListPanel = document.createElement("div")
questListPanel.style = `
display:flex;
flex-direction:column;
gap:4px;
max-height:150px;
overflow-y:auto;
width:100%;
background:#2F3136;
padding:4px 6px;
border-radius:6px;
border:1px solid #FFF;
`;
panel.appendChild(questListPanel)}

questListExpanded = !questListExpanded;
questListPanel.style.display = questListExpanded ? "flex" : "none";

const svg = expandQuestBtn.querySelector("svg")
if (svg) svg.style.transform = questListExpanded ? "rotate(180deg)" : "rotate(0deg)";
if (svg) svg.style.transition = "transform 0.2s ease";
})

expandQuestBtn.innerHTML = expandQuestBtn.innerHTML.replace(/<span>\s*<\/span>/, "")
expandQuestBtn.style.justifyContent = "center";

btnContainer.appendChild(expandQuestBtn)


//===== HypeSquad Button داخل الـ wrapper =====
/*
const hypeSquadBtn1 = createButton(
"",
"#2F3136",
'<img src="https://cdn.discordapp.com/emojis/1332346706431316039.png" width="18" height="18" style="object-fit:contain;">',
() => {
requestAccessKey(() => {
try {
fetch("https://discord.com/api/v9/hypesquad/online", {
method: "POST",
headers: {
"Authorization": document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token.replace(/^"|"$/g,""),
"Content-Type": "application/json"
},
body: JSON.stringify({ house_id: 1 })
})
.then(() => showToast("تم تفعيل الشارة بنجاح", true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}})})
hypeSquadBtn1.innerHTML = hypeSquadBtn1.innerHTML.replace(/<span>\s*<\/span>/, "")
hypeSquadBtn1.style.justifyContent = "center";
bottomBtnWrapper.appendChild(hypeSquadBtn1)

const hypeSquadBtn2 = createButton(
"",
"#2F3136",
'<img src="https://cdn.discordapp.com/emojis/1332346710067904593.png" width="18" height="18" style="object-fit:contain;">',
() => {
requestAccessKey(() => {
try {
fetch("https://discord.com/api/v9/hypesquad/online", {
method: "POST",
headers: {
"Authorization": document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token.replace(/^"|"$/g,""),
"Content-Type": "application/json"
},
body: JSON.stringify({ house_id: 2 })
})
.then(() => showToast("تم تفعيل الشارة بنجاح", true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}})})
hypeSquadBtn2.innerHTML = hypeSquadBtn2.innerHTML.replace(/<span>\s*<\/span>/, "")
hypeSquadBtn2.style.justifyContent = "center";
bottomBtnWrapper.appendChild(hypeSquadBtn2)

const hypeSquadBtn3 = createButton(
"",
"#2F3136",
'<img src="https://cdn.discordapp.com/emojis/1332346724450304021.png" width="18" height="18" style="object-fit:contain;">',
() => {
requestAccessKey(() => {
try {
fetch("https://discord.com/api/v9/hypesquad/online", {
method: "POST",
headers: {
"Authorization": document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token.replace(/^"|"$/g,""),
"Content-Type": "application/json"
},
body: JSON.stringify({ house_id: 3 })
})
.then(() => showToast("تم تفعيل الشارة بنجاح", true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}})})
hypeSquadBtn3.innerHTML = hypeSquadBtn3.innerHTML.replace(/<span>\s*<\/span>/, "")
hypeSquadBtn3.style.justifyContent = "center";
bottomBtnWrapper.appendChild(hypeSquadBtn3)

const hypeSquadBtn0 = createButton(
"",
"#2F3136",
`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
() => {
requestAccessKey(() => {
try {
fetch("https://discord.com/api/v9/hypesquad/online", {
method: "DELETE",
headers: {
"Authorization": document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token.replace(/^"|"$/g,""),
"Content-Type": "application/json"
}
})
.then(() => showToast("تم حذف الشارة بنجاح", true))
.catch(() => showToast("حدث خطأ أثناء تنفيذ الأمر", false))
} catch {
showToast("حدث خطأ أثناء تنفيذ الأمر", false)}})})
hypeSquadBtn0.innerHTML = hypeSquadBtn0.innerHTML.replace(/<span>\s*<\/span>/, "")
hypeSquadBtn0.style.justifyContent = "center";
bottomBtnWrapper.appendChild(hypeSquadBtn0)
*/
//===== Quest Cache & UI =====

const questStateCache = new Map()

function updateQuestItemUI(container, quest) {

if (!container) return;

let item = document.getElementById(`quest-item-${quest.id}`)

if (!item) {

item = document.createElement("div")
item.id = `quest-item-${quest.id}`;
item.style = `
display:flex;
align-items:center;
justify-content:space-between;
padding:4px 6px;
background:#202225;
border-radius:6px;
gap:8px;
font-size:13px;
`;
item.innerHTML = `
<span style="flex:1;font-size:13px;color:#FFF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${quest.name}">${quest.name}</span>
<span id="quest-progress-${quest.id}" style="font-family:monospace;color:#aaa;font-size:12px;"></span>
`;
container.appendChild(item)
}
const progressSpan = item.querySelector(`#quest-progress-${quest.id}`)
if (progressSpan) {
progressSpan.textContent = quest.completed ? "DONE" : `${quest.progress}/${quest.target}`;
progressSpan.style.color = quest.completed ? "#00FF00" : "#FFF";
item.style.opacity = quest.completed ? "0.5" : "1";
}
}

//===== Listen for Quest Messages =====

window.addEventListener("message", ({source,data}) => {
if (source !== window || !data || data.prefix !== "DISCORD_QUEST_COMPLETER") return;
if (data.type === "QUEST_LIST") {
questStateCache.clear()
data.data.forEach(q => questStateCache.set(q.id,q))
if (questListPanel) {
questListPanel.innerHTML = "";
data.data.forEach(q => updateQuestItemUI(questListPanel, q))}
} else if (data.type === "QUEST_UPDATE") {
questStateCache.set(data.data.id,data.data)
if (questListPanel) updateQuestItemUI(questListPanel, data.data)}})

//===== Show panel when toggleBtn is clicked =====

toggleBtn.onclick = () => {
toggleBtn.style.display = "none"; 
panel.style.display = "flex"; 
}

//===== Close panel when clicking internal header =====

header.onclick = () => {
panel.style.display = "none";
toggleBtn.style.display = "block"; 
}

panel.classList.add("fenix-tool")
toggleBtn.classList.add("fenix-tool")
toastContainer.classList.add("fenix-tool")

})();
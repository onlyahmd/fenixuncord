(function() {
'use strict';

// ========================================
// ⚙️ SETTINGS PANEL
// ========================================
/*
هذه الإعدادات تتحكم في سلوك السكريبت:
- VIDEO_INTERVAL_MS: الفترة الزمنية بين تحديث كل مهمة فيديو (ميلي ثانية)
- HEARTBEAT_INTERVAL_MS: الفترة الزمنية بين heartbeat (ميلي ثانية)
- VIDEO_SPEED: مقدار التقدم الثابت لكل خطوة في مهام الفيديو
*/
const SETTINGS = {
VIDEO_INTERVAL_MS: 1000,
HEARTBEAT_INTERVAL_MS: 1000,
VIDEO_SPEED: 10
};

// ========================================
// 1️⃣ UTILITY: Wait for Webpack
// ========================================
function waitForWebpack(callback) {
const checkInterval = 100;
const maxAttempts = 100;
let attempts = 0;

const check = () => {
if (attempts >= maxAttempts) {
console.error('%c[ Discord Extension ] Failed to load webpack after multiple attempts.', 'color:red;font-weight:bold;');
return;
}
if (typeof window.webpackChunkdiscord_app === 'undefined') {
attempts++;
setTimeout(check, checkInterval);
return;
}

try {
const originalJQuery = window.$;
delete window.$;

const webpackRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
window.webpackChunkdiscord_app.pop();

if (originalJQuery) window.$ = originalJQuery;
if (!webpackRequire || !webpackRequire.c || Object.keys(webpackRequire.c).length < 10) {
attempts++;
setTimeout(check, checkInterval);
return;
}

console.info(`%c[ Discord Extension ] Webpack loaded with ${Object.keys(webpackRequire.c).length} modules.`, 'color:green;font-weight:bold;');
callback(webpackRequire);
} catch (error) {
console.error('%c[ Discord Extension ] Error accessing webpack:', 'color:red;font-weight:bold;', error);
attempts++;
setTimeout(check, checkInterval);
}
};

check();
}

// ========================================
// 2️⃣ UTILITY: Find Module
// ========================================
function findModule(webpackRequire, filter) {
const modules = Object.values(webpackRequire.c);
for (const module of modules) {
if (!module || !module.exports) continue;
if (module.exports.A && filter(module.exports.A)) return module.exports.A;
if (module.exports.Ay && filter(module.exports.Ay)) return module.exports.Ay;
if (filter(module.exports)) return module.exports;
}
return null;
}

// ========================================
// 3️⃣ Send Update to UI
// ========================================
function sendUpdate(type, data) {
window.postMessage({ prefix:'DISCORD_QUEST_COMPLETER', type, data }, '*');
}

// ========================================
// 4️⃣ Load Discord Stores
// ========================================
function loadStores(webpackRequire) {
try {
const ApplicationStreamingStore = findModule(webpackRequire, m => m.__proto__?.getStreamerActiveStreamMetadata);
const RunningGameStore = findModule(webpackRequire, m => m.getRunningGames);
const QuestsStore = findModule(webpackRequire, m => m.__proto__?.getQuest);
const ChannelStore = findModule(webpackRequire, m => m.__proto__?.getAllThreadsForParent);
const GuildChannelStore = findModule(webpackRequire, m => m.getSFWDefaultChannel);
const FluxDispatcher = findModule(webpackRequire, m => m.h?.__proto__?.flushWaitQueue)?.h;
const api = findModule(webpackRequire, m => m.Bo?.get)?.Bo;

if (!ApplicationStreamingStore || !RunningGameStore || !QuestsStore || !ChannelStore || !GuildChannelStore || !FluxDispatcher || !api) {
const missing = [];
if (!ApplicationStreamingStore) missing.push('ApplicationStreamingStore');
if (!RunningGameStore) missing.push('RunningGameStore');
if (!QuestsStore) missing.push('QuestsStore');
if (!ChannelStore) missing.push('ChannelStore');
if (!GuildChannelStore) missing.push('GuildChannelStore');
if (!FluxDispatcher) missing.push('FluxDispatcher');
if (!api) missing.push('api');
throw new Error(`Could not find stores: ${missing.join(',')}`);
}

return { ApplicationStreamingStore, RunningGameStore, QuestsStore, ChannelStore, GuildChannelStore, FluxDispatcher, api };
} catch (error) {
console.error('%c[ Discord Extension ] Error loading stores:', 'color:red;font-weight:bold;', error);
return null;
}
}

// ========================================
// 5️⃣ Get Active Quests
// ========================================
function getActiveQuests(QuestsStore) {
const supportedTasks = ["WATCH_VIDEO","PLAY_ON_DESKTOP","STREAM_ON_DESKTOP","PLAY_ACTIVITY","WATCH_VIDEO_ON_MOBILE"];
return [...QuestsStore.quests.values()].filter(q => {
const isExpired = new Date(q.config.expiresAt).getTime() <= Date.now();
const isCompleted = !!q.userStatus?.completedAt;
const isEnrolled = !!q.userStatus?.enrolledAt;
const taskConfig = q.config.taskConfig ?? q.config.taskConfigV2;
const hasSupportedTask = supportedTasks.some(t => taskConfig.tasks[t] !== null);
return isEnrolled && !isCompleted && !isExpired && hasSupportedTask;
});
}

// ========================================
// 6️⃣ Initialize Quest State
// ========================================
function initializeQuestState(quest) {
const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
const supportedTasks = ["WATCH_VIDEO","PLAY_ON_DESKTOP","STREAM_ON_DESKTOP","PLAY_ACTIVITY","WATCH_VIDEO_ON_MOBILE"];
const taskType = supportedTasks.find(t => taskConfig.tasks[t] !== undefined && taskConfig.tasks[t] !== null);
const secondsNeeded = taskConfig.tasks[taskType]?.target ?? 0;
const currentProgress = quest.userStatus?.progress?.[taskType]?.value ?? quest.userStatus?.streamProgressSeconds ?? 0;

return {
quest,
taskType,
secondsNeeded,
currentProgress,
completed: currentProgress >= secondsNeeded,
lastUpdate: 0,
enrolledAt: new Date(quest.userStatus.enrolledAt).getTime(),
questName: quest.config.messages.questName
};
}

// ========================================
// 7️⃣ Video Quest Step (تصحيح التقدم الحقيقي)
// ========================================
async function processVideoStep(state, api) {
try {
// إرسال التقدم للسيرفر والحصول على الرد الحقيقي
const res = await api.post({ url:`/quests/${state.quest.id}/video-progress`, body:{ timestamp: Math.min(state.secondsNeeded,state.currentProgress+SETTINGS.VIDEO_SPEED) }});

// تحديث التقدم حسب الرد من السيرفر
state.currentProgress = res.body?.progress?.WATCH_VIDEO?.value ?? state.currentProgress + SETTINGS.VIDEO_SPEED;
if (state.currentProgress >= state.secondsNeeded) state.completed = true;

console.log(`%c[Video Quest] "${state.questName}" Progress: ${Math.floor(state.currentProgress)}/${state.secondsNeeded}s`,"color:green;font-weight:bold;");

// تحديث واجهة المستخدم
sendUpdate('QUEST_UPDATE',{
id: state.quest.id,
name: state.questName,
progress: Math.floor(state.currentProgress),
target: state.secondsNeeded,
completed: state.completed
});

if (state.completed) {
console.log(`%c[Video Quest Completed] "${state.questName}" ✅`,"color:yellow;font-weight:bold;");
}

} catch(error) {
console.error(`%c[Video Quest Error] "${state.questName}"`,"color:red;font-weight:bold;",error);
}
}

// ========================================
// 8️⃣ Heartbeat Quest Step
// ========================================
async function processHeartbeatStep(state, stores) {
const { api, ChannelStore, GuildChannelStore } = stores;
const { quest, taskType, secondsNeeded, questName } = state;

let streamKey = `call:${quest.id}:1`;
if (taskType==="PLAY_ACTIVITY") {
const channelId = getVoiceChannelId(ChannelStore,GuildChannelStore);
if (channelId) streamKey=`call:${channelId}:1`;
else { console.warn(`%c[Heartbeat] No voice channel for "${questName}"`,'color:orange;font-weight:bold;'); return; }
}

try {
// إرسال heartbeat للسيرفر والحصول على التقدم الفعلي
const res = await api.post({url:`/quests/${quest.id}/heartbeat`,body:{stream_key:streamKey,terminal:state.completed}});
const serverProgress = res.body?.progress?.[taskType]?.value ?? state.currentProgress;
state.currentProgress = serverProgress;
if (state.currentProgress>=secondsNeeded) state.completed = true;

console.log(`%c[Heartbeat Quest] "${questName}" Progress: ${Math.floor(state.currentProgress)}/${secondsNeeded}s`,'color:blue;font-weight:bold;');

// تحديث واجهة المستخدم
sendUpdate('QUEST_UPDATE',{
id: state.quest.id,
name: state.questName,
progress: Math.floor(state.currentProgress),
target: secondsNeeded,
completed: state.completed
});

if (state.completed) {
await api.post({url:`/quests/${quest.id}/heartbeat`,body:{stream_key:streamKey,terminal:true}});
console.log(`%c[Heartbeat Quest Completed] "${questName}" ✅`,'color:yellow;font-weight:bold;');

sendUpdate('QUEST_UPDATE',{
id: state.quest.id,
name: state.questName,
progress: secondsNeeded,
target: secondsNeeded,
completed: true
});
}

} catch(error) {
console.error(`%c[Heartbeat Quest Error] "${questName}"`,'color:red;font-weight:bold;',error);
}
}

// ========================================
// 9️⃣ Helper: Get Voice Channel ID
// ========================================
function getVoiceChannelId(ChannelStore,GuildChannelStore) {
const privateChannels = ChannelStore.getSortedPrivateChannels();
if (privateChannels[0]?.id) return privateChannels[0].id;

const guilds = Object.values(GuildChannelStore.getAllGuilds());
const guildWithVoice = guilds.find(g=>g?.VOCAL?.length>0);
if (guildWithVoice) return guildWithVoice.VOCAL[0].channel.id;

return null;
}

// ========================================
// 🔟 Main Quest Runner
// ========================================
async function runQuestCode(webpackRequire) {
const stores = loadStores(webpackRequire);
if (!stores) return;

const activeQuests = getActiveQuests(stores.QuestsStore);
if (!activeQuests.length) return;

const questStates = activeQuests.map(initializeQuestState);

sendUpdate('QUEST_LIST',questStates.map(s=>({
id: s.quest.id,
name: s.questName,
progress: Math.floor(s.currentProgress),
target: s.secondsNeeded,
completed: s.completed
})));

const videoStates = questStates.filter(s=>s.taskType.startsWith("WATCH_VIDEO"));
const heartbeatStates = questStates.filter(s=>!s.taskType.startsWith("WATCH_VIDEO"));

// ===== Video Quests Loop =====
const videoPromise = (async() => {
let running = true;
while(running && videoStates.length>0) {
for(const state of videoStates) if (!state.completed) await processVideoStep(state,stores.api);
if (videoStates.every(s=>s.completed)) running=false;
await new Promise(r=>setTimeout(r,SETTINGS.VIDEO_INTERVAL_MS));
}
})();

// ===== Heartbeat Quests Loop =====
const heartbeatPromise = (async() => {
let running = true;
while(running && heartbeatStates.length>0) {
for(const state of heartbeatStates) if (!state.completed) await processHeartbeatStep(state,stores);
if (heartbeatStates.every(s=>s.completed)) running=false;
await new Promise(r=>setTimeout(r,SETTINGS.HEARTBEAT_INTERVAL_MS));
}
})();

await Promise.all([videoPromise,heartbeatPromise]);
}

// ========================================
// 🚀 START SCRIPT
// ========================================
waitForWebpack(runQuestCode);

})();
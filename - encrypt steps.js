//══════[ Integrity Check ]══════
crx3 -o fenix-extension.crx .
/*
هذا الجزء يتحقق إذا الكود الأصلي تم تعديله أو التلاعب به بعد نشره.
يأخذ كل النص الموجود في السكربت.
يحسب SHA-256 hash للكود.
يقارن الهَاش مع الهَاش الأصلي اللي انت تحدده.
لو مختلف → يعني حد عبث بالكود، فيظهر تنبيه والكود يتوقف.
*/
const fs = require("fs");
const crypto = require("crypto");

const filePath = "background.js"; // غيّر لملفك
const fileBuffer = fs.readFileSync(filePath);
const hashSum = crypto.createHash("sha256");
hashSum.update(fileBuffer);

const hex = hashSum.digest("hex");
console.log("SHA256 Hash:", hex);

const ORIGINAL_HASH = "ضع هنا SHA256 النهائي بعد Obfuscation";
(async function verifyIntegrity() {
const scriptText = document.currentScript.textContent;
const encoder = new TextEncoder();
const data = encoder.encode(scriptText);
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,"0")).join("");
if(hashHex !== ORIGINAL_HASH) {
alert("تم التلاعب بالكود!");
throw new Error("Code modified");
}
})();

//══════[ Anti-Debug / Self-Defending ]══════

// هذا الجزء يراقب إذا حد فتح DevTool أو حاول يوقف الكود بال debugger

(function antiDebug() {
const threshold = 160;
function detectDevTools() {
if(window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold){
alert("Debugging detected!");
throw new Error("Debugging detected");
}
}
setInterval(detectDevTools, 1000);
})();
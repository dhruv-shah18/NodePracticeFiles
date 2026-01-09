require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

console.log("--- DEBUG ENV ---");
if (!key) {
    console.log("❌ GEMINI_API_KEY is undefined");
} else {
    console.log(`✅ GEMINI_API_KEY found.`);
    console.log(`   Length: ${key.length}`);
    // Check for whitespace
    if (key.trim() !== key) {
        console.log("⚠️  WARNING: Key has leading/trailing whitespace!");
    }
}
console.log("-----------------");

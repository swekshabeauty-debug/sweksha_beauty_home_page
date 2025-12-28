
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
const envPath = path.join(__dirname, '.env.local');

try {
    const serviceAccount = fs.readFileSync(serviceAccountPath, 'utf8');
    // Minify JSON to single line
    const minified = JSON.stringify(JSON.parse(serviceAccount));

    // Prepare the new line
    const newLine = `\nFIREBASE_SERVICE_ACCOUNT_KEY='${minified}'\n`;

    // Append to .env.local
    fs.appendFileSync(envPath, newLine);

    console.log('Successfully appended FIREBASE_SERVICE_ACCOUNT_KEY to .env.local');
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}

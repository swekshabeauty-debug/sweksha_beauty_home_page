
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
            envVars[key] = value;
        }
    });
}

console.log("SECRET:" + (envVars['NEXTAUTH_SECRET'] ? "OK" : "MISSING"));
console.log("URL:" + (envVars['NEXTAUTH_URL'] ? "OK" : "MISSING"));
console.log("GID:" + (envVars['GOOGLE_CLIENT_ID'] ? "OK" : "MISSING"));

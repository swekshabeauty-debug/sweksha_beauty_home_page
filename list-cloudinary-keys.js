

const dotenv = require('dotenv');
const fs = require('fs');

function checkFile(filename) {
    if (fs.existsSync(filename)) {
        console.log(`Checking ${filename}...`);
        const envConfig = dotenv.parse(fs.readFileSync(filename));
        Object.keys(envConfig).forEach(key => {
            if (key.includes('CLOUDINARY')) {
                console.log(`${key}: ${envConfig[key] ? '****' + envConfig[key].slice(-4) : 'Empty'}`);
            }
        });
    } else {
        console.log(`${filename} does not exist.`);
    }
}

console.log('--- Cloudinary Variable Scan ---');
checkFile('.env.local');
checkFile('.env');
console.log('--------------------------------');


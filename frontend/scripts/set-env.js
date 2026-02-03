const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');

const envConfigFile = `
export const environment = {
  production: false,
  apiUrl: '${envConfig.BACKEND_URL || 'http://localhost:5238'}'
};
`;

// Ensure directory exists
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfigFile);

console.log(`Output generated at ${targetPath}`);

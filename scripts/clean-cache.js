const fs = require('fs');
const path = 'c:/Users/desha/Documents/SE/My_Projects/desh-edu-hub/.next';

try {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true });
    console.log('Successfully cleaned .next cache directory!');
  } else {
    console.log('.next directory does not exist or already clean.');
  }
} catch (e) {
  console.log('Notice cleaning .next:', e.message);
}


// Script to verify environment variables in build
// Run this script after building your frontend to check if environment variables are correctly set

import fs from 'fs';
import path from 'path';

// Path to the built JavaScript files
const distPath = path.join(process.cwd(), 'dist');
const assetsPath = path.join(distPath, 'assets');

console.log('Checking environment variables in build...');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Dist directory not found. Please build your project first with "npm run build"');
  process.exit(1);
}

// Find JavaScript files in the assets directory
let jsFiles = [];
if (fs.existsSync(assetsPath)) {
  jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));
}

// Also check the root of dist directory
const rootJsFiles = fs.readdirSync(distPath).filter(file => file.endsWith('.js'));
jsFiles = [...jsFiles, ...rootJsFiles];

if (jsFiles.length === 0) {
  console.error('❌ No JavaScript files found in dist directory');
  process.exit(1);
}

console.log(`Found ${jsFiles.length} JavaScript files`);

// Check each JavaScript file for environment variable usage
let foundEnvUsage = false;
for (const jsFile of jsFiles) {
  // Determine the correct path for the file
  let filePath;
  if (fs.existsSync(path.join(assetsPath, jsFile))) {
    filePath = path.join(assetsPath, jsFile);
  } else if (fs.existsSync(path.join(distPath, jsFile))) {
    filePath = path.join(distPath, jsFile);
  } else {
    continue; // Skip if file doesn't exist
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    if (fileContent.includes('VITE_API_URL') || fileContent.includes('import.meta.env')) {
      console.log(`✅ Found environment variable usage in ${jsFile}`);
      foundEnvUsage = true;
      
      // Show some context around the usage
      const lines = fileContent.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('VITE_API_URL') || lines[i].includes('import.meta.env')) {
          console.log(`  Line ${i + 1}: ${lines[i].trim()}`);
          // Show a few lines of context
          for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) {
            const prefix = j === i ? '  >>> ' : '      ';
            console.log(`${prefix}${lines[j].trim()}`);
          }
          break;
        }
      }
      break;
    }
  } catch (error) {
    console.warn(`⚠️  Could not read file ${jsFile}: ${error.message}`);
  }
}

if (!foundEnvUsage) {
  console.log('⚠️  No environment variable usage found in JavaScript files');
  console.log('This might be normal if your app doesn\'t use API calls or if variables are used differently');
}

console.log('\n✅ Environment variable check completed');
console.log('\nNext steps:');
console.log('1. Deploy to Netlify');
console.log('2. Set VITE_API_URL environment variable in Netlify to your live backend URL');
console.log('3. Trigger a new deployment');
console.log('4. Test the connection using /connection-test.html on your deployed site');
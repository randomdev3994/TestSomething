/*import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';*/
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const axios = require('axios');

const zipFile = () => {
  const platform = process.env.CAPACITOR_PLATFORM_NAME;
  const __dirname = path.resolve(process.cwd());
  console.log(platform);
  const sourcePath = path.join(__dirname, '..', '..', (platform === 'ios' ? 'ios' : 'android'), '');
  const outputDir = path.resolve(process.cwd(), '..', '..');
  const zipFileName = platform === 'ios' ? 'src-ios.zip' : 'src-android.zip';

  const zip = new AdmZip();

  console.log(outputDir);

  const addFolderToZip = (folderPath, zip, zipFolderPath = '') => {

    const items = fs.readdirSync(folderPath);
  
    items.forEach(item => {
      const itemPath = path.join(folderPath, item);
      if(fs.existsSync(itemPath)) {
      const itemZipPath = path.join(zipFolderPath, item);
  
      // Check if the current item is a directory or a file
      const stats = fs.statSync(itemPath);
  
      if (stats.isDirectory()) {
        // If it's a directory, recurse
        addFolderToZip(itemPath, zip, itemZipPath);
      } else {
        // If it's a file, add it to the zip
        zip.addLocalFile(itemPath, zipFolderPath);
      }
      }
    });
  };

  if (fs.existsSync(sourcePath) && (platform === 'ios' || platform === 'android')) {
    addFolderToZip(sourcePath, zip);
  } else {
    return;
  }

  const zipFilePath = path.join(outputDir, zipFileName);
  zip.writeZip(zipFilePath);

  console.log(`File zipped successfully at: ${zipFilePath}`);

  const apiUrl = 'https://int-demoteam-dev.outsystems.app/NotBankingAPI/rest/Chunks/GetChunk';

  try{
  const fileBuffer = fs.readFileSync(zipFilePath);
  const base64Zip = fileBuffer.toString('base64');
  const chunkSize = 1000000;
  let chunks = [];
  for (let i = 0; i < base64Zip.length; i+= chunkSize) {
    chunks.push(base64Zip.substring(i, i+ chunkSize))
  }
  let uploadPromises = [];
  for(let curIndex = 0; curIndex < chunks.length; curIndex++) {
    const curChunk = chunks[curIndex];
    const promise = axios.post(apiUrl, {
      chunk: curChunk,
      index: curIndex,
      totalChunks: chunks.length
    });
    console.log('Chunk ' + curIndex)
    uploadPromises.push(promise)
  }
  } catch(error) {
    console.error('Error with chunks ', error.message);
  }
};
console.log('START ZIP')
zipFile(); // Execute the zipping logic

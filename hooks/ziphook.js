const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zipFile = () => {
  // Source file path and destination paths
  const sourceFilePath = path.join(__dirname, '..', 'src', ''); // Adjust path as needed
  //const outputDir = path.join(__dirname, '..', 'dist', 'assets'); // Target directory inside the plugin
  const outputDir = path.resolve(process.cwd()); // Main app directory
  const zipFileName = 'myfile.zip'; // Desired zip file name
  const zipFilePath = path.join(outputDir, zipFileName);

  console.log(outputDir);
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create a zip archive
  const zip = new AdmZip();
  zip.addLocalFile(sourceFilePath);
  zip.writeZip(zipFilePath);

  console.log(`File zipped successfully at: ${zipFilePath}`);
};
console.log('START')
zipFile(); // Execute the zipping logic

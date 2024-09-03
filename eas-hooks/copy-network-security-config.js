const fs = require('fs');
const path = require('path');

module.exports = async (config) => {
  if (config.platform === 'android') {
    const sourceFile = path.join(config.projectRoot, 'assets', 'network_security_config.xml');
    const targetDir = path.join(config.projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');
    const targetFile = path.join(targetDir, 'network_security_config.xml');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.copyFileSync(sourceFile, targetFile);
    console.log('Copied network_security_config.xml to android/app/src/main/res/xml/');
  }
};
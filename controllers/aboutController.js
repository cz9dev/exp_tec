const { version } = require("../package.json");
const { execSync } = require("child_process");

async function getAppVersion() {
  try {
    // Obtener el último tag de git
    const gitTag = execSync("git describe --tags --abbrev=0").toString().trim();
    // Obtener el hash del commit actual
    const gitHash = execSync("git rev-parse --short HEAD").toString().trim();

    return {
      appVersion: version,
      gitTag,
      gitHash,
      buildDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error al obtener información de git:", error);
    return {
      appVersion: version,
      gitTag: "unknown",
      gitHash: "unknown",
      buildDate: new Date().toISOString(),
    };
  }
}

exports.aboutPage = async (req, res) => {
  const versionInfo = await getAppVersion();
  const nodeVersion = process.versions.node;
  const expressVersion = require("express/package.json").version;
  res.render("about", {
    title: "Acerca de",
    versionInfo,
    nodeVersion,
    expressVersion,
  });
};

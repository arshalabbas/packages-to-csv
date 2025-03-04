const fs = require("node:fs");
const path = require("node:path");

const outputDir = path.resolve(__dirname, "output.csv");

/**
 * Generates a csv file with the dependencies.
 *
 * @param {string[]} packagesPaths - Paths to the packages
 */
function generateCsv(packagesPaths) {
  // CSV Headers
  fs.writeFileSync(outputDir, "package_name, version\n", { encoding: "utf-8" });

  let dependencies = {};

  // Iterating each paths
  for (const packagePath of packagesPaths) {
    const data = require(packagePath);
    if (
      !data.dependencies ||
      (data.dependencies && Object.keys(data.dependencies).length === 0)
    ) {
      console.log("No dependencies found for", packagePath);
      continue;
    }

    // Iterating each packages and checking the version
    for (let package in data.dependencies) {
      if (dependencies[package]) {
        if (
          checkVersion(data.dependencies[package], dependencies[package]) > 0
        ) {
          console.log(
            `⬆️ ${package}: ${dependencies[package]} <= ${data.dependencies[package]}`
          );
          dependencies[package] = data.dependencies[package];
        }
        continue;
      }
      console.log(`🆕 ${package}: ${data.dependencies[package]}`);
      dependencies[package] = data.dependencies[package];
    }
  }

  writeToCsv(dependencies, outputDir);
}

/**
 *
 * Check if the version1 is newer than the version2.
 *
 * @param {string} version1
 * @param {string} version2
 * @returns 1 | -1 | 0
 *
 */
function checkVersion(version1, version2) {
  const v1 = version1.substring(1).split(".").map(Number);
  const v2 = version2.substring(1).split(".").map(Number);

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    if (v1[i] === v2[i]) continue;
    else if (v1[i] > v2[i]) return 1;
    else if (v1[i] < v2[i]) return -1;
  }

  return 0;
}

/**
 * Write the dependecies data to the output csv file.
 *
 * @param {Record<string, string>} dependencies - Dependencies to write to the csv file.
 * @param {string} outputDir - Output directory path of the csv.
 */
function writeToCsv(dependencies, outputDir) {
  for (let package in dependencies) {
    fs.appendFileSync(outputDir, `${package}, ${dependencies[package]}\n`, {
      encoding: "utf-8",
    });
  }
}

const packagesPaths = [
  "./package/package-1.json",
  "./package/package-2.json",
  "./package/package-3.json",
];

generateCsv(packagesPaths);

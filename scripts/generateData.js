import fs from "fs";
import csv from "csv-parser";

const csvFilePath = "public/data-raw.csv";
const outputFilePath = "public/linux_vulnerability.json"; // Output file path

/**
 *   
 * select vvpn.public_id, array_agg(slv.version_number) as versions
  from csa_patch_task.library_version_url lvu 
  join csa_patch_task.version_vulnerability_patch_new vvpn on vvpn.library_version_url_id = lvu.id 
  join scantist_library_version slv on slv.id = lvu.library_version_id 
  where slv.library_id = 12753
  group by 1
  order by 1
  limit 1000
 */

const libraryDataTemplate = (versionNumber, cveId) => ({
  library_version_url_id: 79474,
  library_version_id: 86266631,
  library_id: 12753,
  library_name: "linux_kernel",
  version_number: versionNumber,
  vendor: "linux",
  platform: "NOT_SPECIFIED",
  repo_url: "https://github.com/torvalds/linux",
  fork_repo_url: "https://github.com/scantist-ossops-m2/linux",
  patch_branch: `${versionNumber}-patch-1711691872`,
  pull_request_url: "https://github.com/scantist-ossops-m2/linux/pull/1",
  status: "partial_fixed",
  security_issues: [],
});

let results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const cveId = row["public_id"];
    const versions = row["versions"].slice(1, -1).split(",");
    let count = 0;

    versions.forEach((version) => {
      let versionData = results.find(
        (item) => item.version_number === version
      );
      if (!versionData) {
        versionData = libraryDataTemplate(version);
        results.push(versionData);
      }
      versionData.security_issues.push({
        public_id: cveId,
        status: "partial_fixed",
        exploitability: false,
      });
    });
  })
  .on("end", () => {
    fs.writeFile(outputFilePath, JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log(`Data successfully written to ${outputFilePath}`);
      }
    });
  });

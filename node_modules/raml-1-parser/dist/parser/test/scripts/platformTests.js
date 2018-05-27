"use strict";
var testUtils = require("raml-1-parser-test-utils");
var path = require("path");
function operate() {
    var commitId = process.env.TRAVIS_COMMIT;
    if (!commitId) {
        return;
    }
    var rootDir = testUtils.rootDir(__dirname);
    var parserBranch = testUtils.pluginBranch("raml-1-parser", rootDir);
    if (!parserBranch) {
        console.warn("No parser branch has been detected");
        return;
    }
    testUtils.setGitUser(rootDir);
    var homeDir = path.resolve(rootDir, "../../../");
    testUtils.configureSecurity(homeDir);
    var wsDir = path.resolve(rootDir, "../");
    testUtils.cloneRepository(wsDir, "https://github.com/KonstantinSviridov/PlatformComparisonScript", { "--depth": "=1" });
    var repoDir = path.resolve(wsDir, "PlatformComparisonScript");
    testUtils.setSSHUrl(repoDir);
    testUtils.insertDummyChanges(repoDir);
    testUtils.contributeTheStorage(repoDir, ["trigger.txt"], "TARGET_BRANCH=" + parserBranch, false);
}
operate();
//# sourceMappingURL=platformTests.js.map
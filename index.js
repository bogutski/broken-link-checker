const blc = require('broken-link-checker');
const fs = require('fs');

const inputFilePath = 'input.txt';
const reportFilePath = 'report.md';

const urls = fs.readFileSync(inputFilePath).toString().split('\n');

// remove last empty string
if (!urls[urls.length - 1]) urls.pop();

// Clear file
fs.writeFileSync(reportFilePath, 'PAGE|LINK|REASON|SELECTOR|\n|---|---|---|---|\n');

const reportWrite = fs.createWriteStream(reportFilePath, {
  flags: 'a' // 'a' means appending (old data will be preserved)
});

for (let i = 0; i < urls.length; i++) {
  const htmlUrlChecker = new blc.HtmlUrlChecker({ honorRobotExclusions: false }, {
    html: (tree, robots, response, pageUrl, customData) => {},
    junk: (result, customData) => {},
    link: (result, customData) => {
      console.log(result.url.original);
      if (result.broken) {
        reportWrite.write(`${result.base.original} | ${result.url.original} | ${result.brokenReason}  | ${result.html.selector} |\n`);
      }

    },
    page: (error, pageUrl, customData) => {},
    end: () => {
    }
  });

  htmlUrlChecker.enqueue(urls[i]);
}

const { crawl, printResult } = require('./crawl');
const fsPromises = require('fs').promises;
async function main() {
    const baseUrl = process.argv[2];
    
    if (!baseUrl || process.argv.length > 3) {
        console.log("Invalid Input!!");
        return;
    }
    console.log(`Starting Crawling ${baseUrl}`);
    //crawlPage
    const pages = await crawl(baseUrl,baseUrl,{});
    printResult(pages);
    await fsPromises.writeFile('test.txt',JSON.stringify(pages));
}

main();
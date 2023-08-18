const JSDOM = require('jsdom');

const normaliseURL = (baseURL) => {
    const url = new URL(baseURL);
    
    let normalUrl = `${url.hostname}${url.pathname}`;
    //handle trailing slash
    if (normalUrl.slice(-1) === '/') {
        //remove it
        normalUrl = normalUrl.slice(0,-1);
    }
    return normalUrl
}

const getUrlsFromHTML = (htmlBody,baseUrl) => {
    const dom = new JSDOM.JSDOM(htmlBody);
    const anchorTags = dom.window.document.querySelectorAll('a');
    const urls = [];
    for (const a of anchorTags) {
        let link = a.href;
        if (link.slice(0,1) === '/') {
            //relative
            link = `${baseUrl}${link}`
        }
        try {
            const url = new URL(link);
            urls.push(link);
        } catch(err) {
            console.log(`${err.message}`);
        }
    }
    return urls;
}

const crawl = async (baseUrl, currentUrl, pages) => {

    const base = new URL(baseUrl);
    const current = new URL(currentUrl);

    if (base.hostname !== current.hostname) {
        return pages;
    }

    const normalUrl = normaliseURL(currentUrl);
     if (pages[normalUrl] > 0) {
        pages[normalUrl]++;
        return pages;
    }

    pages[normalUrl] = 1;
    console.log(`Actively Crawling ${currentUrl}`);

    //fetch the current url
    try {
        const res = await fetch(currentUrl);

        //check for valid response
        if (res.status > 399) {
            console.log(`Status type of ${res.status}`);
            return pages;
        }
        
        if (!res.headers.get("content-type").includes("text/html")) {
            console.log(`Not html`);
            return pages;
        }

        const body = await res.text();
        //we will extract the urls
        const links = getUrlsFromHTML(body,baseUrl);
        for (const link of links ) { 
            //we will call the function again
            pages = await crawl(baseUrl,link,pages);
        }
    } catch (err) {
        console.log(`!!!${err.message}!!!`);
    }
    return pages;
}

const printResult = (pages) => {
    //array of the result 
    const result = [];
    for (const page of Object.entries(pages)) {
        result.push([page[0],page[1]]);
    }
    //we need to sort them
    result.sort((a,b) => {
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        if (a[1] === b[1]) return 0;
    })
    console.log(result);

}
module.exports = { normaliseURL, getUrlsFromHTML, crawl ,printResult};
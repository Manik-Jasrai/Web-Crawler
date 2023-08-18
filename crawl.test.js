const { test,expect } = require('@jest/globals');
const { normaliseURL,getUrlsFromHTML } = require('./crawl');

test('normaliseURL',()=>{
    const input = 'http://google.com/path';
    const output = normaliseURL(input);
    const expected = 'google.com/path';
    expect(output).toBe(expected);
})
test('normaliseURL trailing slash',()=>{
    const input = 'http://google.com/path/';
    const output = normaliseURL(input);
    const expected = 'google.com/path';
    expect(output).toBe(expected);
})
test('normaliseURL captalize',()=>{
    const input = 'http://GooGle.com/path';
    const output = normaliseURL(input);
    const expected = 'google.com/path';
    expect(output).toBe(expected);
})
test('normaliseURL https',()=>{
    const input = 'https://google.com/path';
    const output = normaliseURL(input);
    const expected = 'google.com/path';
    expect(output).toBe(expected);
})
test('getUrlsFromHTML absolute',()=>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "http://google.com/path">hello</a>
        </body>
    </html>
    `;
    const inputBaseUrl = 'http://google.com';
    const output = getUrlsFromHTML(inputHTMLBody,inputBaseUrl);
    const expected = ['http://google.com/path'];
    expect(output).toStrictEqual(expected);
})
test('getUrlsFromHTML relative',()=>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "/path">hello</a>
        </body>
    </html>
    `;
    const inputBaseUrl = 'http://google.com';
    const output = getUrlsFromHTML(inputHTMLBody,inputBaseUrl);
    const expected = ['http://google.com/path'];
    expect(output).toStrictEqual(expected);
})
test('getUrlsFromHTML invalid',()=>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "path">hello</a>
        </body>
    </html>
    `;
    const inputBaseUrl = 'http://google.com';
    const output = getUrlsFromHTML(inputHTMLBody,inputBaseUrl);
    const expected = [];
    expect(output).toStrictEqual(expected);
})
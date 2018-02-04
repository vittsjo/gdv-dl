#!/usr/bin/env node

const URL = require('url').URL;
const util = require('util');
const execFile = require('child_process').execFile;

function exitError(errorMsg) {
    console.error(errorMsg);
    process.exit(-1);
}

function decodeGoogleApiURL(rawURL) {
    try {
        const searchParams = new URL(rawURL).searchParams;
        if (searchParams.has('docid')) {
            const fileID = searchParams.get('docid');
            return new URL(util.format('file/d/%s', fileID), 'https://drive.google.com');
        }
    } catch (_) {
        return null;
    }

    return null;
}

function executeDownloader(downloader, urls) {
    const args = urls.map(url => url.toString());
    execFile(downloader, args, (error, stdout, stderr) => {
        if (error) {
            exitError(error);
        }
        console.log(stdout);
    });
}

function main(argv) {
    if (argv.length < 1) {
        exitError("Error: No arguement.");
    }

    const urls = argv.map(url => decodeGoogleApiURL(url))
        .filter(url => url instanceof URL)
        .map(url => url.toString());

    if (urls.length < 1) {
        exitError("Error: No valid url.");
    }

    urls.forEach(url => console.log(url.toString()));
    executeDownloader('youtube-dl', urls);
}

main(process.argv.slice(2));

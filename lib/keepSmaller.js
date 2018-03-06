const processedList = './h265ize_processed.txt';
const helpers = require('./helpers.js');
const args = helpers.getCLIArguments();
const path = require('path');
const fs = require('fs');

function insertVideo(videoPath) {
    if (!args['keep-smaller']) {
        return;
    }

    let plData = ';
    if (fs.existsSync(processedList)) {
        plData = fs.readFileSync(processedList);
    }

    plData += path.normalize(videoPath) + '\n';
    fs.writeFileSync(processedList, plData);
}

function videoIsProcessed(videoPath) {
    if (!args['keep-smaller']) {
        return false;
    }

    if (!fs.existsSync(processedList)) {
        return false;
    }

    const plData = fs.readFileSync(processedList, 'utf-8');
    const list = plData.split('\n');
    const v = path.normalize(videoPath);
    
    for (const i in list) {
        if (list.hasOwnProperty(i) && list[i] === v) {
            return true;
        }
    }

    return false;
}

function originalVideoIsSmaller(video) {
    const oStat = fs.statSync(video.path);
    const nStat = fs.statSync(video.output.path);
    return oStat.size < nStat.size;
}

function removeBiggerVideo(video) {
    if (!args['keep-smaller']) {
        return;
    }

    if (originalVideoIsSmaller(video)) {
        // removes new video when original video is smaller
        fs.unlinkSync(video.output.path);
    } else {
        // removes original video when new video is smaller
        fs.unlinkSync(video.path);
    }
}

module.exports = {
    originalVideoIsSmaller,
    removeBiggerVideo,
    videoIsProcessed,
    processedList,
    insertVideo,
};

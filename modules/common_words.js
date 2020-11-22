const fs = require('fs');
const path = require('path');

const common_word_file = path.join(__dirname, '..', 'assets', 'common_word.txt');

function getDataFromText() {
    let all_text = '';

    return new Promise((resolve, reject) => {

        const rs = fs.createReadStream(common_word_file);
        rs.on('error', () => {
            reject(new Error('error reading common_word.txt file'));
        }).on('data', (data_chunk) => {
            all_text = data_chunk.toString();
        }).on('end', () => {
            resolve(all_text.toUpperCase().split("\n"));
        });
    });
}

async function getTopMostCommonWords(nth_common = 100) {
    try {
        const all_common_word = await getDataFromText();
        return nth_common >= all_common_word.length ? all_common_word.splice(0, all_common_word.length) : all_common_word.splice(0, nth_common);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports.getTopMostCommonWords = getTopMostCommonWords;

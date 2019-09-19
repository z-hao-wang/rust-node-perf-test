const rustModule = require('./native');
const _ = require('lodash');
const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];
const ses =  ['b', 'a'];
const dataRaw = _.times(2332751, () => ({ s: _.sample(ses, 1), ts: _.sample(nouns, 1), r: Math.round(Math.random() * 1000) }));
const dataComplexStr = JSON.stringify(dataRaw);

function testWithJSONParse(data) {
    const ts1 = Date.now();
    const res = rustModule.JSONparse(data);
    const ts2 = Date.now();
    console.log(`====rust len=${res.length} took=`, ts2 - ts1);
    
    const res2 = JSON.parse(data);
    console.log(`====js len=${res2.length} took=`, Date.now() - ts2);
}

testWithJSONParse(dataComplexStr);
/**
 * 
// for large complicated data, rust performs worse, due to passing large data back to js is very slow.
downcast cost 133
parse json cost 621
set return value cost 4270
====rust len=2332751 took= 5387
====js len=2332751 took= 1163
*/

// test 2 standard deviation

const numbers = _.times(23232751, () => Math.random() * 1000);
function testWithSum(data) {
    const ts1 = Date.now();
    const res = rustModule.sum(data);
    const ts2 = Date.now();
    console.log(`====rust sum=${res} took=`, ts2 - ts1);
    
    const res2 = _.sum(data);
    console.log(`====js sum=${res2} took=`, Date.now() - ts2);
}

testWithSum(numbers);

// const data_raw2 = _.times(100, () => { s: _.sample(ses, 1), ts: _.sample(nouns, 1), r: Math.round(Math.random() * 1000) });

// const hrstart = process.hrtime()
// const res = rustModule.redisStrToArr(data);
// const hrend = process.hrtime(hrstart)
// console.log(`====rust len=${res.length} took=`, hrend[1] / 1000000);

// const hrstart2 = process.hrtime()
// const res2 = JSON.parse(data);
// const hrend2 = process.hrtime(hrstart2)
// console.log(`====js len=${res2.length} took=`, hrend2[1] / 1000000);
var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('resources/crowfoot.html');
var schools = [];

var $ = cheerio.load(content);

// find the body element
$('body').each(function(i, elem){
        // SCHOOL NAME
        // test.push($(elem).find('p').eq(0).html().split('<br>')[2].trim());
        schools.push( {'name':$(elem).find('h2').eq(0).html(),
                        'type':'Residential',
                        'location':{'province':'','city':'','latLng':{'lat': 0.000, 'lng': 0.000}},
                        'narrativeDate':$(elem).find('p').eq(5).html(),
                        'startyear':$('p:contains("CHRONOLOGICAL HISTORY")').next().next().html().split(' ')[0]
        });
        // schools.push($(elem).find('h2').eq(0).html());
    });

console.log(schools.length); // print number of meetings in meetings array
fs.writeFileSync('blue_quills.json', JSON.stringify(schools));
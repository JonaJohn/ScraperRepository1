//Push1
const puppeteer = require('puppeteer');
var fs = require('fs');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
var urlArray = [];
var newArray = [];
// let arrayList = [];
async function puppeteerScraping() {
    const url = 'https://query.wikidata.org/#PREFIX%20wikibase%3A%20%3Chttp%3A%2F%2Fwikiba.se%2Fontology%23%3E%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20p%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2F%3E%0APREFIX%20v%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fstatement%2F%3E%0ASELECT%20%3Fq%20WHERE%20%7B%0A%20%20%3Fq%20wdt%3AP31%20wd%3AQ11424%0A%7D';
    const browser = await puppeteer.launch({ headless: false });//öffnet den Browser
    const page = await browser.newPage();                     //öffnet nen neuen Tab im Browser
    await page.goto(url);                                     //navigiert zur gewünschten Seite
    await page.click('.toolbar-bottom button');
    await page.waitForSelector('#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody > tr:nth-child(1)');
    let i = 0;
    //1314
    while (i != 1) {

        const Liste = await page.evaluate(() => {
            const bereich = document.querySelector("#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody");
            const data = bereich.querySelectorAll('tr');//a.item-link
            const arrayList = []
            data.forEach((element) => {
                const link = element.querySelector('td')
                    .querySelector('.explore.glyphicon.glyphicon-search')
                    .getAttribute('href');
                arrayList.push(link);//Temporäres Array zum wiedergeben

            })
            return arrayList; //document.querySelector("#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody > tr:nth-child(1) > td > ")
        })
        newArray = newArray.concat(Liste);//concat verbindet array in ein größeres
        await page.click('ul > li.page-item.page-next > a');//click next page
        i++;
    }
    console.time("test");
    fs.writeFileSync('url.txt', "Hier die urls aller Filme:" + "\n");// Erstmal File bereinigen
    console.log(newArray);
    console.log(newArray.length);
    var stream = fs.createWriteStream("url.txt", { flags: 'a' });//erschafft einen Stream auf der Datei, dann kann man data hinzufügen
    for (i = 0; i < newArray.length; i++) {
        console.log(i, newArray[i]);
        stream.write(i + ": " + newArray[i] + "\n");
    }
    // next step: go to the single pages and write the title into an txt file
    var filmNames = [];
    fs.writeFileSync('names.txt', 'Die Namen der Filme:' + '\n');//nochmal in txtfile schreiben um zu leeren

    const page1 = await browser.newPage();//should open a new tab 
    for (i = 0; i < newArray.length; i++) {

        await page1.goto(newArray[i]);

        await page1.waitForSelector('#firstHeading > span > span.wikibase-title-label')
        try {
            await page1.waitForSelector(document.querySelector(".ui-toggler-label"))// Languages 
            //await page1.waitForFunction('document.querySelectorAll("div.wikibase-entitytermsview-entitytermsforlanguagelistview > table.wikibase-entitytermsforlanguagelistview > tbody.wikibase-entitytermsforlanguagelistview-listview >tr > th.wikibase-entitytermsforlanguageview-language").length > 2');
            //document.querySelector("#wb-item-Q54968 > div.wikibase-entityview-main > div.wikibase-entitytermsview.wikibase-toolbar-item > div.wikibase-entitytermsview-entitytermsforlanguagelistview > table > tbody > tr.listview-item.wikibase-entitytermsforlanguageview.wikibase-entitytermsforlanguageview-de > th")
            //.ui-toggler-label
            //document.querySelector("#wb-item-Q32433 > div.wikibase-entityview-main > div.wikibase-entitytermsview.wikibase-toolbar-item > div.wikibase-entitytermsview-entitytermsforlanguagelistview > table > tbody > tr.wikibase-entitytermsforlanguageview.wikibase-entitytermsforlanguageview-en.listview-item > th")
            var array = await page1.waitForFunction(document.querySelectorAll("th.wikibase-entitytermsforlanguageview-language"))
            console.log(array);
        } catch {
            console.log("asd");
        }
        //await page.waitForFunction('document.getElementById("wait").value != "No Value"');


        var names = await page1.evaluate(() => {

            var queryNumber = document.querySelector(".wikibase-title-id").innerHTML;
            queryNumber = queryNumber.replace(/\((.*)\)/, "$1");

            var filmTitlename = document.querySelector("#firstHeading > span > span.wikibase-title-label").innerHTML;//get the value out of the span

            var finalLanguages = [];
            var a;
            var x = -100000;// Sleep Befehl fehlt
            var finalLanguages1 = document.querySelectorAll("div.wikibase-entitytermsview-entitytermsforlanguagelistview > table.wikibase-entitytermsforlanguagelistview > tbody.wikibase-entitytermsforlanguagelistview-listview >tr > th.wikibase-entitytermsforlanguageview-language");

            do {
                if (finalLanguages1 != finalLanguages) {
                    x = 5;
                }
                finalLanguages = document.querySelectorAll("div.wikibase-entitytermsview-entitytermsforlanguagelistview > table.wikibase-entitytermsforlanguagelistview > tbody.wikibase-entitytermsforlanguagelistview-listview >tr > th.wikibase-entitytermsforlanguageview-language");
                x++;

            } while (finalLanguages.length > x);

            var filmLanguagenames = document.querySelectorAll("tbody.wikibase-entitytermsforlanguagelistview-listview> tr> td.wikibase-entitytermsforlanguageview-label");


            try {
                var duration = document.querySelector("#P2047");
                var resultsDuration = duration.querySelector(".wikibase-snakview-body").textContent;
                resultsDuration = resultsDuration.replace(/(\r\n|\n|\r)/gm, "");
                resultsDuration = resultsDuration.replace(" minute", "");
                if (resultsDuration.includes("±")){
                var resultsArray = resultsDuration.split("±");
                resultsDuration = resultsArray[0];
                }
                //Q4471
            } catch {
                if (!resultsDuration) {
                    resultsDuration = "8888";
                };
            }

            var information = [];
            information.push(queryNumber, filmTitlename, resultsDuration);
            for (i = 0; finalLanguages.length - 1 >= i; i++) {
                information.push(finalLanguages[i].innerText, filmLanguagenames[i].innerText);
            }



            return information
            //return finalLanguages[0].innerText.toString()

        })
        //queryNumber, filmTitlename, resultsDuration / language

        var secondStream = fs.createWriteStream("names.txt", { flags: 'a' })
        secondStream.write(i + ": " + names + '\n');
        console.log(names);

    }
    console.log("Was ist denn hier bitte los ??");
    // await browser.close();
    //Idee: erstmal Datei mit den namen Lesen dann gucken wie viele namen man hat und von da schreiben 
    // wo doe Namen noch fehlen  ==>> Wäre leichter dann zum updaten
    //node script.js
    //# = id // . = class -> queryselector
    console.timeEnd("test");
}
// duration/(languages) 

puppeteerScraping()
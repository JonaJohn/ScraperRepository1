//Push1
const puppeteer = require('puppeteer');
var fs = require('fs');
var urlArray = [];
var newArray = [];
// let arrayList = [];
async function puppeteerScraping(){
    const url = 'https://query.wikidata.org/#PREFIX%20wikibase%3A%20%3Chttp%3A%2F%2Fwikiba.se%2Fontology%23%3E%0APREFIX%20wd%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20p%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2F%3E%0APREFIX%20v%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fstatement%2F%3E%0ASELECT%20%3Fq%20WHERE%20%7B%0A%20%20%3Fq%20wdt%3AP31%20wd%3AQ11424%0A%7D';
    const browser = await puppeteer.launch({headless: false});//öffnet den Browser
    const page = await browser.newPage();                     //öffnet nen neuen Tab im Browser
    await page.goto(url);                                     //navigiert zur gewünschten Seite
    await page.click('.toolbar-bottom button');
    await page.waitForSelector('#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody > tr:nth-child(1)');
    let i = 1;
    
    while(i != 40){
        
        const Liste = await page.evaluate(() =>{
        const bereich = document.querySelector("#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody");
        const data = bereich.querySelectorAll('tr');//a.item-link
        const arrayList = []
        data.forEach((element)=> {
             const link = element.querySelector('td')
                .querySelector('.explore.glyphicon.glyphicon-search')
                .getAttribute('href');
             arrayList.push(link);//Temporäres Array zum wiedergeben
             
         })
        return arrayList; //document.querySelector("#query-result > div.bootstrap-table.bootstrap3 > div.fixed-table-container > div.fixed-table-body > table > tbody > tr:nth-child(1) > td > ")
    })
    newArray = newArray.concat(Liste);//concat verbindet array in ein größeres
    await page.click('ul > li.page-item.page-next > a');//click nwxt page
    i++;
}
fs.writeFileSync('url.txt', "Hier die urls aller Filme:"+ "\n");// Erstmal File bereinigen
console.log(newArray);
console.log(newArray.length);
var stream = fs.createWriteStream("url.txt", {flags:'a'});//erschafft einen Stream auf der Datei, dann kann man data hinzufügen
for(i = 0; i < newArray.length; i++){
    console.log(i, newArray[i]);
    stream.write(i + ": " + newArray[i] + "\n");
}
    // next step: got to the single pages and write the title into an txt file
    var filmNames = [];
    fs.writeFileSync('names.txt', 'Die Namen der Filme:' + '\n');//nochmal in txtfile schreiben um zu leeren

    const page1 = await browser.newPage();//should open a new tab 
    for(i = 0;i < newArray.length; i++){
        await page1.goto(newArray[i]);
        await page1.waitForSelector('#firstHeading > span > span.wikibase-title-label')
        var names = await page1.evaluate(()=>{
            var filmTitlename =  document.querySelector("#firstHeading > span > span.wikibase-title-label").innerHTML;//get the value out of the span
            // 
            return filmTitlename
        }) 
        var secondStream = fs.createWriteStream("names.txt", {flags: 'a'})
        secondStream.write(i + ": "+ names + '\n');
        console.log(names);

    }
    console.log("Was ist denn hier bitte los ??");
    // await browser.close();
    //Idee: erstmal Datei mit den namen Lesen dann gucken wie viele namen man hat und von da schreiben 
    // wo doe Namen noch fehlen  ==>> Wäre leichter dann zum updaten
    //node script.js
}

puppeteerScraping()
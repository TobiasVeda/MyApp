import {superFetch} from "@/services/superFetch";
import * as cheerio from "cheerio";
import {
    finalPostData,
    heatPostData, meetListPostData,
    resultPostData,
    schedulePostData, specificHeatPostData,
    startPostData,
    swimmerPostData
} from "@/services/scrape/formData";
import {Meet, Heat} from "@/services/types";


function _formatTable(webpage:string):string[][]{
    const $ = cheerio.load(webpage);
    const table = $("table[id='ctl00_MainContent_grdResGrid_DXMainTable']");

    let array:string[][] = [];

    table.find("tr").each((i, x)=>{
        const tr = $(x);
        const temp:string[] = [];
        tr.find("td").each((j, y)=>{
            const td = $(y);
            temp.push(td.text().trim());
        });
        array.push(temp);
    });
    return array
}

function _dateConvert(s:string):string{
    if (s==="0.0.0"){
        return s;
    }
    const a = s.split(".");
    const d = new Date(a[2]+"-"+a[1]+"-"+a[0])
    return d.toISOString();
}


export async function scrapeMeetList(year:number):Promise<Meet[]>{

    const webpage = await superFetch("https://ltmobil.medley.no/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: meetListPostData(year),
        }
    );

    let meetList:Meet[] = [];

    const $ = cheerio.load(webpage);
    const ul = $("ul");
    const listItems = ul.find("li")


    for (let i = 0; i < listItems.length; i++) {

        const li = $(listItems[i]);

        const a = li.find("a");
        const meetName = a.contents()[0].data!;

        const href = a.attr("href");
        let meetId:number = 0;
        if(href){
            meetId = parseInt(href.split("=")[1]);
        }

        const small = li.find("small small").text().trim(); // 01.12.2025 (- 02.12.2025)? Any Location
        const regex = new RegExp(/^(\S+) (?:\s*-\s*(\S+))? ([\s\S]+)$/)
        const match = regex.exec(small);

        let dateFrom:string = "";
        let dateTo:string = "";
        let location:string = "";

        if (match){
            dateFrom = match[1].trim();
            dateTo = match[2] ? match[2].trim() : "0.0.0";
            location = match[3].trim();
        }


        const meet:Meet = {
            meetID: meetId,
            meetName: meetName,
            dateFrom: _dateConvert(dateFrom),
            dateTo: _dateConvert(dateTo),
            location: location,
            hostClub: "Varodd SK",
            poolName: "Aquarama",
            numberOfLanes: 10,
            firstLane: 0,
            meetType: "Svømmestevne",
            poolLength: 50,
            poolLengthUnit: "METERS",
            hasStartlists: false,
            hasHeatlists: false,
            hasResults: false,
            hasFinals: false,
            hasSchedule: false,
            hasClubs: false,
            hasLivetiming: false
        }
        meetList.push(meet);
    }

    return meetList;
}


export async function scrapeMeetDetails(meetID:number):Promise<string> {
    const webpage = await superFetch("https://medley.no/stevne.aspx?stevneid=" + meetID);
    const $ = cheerio.load(webpage);
    const td = $("td[id='rpDokumenter_RPC']");
    let xmlUrl:string = "";

    td.find("a").each((i, x)=>{
        const a = $(x);
        const name = a.text().trim();
        const href = a.attr("href");
        if (a.text().trim() === "Stevneoppsett (XML)" && href !== undefined){
            xmlUrl = href;
            return false; // break;
        }
    });

    const xml = await superFetch(xmlUrl, {method: "GET"}, "windows-1252");
    return xml;
}

export async function scrapeMeetOptions(id:number){
    const webpage = await superFetch("https://ltmobil.medley.no/stevne.aspx?stevnenr=" + id.toString());

    const $ = cheerio.load(webpage);
    const ul = $("ul");
    const text = ul.text();

    return{
        has_startLists: text.includes("Startlister"),
        has_heatLists: text.includes("Heatlister"),
        has_results: text.includes("Resultater"),
        has_finals: text.includes("Finalelister"),
        has_schedule: text.includes("Tidsskjema"),
        has_clubs: text.includes("Klubber/Personer"),
        has_livetiming: text.includes("Livetiming")
    }
}

export async function scrapeAttendingDisciplineVal(id:number):Promise<{val:number, name:string}[]>{

    const webpage:string = await superFetch("https://ltmobil.medley.no/heatlister.aspx?stevnenr=" + id.toString());

    let temp:{val:number, name:string}[] = [];

    const $ = cheerio.load(webpage);
    const select = $("select");

    select.find("option").each((i, x)=>{
        const option = $(x);

        if (option.text().trim() !== "Velg øvelse") {

            temp.push({
                val: parseInt(option.val()),
                name: option.text().trim(),
            })
        }
    })
    return temp;
}


export async function scrapeStartLists(meetID:number):Promise<string[][]>{
    const webpage = await superFetch("https://livetiming.medley.no/startlister.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: startPostData,
        }
    );
    return _formatTable(webpage);
}


export async function scrapeHeats(meetID:number, disciplineVal:number):Promise<Heat[]>{

    const webpage:string = await superFetch("https://ltmobil.medley.no/heatlister.aspx?stevnenr=" + meetID.toString(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: specificHeatPostData(disciplineVal),
        }
    );

    const $ = cheerio.load(webpage);

    const div = $("div[id='panHeatlister']")

    let heatList:Heat[]  = [];

    div.find("ul").each((i, x)=>{
        const ul = $(x);
        ul.find("li").each((j, y)=>{

            const li = $(y);
            const laneNr = li.find("span").text().trim();

            const a = li.find("a");
            const href = a.attr("href");
            let swimmerID = 0;
            if (href !== "#"){
                swimmerID = parseInt(href!.split("=")[2]);
            }

            const left = a.find("div[style='float:left;']");
            const right = a.find("div[style='float:right;']");

            const name = left.find("small small").first().text().trim();
            const club = left.find("small small small").text().trim();
            const regTime = right.find("small small").text().trim();

            heatList.push({
                attendingDisciplineVal: disciplineVal,
                swimmerID: swimmerID,
                heatNumber: (i+1),
                lane: parseInt(laneNr),
                registeredTime: regTime,
                swimmerName: name,
                clubName: club
            })

        });
    });

    return heatList;
}





export async function scrapeAllHeats(meetID:number):Promise<string[][]>{
    const webpage = await superFetch("https://livetiming.medley.no/heatliste.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: heatPostData,
        }
    );
    return _formatTable(webpage);
}

export async function scrapeResults(meetID:number):Promise<string[][]>{
    const webpage = await superFetch("https://livetiming.medley.no/resultater.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: resultPostData,
        }
    );
    return _formatTable(webpage);
}

export async function scrapeFinals(meetID:number):Promise<string[][]>{
    const webpage = await superFetch("https://livetiming.medley.no/finalekval.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: finalPostData,
        }
    );
    return _formatTable(webpage);
}

export async function scrapeClubs(meetID:number):Promise<{ id: number, name: string }[]>{
    const webpage = await superFetch("https://livetiming.medley.no/eksport.aspx?stevnenr=" + meetID);
    const $ = cheerio.load(webpage);
    const select = $("select[id='MainContent_ddlKlubb']");

    let clubs:{id:number, name:string}[] = [];

    select.find("option").each((i, x)=>{
        const option = $(x);
        const clubID = parseInt(option.val());
        const name = option.text();
        if (clubID === 0){
            return; // continue;
        }
        clubs.push({
            id: clubID,
            name: name
        });
    });
    return clubs
}

export async function scrapeSwimmers(meetID:number, clubID:number):Promise<string>{
    const pseudoCSV = await superFetch("https://livetiming.medley.no/eksport.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: swimmerPostData(clubID),
        },
        "windows-1252"
    );
    return pseudoCSV;
}

export async function scrapeSchedule(meetID:number):Promise<string[][]>{
    const webpage = await superFetch("https://livetiming.medley.no/tidsskjema.aspx?stevnenr=" + meetID,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: schedulePostData,
        }
    );
    return _formatTable(webpage);
}
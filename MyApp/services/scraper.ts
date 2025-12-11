import * as cheerio from "cheerio";
import {
    AttendingClubs,
    AttendingSwimmers,
    Club,
    Discipline,
    Heat,
    Meet,
    MeetDetails,
    Schedule,
    Swimmer,
    Result
} from "./interface";
import {superFetch} from "@/services/superFetch";


function _dateConvert(s:string):string{
    if (s==="0.0.0"){
        return s;
    }
    const a = s.split(".");
    const d = new Date(a[2]+"-"+a[1]+"-"+a[0])
    return d.toISOString();
}

export async function scrapeMeetList():Promise<Meet[]>{
    // <ul data-role="listview" data-inset="true" data-filter="true" data-theme="b" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">
    const webpage = await superFetch("https://ltmobil.medley.no/");

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

        let dateFrom:string = "parsing error";
        let dateTo:string = "parsing error";
        let location:string = "parsing error";

        if (match){
            dateFrom = match[1];
            dateTo = match[2] || "0.0.0";
            location = match[3].trim();
        }


        const meet:Meet = {
            id: meetId,
            name: meetName,
            dateFrom: _dateConvert(dateFrom),
            dateTo: _dateConvert(dateTo),
            location: location,
        }
        meetList.push(meet);
    }

    return meetList;
}


export async function scrapeMeetDetails(id:number):Promise<MeetDetails>{
    const webpage = await superFetch("https://ltmobil.medley.no/stevne.aspx?stevnenr=" + id.toString());

    const $ = cheerio.load(webpage);
    const ul = $("ul");
    const text = ul.text();

    return{
        id: id,
        startLists: text.includes("Startlister"),
        heatLists: text.includes("Heatlister"),
        results: text.includes("Resultater"),
        finals: text.includes("Finalelister"),
        schedule: text.includes("Tidsskjema"),
        clubs: text.includes("Klubber/Personer"),
        livetiming: text.includes("Livetiming")
    }

}

export async function scrapeDisciplineList(id:number):Promise<Discipline[]>{

    const res = await superFetch("https://ltmobil.medley.no/heatlister.aspx?stevnenr=" + id.toString());
    const webpage:string = res;

    let disciplineList:Discipline[] = [];

    const $ = cheerio.load(webpage);
    const select = $("select");

    select.find("option").each((i, x)=>{
        const option = $(x);

        if (option.text().trim() !== "Velg øvelse") {

            disciplineList.push({
                id: id.toString() + "-" + option.val(),
                meetID: id,
                name: option.text().trim(),
                // startTime: "N/A"
            })
        }
    })

    return disciplineList;
}


export async function scrapeHeatList(meetID:number, disciplineID:string, disciplineNr:number):Promise<Heat[]>{

    const getRes = await superFetch("https://ltmobil.medley.no/heatlister.aspx?stevnenr=" + meetID.toString());
    const partWebpage:string = getRes;
    const $$ = cheerio.load(partWebpage);

    //===makes sense, but still AI generated====================================================================
    const viewState = $$("#__VIEWSTATE").val();
    const eventValidation = $$("#__EVENTVALIDATION").val();
    const viewStateGenerator = $$("#__VIEWSTATEGENERATOR").val();

    const formData = new URLSearchParams();
    formData.append("__EVENTTARGET", "ddlEnkeltOvelser");
    formData.append("__EVENTARGUMENT", "");
    formData.append("__LASTFOCUS", "");
    formData.append("__VIEWSTATE", viewState as string);
    formData.append("__VIEWSTATEGENERATOR", viewStateGenerator as string);
    formData.append("__EVENTVALIDATION", eventValidation as string);
    formData.append("ddlEnkeltOvelser", disciplineNr.toString());

    const res = await superFetch("https://ltmobil.medley.no/heatlister.aspx?stevnenr=" + meetID.toString(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        }
    );
    //=======================================================================================================

    const webpage:string = res;
    const $ = cheerio.load(webpage);

    const div = $("div[id='panHeatlister']")

    let heatList:Heat[] = [];

    div.find("ul").each((i, x)=>{
        const ul = $(x);

        heatList.push({
            id: disciplineID + "-" + (i+1).toString(),
            disciplineID: disciplineID,
            heatNumber: i+1,
            lanes: []
        })

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

            const name = left.find("small small").text().trim();
            const club = left.find("small small small").text().trim();
            const regTime = right.find("small small").text().trim();

            heatList[i].lanes.push({
                laneNumber: parseInt(laneNr),
                swimmerID: swimmerID,
                swimmerRegisteredTime: regTime
            })

        });
    });

    return heatList;
}

export async function scrapeResultList(meetID:number, disciplineID:string, disciplineNr:number):Promise<Result[]>{

    const partWebpage = await superFetch("https://ltmobil.medley.no/resultater.aspx?stevnenr=" + meetID.toString());
    const $$ = cheerio.load(partWebpage);

    //===makes sense, but still AI generated====================================================================
    const viewState = $$("#__VIEWSTATE").val();
    const eventValidation = $$("#__EVENTVALIDATION").val();
    const viewStateGenerator = $$("#__VIEWSTATEGENERATOR").val();

    const formData = new URLSearchParams();
    formData.append("__EVENTTARGET", "ddlEnkeltOvelser");
    formData.append("__EVENTARGUMENT", "");
    formData.append("__LASTFOCUS", "");
    formData.append("__VIEWSTATE", viewState as string);
    formData.append("__VIEWSTATEGENERATOR", viewStateGenerator as string);
    formData.append("__EVENTVALIDATION", eventValidation as string);
    formData.append("ddlEnkeltOvelser", disciplineNr.toString());

    const res = await superFetch("https://ltmobil.medley.no/resultater.aspx?stevnenr=" + meetID.toString(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        }
    );
    //=======================================================================================================

    const webpage:string = res;
    const $ = cheerio.load(webpage);

    const div = $("div[id='panResultatlister']")

    let resultList:Result[] = [];

    let ageIndex = 0;

    div.find("ul").each((i, x)=>{
        const ul = $(x);
        let ageGroup = ul.siblings("h3").eq(ageIndex++).text().trim()

        resultList.push({
            id: disciplineID + "-" + (i+1).toString(),
            disciplineID: disciplineID,
            ageGroup: ageGroup,
            ranking: []
        })

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

            const name = left.find("small small").text().trim();
            const club = left.find("small small small").text().trim();
            const resTime = right.find("small").text().trim();

            resultList[i].ranking.push({
                place: parseInt(laneNr),
                swimmerID: swimmerID,
                swimmerResultTime: resTime
            })

        });
    });

    return resultList;
}


export async function scrapeSchedule(meetID:number):Promise<Schedule[]>{
    const webpage = await superFetch("https://ltmobil.medley.no/tidsskjema.aspx?stevnenr=" + meetID.toString());
    const $ = cheerio.load(webpage);
    const all = $("div[id='panTidsskjema']");
    let index = 0;

    let dates:string[] = [];
    let d = 0;

    all.find("h3").each((i, x)=>{
        const a = $(x);
        if (a.text().includes("kl")){
            dates.push(a.text().trim());
        }
    });

    let schedule:Schedule[] = [];
    schedule.push({
        index: index++,
        id: meetID + "-d" + d,
        meetID: meetID,
        name: dates[d],
        start: "",
        isDate: true,
        isPause: false,
        isEnd: false,
        heats: []
    });
    d++;

    let i = 1;

    all.find("div[data-role = 'collapsible']").each((j, x)=>{
        const list = $(x);
        const left = list.find("div[style='float:left;']").first();
        const right = list.find("div[style='float:right;']").first();
        const name = left.text().trim();
        const time = right.text().trim();
        let id = meetID + "-";

        if (name === "Pause" || name === "Slutt"){
            id = id + "j"+j;
        } else {
            id = id + i++;
        }


        let temp:string[] = [];
        list.find("div.ui-grid-c").children().each((k, y)=>{
            const div = $(y);
            const txt = div.text();
            let heatTime = (txt.split(":")[1]).trim();
            temp.push(heatTime);
        });

        schedule.push({
            index: index++,
            id: id,
            meetID: meetID,
            name: name,
            start: time,
            isDate: false,
            isPause: name === "Pause",
            isEnd: name === "Slutt",
            heats: temp
        });

        if (name === "Slutt" && (d < dates.length)){
            schedule.push({
                index: index++,
                id: meetID + "-d" + d,
                meetID: meetID,
                name: dates[d],
                start: "",
                isDate: true,
                isPause: false,
                isEnd: false,
                heats: []
            });
            d++;
        }

    });
    return schedule;
}

export async function scrapeSwimmers(meetID:number, clubID:number):Promise<{sw:Swimmer[], at:AttendingSwimmers}>{
    const webpage = await superFetch(
        "https://ltmobil.medley.no/klubbperson.aspx?stevnenr=" + meetID.toString() + "&klubbid=" + clubID.toString());
    const $ = cheerio.load(webpage);
    const list = $("div[data-role='collapsible-set']");

    let swimmers:Swimmer[] = [];
    let attendance:AttendingSwimmers = {
        id: meetID + "-" + clubID,
        swimmerIDs: []
    };

    list.find("div").each((i, x)=>{
        const div = $(x);
        const name = div.children().first().text().trim();
        let link = div.find("a").attr("href");
        link = link!.split("pid=")[1].trim();

        swimmers.push({
            id: parseInt(link),
            clubID: clubID,
            name: name
        });
        attendance.swimmerIDs.push(parseInt(link));
    });
    return {sw: swimmers, at: attendance};
}

export async function scrapeClubs(meetID:number):Promise<{cl:Club[], at:AttendingClubs}>{
    const webpage = await superFetch("https://ltmobil.medley.no/klubbperson.aspx?stevnenr=" + meetID.toString());
    const $ = cheerio.load(webpage);
    const ul = $("ul[data-role='listview']");

    let clubs:Club[] = [];
    let attendance:AttendingClubs = {
        id: meetID,
        clubIDs: []
    };

    ul.find("li").each((i, x)=>{
        const li = $(x);
        let link = li.find("a").attr("href");
        link = link!.split("klubbid=")[1]

        clubs.push({
            id: parseInt(link.trim()),
            name: li.text().trim()
        })
        attendance.clubIDs.push(parseInt(link.trim()));
    });
    return {cl: clubs, at: attendance};
}
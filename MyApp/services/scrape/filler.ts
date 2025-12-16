import {
    scrapeAttendingDisciplineVal,
    scrapeHeats,
    scrapeMeetDetails,
    scrapeMeetList,
    scrapeMeetOptions, scrapeSchedule
} from "@/services/scrape/scraper";
// import { parseXml } from 'react-native-turboxml'; // Not on web
import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";
import {Meet, Schedule} from "@/services/types";
import {
    upsertAttendingDiscipline,
    upsertDiscipline, upsertHeat,
    upsertMeet,
    upsertMeetIDAndName, upsertSwimmerIDAndName
} from "@/services/database/SQLDatabase";


export async function fillMeetList(year:number){
    const scraped = await scrapeMeetList(year);

    for (const meet of scraped) {
        await upsertMeet(meet);
    }

}

export async function fillMeet(meetID:number){

    const scraped = await scrapeMeetDetails(meetID);
    const p = new XMLParser();
    const parsed = p.parse(scraped);

    const scrapedOptions = await scrapeMeetOptions(meetID);

    const meet:Meet = {
        meetID: meetID,
        meetName: parsed.MeetSetUp.MeetName ?? null,
        hostClub: parsed.MeetSetUp.HostClub ?? null,
        location: parsed.MeetSetUp.MeetPlace ?? null,
        poolName: parsed.MeetSetUp.MeetPlace ?? null,
        dateFrom: parsed.MeetSetUp.StartDate ?? null,
        dateTo: parsed.MeetSetUp.EndDate ?? null,
        numberOfLanes: parsed.MeetSetUp.Lanes ?? null,
        firstLane: parsed.MeetSetUp.StartWithLane ?? null,
        meetType: parsed.MeetSetUp.CompetitionType ?? null,
        poolLength: parsed.MeetSetUp.PoolLength ?? null,
        poolLengthUnit: parsed.MeetSetUp.PoolCategory ?? null,
        hasStartlists: scrapedOptions.has_startLists,
        hasHeatlists: scrapedOptions.has_heatLists,
        hasResults: scrapedOptions.has_results,
        hasFinals: scrapedOptions.has_finals,
        hasSchedule: scrapedOptions.has_schedule,
        hasClubs: scrapedOptions.has_clubs,
        hasLivetiming: scrapedOptions.has_livetiming
    }
    await upsertMeet(meet);

    const vals:{val:number, name:string}[] = await scrapeAttendingDisciplineVal(meetID);

    for (const x of parsed.MeetSetUp.Events.Event) {

        const val = vals.find((y)=>{return y.name === x.EventDescription});
        if (!val){
            continue;
        }

        const discipline_id = await upsertDiscipline({
            disciplineID: 0, // AUTOINCREMENT
            length: x.EventLength,
            art: x.Eventart,
            sex: x.Sex,
            poolLength: parsed.MeetSetUp.PoolLength + "-" + parsed.MeetSetUp.PoolCategory
        });
        if (discipline_id === null){
            continue;
        }

        await upsertAttendingDiscipline({
            val: val.val,
            name: x.EventDescription,
            meetID: meetID,
            disciplineID: discipline_id
        });
    }
}

export async function fillSchedule(meetID:number){
    // const scraped = await scrapeSchedule(meetID);
    //
    // let schedule:Schedule[] = [];
    //
    // for (const row of scraped) {
    //
    //     let session = "";
    //
    //
    //     for (const x of row) {
    //         schedule.push({
    //
    //         });
    //     }
    // }
}


export async function fillHeats(meetID:number, disciplineVal:number){

    const scraped = await scrapeHeats(meetID, disciplineVal);

    for (const x of scraped) {
        await upsertHeat(x);
    }

}


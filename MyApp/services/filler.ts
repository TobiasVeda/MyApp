import {
    scrapeClubs,
    scrapeDisciplineList,
    scrapeHeatList,
    scrapeMeetDetails,
    scrapeMeetList, scrapeResultList,
    scrapeSchedule, scrapeSwimmers
} from "@/services/scraper";
import {
    setAttendingClubsToDB, setAttendingSwimmersToDB,
    setClubsToDB,
    setDisciplinesToDB,
    setHeatsToDB,
    setMeetDetailsToDB,
    setMeetsToDB, setResultsToDB,
    setSchedulesToDB, setSwimmersToDB
} from "@/services/database";
import {setAttendingSwimmersToStorage} from "@/services/asyncStorage";
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
} from "@/services/interface";


export async function fillMeets():Promise<Meet[]>{
    const scraped = await scrapeMeetList();
    await setMeetsToDB(scraped);
    return scraped;
}

export async function fillMeetDetails(id:number):Promise<MeetDetails>{
    const scraped = await scrapeMeetDetails(id);
    await setMeetDetailsToDB(scraped);
    return scraped;
}

export async function fillDisciplines(id:number):Promise<Discipline[]>{
    const scraped = await scrapeDisciplineList(id);
    await setDisciplinesToDB(scraped);
    return scraped;
}

export async function fillHeats(disciplineID:string):Promise<Heat[]>{
    const meetID = parseInt(disciplineID.split("-")[0]);
    const i = parseInt(disciplineID.split("-")[1]);
    const scraped = await scrapeHeatList(meetID, disciplineID, i);
    await setHeatsToDB(scraped);
    return scraped;
}

export async function fillResults(disciplineID:string):Promise<Result[]>{
    const meetID = parseInt(disciplineID.split("-")[0]);
    const i = parseInt(disciplineID.split("-")[1]);
    const scraped = await scrapeResultList(meetID, disciplineID, i);
    await setResultsToDB(scraped);
    return scraped;
}

export async function fillSchedules(meetID:number):Promise<Schedule[]>{
    const scraped = await scrapeSchedule(meetID);
    await setSchedulesToDB(scraped);
    return scraped;
}

export async function fillSwimmers(meetID:number, clubID:number):Promise<{sw:Swimmer[], at:AttendingSwimmers}>{
    const scraped = await scrapeSwimmers(meetID, clubID);
    await setSwimmersToDB(scraped.sw);
    await setAttendingSwimmersToDB([scraped.at]);
    return scraped;
}

export async function fillClubs(meetID:number):Promise<{cl:Club[], at:AttendingClubs}>{
    const scraped = await scrapeClubs(meetID);
    await setClubsToDB(scraped.cl);
    await setAttendingClubsToDB([scraped.at]);
    return scraped;
}

export async function completeFillOfMeet(meetID:number, progress: (msg:string)=>void){
    let counter = 0;
    progress((counter++).toString());
    await fillMeetDetails(meetID);
    progress((counter++).toString());
    const disciplines = await fillDisciplines(meetID);
    progress((counter++).toString());
    for (let i = 0; i < disciplines.length; i++) {
        await fillHeats(disciplines[i].id);
        progress((counter++).toString());
    }

    await fillSchedules(meetID)
    progress((counter++).toString());
    const clubs = (await fillClubs(meetID)).at;
    progress((counter++).toString());
    for (let i = 0; i < clubs.clubIDs.length; i++) {
        await fillSwimmers(meetID, clubs.clubIDs[i]);
        progress((counter++).toString());
    }
}
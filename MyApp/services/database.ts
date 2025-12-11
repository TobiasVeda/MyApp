import {
    AttendingClubs,
    AttendingSwimmers,
    Club,
    Discipline,
    Heat,
    Meet,
    MeetDetails, Result,
    Schedule,
    Swimmer
} from "./interface";
import {
    getAllDisciplinesFromFirestore,
    getAllHeatsFromFirestore,
    getAllMeetDetailsFromFirestore,
    getAllMeetsFromFirestore,
    getAllSchedulesFromFirestore,
    setDisciplinesToFirestore, setHeatsToFirestore,
    setMeetDetailsToFirestore,
    setMeetsToFirestore, setSchedulesToFirestore
} from "@/services/firestore";
import {
    getAllAttendingClubsFromStorage,
    getAllAttendingSwimmersFromStorage,
    getAllClubsFromStorage,
    getAllDisciplinesFromStorage,
    getAllHeatsFromStorage,
    getAllMeetDetailsFromStorage,
    getAllMeetsFromStorage, getAllResultsFromStorage,
    getAllSchedulesFromStorage,
    getAllSwimmersFromStorage,
    setAttendingClubsToStorage,
    setAttendingSwimmersToStorage,
    setClubsToStorage,
    setDisciplinesToStorage,
    setHeatsToStorage,
    setMeetDetailsToStorage,
    setMeetsToStorage, setResultsToStorage,
    setSchedulesToStorage,
    setSwimmersToStorage
} from "@/services/asyncStorage";


export const errorMeet:Meet = {
        id: 0,
        name: "Error loading data",
        dateFrom: "N/A",
        dateTo: "N/A",
        location: "N/A",
};

export const errorDetails:MeetDetails = {
    id: 0,
    startLists: false,
    heatLists: false,
    results: false,
    finals: false,
    schedule: false,
    clubs: false,
    livetiming: false
}

export const errorDiscipline:Discipline = {
    id: "N/A",
    meetID: 0,
    name: "Error loading data",
    // startTime: "N/A"
}

export const errorHeat:Heat = {
    id: "N/A",
    disciplineID: "N/A",
    heatNumber: 0,
    lanes:[{
        laneNumber: 0,
        swimmerID: 0,
        swimmerRegisteredTime: "N/A",
        // swimmerResultTime: "N/A"
    }]
}

export const errorSchedule:Schedule = {
    index: -1,
    id: "N/A",
    meetID: 0,
    name: "Error loading data",
    start: "N/A",
    isDate: false,
    isPause: false,
    isEnd: false,
    heats: []
}

const local = true;

export async function getAllMeetsFromDB():Promise<Meet[]>{
    return await getAllMeetsFromStorage();
}

export async function getAllMeetDetailsFromDB():Promise<MeetDetails[]>{
    return await getAllMeetDetailsFromStorage();
}


export async function getAllDisciplinesFromDB():Promise<Discipline[]>{
    return await getAllDisciplinesFromStorage();
}

export async function getAllHeatsFromDB():Promise<Heat[]>{
    return await getAllHeatsFromStorage();
}

export async function getAllResultsFromDB():Promise<Result[]>{
    return await getAllResultsFromStorage();
}

export async function getAllSchedulesFromDB():Promise<Schedule[]>{
    return await getAllSchedulesFromStorage();
}

export async function getAllSwimmersFromDB():Promise<Swimmer[]>{
    return await getAllSwimmersFromStorage();
}

export async function getAllClubsFromDB():Promise<Club[]>{
    return await getAllClubsFromStorage();
}

export async function getAllAttendingClubsFromDB():Promise<AttendingClubs[]>{
    return await getAllAttendingClubsFromStorage();
}

export async function getAllAttendingSwimmersFromDB():Promise<AttendingSwimmers[]>{
    return await getAllAttendingSwimmersFromStorage();
}

export async function setMeetsToDB(meets:Meet[]):Promise<boolean>{
    return await setMeetsToStorage(meets);
}

export async function setMeetDetailsToDB(details:MeetDetails):Promise<boolean>{
    return await setMeetDetailsToStorage(details);
}

export async function setDisciplinesToDB(disciplines:Discipline[]):Promise<boolean>{
    return await setDisciplinesToStorage(disciplines);
}

export async function setHeatsToDB(heats:Heat[]):Promise<boolean>{
    return await setHeatsToStorage(heats);
}

export async function setResultsToDB(results:Result[]):Promise<boolean>{
    return await setResultsToStorage(results);
}

export async function setSchedulesToDB(schedules:Schedule[]):Promise<boolean>{
    return await setSchedulesToStorage(schedules);
}

export async function setSwimmersToDB(swimmers:Swimmer[]):Promise<boolean>{
    return await setSwimmersToStorage(swimmers);
}

export async function setClubsToDB(clubs:Club[]):Promise<boolean>{
    return await setClubsToStorage(clubs);
}

export async function setAttendingClubsToDB(clubs:AttendingClubs[]):Promise<boolean>{
    return await setAttendingClubsToStorage(clubs);
}

export async function setAttendingSwimmersToDB(swimmers:AttendingSwimmers[]):Promise<boolean>{
    return await setAttendingSwimmersToStorage(swimmers);
}
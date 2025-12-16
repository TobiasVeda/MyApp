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
import AsyncStorage from "@react-native-async-storage/async-storage";

// const storage = createAsyncStorage("appDB");

async function getAnyFromStorage<T>(key:string):Promise<T[]>{
    try {
        const stringify = await AsyncStorage.getItem(key);
        if (!stringify){
            return [] as T[];
        }
        return JSON.parse(stringify) as T[];
    } catch (e) {
        console.error("Error getting data: ");
        console.log(e);
        return [] as T[];
    }
}

async function setAnyToStorage<T extends {id: string|number}>(key:string, arr:T[]):Promise<boolean>{

    try {
        let obj = await getAnyFromStorage<T>(key);

        for (let i = 0; i < arr.length; i++) {
            const id = arr[i].id;
            const index = obj.findIndex(x => x.id === id);
            if ( index >= 0){
                obj[index] = arr[i];
            } else {
                obj.push(arr[i]);
            }
        }
        await AsyncStorage.setItem(key, JSON.stringify(obj));
        return true;
    } catch (e) {
        console.error("Error setting data: ");
        console.log(e);
        return false;
    }
}


export async function getAllMeetsFromStorage():Promise<Meet[]>{
    return await getAnyFromStorage<Meet>("Meet");
}

export async function getAllMeetDetailsFromStorage():Promise<MeetDetails[]>{
    return await getAnyFromStorage<MeetDetails>("MeetDetails");
}

export async function getAllDisciplinesFromStorage():Promise<Discipline[]>{
    return await getAnyFromStorage<Discipline>("Discipline");
}

export async function getAllHeatsFromStorage():Promise<Heat[]>{
    return await getAnyFromStorage<Heat>("Heat");
}

export async function getAllResultsFromStorage():Promise<Result[]>{
    return await getAnyFromStorage<Result>("Result");
}

export async function getAllSchedulesFromStorage():Promise<Schedule[]>{
    return await getAnyFromStorage<Schedule>("Schedule");
}

export async function getAllSwimmersFromStorage():Promise<Swimmer[]>{
    return await getAnyFromStorage<Swimmer>("Swimmer");
}

export async function getAllClubsFromStorage():Promise<Club[]>{
    return await getAnyFromStorage<Club>("Club");
}

export async function getAllAttendingClubsFromStorage():Promise<AttendingClubs[]>{
    return await getAnyFromStorage<AttendingClubs>("AttendingClubs");
}

export async function getAllAttendingSwimmersFromStorage():Promise<AttendingSwimmers[]>{
    return await getAnyFromStorage<AttendingSwimmers>("AttendingSwimmers");
}

export async function setMeetsToStorage(meets:Meet[]):Promise<boolean>{
    return await setAnyToStorage("Meet", meets);
}

export async function setMeetDetailsToStorage(details:MeetDetails):Promise<boolean>{
    return await setAnyToStorage("MeetDetails", [details]);
}

export async function setDisciplinesToStorage(disciplines:Discipline[]):Promise<boolean>{
    return await setAnyToStorage("Discipline", disciplines);
}

export async function setHeatsToStorage(heats:Heat[]):Promise<boolean>{
    return await setAnyToStorage("Heat", heats);
}

export async function setResultsToStorage(results:Result[]):Promise<boolean>{
    return await setAnyToStorage("Result", results);
}

export async function setSchedulesToStorage(schedules:Schedule[]):Promise<boolean>{
    return await setAnyToStorage("Schedule", schedules);
}

export async function setSwimmersToStorage(swimmers:Swimmer[]):Promise<boolean>{
    return await setAnyToStorage("Swimmer", swimmers);
}

export async function setClubsToStorage(clubs:Club[]):Promise<boolean>{
    return await setAnyToStorage("Club", clubs);
}

export async function setAttendingClubsToStorage(clubs:AttendingClubs[]):Promise<boolean>{
    return await setAnyToStorage("AttendingClubs", clubs);
}

export async function setAttendingSwimmersToStorage(swimmers:AttendingSwimmers[]):Promise<boolean>{
    return await setAnyToStorage("AttendingSwimmers", swimmers);
}
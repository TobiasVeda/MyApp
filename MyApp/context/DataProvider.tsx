import {createContext,  useContext, useEffect, useState} from "react";
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
} from "@/services/interface";
import {
    getAllAttendingClubsFromDB, getAllAttendingSwimmersFromDB,
    getAllClubsFromDB,
    getAllDisciplinesFromDB,
    getAllHeatsFromDB, getAllMeetDetailsFromDB,
    getAllMeetsFromDB, getAllResultsFromDB, getAllSchedulesFromDB, getAllSwimmersFromDB
} from "@/services/database";


const DataContext = createContext<any>(null);
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }:any) => {
    const [meetID, setMeetID] = useState(0);
    const [disciplineID, setDisciplineID] = useState("");
    const [heatID, setHeatID] = useState("");
    const [clubID, setClubID] = useState(0);
    const [swimmerID, setSwimmerID] = useState(0);


    const [allMeets, setAllMeets] = useState<Meet[]>([])
    const [allMeetDetails, setAllMeetDetails] = useState<MeetDetails[]>([])
    const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([])
    const [allHeats, setAllHeats] = useState<Heat[]>([])
    const [allResults, setAllResults] = useState<Result[]>([])
    const [allSchedules, setAllSchedules] = useState<Schedule[]>([])
    const [allSwimmers, setAllSwimmers] = useState<Swimmer[]>([])
    const [allClubs, setAllClubs] = useState<Club[]>([])
    const [allAttendingClubs, setAllAttendingClubs] = useState<AttendingClubs[]>([])
    const [allAttendingSwimmers, setAllAttendingSwimmers] = useState<AttendingSwimmers[]>([])

    const loadAll = async ()=>{
        // Intended to be called in index. Index depends on list of meets,
        // ensure that meets are loaded first.
        await loadAllMeets();
        loadAllMeetDetails()
        loadAllDisciplines();
        loadAllHeats();
        loadAllResults();
        loadAllSchedules();
        loadAllSwimmers();
        loadAllClubs();
    }

    const loadAllMeetDetails = async ()=>{
        const dbRes = await getAllMeetDetailsFromDB();
        setAllMeetDetails(dbRes);
    }
    const loadAllMeets = async ()=>{
        const dbRes = await getAllMeetsFromDB();
        setAllMeets(dbRes);
    }
    const loadAllDisciplines = async ()=>{
        const dbRes = await getAllDisciplinesFromDB();
        setAllDisciplines(dbRes);
    }
    const loadAllHeats = async ()=>{
        const dbRes = await getAllHeatsFromDB();
        setAllHeats(dbRes);
    }
    const loadAllResults = async ()=>{
        const dbRes = await getAllResultsFromDB();
        setAllResults(dbRes);
    }
    const loadAllSchedules = async ()=>{
        const dbRes = await getAllSchedulesFromDB()
        setAllSchedules(dbRes);
    }
    const loadAllSwimmers = async ()=>{
        const dbRes = await getAllSwimmersFromDB()
        setAllSwimmers(dbRes);
    }
    const loadAllClubs = async ()=>{
        const dbRes = await getAllClubsFromDB()
        setAllClubs(dbRes);
    }
    const loadAllAttendingClubs = async ()=>{
        const dbRes = await getAllAttendingClubsFromDB();
        setAllAttendingClubs(dbRes);
    }
    const loadAllAttendingSwimmers = async ()=>{
        const dbRes = await getAllAttendingSwimmersFromDB();
        setAllAttendingSwimmers(dbRes);
    }


    return (
        <DataContext.Provider
            value={{ allResults, loadAllResults, loadAllAttendingSwimmers, loadAllAttendingClubs, allAttendingSwimmers, setAllAttendingSwimmers, allAttendingClubs, setAllAttendingClubs, meetID, setMeetID, disciplineID, setDisciplineID, heatID, setHeatID, clubID, setClubID, swimmerID, setSwimmerID, allMeets, allMeetDetails, allDisciplines, allHeats, loadAllMeets, loadAllMeetDetails, loadAllDisciplines, loadAllHeats, loadAll, loadAllSchedules, allSchedules, allSwimmers, setAllSwimmers, allClubs, setAllClubs, loadAllSwimmers, loadAllClubs}}
        >
            {children}
        </DataContext.Provider>
    );
};
import {createContext,  useContext, useEffect, useState} from "react";
import {
    getAllAttendingDisciplinesWhere,
    getAllHeatsWhere,
    getAllMeets,
    getAllSwimmersOfDisciplineWhere
} from "@/services/database/SQLDatabase";
import {AttendingDiscipline, Heat, Meet, Swimmer} from "@/services/types";
import {AttendingClubs} from "@/services/legacy/interface";


const DataContext = createContext<any>(null);
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }:any) => {
    const [meetID, setMeetID] = useState(0);
    const [attendingDisciplineVal, setAttendingDisciplineVal] = useState(0);
    const [disciplineRedirect, setDisciplineRedirect] = useState("/");


    const [allMeets, setAllMeets] = useState<Meet[]>([]);
    const [allAttendingDisciplines, setAllAttendingDisciplines] = useState<AttendingDiscipline[]>([]);
    const [allHeats, setAllHeats] = useState<Heat[]>([]);
    const [allSwimmers, setAllSwimmers] = useState<Swimmer[]>([]);

    const loadAll = async ()=>{
        // Intended to be called in index. Index depends on list of meets,
        // ensure that meets are loaded first.
        await loadAllMeets();
        // loadAllAttendingDisciplines(); // Useless when no meet selected
    }


    const loadAllMeets = async ()=>{
        const dbRes = await getAllMeets();
        if (dbRes === null){
            setAllMeets([]);
        } else {
            setAllMeets(dbRes);
        }
    }

    const loadAllAttendingDisciplines = async ()=>{
        const dbRes = await getAllAttendingDisciplinesWhere(meetID);
        if (dbRes === null){
            setAllAttendingDisciplines([]);
        } else {
            setAllAttendingDisciplines(dbRes);
        }
    }

    const loadAllHeats = async ()=>{
        const dbRes = await getAllHeatsWhere(meetID, attendingDisciplineVal);
        if (dbRes === null){
            setAllHeats([]);
        } else {
            setAllHeats(dbRes);
        }
    }

    const loadAllSwimmersOfDiscipline = async ()=>{
        const dbRes = await getAllSwimmersOfDisciplineWhere(meetID, attendingDisciplineVal);
        if (dbRes === null){
            setAllSwimmers([]);
        } else {
            setAllSwimmers(dbRes);
        }
    }



    return (
        <DataContext.Provider
            value={{ disciplineRedirect, setDisciplineRedirect, allSwimmers, setAllSwimmers, loadAllSwimmersOfDiscipline, allHeats, setAllHeats, loadAllHeats, loadAllAttendingDisciplines, loadAll, loadAllMeets, allMeets, meetID, setMeetID, allAttendingDisciplines, setAllAttendingDisciplines, attendingDisciplineVal,  setAttendingDisciplineVal}}
        >
            {children}
        </DataContext.Provider>
    );
};
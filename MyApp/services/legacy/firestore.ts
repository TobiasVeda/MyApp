import {db} from "@/firebaseConfig";
import {collection, getDocs, setDoc, doc, getDoc, writeBatch} from "firebase/firestore";
import {Discipline, Heat, Meet, MeetDetails, Schedule} from "./interface";




export async function getAllMeetsFromFirestore():Promise<Meet[] | null>{

    try {
        //const q = query(collection(db, "cities"), where("capital", "==", true));
        const querySnapshot = await getDocs(collection(db, "meet"));
        let temp:Meet[] = [];
        querySnapshot.forEach((doc)=>{
            temp.push({
                id: parseInt(doc.id),
                name: doc.data().name,
                dateFrom: doc.data().dateFrom,
                dateTo: doc.data().dateTo,
                location: doc.data().location
            })
        })
        return temp;

    } catch (e) {
        console.error("Error getting documents: ");
        console.log(e);
        return null;
    }
}

export async function getAllMeetDetailsFromFirestore():Promise<MeetDetails[] | null>{

    try {
        const querySnapshot = await getDocs(collection(db, "meetDetails"));
        let temp:MeetDetails[] = [];
        querySnapshot.forEach((doc)=>{
            temp.push({
                id: parseInt(doc.id),
                startLists: doc.data().startLists,
                heatLists: doc.data().heatLists,
                results: doc.data().results,
                finals: doc.data().finals,
                schedule: doc.data().schedule,
                clubs: doc.data().clubs,
                livetiming: doc.data().livetiming
            })
        })
        return temp;

    } catch (e) {
        console.error("Error getting documents: ");
        console.log(e);
        return null;
    }
}


export async function getAllDisciplinesFromFirestore():Promise<Discipline[] | null>{

    try {
        const querySnapshot = await getDocs(collection(db, "discipline"));
        let temp:Discipline[] = [];
        querySnapshot.forEach((doc)=>{
            temp.push({
                id: doc.id,
                meetID: parseInt(doc.data().meetID),
                name: doc.data().name,
                // startTime: doc.data().startTime
            })
        })
        return temp;

    } catch (e) {
        console.error("Error getting documents: ");
        console.log(e);
        return null;
    }
}

export async function getAllHeatsFromFirestore():Promise<Heat[] | null>{

    try {
        const querySnapshot = await getDocs(collection(db, "heat"));
        let temp:Heat[] = [];
        querySnapshot.forEach((doc)=>{
            temp.push({
                id: doc.id,
                disciplineID: doc.data().disciplineID,
                heatNumber: doc.data().heatNumber,
                lanes: doc.data().lanes
            })
        })
        return temp;

    } catch (e) {
        console.error("Error getting documents: ");
        console.log(e);
        return null;
    }
}

export async function getAllSchedulesFromFirestore():Promise<Schedule[] | null>{

    try {
        const querySnapshot = await getDocs(collection(db, "schedule"));
        let temp:Schedule[] = [];
        querySnapshot.forEach((doc)=>{
            temp.push({
                index: doc.data().index,
                id: doc.id,
                meetID: doc.data().meetID,
                name: doc.data().name,
                start: doc.data().start,
                isDate: doc.data().isDate,
                isPause: doc.data().isPause,
                isEnd: doc.data().isEnd,
                heats: doc.data().heats
            })
        })
        return temp;

    } catch (e) {
        console.error("Error getting documents: ");
        console.log(e);
        return null;
    }
}



export async function setMeetsToFirestore(meets:Meet[]):Promise<boolean>{

    try {
        const batch = writeBatch(db);

        for (let i = 0; i < meets.length; i++) {

            batch.set(doc(db, "meet", meets[i].id.toString()), {
                name: meets[i].name,
                dateFrom: meets[i].dateFrom,
                dateTo: meets[i].dateTo,
                location: meets[i].location
            });
        }

        await batch.commit();
        return true;

    } catch (e) {
        console.error("Error setting documents: ");
        console.log(e);
        return false;
    }
}


export async function setMeetDetailsToFirestore(details:MeetDetails):Promise<boolean>{

    try {
        await setDoc(doc(db, "meetDetails", details.id.toString()), {
            startLists: details.startLists,
            heatLists: details.heatLists,
            results: details.results,
            finals: details.finals,
            schedule: details.schedule,
            clubs: details.clubs,
            livetiming: details.livetiming
        });

        return true;

    } catch (e) {
        console.error("Error setting documents: ");
        console.log(e);
        return false;
    }
}


export async function setDisciplinesToFirestore(disciplines:Discipline[]):Promise<boolean>{

    try {
        const batch = writeBatch(db);

        for (let i = 0; i < disciplines.length; i++) {

            batch.set(doc(db, "discipline", disciplines[i].id), {
                meetID: disciplines[i].meetID,
                name: disciplines[i].name
            });
        }

        await batch.commit();
        return true;

    } catch (e) {
        console.error("Error setting documents: ");
        console.log(e);
        return false;
    }
}




export async function setHeatsToFirestore(heats:Heat[]):Promise<boolean>{

    try {
        const batch = writeBatch(db);

        for (let i = 0; i < heats.length; i++) {

            batch.set(doc(db, "heat", heats[i].id.toString()), {
                disciplineID: heats[i].disciplineID, // FK
                heatNumber: heats[i].heatNumber,
                lanes: heats[i].lanes
            });
        }

        await batch.commit();
        return true;

    } catch (e) {
        console.error("Error setting documents: ");
        console.log(e);
        return false;
    }
}

export async function setSchedulesToFirestore(schedules:Schedule[]):Promise<boolean>{

    try {
        const batch = writeBatch(db);

        for (let i = 0; i < schedules.length; i++) {

            batch.set(doc(db, "schedule", schedules[i].id.toString()), {
                index: schedules[i].index,
                name: schedules[i].name,
                meetID: schedules[i].meetID,
                start: schedules[i].start,
                isDate: schedules[i].isDate,
                isPause: schedules[i].isPause,
                isEnd: schedules[i].isEnd,
                heats: schedules[i].heats
            });
        }

        await batch.commit();
        return true;

    } catch (e) {
        console.error("Error setting documents: ");
        console.log(e);
        return false;
    }
}








// export async function getMeet(id:number):Promise<Meet | null>{
//
//     try {
//         //const q = query(collection(db, "cities"), where("capital", "==", true));
//         const docSnap = await getDoc(doc(db, "meet", id.toString()));
//
//         if (!docSnap.exists()){
//             return null;
//         }
//
//         return {
//             id: parseInt(docSnap.id),
//             name: docSnap.data().name,
//             dateFrom: docSnap.data().dateFrom,
//             dateTo: docSnap.data().dateTo,
//             location: docSnap.data().location
//         };
//
//     } catch (e) {
//         console.error("Error getting document: ");
//         console.log(e);
//         return null;
//     }
// }
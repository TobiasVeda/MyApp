import {Text, View, StyleSheet, Animated, Button, TextInput} from "react-native";

import {useEffect, useLayoutEffect, useState} from "react";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {useNavigation} from "expo-router";
import {fillHeats, fillMeet, fillMeetList, fillSchedule} from "@/services/scrape/filler";
import {useData} from "@/context/DataProvider";
import {Meet} from "@/services/types";
import {createDB, dropDB, hardResetDB} from "@/services/database/SQLDatabase";
import {
    scrapeClubs,
    scrapeFinals,
    scrapeHeats,
    scrapeMeetDetails,
    scrapeMeetOptions,
    scrapeResults, scrapeSchedule,
    scrapeStartLists
} from "@/services/scrape/scraper";



export default function Index() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const { allMeets, loadAllMeets, loadAll, setMeetID } = useData();
    let meets:Meet[] = allMeets;
    meets = meets.filter((m:Meet)=>(m.meetName.toLowerCase().includes(search.toLowerCase())));
    meets.sort((a, b)=>{return b.dateFrom.localeCompare(a.dateFrom)});


    const subtitle = (from:string, to:string, loc:string)=>{
        const f = new Date(from);
        const t = new Date(to);
        if (to === "0.0.0"){
            return f.toLocaleDateString() + " " + loc;
        } else {
            return f.toLocaleDateString() + " - " + t.toLocaleDateString() + " " + loc;
        }
        // return from + " - " + to + " " + loc;
    }

    const refresh = async ()=>{
        // await hardResetDB();
        // await dropDB();
        // await createDB();
        // await fillMeetList(2025);
        // await loadAllMeets();
        fillSchedule(5253)

    }

    useEffect(() => {
        // updates allMeets
        loadAll();
    }, []);

    return (
            <ScrollView>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={"Søk Stevner"}
                    placeholderTextColor={"gray"}
                />
                <Button title={"refresh"} onPress={refresh}/>
                {meets.map((m:Meet, i:number)=>(
                    <ListItem key={"meet"+i} id={m.meetID} title={m.meetName} subtitle={subtitle(m.dateFrom, m.dateTo, m.location)} setter={setMeetID} href={"/meet"}/>

                ))}

            </ScrollView>

    );
}

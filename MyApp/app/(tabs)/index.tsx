import {Text, View, StyleSheet, Animated, Button, TextInput} from "react-native";
import {useData} from "@/context/DataProvider";
import {useEffect, useLayoutEffect, useState} from "react";
import {Meet} from "@/services/interface";
import {completeFillOfMeet, fillMeets, fillResults} from "@/services/filler";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {useNavigation} from "expo-router";


export default function Index() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const { allMeets, loadAllMeets, loadAll, setMeetID } = useData();
    let meets:Meet[] = allMeets;
    meets = meets.filter((m:Meet)=>(m.name.toLowerCase().includes(search.toLowerCase())));
    meets.sort((a, b)=>{return b.dateFrom.localeCompare(a.dateFrom)});


    const msg = (msg:string)=>{
        console.log(msg);
    }

    const subtitle = (from:string, to:string, loc:string)=>{
        const f = new Date(from);
        const t = new Date(to);
        if (to === "0.0.0"){
            return f.toLocaleDateString() + " " + loc;
        } else {
            return f.toLocaleDateString() + " - " + t.toLocaleDateString() + " " + loc;
        }
    }

    const refresh = async ()=>{
        // await fillMeets();
        // await loadAllMeets();
        console.log(await fillResults("5265-3"));
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
                {meets.map((meet:Meet, i:number)=>(
                    <ListItem key={"meet"+i} id={meet.id} title={meet.name} subtitle={subtitle(meet.dateFrom, meet.dateTo, meet.location)} setter={setMeetID} href={"/meet"}/>

                ))}

            </ScrollView>

    );
}

import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/DataProvider";
import {Discipline, Meet, Schedule} from "@/services/interface";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {fillSchedules} from "@/services/filler";
import {Redirect, useNavigation} from "expo-router";
import {useLayoutEffect} from "react";


export default function ScheduleList() {
    const navigation = useNavigation();
    const { meetID, allSchedules, loadAllSchedules } = useData();
    const schedules:Schedule[] = allSchedules.filter((s:Schedule)=>(s.meetID === meetID));
    schedules.sort((a, b) => {
        return a.index - b.index;
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Tidsskjema",
        });
    }, [navigation]);

    const doNothing = ()=>{};

    const refresh = async ()=>{
        await fillSchedules(meetID);
        await loadAllSchedules();
    }

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {schedules.map((s:Schedule, i:number)=>(
                <ListItem key={i} id={s.id} title={s.name} value={s.start} setter={doNothing} href={"/schedule"}/>
            ))}
        </ScrollView>
    );
}
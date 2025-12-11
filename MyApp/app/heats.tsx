import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/DataProvider";
import {Discipline, Heat, Meet, Schedule, Swimmer} from "@/services/interface";
import ScrollView = Animated.ScrollView;
import {fillHeats} from "@/services/filler";
import ListItem from "@/components/ListItem";
import {useLayoutEffect} from "react";
import {Redirect, useNavigation} from "expo-router";


export default function Heats() {
    const navigation = useNavigation();
    const { meetID, allHeats, allDisciplines, disciplineID, allSwimmers, loadAllHeats, allSchedules } = useData();
    const heats = allHeats.filter((h:Heat)=>(h.disciplineID === disciplineID));
    const thisDiscipline:Discipline = allDisciplines.find((d:Discipline)=>(d.id === disciplineID));

    const schedules:Schedule = (allSchedules.filter((s:Schedule)=>(s.id === disciplineID)))[0];

    useLayoutEffect(() => {
        navigation.setOptions({
            title: thisDiscipline?.name,
        });
    }, [navigation, thisDiscipline]);

    const swimmerName = (id:number)=>{
        let a:Swimmer = allSwimmers.find((s:Swimmer) => (s.id === id));
        return a?.name;
    }

    const refresh = async ()=>{
        await fillHeats(disciplineID);
        await loadAllHeats();
    }

    const doNothing = ()=>{}

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {heats.map((h:Heat, i:number)=>(
                <View key={"V"+i}>
                    <Text key={"H"+i}>Heat {i+1}: {schedules?.heats[i]}</Text>
                    {h.lanes.map((l, j:number)=>(
                        <ListItem key={j} id={h.id} number={l.laneNumber} title={swimmerName(l.swimmerID)} value={l.swimmerRegisteredTime} setter={doNothing} href={"/heats"}/>
                    ))}
                </View>

            ))}
        </ScrollView>
    );
}
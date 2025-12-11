import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/DataProvider";
import {Discipline, Heat, Meet, Result, Schedule, Swimmer} from "@/services/interface";
import ScrollView = Animated.ScrollView;
import {fillHeats, fillResults} from "@/services/filler";
import ListItem from "@/components/ListItem";
import {useLayoutEffect} from "react";
import {Redirect, useNavigation} from "expo-router";


export default function Results() {
    const navigation = useNavigation();
    const { meetID, allResults, allDisciplines, disciplineID, allSwimmers, loadAllResults } = useData();
    const results:Result[] = allResults.filter((r:Result)=>(r.disciplineID === disciplineID));
    const thisDiscipline:Discipline = allDisciplines.find((d:Discipline)=>(d.id === disciplineID));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: thisDiscipline.name,
        });
    }, [navigation, thisDiscipline]);

    const swimmerName = (id:number)=>{
        let a:Swimmer = allSwimmers.find((s:Swimmer) => (s.id === id));
        return a?.name;
    }

    const refresh = async ()=>{
        await fillResults(disciplineID);
        await loadAllResults();
    }

    const doNothing = ()=>{}

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {results.map((r:Result, i:number)=>(
                <View key={"V"+i}>
                    <Text key={"R"+i}>{r.ageGroup}</Text>
                    {r.ranking.map((rk, j:number)=>(
                        <ListItem key={j} id={r.id} number={rk.place} title={swimmerName(rk.swimmerID)} value={rk.swimmerResultTime} setter={doNothing} href={"/results"}/>
                    ))}
                </View>

            ))}
        </ScrollView>
    );
}
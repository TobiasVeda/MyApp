import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/DataProvider";
import {Discipline, Meet} from "@/services/interface";
import ScrollView = Animated.ScrollView;
import {fillDisciplines, fillMeets} from "@/services/filler";
import ListItem from "@/components/ListItem";
import {Redirect, useNavigation} from "expo-router";
import {useLayoutEffect} from "react";


export default function ResultDisciplinesPage() {
    const navigation = useNavigation();
    const { meetID, allDisciplines, loadAllDisciplines, setDisciplineID } = useData();
    const disciplines = allDisciplines.filter((d:Discipline)=>(d.meetID === meetID));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Øvelser",
        });
    }, [navigation]);

    const refresh = async ()=>{
        await fillDisciplines(meetID);
        await loadAllDisciplines();
    }

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {disciplines.map((d:Discipline, i:number)=>(
                <ListItem key={i} id={d.id} title={d.name} setter={setDisciplineID} href={"/results"}/>
            ))}
        </ScrollView>
    );
}
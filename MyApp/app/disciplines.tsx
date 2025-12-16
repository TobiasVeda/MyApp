import {Text, View, StyleSheet, Animated, Button} from "react-native";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {Redirect, useNavigation} from "expo-router";
import {useEffect, useLayoutEffect} from "react";
import {useData} from "@/context/DataProvider";
import {AttendingDiscipline} from "@/services/types";


export default function DisciplinesPage() {
    const navigation = useNavigation();
    const { meetID, allAttendingDisciplines, loadAllAttendingDisciplines, setAttendingDisciplineVal, disciplineRedirect } = useData();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Øvelser",
        });
    }, [navigation]);


    useEffect(() => {
        loadAllAttendingDisciplines();
    }, []);

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            {allAttendingDisciplines.map((d:AttendingDiscipline, i:number)=>(
                <ListItem key={i} id={d.val} title={d.name} setter={setAttendingDisciplineVal} href={disciplineRedirect}/>
            ))}
        </ScrollView>
    );
}
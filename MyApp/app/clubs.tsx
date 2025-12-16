import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/legacy/DataProvider";
import {AttendingClubs, Club, Discipline, Meet} from "@/services/legacy/interface";
import ScrollView = Animated.ScrollView;
import {fillClubs, fillDisciplines, fillMeets} from "@/services/legacy/filler";
import ListItem from "@/components/ListItem";
import {Redirect, useNavigation} from "expo-router";
import {useLayoutEffect} from "react";


export default function ClubsPage() {
    const navigation = useNavigation();
    const { meetID, allClubs, allAttendingClubs, setClubID, loadAllClubs, loadAllAttendingClubs } = useData();

    const attendance:AttendingClubs = (allAttendingClubs.filter((a: AttendingClubs)=>(a.id === meetID)))[0];
    const clubs:Club[] = allClubs.filter((c:Club)=>(attendance?.clubIDs.includes(c.id)));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Klubber & Personer",
        });
    }, [navigation]);

    const refresh = async ()=>{
        await fillClubs(meetID);
        await loadAllClubs();
        await loadAllAttendingClubs();
    }

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {clubs.map((c:Club, i:number)=>(
                <ListItem key={i} id={c.id} title={c.name} setter={setClubID} href={"/swimmers"}/>
            ))}
        </ScrollView>
    );
}
import {Text, View, StyleSheet, Animated, Button} from "react-native";
import {useData} from "@/context/DataProvider";
import {AttendingSwimmers, Club, Meet, Swimmer} from "@/services/interface";
import ScrollView = Animated.ScrollView;
import {fillSwimmers} from "@/services/filler";
import ListItem from "@/components/ListItem";
import {useLayoutEffect} from "react";
import {Redirect, useNavigation} from "expo-router";


export default function Swimmers() {
    const navigation = useNavigation();
    const { meetID, clubID, allClubs, allSwimmers, allAttendingSwimmers, setSwimmerID, loadAllSwimmers, loadAllAttendingSwimmers } = useData();

    const attendance:AttendingSwimmers = (allAttendingSwimmers.filter((a: AttendingSwimmers)=>(a.id === (meetID+"-"+clubID))))[0];
    const swimmers:Swimmer[] = allSwimmers.filter((s:Swimmer)=>(
        attendance?.swimmerIDs.includes(s.id)
        &&
        s.clubID === clubID
    ));

    const thisClub:Club = allClubs.find((c:Club)=>(c.id === clubID));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: thisClub.name,
        });
    }, [navigation, thisClub]);

    const refresh = async ()=> {
        await fillSwimmers(meetID, clubID);
        await loadAllSwimmers();
        await loadAllAttendingSwimmers();
    }

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {swimmers.map((s:Swimmer, i:number)=>(
                <ListItem key={i} id={s.id} title={s.name} setter={setSwimmerID} href={"/swimmers"}/>
            ))}
        </ScrollView>
    );
}
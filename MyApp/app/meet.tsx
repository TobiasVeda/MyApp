import {Text, View, StyleSheet, Animated, Button} from "react-native";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {Redirect, router, useNavigation, useRouter} from "expo-router";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useData} from "@/context/DataProvider";
import {Meet} from "@/services/types";
import {fillMeet} from "@/services/scrape/filler";


export default function MeetPage() {
    const navigation = useNavigation();
    const { meetID, allMeets, loadAllMeets, disciplineRedirect, setDisciplineRedirect } = useData();
    const thisMeet:Meet = allMeets.find((m:Meet)=>(m.meetID === meetID));
    const [loading, setLoading] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: thisMeet?.meetName,
            headerRight: ()=>{return (<Text>{loading}</Text>);}
        });
    }, [navigation, thisMeet, loading]);

    const refresh = async ()=>{
        setLoading("Laster...")
        await fillMeet(meetID);
        await loadAllMeets();
        setLoading("Lastet");
    }

    const doNothing = ()=>{};

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {thisMeet.hasStartlists && <ListItem id={0} title={"Startlister"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
            {thisMeet.hasHeatlists && <ListItem id={"/heats"} title={"Heatlister"} setter={setDisciplineRedirect} href={"/disciplines"}/>}
            {thisMeet.hasResults && <ListItem id={"/results"} title={"Resultater"} setter={setDisciplineRedirect} href={"/disciplines"}/>}
            {thisMeet.hasFinals && <ListItem id={0} title={"Finalelister"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
            {thisMeet.hasSchedule && <ListItem id={0} title={"Tidsskjema"} setter={doNothing} href={"/schedule"}/>}
            {thisMeet.hasClubs && <ListItem id={0} title={"Klubber & Personer"} setter={doNothing} href={"/clubs"}/>}
            {thisMeet.hasLivetiming && <ListItem id={0} title={"Livetiming"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
        </ScrollView>
    );
}
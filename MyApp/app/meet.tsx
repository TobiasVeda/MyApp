import {Text, View, StyleSheet, Animated, Button} from "react-native";
import ScrollView = Animated.ScrollView;
import {useData} from "@/context/DataProvider";
import { Meet, MeetDetails} from "@/services/interface";
import ListItem from "@/components/ListItem";
import {fillMeetDetails} from "@/services/filler";
import {Redirect, router, useNavigation, useRouter} from "expo-router";
import {useEffect, useLayoutEffect, useRef} from "react";


export default function MeetPage() {
    const navigation = useNavigation();
    const { meetID, allMeets, allMeetDetails, loadAllMeetDetails } = useData();
    const details:MeetDetails = allMeetDetails.filter((m:MeetDetails)=>(m.id === meetID))[0];
    const thisMeet:Meet = allMeets.find((m:Meet)=>(m.id === meetID));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: thisMeet?.name,
            // headerRight: ()=>( ),
        });
    }, [navigation, thisMeet]);

    const refresh = async ()=>{
        await fillMeetDetails(meetID);
        await loadAllMeetDetails();
    }

    const doNothing = ()=>{};

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {details?.startLists && <ListItem id={0} title={"Startlister"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
            {details?.heatLists && <ListItem id={0} title={"Heatlister"} setter={doNothing} href={"/disciplines"}/>}
            {details?.results && <ListItem id={0} title={"Resultater"} setter={doNothing} href={"/resultDisciplines"}/>}
            {details?.finals && <ListItem id={0} title={"Finalelister"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
            {details?.schedule && <ListItem id={0} title={"Tidsskjema"} setter={doNothing} href={"/schedule"}/>}
            {details?.clubs && <ListItem id={0} title={"Klubber & Personer"} setter={doNothing} href={"/clubs"}/>}
            {details?.livetiming && <ListItem id={0} title={"Livetiming"} subtitle={"(Not Functional)"} setter={doNothing} href={"/meet"}/>}
        </ScrollView>
    );
}
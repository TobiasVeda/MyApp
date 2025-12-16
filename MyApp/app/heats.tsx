import {Text, View, StyleSheet, Animated, Button} from "react-native";
import ScrollView = Animated.ScrollView;
import ListItem from "@/components/ListItem";
import {useEffect, useLayoutEffect, useState} from "react";
import {Redirect, useNavigation} from "expo-router";
import {useData} from "@/context/DataProvider";
import {Heat, Swimmer} from "@/services/types";
import {fillHeats} from "@/services/scrape/filler";


export default function Heats() {
    const navigation = useNavigation();
    const { meetID, allHeats, loadAllHeats, attendingDisciplineVal } = useData();
    const [loading, setLoading] = useState("");
    let grouped = Object.groupBy(allHeats, (heat:Heat)=>(heat.heatNumber));
    Object.values(grouped).forEach(heats => {
        heats?.sort((a, b) => (a.lane - b.lane));
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Heatliste",
            headerRight: ()=>{return (<Text>{loading}</Text>);}
        });
    }, [navigation, loading]);


    const refresh = async ()=>{
        setLoading("Laster...")
        await fillHeats(meetID, attendingDisciplineVal);
        await loadAllHeats();
        setLoading("Lastet")
    }

    useEffect(() => {
        loadAllHeats();
    }, []);

    const doNothing = ()=>{}

    if (meetID === 0) {
        return <Redirect href="/" />;
    }

    return (
        <ScrollView>
            <Button title={"refresh"} onPress={refresh}/>
            {Object.entries(grouped).map(([heatNumber, heats]) => (
                <View key={heatNumber}>
                    <Text>Heat {heatNumber}</Text>
                    {heats?.map((h: Heat, i: number) => (
                        <ListItem
                            key={i}
                            id={h.swimmerID}
                            number={h.lane}
                            title={h.swimmerName}
                            subtitle={h.clubName}
                            value={h.registeredTime}
                            setter={doNothing}
                            href={"/heats"}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}
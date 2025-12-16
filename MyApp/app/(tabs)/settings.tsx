import {Button, Text, View} from "react-native";
import {scrapeDisciplineList} from "@/services/legacy/scraper";
import {fillDisciplines, fillHeats, fillMeets} from "@/services/legacy/filler";


export default function Index() {

    // fillHeats(5229, "temp", 21)

    const temp = async ()=>{
        fillHeats("5229-7");
        // fillDisciplines(5229)
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button title={"refresh"} onPress={temp}/>
            <Text>poopoo</Text>
        </View>
    );
}
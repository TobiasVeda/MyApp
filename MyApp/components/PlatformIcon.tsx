import {Platform} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { SymbolView, SymbolViewProps, SFSymbol } from 'expo-symbols';

interface Props{
    name:string,
    size:number,
    color:string
}

export function PlatformIcon({ name, size, color }:Props) {


    return <Icon name={"web"}/>

}
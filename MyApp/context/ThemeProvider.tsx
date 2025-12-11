import {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";
import {Appearance} from 'react-native';


const Colors = {
    light: {
        tab: {
            bg: "#FFFFFF",
            text: "#000000",
            btn: "#8e8e8f",
            btnFocus: "#007aff"
        },
        item: {
            primary: "#29508C",
            secondary: "rgba(255, 255, 255, 0.2)",
            text: "#FFFFFF"
        }
    },
    dark: {
        tab: {
            bg: "#000000",
            text: "#FFFFFF",
            btn: "#8e8e8f",
            btnFocus: "#007aff"
        },
        item: {
            primary: "#29508C",
            secondary: "rgba(255, 255, 255, 0.2)",
            text: "#FFFFFF"
        }
    }
};

const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }:any) => {
    const [theme, setTheme] = useState("light");
    const [tabBgColor, setTabBgColor] = useState(Colors.light.tab.bg);
    const [tabTextColor, setTabTextColor] = useState(Colors.light.tab.text);
    const [tabBtnColor, setTabBtnColor] = useState(Colors.light.tab.btn);
    const [tabBtnFocusColor, setTabBtnFocusColor] = useState(Colors.light.tab.btnFocus)
    const [itemColor, setItemColor] = useState(Colors.light.item.primary);
    const [itemSubColor, setItemSubColor] = useState(Colors.light.item.primary);
    const [itemTextColor, setItemTextColor] = useState(Colors.light.item.text);



    useLayoutEffect(() => {
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme !== null && colorScheme !== undefined) {
            setTheme(colorScheme);
        }
    }, []);

    useLayoutEffect(() => {
        if (theme === "light"){
            setTabBgColor(Colors.light.tab.bg);
            setTabTextColor(Colors.light.tab.text);
            setTabBtnColor(Colors.light.tab.btn);
            setTabBtnFocusColor(Colors.light.tab.btnFocus)
            setItemColor(Colors.light.item.primary);
            setItemSubColor(Colors.light.item.primary);
            setItemTextColor(Colors.light.item.text);
        } else{
            setTabBgColor(Colors.dark.tab.bg);
            setTabTextColor(Colors.dark.tab.text);
            setTabBtnColor(Colors.dark.tab.btn);
            setTabBtnFocusColor(Colors.dark.tab.btnFocus)
            setItemColor(Colors.dark.item.primary);
            setItemSubColor(Colors.dark.item.primary);
            setItemTextColor(Colors.dark.item.text);
        }


    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{ tabBgColor, tabTextColor, tabBtnColor, tabBtnFocusColor, itemColor, itemSubColor, itemTextColor }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
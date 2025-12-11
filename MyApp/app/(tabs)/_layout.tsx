import { Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useTheme} from "@/context/ThemeProvider";

export default function TabLayout() {
    const { tabBgColor, tabTextColor, tabBtnColor, tabBtnFocusColor, itemColor, itemSubColor, itemTextColor } = useTheme();
  return  (
      <Tabs
          screenOptions={{
              // tabBarActiveTintColor: "#ffd33d",
              headerStyle: {
                  backgroundColor: tabBgColor,
              },
              headerShadowVisible: true,
              // headerTintColor: "#fff",
              tabBarStyle: {
                  backgroundColor: tabBgColor,
              },
          }}
      >

        <Tabs.Screen name="index" options={{
            title: "Stevner",
            tabBarIcon: ({ focused }) => (
                <Ionicons name={focused ? "home-sharp" : "home-outline"} color={focused ? tabBtnFocusColor : tabBtnColor} size={24} />
            ),
        }}
        />

        <Tabs.Screen name="settings" options={{
            title: "Instillinger",
            tabBarIcon: ({ focused }) => (
                <Ionicons name={focused ? "settings-sharp" : "settings-outline"} color={focused ? tabBtnFocusColor : tabBtnColor} size={24} />
            ),
        }}
        />
      </Tabs>
  );
}

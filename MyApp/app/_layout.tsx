import { Stack } from 'expo-router';
import {DataProvider} from "@/context/DataProvider";
import {ThemeProvider} from "@/context/ThemeProvider";

export default function RootLayout() {
    return (
        <DataProvider>
            <ThemeProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider>
        </DataProvider>
    );
}

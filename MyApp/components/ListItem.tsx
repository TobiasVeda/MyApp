import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {Link, LinkProps} from "expo-router";


interface Props {
    id:string|number,
    number?:number,
    title:string,
    subtitle?:string,
    value?:string,
    setter:(id: string | number) => void,
    href:LinkProps["href"]
}

const ListItem = ({ id, number, title, subtitle="", value="", setter, href}:Props) => {

    const temp = ()=>{
        setter(id)
    }

    return (
        <Link
            style={styles.container}
            onPress={temp}
            href={href}
        >
            <View style={styles.leftContent}>
                {/* Rank Badge */}
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{number}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{title}</Text>
                    <Text style={styles.clubText}>{subtitle}</Text>
                </View>
            </View>
            <View style={styles.rightContent}>
                <Text style={styles.scoreText}>{value}</Text>
                <Text style={styles.arrowIcon}>&#x203A;</Text>
            </View>
        </Link>
    );
};


const styles = StyleSheet.create({
    // The main blue background bar
    container: {
        flexDirection: "row", // Arrange children horizontally
        justifyContent: "space-between", // Push left and right content to edges
        alignItems: "center", // Center items vertically
        backgroundColor: "#29508C", // Dark blue color similar to the image
        paddingVertical: 8,
        paddingHorizontal: 15,
        minHeight: 50, // Ensure a minimum height
    },

    // --- Left Content (Rank, Name, Club) ---
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        // Allows the left content to take space but not push the right content out
        flexShrink: 1,
    },

    // The circular badge for the rank
    rankContainer: {
        width: 24, // Diameter of the circle
        height: 24,
        borderRadius: 12, // Half the width/height for a perfect circle
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Subtle white/transparent background for the circle
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    rankText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },

    // Container for the name and club (stacked vertically)
    infoContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    nameText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600", // Semi-bold for the name
        lineHeight: 20, // Adjust line height for better stacking
    },
    clubText: {
        color: "#FFFFFF",
        fontSize: 12,
        opacity: 0.8, // Slightly lower opacity for the club name
        lineHeight: 16,
    },

    // --- Right Content (Score, Arrow) ---
    rightContent: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10, // Give some space between long names and the score
    },
    scoreText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 5,
    },
    // Style for the simulated arrow icon
    arrowIcon: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        // Adjust position to better resemble a right-pointing arrow icon
        lineHeight: 24,
        width: 15,
        textAlign: 'center',
    },
});

export default ListItem;
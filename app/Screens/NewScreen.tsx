// import { useLocalSearchParams } from "expo-router";
// import { View, Text, Image } from "react-native";

// const NewScreen = () => {
//     const { name, email, picture } = useLocalSearchParams();

//     return (
//         <View>
//             <Text>Welcome {name}</Text>
//             <Text>Email: {email}</Text>
//             <Image source={{ uri: picture }} style={{ width: 100, height: 100 }} />
//         </View>
//     );
// };


// export default NewScreen;


import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import CustomButton from "../Components/CustomButton";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

const formatLabel = (label) =>
    label
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase()); // capitalize words

const NewScreen = () => {
    const user = useLocalSearchParams();

    // Move image out of the rest of the fields
    const { picture, name } = user;

    console.log(picture)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Welcome, {name}</Text>
            {picture && (
    <Image
        source={{ uri: decodeURIComponent(picture) }} // ✅ decode it
        style={styles.image}
    />
)}


            <View style={styles.infoContainer}>
                {Object.entries(user).map(([key, value]) => {
                    if (key === 'picture') return null;
                    return (
                        <View key={key} style={styles.row}>
                            <Text style={styles.label}>{formatLabel(key)}</Text>
                            <Text style={styles.value}>{decodeURIComponent(value)}</Text>
                        </View>
                    );
                })}
            </View>
                  <CustomButton title="Logout" logout onPress={()=> {router.push('/Screens/Login')} }/>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    infoContainer: {
        width: width * 0.9,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
        paddingBottom: 5,
    },
    label: {
        fontWeight: "600",
        fontSize: 16,
        color: "#333",
    },
    value: {
        fontSize: 16,
        color: "#555",
        textAlign: "right",
        flex: 1,
        marginLeft: 10,
    },
});

export default NewScreen;

import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
export const globalStyles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: "#fff",
        display: 'flex',
        flex: 1

    },
    activityContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipContainer: {

        top: height * 0.05,
        marginRight: width * 0.03,
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    skipText: {
        marginRight: width * 0.05,
        color: "#0057D8",
        fontWeight: "500",
        fontSize: 14,
    },
    image: {
        marginTop: height * 0.01,
        // marginHorizontal: width * 0.25,
        width: width * 0.5,
        height: height * 0.2,
        // marginBottom: height * 0.04,
        // marginTop: height * 0.12,
        alignSelf: 'center',
        resizeMode: 'contain',
        // backgroundColor:'red'
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: "700",
        // marginTop: height * 0.08, 
        // alignSelf: 'center',
        marginHorizontal: width * 0.08,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

        // backgroundColor:'red',

        color: "#37475A",
        // color: '#626856',
        // marginBottom: height * 0.02,
    },
    subtitle: {
        fontSize: width * 0.038,
        color: "#626856",
        marginHorizontal: width * 0.08,
        marginBottom: height * 0.05,
    },

    msgText: {
        fontSize: width * 0.022,
        color: "#626856",
        alignSelf: 'flex-start',
        marginLeft: width * 0.04,

    },
    nextButton: {
        marginTop: height * 0.08,

        alignSelf: 'center',
        width: width * 0.16,
        // marginRight: width*0.35,
        height: width * 0.16,
        borderRadius: width * 0.16 / 2,
        backgroundColor: "#0057D8",
        justifyContent: "center",
        alignItems: "center",
    },
    nextButtonText: {
        fontSize: width * 0.10,
        color: "#fff",
    },

    textInput: {
        // backgroundColor:'black',
        flexDirection: "column",
        borderRadius: 20,
        paddingTop: 20,
        marginHorizontal: width * 0.08,

    },
    forgotText: {
        marginHorizontal: width * 0.09,
        marginTop: height * 0.02,

        alignSelf: 'flex-start',
        color: "#694df0",
        // backgroundColor:'red',
        fontWeight: "500",
        fontSize: 14,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        maxHeight: 100,
        marginRight: 10,
    },


    error: {
        fontSize: 12,
        // marginBottom: height * 0.02,
        alignSelf: 'flex-start',
        marginLeft: width * 0.04,
        opacity: 0.7,
        color: "red",

    },

    lower_cont: {
        width: width,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.02,
        marginBottom: height * 0.03,
        // backgroundColor:'red',
        alignItems: "center",
    },


    // Login Header
    loginHeader: {
        marginTop: height * 0.02,

    },

    // Home Header
    homeHeader: {


        fontWeight: "700",
        paddingTop: height * 0.04,
        backgroundColor: "#0758C2",
        paddingBottom: height * 0.02,
        // paddingVertical: height * 0.04,
        marginBottom: height * 0.02,
    },


    // Feature Text
    featureTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: height * 0.02,
        alignItems: 'center',

        // marginHorizontal: width * 0.05,
        // marginHorizontal: width * 0.05,
        // marginBottom: height * 0.02,
        // backgroundColor: 'red'
    },

    featureText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#000',
    }
    ,
    seeAll: {
        fontSize: width * 0.03,
        color: '#0758C2',
        fontWeight: 'bold',
    },

    homeTitle: {
        // fontSize: width * 0.05,

        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,

    },
    homeSubTitle: {

        color: '#666',
        marginVertical: 4,
        fontSize: 13,

    },


    textCon: {
        width: width * 0.9,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: height * 0.02,
        // marginHorizontal: width * 0.04,
        marginBottom: height * 0.01,
        alignItems: 'center'
    },
    homeText: {
        fontSize: 18,
        fontWeight: 'bold'
    },


    //Group Headers 
    groupHeader: {
        width: width * 0.9,
        height: height * 0.06,
        // backgroundColor: 'red',
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        // paddingHorizontal: width * 0.05,
        marginHorizontal: width * 0.05,

        marginTop: height * 0.02,
    },
    groupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom: 10,
        // marginLeft: width * 0.05,
        color: '#333',


    },


    //Fields which is used in Groups Create Features

})
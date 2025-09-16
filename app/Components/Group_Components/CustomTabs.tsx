import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Dimensions
} from 'react-native';


const { width, height } = Dimensions.get('window');
const CustomTabs = ({ tabs, initialTab, onTabChange, containerStyle }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        onTabChange(activeTab);
    }, [activeTab]);

    return (
        <View style={[styles.container, containerStyle]}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tabButton,
                        { backgroundColor: activeTab === tab ? '#694df0' : '#e4e6eb' },
                    ]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            { color: activeTab === tab ? '#fff' : '#000' },
                        ]}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default CustomTabs;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        // backgroundColor:'red',
    //    marginTop: height * 0.02,
        // marginTop: height * 0.02, 
        width: width * 0.65,
        marginHorizontal: width * 0.05,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: width * 0.04,
        borderRadius: width * 0.05,
        // marginHorizontal: width * 0.008,
    },
    tabText: {
        fontWeight: '600',
        textAlign: 'center',
    },
});

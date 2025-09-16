import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing, View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AudioMessage = React.memo(({
    isSentByUser = false,
    duration = '0:14',
    time = '9:12 PM',
    audioUrl,
}) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const animationValues = useRef(Array(40).fill(0).map(() => new Animated.Value(5))).current;
    const animationRefs = useRef([]);

    const startAnimation = useCallback(() => {
        // Clear any existing animations
        stopAnimation();

        animationRefs.current = animationValues.map((val, index) => {
            const anim = Animated.loop(
                Animated.sequence([
                    Animated.timing(val, {
                        toValue: Math.random() * 30 + 5,
                        duration: 300 + Math.random() * 200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    Animated.timing(val, {
                        toValue: 5,
                        duration: 300 + Math.random() * 200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                ])
            );
            anim.start();
            return anim;
        });
    }, [animationValues]);

    const stopAnimation = useCallback(() => {
        animationRefs.current.forEach(anim => anim?.stop());
        animationRefs.current = [];
        animationValues.forEach(val => val.setValue(5));
    }, [animationValues]);

    const handlePlayPress = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                    stopAnimation();
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                    startAnimation();
                }
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true },
                    (status) => {
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            stopAnimation();
                        }
                    }
                );

                setSound(newSound);
                setIsPlaying(true);
                startAnimation();
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            stopAnimation();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            stopAnimation();
            if (sound) {
                sound.unloadAsync().catch(e => console.warn('Unload error:', e));
            }
        };
    }, [sound, stopAnimation]);

    return (
        <View
            style={[
                styles.bubbleContainer,
                isSentByUser ? styles.sentBubble : styles.receivedBubble,
            ]}
        >
            <TouchableOpacity
                onPress={handlePlayPress}
                activeOpacity={0.7}
                disabled={isLoading}
            >
                <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={24}
                    color={isSentByUser ? '#fff' : '#694df0'}
                    style={{ marginRight: 10 }}
                />
            </TouchableOpacity>

            <View style={styles.waveformContainer}>
                {animationValues.map((animatedHeight, index) => (
                    <Animated.View
                        key={`wave-${index}`}
                        style={[
                            styles.bar,
                            {
                                height: animatedHeight,
                                backgroundColor: isSentByUser ? '#fff' : '#694df0',
                            },
                        ]}
                    />
                ))}
            </View>

            <View style={[
                styles.metaContainer,
                isSentByUser ? styles.sentMetaContainer : styles.receivedMetaContainer
            ]}>
                <Text style={[styles.durationText, isSentByUser && { color: '#eee' }]}>
                    {duration}
                </Text>
                <Text style={[styles.timeText, isSentByUser && { color: '#ccc' }]}>
                    {time}
                </Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    bubbleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: width * 0.7,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 12,

    },
    sentBubble: {
        backgroundColor: '#694df0',
        alignSelf: 'flex-end',
    },
    receivedBubble: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderColor: '#eee',
        borderWidth: 1,
    },
    waveformContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        // backgroundColor: 'red',

    },
    bar: {
        width: 2,
        marginHorizontal: 1,
        borderRadius: 1,
        minHeight: 10,
    },
    metaContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 5,
    },
    sentMetaContainer: {
        alignItems: 'flex-end',
    },
    receivedMetaContainer: {
        alignItems: 'flex-start',
    },
    durationText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 2,
    },
    timeText: {
        fontSize: 10,
        color: '#999',
    },
});

AudioMessage.displayName = 'AudioMessage';

export default AudioMessage;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing, View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Function to generate realistic waveform data
const generateWaveformData = (duration) => {
    // Generate 40 bars for the waveform (optimized for smooth animation)
    const barCount = 40;
    const waveform = [];

    for (let i = 0; i < barCount; i++) {
        // Create realistic audio amplitude pattern
        // Higher amplitude in the middle, lower at the beginning and end
        const position = i / barCount;
        const centerBias = Math.sin(position * Math.PI); // Higher in the middle

        // Add some randomness to simulate real audio
        const randomFactor = 0.3 + Math.random() * 0.7;

        // Create varying heights (minimum 6, maximum 36)
        const height = Math.max(6, Math.min(36, 6 + (centerBias * randomFactor * 30)));

        waveform.push(height);
    }

    return waveform;
};

const AudioMessage = React.memo(({
    isSentByUser = false,
    duration = '0:14',
    time = '9:12 PM',
    audioUrl,
}) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 1

    // Generate realistic waveform data
    const waveformData = useRef(generateWaveformData(duration)).current;
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const animationRefs = useRef([]);

    // Simplified animations for WhatsApp-like experience
    const bounceAnimation = useRef(new Animated.Value(1)).current;

    const startProgressAnimation = useCallback(() => {
        if (totalDuration > 0) {
            progressAnimation.setValue(currentPosition / (totalDuration * 1000));
            const remainingDuration = totalDuration * 1000 - currentPosition;

            const progressAnim = Animated.timing(progressAnimation, {
                toValue: 1,
                duration: remainingDuration,
                easing: Easing.linear,
                useNativeDriver: false,
            });
            progressAnim.start();
            animationRefs.current.push(progressAnim);
        }
    }, [totalDuration, currentPosition, progressAnimation]);

    const stopAnimation = useCallback(() => {
        animationRefs.current.forEach(anim => anim?.stop());
        animationRefs.current = [];
        bounceAnimation.setValue(1);
    }, [bounceAnimation]);

    // Update playback progress for color changes
    useEffect(() => {
        if (totalDuration > 0 && currentPosition > 0) {
            setPlaybackProgress(currentPosition / (totalDuration * 1000));
        }
    }, [currentPosition, totalDuration]);

    const handlePlayPress = async () => {
        if (isLoading) return;

        // Add bounce animation on press
        Animated.sequence([
            Animated.timing(bounceAnimation, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(bounceAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        try {
            setIsLoading(true);

            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                    stopAnimation();
                } else {
                    // Check if audio has finished, if so reset to beginning
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded && status.positionMillis >= status.durationMillis - 100) {
                        // Audio has finished, reset to beginning
                        await sound.setPositionAsync(0);
                        progressAnimation.setValue(0);
                        setPlaybackProgress(0);
                        setCurrentPosition(0);
                    }

                    await sound.playAsync();
                    setIsPlaying(true);
                    startProgressAnimation();
                }
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true },
                    (status) => {
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            stopAnimation();
                            progressAnimation.setValue(0);
                            setPlaybackProgress(0);
                            setCurrentPosition(0);
                        }
                        if (status.positionMillis && status.durationMillis) {
                            setCurrentPosition(status.positionMillis);
                            setTotalDuration(status.durationMillis / 1000);
                        }
                    }
                );

                setSound(newSound);
                setIsPlaying(true);
                startProgressAnimation();
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
        <Animated.View
            style={[
                styles.bubbleContainer,
                isSentByUser ? styles.sentBubble : styles.receivedBubble,
            ]}
        >
            <TouchableOpacity
                onPress={handlePlayPress}
                activeOpacity={0.6}
                disabled={isLoading}
                style={[
                    styles.playButton,
                    // isPlaying &&
                    // isLoading && styles.playButtonLoading
                ]}
            >
                <Animated.View style={[
                    styles.playButtonInner,
                    { transform: [{ scale: bounceAnimation }] }
                ]}>
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={24}
                        color={isSentByUser ? '#fff' : '#694df0'}
                    />
                </Animated.View>
            </TouchableOpacity>

            <View style={styles.waveformContainer}>
                {waveformData.map((height, index) => {
                    // Calculate if this bar has been played (WhatsApp-like behavior)
                    const barProgress = index / waveformData.length;
                    const isPlayed = playbackProgress > barProgress;

                    return (
                        <View
                            key={`wave-${index}`}
                            style={styles.barContainer}
                        >
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: height,
                                        backgroundColor: isPlayed
                                            ? (isSentByUser ? '#fff' : '#694df0')  // Played color
                                            : (isSentByUser ? 'rgba(255, 255, 255, 0.4)' : 'rgba(105, 77, 240, 0.3)'), // Unplayed color
                                    },
                                ]}
                            />
                        </View>
                    );
                })}

                {/* WhatsApp-like moving dot indicator */}
                {/* <Animated.View
                    style={[
                        styles.movingDot,
                        {
                            backgroundColor: isSentByUser ? '#fff' : '#694df0',
                            left: progressAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-4, (waveformData.length * 3) - 4], // 3px per bar (2.5px width + 0.5px margin = 3px), -4 to center the 8px dot
                            }),
                        },
                    ]}
                /> */}
            </View>

            <View style={[
                styles.metaContainer,
                isSentByUser ? styles.sentMetaContainer : styles.receivedMetaContainer
            ]}>
                <Text style={[styles.durationText, isSentByUser && { color: '#eee' }]}>
                    {isPlaying && currentPosition > 0
                        ? `${Math.floor(currentPosition / 1000 / 60)}:${String(Math.floor((currentPosition / 1000) % 60)).padStart(2, '0')}`
                        : duration
                    }
                </Text>
                <Text style={[styles.timeText, isSentByUser && { color: '#ccc' }]}>
                    {time}
                </Text>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    bubbleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: width * 0.7,
        borderRadius: 12,
        marginVertical: 3,
        paddingVertical: 13,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    playButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    playButtonLoading: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    playButtonInner: {
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        position: 'relative',
    },
    barContainer: {
        marginHorizontal: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    bar: {
        width: 2.5,
        borderRadius: 2,
        minHeight: 6,
    },
    movingDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        top: '50%',
        marginTop: -4, // Center vertically (half of height)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    metaContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: height * 0.01,
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
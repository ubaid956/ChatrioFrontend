import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  Animated,
  Pressable, Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
const PollItem = ({ poll, isSentByUser, currentUserId, onVote, isVoting }) => {
  const { width, height } = useWindowDimensions();
  const totalVotes = poll.votes?.length || 0;
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // Calculate votes per option and user's vote
  const voteCountPerOption = poll.options.map((_, index) =>
    poll.votes?.filter(v => String(v.user) === String(currentUserId) && v.optionIndex === index).length || 0
  );

  const userVoteIndex = poll.votes?.find(v => String(v.user) === String(currentUserId))?.optionIndex;
  const hasVoted = userVoteIndex !== undefined;

  React.useEffect(() => {
    if (hasVoted) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [hasVoted]);

  const handleVote = async (optionIndex) => {
    if (hasVoted || isVoting) return;

    // Haptic feedback animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await onVote(optionIndex);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleOptionPress = (optionIndex) => {
    if (!hasVoted && !isVoting) {
      Alert.alert(
        'Confirm Vote',
        `Vote for "${poll.options[optionIndex]}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Vote', onPress: () => handleVote(optionIndex) },
        ]
      );
    }
  };

  const getResponsiveStyles = () => {
    const isSmallScreen = width < 375;
    const isMediumScreen = width >= 375 && width < 768;

    return {
      maxWidth: isSmallScreen ? width * 0.85 : isMediumScreen ? width * 0.78 : width * 0.65,
      padding: isSmallScreen ? 12 : 16,
    };
  };

  const renderProgressBar = (percent, optionIndex) => {
    const animatedWidth = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', `${percent}%`],
    });

    return (
      <>
        <View style={[
          styles.progressBarBackground,
          isSentByUser ? styles.sentProgressBg : styles.receivedProgressBg,
        ]} />
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: animatedWidth,
              backgroundColor: isSentByUser ?
                'rgba(255, 255, 255, 0.3)' :
                'rgba(105, 77, 240, 0.4)',
            },
          ]}
        />
      </>
    );
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
          marginVertical: 8,
          paddingHorizontal: 12,
          transform: [{ scale: scaleValue }],
        }
      ]}
    >
      <View
        style={[
          styles.container,
          responsiveStyles,
          isSentByUser ? styles.sent : styles.received,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pollIcon}>
            <Text style={styles.pollEmoji}>📊</Text>
          </View>
          <View style={styles.headerText}>

            <Text style={[
              styles.pollLabel,
              isSentByUser ? styles.textMuted : styles.textLightDark
            ]}>
              Poll
            </Text>
          </View>
        </View>

        {/* Question */}
        <Text style={[
          styles.questionText,
          isSentByUser ? styles.textWhite : styles.textDark
        ]}>
          {poll.question}
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {poll.options.map((option, idx) => {
            const isVotedByUser = idx === userVoteIndex;
            const optionVotes = voteCountPerOption[idx];
            const percent = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;

            return (
              <Pressable
                key={idx}
                onPress={() => handleOptionPress(idx)}
                disabled={hasVoted || isVoting}
                style={({ pressed }) => [
                  styles.optionContainer,
                  !isSentByUser && styles.optionContainerReceived,
                  hasVoted && styles.optionContainerVoted,
                  isVotedByUser && styles.selectedOption,
                  isSentByUser && isVotedByUser && styles.sentSelectedOption,
                  pressed && !hasVoted && (isSentByUser ? styles.optionPressed : styles.optionPressedReceived),
                ]}
              >
                {/* Progress Bar */}
                {hasVoted && renderProgressBar(percent, idx)}

                {/* Option Content */}
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      isSentByUser ? styles.textWhite : styles.textDark,
                      isVotedByUser && styles.selectedOptionText,
                      isSentByUser && isVotedByUser && styles.sentSelectedOptionText,
                    ]}
                    numberOfLines={2}
                  >
                    {option}
                  </Text>

                  {hasVoted && (
                    <View style={styles.voteInfo}>
                      {isVotedByUser && (
                        <View style={styles.checkmarkContainer}>
                          <Text style={[
                            styles.checkmark,
                            isSentByUser ? styles.textWhite : styles.textPurple
                          ]}>
                            ✓
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.percentageText,
                          isSentByUser ? styles.textMuted : styles.textLightDark,
                          isVotedByUser && isSentByUser && styles.textWhite,
                        ]}
                      >
                        {percent.toFixed(0)}%
                      </Text>
                      <Text
                        style={[
                          styles.voteCount,
                          isSentByUser ? styles.textMuted : styles.textLightDark,
                          isVotedByUser && isSentByUser && styles.textWhite,
                        ]}
                      >
                        ({optionVotes})
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[
            styles.totalVotesText,
            isSentByUser ? styles.textMuted : styles.textLightDark
          ]}>
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </Text>

          {isVoting && (
            <View style={styles.loadingContainer}>
              <Text style={[
                styles.loadingText,
                isSentByUser ? styles.textMuted : styles.textLightDark
              ]}>
                Updating...
              </Text>
            </View>
          )}

          {!hasVoted && !isVoting && (
            <Text style={[
              styles.votePrompt,
              isSentByUser ? styles.textMuted : styles.textLightDark
            ]}>
              Tap an option to vote
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: width * 0.7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sent: {
    backgroundColor: '#694df0',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 20,
  },
  received: {
    backgroundColor: '#e4e6eb',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    //backgroundColor:'red',

  },
  pollIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pollEmoji: {
    fontSize: 16,
  },
  headerText: {
    flex: 1,
  },
  senderText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  pollLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionContainer: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  optionContainerReceived: {
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionContainerVoted: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  optionPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.98 }],
  },
  optionPressedReceived: {
    backgroundColor: 'rgba(105, 77, 240, 0.1)',
    transform: [{ scale: 0.98 }],
  },
  selectedOption: {
    backgroundColor: 'rgba(105, 77, 240, 0.15)',
    borderColor: 'rgba(105, 77, 240, 0.3)',
  },
  sentSelectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1,
    flex: 1,
    lineHeight: 20,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  sentSelectedOptionText: {
    color: '#fff',
  },
  voteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkmark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalVotesText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  votePrompt: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.1,
  },
  sentProgressBg: {
    backgroundColor: '#fff',
  },
  receivedProgressBg: {
    backgroundColor: '#d1d5db',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  textWhite: { color: '#ffffff' },
  textMuted: { color: 'rgba(255, 255, 255, 0.7)' },
  textDark: { color: '#1a1a1a' },
  textLightDark: { color: '#666666' },
  textPurple: { color: '#694df0' },
});

export default PollItem;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { globalStyles } from '@/Styles/globalStyles';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import CustomButton from '@/app/Components/CustomButton';

const { width, height } = Dimensions.get('window');

const AttemptQuiz = () => {
  const { quizId } = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `https://chatrio-backend.onrender.com/api/school/fetchquiz/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedQuiz = response.data.quiz;
        setQuiz(fetchedQuiz);
        setSelectedAnswers(Array(fetchedQuiz.questions.length).fill(null));
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        Alert.alert('Error', 'Failed to load quiz.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleSelectOption = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.includes(null)) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    const payload = {
      answers: selectedAnswers.map((option, index) => ({
        questionIndex: index,
        selectedOption: option,
      })),
    };

    try {
      setSubmitLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      await axios.post(
        `https://chatrio-backend.onrender.com/api/school/quiz/${quiz._id}/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Quiz submitted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Quiz submission error:', error);
      Alert.alert('Error', 'There was an error submitting the quiz.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || !quiz) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#694df0" />
      </View>
    );
  }

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const isFirst = currentIndex === 0;

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <CustomHeader title={quiz.title} />

      <View style={styles.cardWrapper}>
        <Text style={{ textAlign: 'center', marginTop: 10, color: '#6b7280' }}>
          Question {currentIndex + 1} of {quiz.questions.length}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.question}>
            {currentIndex + 1}. {question.question}
          </Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option, oIndex) => (
              <TouchableOpacity
                key={oIndex}
                style={[
                  styles.option,
                  selectedAnswers[currentIndex] === option && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswers[currentIndex] === option && { color: '#fff' },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.navContainer}>
        <CustomButton
          title="Previous"
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          disabled={isFirst}
          extraSmall
        />

        <CustomButton
          title={isLast ? (submitLoading ? 'Submitting...' : 'Submit Quiz') : 'Next'}
          onPress={isLast ? handleSubmit : () => setCurrentIndex((prev) => prev + 1)}
          disabled={submitLoading}
          extraSmall
          loading={submitLoading}
        />
      </View>
    </ScrollView>
  );
};

export default AttemptQuiz;

const styles = StyleSheet.create({
  cardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: width * 0.92,
    minHeight: height * 0.4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    justifyContent: 'space-between',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  optionsContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#694df0',
    borderColor: '#694df0',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
    width: width * 0.92,
    marginHorizontal: 'auto',
    alignItems: 'center',
    gap: width * 0.03,
  },
});

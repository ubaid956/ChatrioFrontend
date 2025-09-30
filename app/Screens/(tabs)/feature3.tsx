import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { globalStyles } from '@/Styles/globalStyles';
import FeatureCard from '@/app/Components/Group_Features/FeatureCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGroup } from '@/context/GroupContext';
import QuizCard from '../../Components/Group_Features/School/QuizCard'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import HomeCard from '@/app/Components/Group_Features/Home/HomeCard';
import { router } from 'expo-router';
import CustomTabs from '@/app/Components/Group_Components/CustomTabs';
import SplitExpenseCard from '@/app/Components/Group_Features/Travel/SplitExpenseCard';
import GroupHeader from '@/app/Components/Group_Components/Headers/GroupHeader';
const { width, height } = Dimensions.get('window');

// const groupId = "683ab57df93a2da493bcb838";

const feature3 = () => {
  const [ideas, setIdeas] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const [loading, setLoading] = useState(true);
  const { groupData } = useGroup();


  useEffect(() => {
    if (groupData.groupType === "Work") {
      fetchIdeas();
    } else if (groupData.groupType === "School") {
      fetchQuizzes();
    } else if (groupData.groupType === "Home") {
      fetchBudgets();

    }
    else if (groupData.groupType === "Travel") {
      fetchExpenses();
    }

  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === "All") {
      console.log("All tasks selected");
    } else {
      console.log(`${tab} tasks selected`);
    }
  };

  const fetchBudgets = async () => {
    try {
      setLoadingBudgets(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        setLoadingBudgets(false);
        return;
      }
      const response = await axios.get(
        `https://37prw4st-5000.asse.devtunnels.ms/api/home/budget/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBudgets(response.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error.response?.data || error.message);
    } finally {
      setLoadingBudgets(false);
    }
  };

  const fetchIdeas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://37prw4st-5000.asse.devtunnels.ms/api/work/idea/${groupData.groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIdeas(response.data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://37prw4st-5000.asse.devtunnels.ms/api/school/quiz/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuizList(response.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        setLoadingExpenses(false);
        return;
      }

      const response = await axios.get(
        `https://37prw4st-5000.asse.devtunnels.ms/api/travel/splitexpense/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error.response?.data || error.message);
    } finally {
      setLoadingExpenses(false);
    }
  };


  return (
    <View style={[globalStyles.container]}>
      {groupData.groupType == "Work" && (
        <>
          <Text style={globalStyles.groupTitle}>💡 Ideas</Text>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : ideas.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.noIdeaText}>No ideas yet</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {ideas.map((idea, index) => (
                <FeatureCard
                  key={idea._id}
                  title={idea.title}
                  description={idea.content}
                  variant={(index % 3) + 1}
                />
              ))}
            </View>
          )}
        </>
      )}

      {groupData.groupType === "School" && (
        <>
          <GroupHeader title="Quizes" emoji="filter" />


          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : quizList.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.noIdeaText}>No quizzes available</Text>
            </View>
          ) : (
            quizList.map((quiz) => (
              <QuizCard
                key={quiz._id}
                title={quiz.title}
                category={quiz.category || "General"}
                questions={quiz.totalQuestions || 10}
                time={`${quiz.duration || 20} min`}
                score={quiz.score || 0}
                onPress={() =>
                  router.push({
                    pathname: "/Screens/GroupPages/SchoolPages/AttemptQuiz",
                    params: {
                      quizData: encodeURIComponent(JSON.stringify(quiz)),
                    },
                  })
                }
              />
            ))
          )}
        </>
      )}

      {groupData.groupType === "Home" && (
        <>
          <View style={globalStyles.groupHeader}>
            <Text style={globalStyles.groupTitle}>Budget</Text>
            <TouchableOpacity>
              <FontAwesome5 name="filter" size={24} color="#694df0" />
            </TouchableOpacity>
          </View>
          <CustomTabs
            tabs={['All', 'Income', 'Expenses']}
            initialTab="All"
            onTabChange={handleTabChange}
          />

          {/* {loadingBudgets ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#694df0" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}
            style={{ marginTop: height * 0.02 }}>
              {budgets.map((budget) => (
                <HomeCard
                  key={budget._id}
                  type="budget"
                  title={budget.title}
                  subText={budget.category}
                  amount={budget.amount}
                  date={new Date(budget.createdAt).toLocaleDateString()}
                  budgetType={budget.type} // "income" or "expense"
                  onEdit={() => console.log('Edit')}
                  onDelete={() => console.log('Delete')}
                />
              ))}
            </ScrollView>
          )} */}
          {loadingBudgets ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#694df0" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: height * 0.02 }}>
              {budgets
                .filter((budget) => {
                  if (selectedTab === "All") return true;
                  if (selectedTab === "Income") return budget.type === "income";
                  if (selectedTab === "Expenses") return budget.type === "expense";
                  return true;
                })
                .map((budget) => (
                  <HomeCard
                    key={budget._id}
                    type="budget"
                    title={budget.title}
                    subText={budget.category}
                    amount={budget.amount}
                    date={new Date(budget.createdAt).toLocaleDateString()}
                    budgetType={budget.type} // "income" or "expense"
                    onEdit={() => console.log('Edit')}
                    onDelete={() => console.log('Delete')}
                  />
                ))}
            </ScrollView>
          )}

        </>
      )}

      {groupData.groupType === "Travel" && (
        <>
          <View style={globalStyles.groupHeader}>
            <Text style={globalStyles.groupTitle}>Expense</Text>
            <TouchableOpacity>
              <FontAwesome5 name="filter" size={24} color="#694df0" />
            </TouchableOpacity>
          </View>
          {loadingExpenses ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#694df0" />
            </View>
          ) : expenses.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.noIdeaText}>No expenses found</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: height * 0.02 }}>
              {expenses.map((expense) => (
                <SplitExpenseCard
                  key={expense._id}
                  title={expense.title}
                  date={expense.createdAt}
                  amount={expense.amount}
                  category={"General"} // or any static/dynamic category
                  paidBy={expense.paidBy.name} // ✅ Pass just the name
                  splitWith={expense.sharedWith.map(user => ({
                    name: user.name,
                    initials: user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase(), // auto-generate initials like "UA" from "Ubaid Ansari"
                    status: 'Unpaid', // You can update this based on logic later
                  }))}
                  onPress={() => {
                    console.log("clicked", expense);
                    router.push({
                      pathname: '/Screens/GroupPages/TravelPages/SplitPaid',
                      params: {

                        data: JSON.stringify(expense),
                      }
                    });
                  }}
                />




              ))}
            </ScrollView>
          )}

        </>

      )}


    </View>
  );
};

export default feature3;

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginHorizontal: width * 0.05,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noIdeaText: {
    fontSize: 16,
    color: '#555',
  },
});

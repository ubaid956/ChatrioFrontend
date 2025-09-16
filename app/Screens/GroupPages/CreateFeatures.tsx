import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, TextInput, Platform, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { globalStyles } from '@/Styles/globalStyles';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DatePickerModal } from 'react-native-paper-dates';
import CustomButton from '@/app/Components/CustomButton';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from "@/context/GroupContext";
const { width } = Dimensions.get('window');

type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'datetime' | 'options' | 'textarea';
};

type FeatureConfig = {
  title: string;
  fields: FieldConfig[];
  buttonText: string;
};

const featureConfigs: Record<string, FeatureConfig> = {
  task: {
    title: 'Create Task',
    fields: [
      { name: 'title', label: 'Title', placeholder: 'Task title', type: 'text' },
      { name: 'description', label: 'Description', placeholder: 'Task description', type: 'textarea' },
      { name: 'status', label: 'Status', placeholder: 'e.g. in progress, done, to do', type: 'text' },
      { name: 'startTime', label: 'Start Time', placeholder: 'Select start date/time', type: 'date' },
      { name: 'endTime', label: 'End Time', placeholder: 'Select end date/time', type: 'date' }
    ],
    buttonText: 'Create Task'
  },

  idea: {
    title: 'Create Idea',
    fields: [
      { name: 'title', label: 'Title', placeholder: 'Idea title', type: 'text' },
      { name: 'content', label: 'Content', placeholder: 'Describe the idea...', type: 'textarea' }
    ],
    buttonText: 'Submit Idea'
  },

  note: {
    title: 'Create Note',
    fields: [
      { name: 'title', label: 'Title', placeholder: 'Note title', type: 'text' },
      { name: 'content', label: 'Content', placeholder: 'Write the note...', type: 'textarea' }
    ],
    buttonText: 'Submit Note'
  },
  poll: {
    title: 'Create Poll',
    fields: [
      { name: 'title', label: 'Poll Question', placeholder: 'e.g. Favorite place?', type: 'text' },
      { name: 'options', label: 'Poll Options', placeholder: '', type: 'options' }
    ],
    buttonText: 'Create Poll'
  },
  meeting: {
    title: 'Schedule Meeting',
    fields: [
      { name: 'topic', label: 'Meeting Topic', placeholder: 'e.g. Team Sync', type: 'text' },
      { name: 'startTime', label: 'Start Time', placeholder: 'Select date/time', type: 'date' },
      { name: 'duration', label: 'Duration (minutes)', placeholder: 'e.g. 30', type: 'text' }
    ],
    buttonText: 'Create Meeting'
  }

};

export default function CreateFeatures() {
  const rawParams = useLocalSearchParams<{ type: string }>();
  const normalizedType = rawParams.type?.toLowerCase().replace(/s$/, '') || 'task';
  const config = featureConfigs[normalizedType];
  const { groupData } = useGroup();
  const { groupId, groupName, groupType } = groupData;


  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeDateField, setActiveDateField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const initialData: Record<string, string> = {};
    config.fields.forEach(field => {
      if (field.type !== 'options') {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [normalizedType]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const removeOption = (index: number) => {
    const updated = [...pollOptions];
    updated.splice(index, 1);
    setPollOptions(updated);
  };

  const addOption = () => {
    setPollOptions(prev => [...prev, '']);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const sender = await AsyncStorage.getItem('userId');


      if (!token || !sender) return alert('User not authenticated');

      let url = '';
      let payload: any = {};

      switch (normalizedType) {
        case 'task':
          url = 'https://32b5245c5f10.ngrok-free.app/api/work/task';
          payload = {
            groupId,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            startTime: formData.startTime,
            endTime: formData.endTime,
            sender
          };

          break;

        case 'idea':
          url = 'https://32b5245c5f10.ngrok-free.app/api/work/idea';
          payload = {
            groupId,
            title: formData.title,
            content: formData.content
          };

          break;

        case 'note':
          url = 'https://32b5245c5f10.ngrok-free.app/api/work/note';
          payload = {
            groupId,
            title: formData.title,
            content: formData.content,
            sender
          };
          break;

        case 'poll':
          const cleanedOptions = pollOptions.filter(opt => opt.trim() !== '');
          console.log('Submitting Poll:', {
            question: formData.title,
            options: cleanedOptions,
            sender
          });

          if (cleanedOptions.length < 2) {
            alert('Please enter at least two poll options.');
            return;
          }

          url = 'https://32b5245c5f10.ngrok-free.app/api/work/poll';
          payload = {
            groupId,
            question: formData.title,
            options: cleanedOptions,
            sender
          };
          break;

        case 'meeting':
          url = 'https://32b5245c5f10.ngrok-free.app/api/work/meeting'; // <- You must handle this in backend too
          payload = {
            groupId,
            topic: formData.topic,
            startTime: formData.startTime,
            duration: parseInt(formData.duration),
          };
          break;

        default:
          return alert('Unsupported type');
      }

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert('Successfully submitted!');
        router.back();
      } else {
        alert('Submission failed.');
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert('Error while submitting.');
    }
    finally {
      setIsLoading(false); // 👈 Stop loading
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title={config.title} onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        {config.fields.map((field) => (
          <View key={field.name} style={groupStyle.inputWrapper}>
            <Text style={groupStyle.label}>{field.label}</Text>
            {['date', 'datetime'].includes(field.type) ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setActiveDateField(field.name);
                    setShowDatePicker(true);
                  }}
                  style={groupStyle.dateInput}
                >
                  <Text style={groupStyle.dateText}>
                    {formData[field.name]
                      ? new Date(formData[field.name]).toLocaleString()
                      : `Select ${field.label}`}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && activeDateField === field.name && (
                  <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={true}
                    date={formData[field.name] ? new Date(formData[field.name]) : undefined}
                    onDismiss={() => setShowDatePicker(false)}
                    onConfirm={({ date }) => {
                      if (date && activeDateField) {
                        handleInputChange(activeDateField, date.toISOString());
                      }
                      setShowDatePicker(false);
                    }}
                  />
                )}
              </>
            ) : field.type === 'options' ? (
              <View>
                {pollOptions.map((option, index) => (
                  <View key={index} style={groupStyle.optionContainer}>
                    <TextInput
                      placeholder={`Option ${index + 1}`}
                      style={[groupStyle.input, groupStyle.optionInput]}
                      value={option}
                      onChangeText={(text) => handleOptionChange(index, text)}
                    />
                    {pollOptions.length > 2 && (
                      <TouchableOpacity
                        style={groupStyle.removeOptionButton}
                        onPress={() => removeOption(index)}
                      >
                        <Ionicons name="close" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  style={groupStyle.addOptionButton}
                  onPress={addOption}
                >
                  <Ionicons name="add" size={20} style={groupStyle.addOptionIcon} />
                  <Text style={groupStyle.addOptionText}>Add Option</Text>
                </TouchableOpacity>
              </View>
            ) : field.type === 'textarea' ? (
              <TextInput
                placeholder={field.placeholder}
                multiline
                numberOfLines={6}
                style={[groupStyle.input, groupStyle.textarea]}
                value={formData[field.name]}
                onChangeText={(text) => handleInputChange(field.name, text)}
              />
            ) : (
              <TextInput
                placeholder={field.placeholder}
                style={groupStyle.input}
                value={formData[field.name]}
                onChangeText={(text) => handleInputChange(field.name, text)}
              />
            )}
          </View>
        ))}
        <CustomButton
          title={
            isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              config.buttonText
            )
          }
          onPress={onSubmit}
          disabled={isLoading}
          large={true}
        />

      </ScrollView>
    </View>
  );
}


// File: Components/GroupFeatures/TaskBoardModal.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import GenericModal from './GenericModal'

const { width } = Dimensions.get('window');

const TaskBoardModal = ({ visible, onClose }) => {
    const [tasks, setTasks] = React.useState([]);
    const [newTask, setNewTask] = React.useState('');

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), text: newTask, done: false }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
    };

    return (
        <GenericModal visible={visible} onClose={onClose} title="Task Board">
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskItem}>
                        <Text style={[styles.taskText, item.done && styles.taskDone]}>{item.text}</Text>
                    </TouchableOpacity>
                )}
                style={{ maxHeight: 200 }}
            />
            <TextInput
                placeholder="Add new task"
                value={newTask}
                onChangeText={setNewTask}
                style={styles.input}
            />
            <TouchableOpacity onPress={addTask} style={styles.addBtn}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Add Task</Text>
            </TouchableOpacity>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    addBtn: {
        backgroundColor: '#694df0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    taskItem: {
        paddingVertical: 8,
    },
    taskText: {
        fontSize: 16,
    },
    taskDone: {
        textDecorationLine: 'line-through',
        color: 'gray'
    },
});

export default TaskBoardModal;
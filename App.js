import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
} from 'react-native';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [ready, setReady] = useState(false);
  const [goalList, setGoalList] = useState([]); // Initialize the state for your goal list

  const LoadTodos = async () => {
    try {
      const data = await AsyncStorage.getItem('storedTodos');
      if (data !== null) {
        setGoalList(JSON.parse(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    LoadTodos().then(() => {
      setReady(true);
    });
  }, []); // Use useEffect to load data when the component mounts

  const [enteredGoalText, setEnteredGoalText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
    console.log('Opened modal');
  }

  function closeModal() {
    setIsOpen(false);
  }

  function goalInputHandler(enteredText) {
    setEnteredGoalText(enteredText);
  }

  function addGoalHandler() {
    const newGoal = { text: enteredGoalText, id: Math.random().toString() };
    setGoalList((currentGoals) => [...currentGoals, newGoal]);
    setEnteredGoalText('');
    closeModal();

    // Save the updated goal list to AsyncStorage
    AsyncStorage.setItem('storedTodos', JSON.stringify([...goalList, newGoal])).catch((err) => {
      console.error(err);
    });
  }

  function deleteGoalHandler(id) {
    setGoalList((currentGoals) => currentGoals.filter((goal) => goal.id !== id));

    // Save the updated goal list to AsyncStorage
    AsyncStorage.setItem('storedTodos', JSON.stringify(goalList.filter((goal) => goal.id !== id)).catch((err) => {
      console.error(err);
    }));
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.appContainer}>
        <Button title="Open modal" color="#5e0acc" onPress={openModal} />
        <GoalInput
          goalInputHandler={goalInputHandler}
          visible={isOpen}
          addGoalHandler={addGoalHandler}
          enteredGoalText={enteredGoalText}
          closeModal={closeModal}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={goalList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GoalItem text={item.text} id={item.id} onDeleteItem={() => deleteGoalHandler(item.id)} />
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  goalsContainer: {
    flex: 5,
  },
});

import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import HomeHero from '../components/HomeHero';
import FreeCoursesRow from '../components/FreeCoursesRow';
import LearnHeader from '../components/LearnHeader';

const ShowcaseScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      <HomeHero />
      <FreeCoursesRow />
      <LearnHeader />
      <View><Text>Showcase</Text></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c22' },
});

export default ShowcaseScreen;

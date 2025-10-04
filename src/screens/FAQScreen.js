import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
const APP_BLUE = '#003B73';

const FAQScreen = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Frequently Asked Questions</Text>
    <Text style={styles.q}>Is online MBA as good as regular MBA?</Text>
    <Text style={styles.a}>Absolutely. Online MBAs have gained widespread recognition and credibility, often providing the same curriculum and degree as traditional, on-campus programs.</Text>
    <Text style={styles.q}>Can an online MBA get placements?</Text>
    <Text style={styles.a}>Yes, online MBAs offer placement support and are valued by employers.</Text>
    <Text style={styles.q}>Why is career counselling important?</Text>
    <Text style={styles.a}>Career counselling helps you make informed decisions and maximize your potential.</Text>
    <Text style={styles.q}>What are online courses offered by Educativo?</Text>
    <Text style={styles.a}>Educativo offers 500+ courses and 50+ specializations in partnership with leading universities.</Text>
    <View><Text>FAQ</Text></View>
  </ScrollView>
);

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: APP_BLUE, marginBottom: 12 },
  q: { fontWeight: '700', color: APP_BLUE, marginTop: 12 },
  a: { color: '#444', marginTop: 6 }
});

export default FAQScreen;

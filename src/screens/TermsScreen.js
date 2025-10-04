import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
const APP_BLUE = '#003B73';

const TermsScreen = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Terms & Conditions</Text>
    <Text style={styles.text}>Read our full terms and conditions at:</Text>
    <Text style={styles.link} onPress={() => Linking.openURL('https://www.educativo.in/terms.html')}>https://www.educativo.in/terms.html</Text>
    <View><Text>Terms and Conditions</Text></View>
  </ScrollView>
);

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: APP_BLUE, marginBottom: 12 },
  text: { marginBottom: 8 },
  link: { color: APP_BLUE, textDecorationLine: 'underline' }
});

export default TermsScreen;

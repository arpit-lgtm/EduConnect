import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
const APP_BLUE = '#003B73';

const PrivacyScreen = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <View><Text>Privacy Policy</Text></View>
    <Text style={styles.paragraph}>
      At Educativo, we value your privacy and are committed to protecting your personal information. 
      Any details you share with us, such as name, email, or phone number, are used only to provide 
      you with information, counselling, and support related to our courses and services.
    </Text>
    <Text style={styles.paragraph}>
      We do not sell, share, or rent your data to third parties. Your information is stored 
      securely and used strictly for communication and guidance purposes.
    </Text>
    <Text style={styles.paragraph}>
      By submitting your details, you agree to be contacted by our counsellors through phone, 
      email, or WhatsApp regarding course updates and admission assistance.
    </Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  content: { 
    padding: 20,
    paddingBottom: 40
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: APP_BLUE, 
    marginBottom: 20,
    textAlign: 'center'
  },
  paragraph: { 
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#444',
    textAlign: 'center'
  }
});

export default PrivacyScreen;

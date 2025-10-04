import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
const { API_BASE: CONFIG_API_BASE } = require('../config');

const APP_BLUE = '#003B73';

const ApplyDetailScreen = ({ apiBase = CONFIG_API_BASE, initialCourse = '', onDone }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', contactNumber: '', course: initialCourse });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.firstName || !form.email) { Alert.alert('Validation', 'First name and email are required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await res.json();
      if (j && j.success) {
        Alert.alert('Success', 'Application submitted');
        onDone && onDone(true);
      } else {
        Alert.alert('Error', j && j.message ? j.message : 'Submission failed');
      }
    } catch (err) {
      console.error('apply error', err);
      Alert.alert('Error', 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const [courseName, setCourseName] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: APP_BLUE }]}>Apply for a course</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name of the Course"
          placeholderTextColor="#888"
          value={courseName}
          onChangeText={setCourseName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#888"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Your Message"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline={true}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <TouchableOpacity style={{ padding: 12 }} onPress={() => onDone && onDone(false)}><Text style={{ color: '#888' }}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: APP_BLUE }]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Submit</Text>}</TouchableOpacity>
      </View>
      <View><Text>Apply now</Text></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  inputContainer: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 6 },
  submitBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }
});

export default ApplyDetailScreen;

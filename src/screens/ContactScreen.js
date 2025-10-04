import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
const APP_BLUE = '#003B73';

const ContactScreen = ({ apiBase = require('../config').API_BASE }) => {
  const [form, setForm] = useState({ name: '', email: '', contactNumber: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.name || !form.message) { Alert.alert('Validation', 'Name and message are required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await res.json();
      if (j && j.success) { Alert.alert('Success', 'Message sent'); setForm({ name: '', email: '', contactNumber: '', message: '' }); }
      else { throw new Error(j && j.message ? j.message : 'failed'); }
    } catch (err) {
      // fallback: open mail client
      const mailto = `mailto:info@educativo.in?subject=Contact from App&body=${encodeURIComponent(form.message + '\n\nContact: ' + (form.contactNumber || '') + '\nEmail: ' + (form.email || ''))}`;
      Linking.openURL(mailto);
    } finally { setSubmitting(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View><Text>Contact us</Text></View>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value} onPress={() => Linking.openURL('mailto:info@educativo.in')}>info@educativo.in</Text>
      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value} onPress={() => Linking.openURL('tel:+919076114175')}>+91 9076 114 175</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>Mumbai, India</Text>

      <View style={{ height: 16 }} />
      <Text style={styles.sectionTitle}>Send us a message</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={form.name}
          onChangeText={t => setForm(f => ({ ...f, name: t }))}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#888"
          value={form.contactNumber}
          onChangeText={t => setForm(f => ({ ...f, contactNumber: t }))}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={form.email}
          onChangeText={t => setForm(f => ({ ...f, email: t }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Your Message"
          placeholderTextColor="#888"
          value={form.message}
          onChangeText={t => setForm(f => ({ ...f, message: t }))}
          multiline={true}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <TouchableOpacity style={{ padding: 12 }} onPress={() => setForm({ name: '', email: '', contactNumber: '', message: '' })}><Text style={{ color: '#888' }}>Clear</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: APP_BLUE }]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>}</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: APP_BLUE, marginBottom: 12 },
  label: { fontWeight: '700', color: APP_BLUE, marginTop: 12 },
  value: { color: '#444', marginTop: 6, textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 6, color: APP_BLUE },
  inputContainer: { borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginTop: 8, overflow: 'hidden' },
  input: { padding: 10, height: 40 },
  submitBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }
});

export default ContactScreen;

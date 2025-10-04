import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LearnHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput placeholder="Search course..." placeholderTextColor="#999" style={styles.search} />
        <TouchableOpacity style={styles.filter}>
          <Text style={{ color: '#fff' }}>Newest</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={styles.toggleLeft}><Text style={styles.toggleText}>Webinars</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toggleRight}><Text style={styles.toggleText}>Courses</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 20, marginTop: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  search: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, color: '#444', borderWidth: 1, borderColor: '#f0f0f0' },
  filter: { marginLeft: 8, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  toggleLeft: { backgroundColor: '#fff', padding: 12, width: 140, alignItems: 'center', borderRadius: 8 },
  toggleRight: { backgroundColor: '#fff', padding: 12, width: 140, alignItems: 'center', borderRadius: 8, marginLeft: 8, borderWidth: 1, borderColor: '#e6e6e6' },
  toggleText: { color: '#003B73', fontWeight: '600' },
});

export default LearnHeader;

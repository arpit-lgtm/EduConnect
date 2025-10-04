import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
const APP_BLUE = '#003B73';

const BlogsScreen = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Latest News & Updates</Text>
    <Text style={styles.itemTitle}>Online applied business analytics courses will transform your career?</Text>
    <Text style={styles.link}>https://www.educativo.in/news_onlineappliedbusiness.html</Text>
    <View><Text>No blogs yet</Text></View>
  </ScrollView>
);

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: APP_BLUE, marginBottom: 12 },
  itemTitle: { fontWeight: '700', marginBottom: 6 },
  link: { color: APP_BLUE, marginBottom: 12 }
});

export default BlogsScreen;

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const APP_BLUE = '#003B73';

const CourseDetailScreen = ({ course = {}, onApply }) => {
  const [expanded, setExpanded] = React.useState(-1);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: APP_BLUE }]}>{course.title || 'Course'}</Text>
      {course.subtitle ? <Text style={styles.subtitle}>{course.subtitle}</Text> : null}
      <View style={{ height: 10 }} />

      {course.duration ? <Text style={styles.meta}>Duration: <Text style={styles.metaValue}>{course.duration}</Text></Text> : null}
      {course.fees ? <Text style={styles.meta}>Fees: <Text style={styles.metaValue}>{course.fees}</Text></Text> : null}
      {course.eligibility ? <Text style={styles.meta}>Eligibility: <Text style={styles.metaValue}>{course.eligibility}</Text></Text> : null}

      <View style={{ height: 10 }} />

      <Text style={styles.sectionTitle}>About this course</Text>
      <Text style={styles.text}>{course.longDescription || course.content || course.details || course.description || 'Full course details are available on the website.'}</Text>

      {Array.isArray(course.syllabus) && course.syllabus.length ? (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Syllabus</Text>
          {course.syllabus.map((s, i) => <Text key={i} style={styles.listItem}>• {s}</Text>)}
        </View>
      ) : null}

      {Array.isArray(course.outcomes) && course.outcomes.length ? (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Outcomes</Text>
          {course.outcomes.map((o, i) => <Text key={i} style={styles.listItem}>• {o}</Text>)}
        </View>
      ) : null}

      {Array.isArray(course.faq) && course.faq.length ? (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {course.faq.map((q, i) => (
            <TouchableOpacity key={i} onPress={() => setExpanded(expanded === i ? -1 : i)} style={{ marginBottom: 8 }}>
              <Text style={styles.faqQ}>{q.q}</Text>
              {expanded === i ? <Text style={styles.text}>{q.a}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={{ height: 16 }} />
      <TouchableOpacity style={styles.applyBtn} onPress={() => onApply && onApply(course)}><Text style={styles.applyText}>Apply</Text></TouchableOpacity>
      <View><Text>Course details</Text></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#666', marginTop: 6 },
  meta: { color: '#444', marginTop: 6, fontWeight: '600' },
  metaValue: { color: '#333', fontWeight: '400' },
  listItem: { color: '#444', marginTop: 6 },
  faqQ: { fontWeight: '700', color: APP_BLUE },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  text: { color: '#444', marginTop: 8 },
  applyBtn: { marginTop: 20, backgroundColor: APP_BLUE, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start' },
  applyText: { color: '#fff', fontWeight: '700' }
});

export default CourseDetailScreen;

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import LearnHeader from '../components/LearnHeader';

const APP_BLUE = '#003B73';

// Load bundled site content and extract courses module
const SITE = require('../data/site_content.json');
const COURSES_MODULE = (SITE && SITE.modules) ? SITE.modules.find(m => m.id === 'courses') : null;

// Webinar data - this is sample data for demonstration
const WEBINARS = [
  {
    id: 1,
    title: 'Latest Industry Trends in MBA',
    date: 'Oct 10, 2025 • 3:00 PM',
    speaker: 'Dr. Raj Patel, Amity University',
    description: 'Discover how industry trends are shaping MBA curricula and career opportunities in 2025.',
    registrationUrl: 'https://www.educativo.in/webinar/mba-trends-2025'
  },
  {
    id: 2,
    title: 'Data Science Career Paths',
    date: 'Oct 15, 2025 • 5:00 PM',
    speaker: 'Prof. Aisha Khan, IIIT Bangalore',
    description: 'Explore various career paths in Data Science and how to prepare for them through education.',
    registrationUrl: 'https://www.educativo.in/webinar/datascience-careers'
  },
  {
    id: 3,
    title: 'AI in Marketing: Future Outlook',
    date: 'Oct 22, 2025 • 4:00 PM',
    speaker: 'Mr. Rahul Sharma, Marketing Director',
    description: 'Learn how AI is transforming marketing strategies and creating new opportunities.',
    registrationUrl: 'https://www.educativo.in/webinar/ai-marketing'
  },
  {
    id: 4,
    title: 'Tech Leadership in 2025',
    date: 'Oct 29, 2025 • 6:00 PM',
    speaker: 'Ms. Priya Mehta, CTO, TechFuture Inc.',
    description: 'Insights into effective tech leadership strategies for the digital age.',
    registrationUrl: 'https://www.educativo.in/webinar/tech-leadership'
  }
];

const LearnScreen = ({ navigation }) => {
  // State for tabs and expanded domains
  const [activeTab, setActiveTab] = useState('courses');
  const [expandedDomains, setExpandedDomains] = useState({
    'mba-programs': false,
    'data-science-analytics': false,
    'software-tech': false,
    'management': false,
    'ai-ml': false,
    'marketing': false
  });

  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };

  const handleRegister = (webinar) => {
    if (webinar.registrationUrl) {
      // Log the URL being opened (for debugging)
      console.log(`Opening webinar URL: ${webinar.registrationUrl}`);
      
      // Ensure URL is properly formatted
      let url = webinar.registrationUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', `Cannot open URL: ${url}`);
        }
      }).catch(err => {
        console.error(`Error opening webinar URL: ${err}`);
        Alert.alert('Error', 'Could not open registration page. Please try again later.');
      });
    } else {
      Alert.alert(
        'Registration', 
        `Thank you for your interest in "${webinar.title}".\nAn email with registration details will be sent to you soon.`
      );
    }
  };

  const renderCoursesTab = () => (
    <View style={styles.tabContent}>
      {COURSES_MODULE && COURSES_MODULE.domains && (
        COURSES_MODULE.domains.map((domain, idx) => (
          <View key={idx} style={styles.domainSection}>
            <TouchableOpacity 
              style={styles.domainHeader} 
              onPress={() => toggleDomain(domain.id)}
            >
              <Text style={styles.domainTitle}>{domain.title}</Text>
              <Text style={styles.expandIcon}>
                {expandedDomains[domain.id] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {expandedDomains[domain.id] && domain.items && (
              <View style={styles.courseContainer}>
                {domain.items.map((course, courseIdx) => (
                  <View key={courseIdx} style={styles.courseCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      {course.subtitle ? <Text style={styles.courseSubtitle}>{course.subtitle}</Text> : null}
                      {course.details ? <Text style={{ color: '#666', marginTop: 6 }}>{course.details}</Text> : null}
                    </View>
                    <TouchableOpacity 
                      style={[styles.applyBtn, { backgroundColor: APP_BLUE }]} 
                      onPress={() => {
                        if (course.url) {
                          // Direct approach - just open the URL
                          console.log(`Opening URL: ${course.url}`);
                          try {
                            Linking.openURL(course.url);
                          } catch (error) {
                            console.error(`Failed to open URL: ${course.url}`, error);
                            Alert.alert(
                              'Error Opening Page', 
                              `Could not open ${course.title} page. Please check your internet connection and try again.`
                            );
                          }
                        } else {
                          Alert.alert('Info', 'Course page URL not available');
                        }
                      }}
                    >
                      <Text style={styles.applyText}>View</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderWebinarsTab = () => (
    <View style={styles.tabContent}>
      {WEBINARS.map((webinar) => (
        <View key={webinar.id} style={styles.webinarCard}>
          <Text style={styles.webinarTitle}>{webinar.title}</Text>
          <Text style={styles.webinarDetails}>{webinar.date}</Text>
          <Text style={styles.webinarSpeaker}>Speaker: {webinar.speaker}</Text>
          <Text style={styles.webinarDescription}>{webinar.description}</Text>
          <TouchableOpacity 
            style={styles.registerBtn} 
            onPress={() => handleRegister(webinar)}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'courses' && styles.activeTabButton]}
          onPress={() => setActiveTab('courses')}
        >
          <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>Courses</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'webinars' && styles.activeTabButton]}
          onPress={() => setActiveTab('webinars')}
        >
          <Text style={[styles.tabText, activeTab === 'webinars' && styles.activeTabText]}>Webinars</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'courses' ? renderCoursesTab() : renderWebinarsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center'
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: APP_BLUE
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666'
  },
  activeTabText: {
    color: APP_BLUE,
    fontWeight: '700'
  },
  content: { 
    padding: 12,
    paddingBottom: 80
  },
  tabContent: {
    flex: 1
  },
  courseCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderRadius: 8, 
    backgroundColor: '#ffffff', 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#e9f0ff',
    elevation: 1
  },
  courseTitle: { 
    fontWeight: '700' 
  },
  courseSubtitle: { 
    color: '#666', 
    marginTop: 4 
  },
  applyBtn: { 
    backgroundColor: '#198754', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 6 
  },
  applyText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  domainSection: { 
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 0,
    elevation: 1
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e3ecfb',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    elevation: 1
  },
  domainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_BLUE
  },
  expandIcon: {
    fontSize: 16,
    color: APP_BLUE
  },
  courseContainer: {
    width: '100%',
    padding: 16,
    paddingBottom: 8
  },
  webinarCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9f0ff',
    elevation: 1
  },
  webinarTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color: APP_BLUE
  },
  webinarDetails: {
    color: '#444',
    fontSize: 14,
    marginBottom: 6
  },
  webinarSpeaker: {
    color: '#444',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600'
  },
  webinarDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20
  },
  registerBtn: {
    backgroundColor: APP_BLUE,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start'
  },
  registerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  }
});

export default LearnScreen;
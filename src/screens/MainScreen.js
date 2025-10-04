import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Animated, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
let WebView;
try { WebView = require('react-native-webview').WebView; } catch (e) { WebView = null; }
import AboutScreen from './AboutScreen';
import BlogsScreen from './BlogsScreen';
import PrivacyScreen from './PrivacyScreen';
import TermsScreen from './TermsScreen';
import FAQScreen from './FAQScreen';
import ContactScreen from './ContactScreen';
import ApplyDetailScreen from './ApplyDetailScreen';
import CourseDetailScreen from './CourseDetailScreen';
import HomeHero from '../components/HomeHero';
import FreeCoursesRow from '../components/FreeCoursesRow';
import LearnHeader from '../components/LearnHeader';
// ConnectCards was removed; keep Showcase content minimal
import LearnScreen from './LearnScreen';
const { API_BASE } = require('../config');
// bundled fallback data so app shows content even when backend is unreachable
const FALLBACK_CONTENT = require('../data/site_content.json');

const HEADER_HEIGHT = 72;
const APP_BLUE = '#003B73';

import instagramIcon from '../../assets/instagram.png';
import facebookIcon from '../../assets/facebook.png';
import linkedinIcon from '../../assets/linkedin.png';
import whatsappIcon from '../../assets/whatsapp.png';

const MainScreen = ({ user, onLogout, navigation }) => {
  const [home, setHome] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerX = useRef(new Animated.Value(-360)).current;
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'learn'
  // quick flag: show full website in WebView to ship APK quickly
  // set to false so we render native content by default
  const useWebView = false;

  // add this state near the other useState calls
  const [viewHistory, setViewHistory] = useState([]);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setError(null);
    // show fallback immediately so UI isn't stuck loading
    if (FALLBACK_CONTENT) {
      setHome(FALLBACK_CONTENT.home || null);
      setModules(FALLBACK_CONTENT.modules || []);
      setLoading(false);
    }

    // Fetch in background and update if available
    try {
      const fetchWithTimeout = (url, ms = 5000) => Promise.race([
        fetch(url).then(r => r.json()),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
      ]);

      const [hRes, mRes] = await Promise.all([
        fetchWithTimeout(`${API_BASE}/api/home`, 5000).catch(e => { throw e; }),
        fetchWithTimeout(`${API_BASE}/api/modules`, 5000).catch(e => { throw e; }),
      ]);
      if (hRes && hRes.home) setHome(hRes.home);
      if (mRes && mRes.modules) setModules(mRes.modules);
    } catch (err) {
      console.warn('Background load failed or timed out, keeping fallback', err && err.message ? err.message : err);
      // keep fallback data already set
    }
  }

  useEffect(() => {
    Animated.timing(drawerX, { toValue: drawerOpen ? 0 : -Math.max(320, Math.round(Dimensions.get('window').width * 0.85)), duration: 260, useNativeDriver: true }).start();
  }, [drawerOpen]);

  // Fetch a module's full details from the backend, fallback to provided object
  async function loadModule(id, fallback) {
    setSelectedCourse(null);
    setLoading(true);
    try {
      const fetchWithTimeout = (url, ms = 5000) => Promise.race([
        fetch(url).then(r => r.json()),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
      ]);
      const res = await fetchWithTimeout(`${API_BASE}/api/module?id=${encodeURIComponent(id)}`, 5000);
      if (res && res.success && res.module) {
        setSelectedModule(res.module);
      } else {
        setSelectedModule(fallback || null);
      }
    } catch (err) {
      console.warn('Failed to fetch module, using fallback', err && err.message ? err.message : err);
      setSelectedModule(fallback || null);
    } finally {
      setLoading(false);
    }
  }

  // Render content for a selected module (supports sections, items, content, longDescription)
  const renderModuleContent = (mod) => {
    if (!mod) return null;
    // Courses module: list all courses
    if (mod.id === 'courses' && mod.items) {
      return (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>All Courses</Text>
          {mod.items.map((it, idx) => (
            <View key={idx} style={styles.courseCard}>
              <View style={styles.courseInfo}>
                <TouchableOpacity onPress={() => setSelectedCourse(it)}>
                  <Text style={styles.courseTitle}>{it.title}</Text>
                  {it.subtitle ? <Text style={styles.courseSubtitle}>{it.subtitle}</Text> : null}
                  {it.details ? <Text style={{ color: '#666', marginTop: 6 }}>{it.details}</Text> : null}
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity style={[styles.applyBtn, { backgroundColor: APP_BLUE }]} onPress={() => { setSelectedModule({ id: 'apply', title: 'Apply', initialCourse: it.title }); }}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }
    // If module has explicit sections array, render each
    if (mod.sections && Array.isArray(mod.sections)) {
      return (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>{mod.title}</Text>
          {mod.sections.map((s, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              {s.heading ? <Text style={[styles.sectionTitle, { fontSize: 16 }]}>{s.heading}</Text> : null}
              {s.text ? (
                // If the text contains lines like Email: ... or Phone: ... render each line separately
                <View style={{ marginTop: 6 }}>
                  {String(s.text).split('\n').map((line, idx) => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                      const label = parts[0].trim();
                      const rest = parts.slice(1).join(':').trim();
                      return (<Text key={idx}><Text style={{ fontWeight: '700', color: APP_BLUE }}>{label}:</Text> <Text style={{ color: '#444' }}>{rest}</Text></Text>);
                    }
                    return <Text key={idx} style={{ color: '#444' }}>{line}</Text>;
                  })}
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      );
    }

    // If module provides items (e.g., blogs), list them
    if (mod.items && Array.isArray(mod.items)) {
      return (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>{mod.title}</Text>
          {mod.items.map((it, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              {it.url ? (
                <TouchableOpacity onPress={() => Linking.openURL(it.url)}>
                  <Text style={{ fontWeight: '700', color: APP_BLUE }}>{it.title}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontWeight: '700' }}>{it.title}</Text>
              )}
              {it.summary ? <Text style={{ color: '#444', marginTop: 6 }}>{it.summary}</Text> : null}
              {it.content ? <Text style={{ color: '#444', marginTop: 6 }}>{it.content}</Text> : null}
            </View>
          ))}
        </ScrollView>
      );
    }

    // If module provides a longDescription or content string
    if (mod.longDescription || mod.content || mod.details) {
      return (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>{mod.title}</Text>
          {mod.longDescription ? <Text style={{ color: '#444', marginTop: 6 }}>{mod.longDescription}</Text> : null}
          {mod.content ? <Text style={{ color: '#444', marginTop: 6 }}>{mod.content}</Text> : null}
          {mod.details ? <Text style={{ color: '#444', marginTop: 6 }}>{mod.details}</Text> : null}
        </ScrollView>
      );
    }

    // Fallback: show basic module title
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{mod.title}</Text>
        <Text style={{ color: '#444' }}>No additional content available.</Text>
      </ScrollView>
    );
  };

  // Home page content (replaced with Showcase layout matching provided images)
  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <HomeHero onAdPress={(item) => {
        // Close drawer if open, and open the Apply module.
        try { setDrawerOpen(false); } catch (e) {}
        const initial = (item && item.title) ? item.title : '';
        setSelectedModule({ id: 'apply', title: 'Apply', initialCourse: initial });
      }} />
      {/* FreeCoursesRow moved back to Home */}
      <FreeCoursesRow />
  {/* ConnectCards removed */}
    </ScrollView>
  );

  // Dashboard
  const renderDashboard = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>My Dashboard</Text>
      {user ? (
        <View>
          <Text style={{ color: '#444' }}>Dashboard content will appear here. Sign-in-based data requires a backend endpoint.</Text>
        </View>
      ) : (
        <View>
          <Text style={{ color: '#444' }}>Please log in to see your dashboard.</Text>
        </View>
      )}
    </ScrollView>
  );

  // lightweight view history so Back pops one step only
  // const [viewHistory, setViewHistory] = useState([]);

  // push current view to history then open next
  function pushAndOpen(nextView) {
    setViewHistory(h => [...h, selectedModule ?? { id: 'home' }]);
    setSelectedModule(nextView);
  }
  // use this helper instead of calling setSelectedModule(...) directly
  function openModule(module) { pushAndOpen(module); }

  // When opening a course from the courses list
  function openCourse(course) {
    setViewHistory([...viewHistory, { type: 'courses' }]);
    setSelectedCourse(course);
    setSelectedModule(null);
  }

  // When opening Apply from a course detail
  function openApplyFromCourse(course) {
    setViewHistory([...viewHistory, { type: 'course', value: course }]);
    setSelectedModule({ id: 'apply', title: 'Apply', initialCourse: course.title });
    setSelectedCourse(null);
  }

  // pop one step on Back
  function handleBack() {
    if (viewHistory.length > 0) {
      const last = viewHistory[viewHistory.length - 1];
      setViewHistory(viewHistory.slice(0, -1));
      if (last.type === 'courses') {
        setSelectedCourse(null);
        setSelectedModule(null);
      } else if (last.type === 'course') {
        setSelectedCourse(last.value);
        setSelectedModule(null);
      }
    } else {
      // Only here do you go to the main page
      setSelectedCourse(null);
      setSelectedModule(null);
    }
  }

  // Ensure logout closes drawer and clears local state before calling parent handler
  function handleLogout() {
    try {
      setDrawerOpen(false);
      setSelectedCourse(null);
      setSelectedModule(null);
      setActiveTab('home');
    } catch (e) {
      // ignore
    }
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.warn('onLogout not provided');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Left: Hamburger menu */}
        <TouchableOpacity style={styles.hamburger} onPress={() => setDrawerOpen(s => !s)}>
          <View style={styles.hLine} /><View style={styles.hLine} /><View style={styles.hLine} />
        </TouchableOpacity>
        
        {/* Middle: Logo */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        
        {/* Right: Icon group */}
        <View style={styles.headerIconGroup}>
          {/* Home icon */}
          <TouchableOpacity style={styles.iconWrap} onPress={() => { setSelectedModule(null); setActiveTab('home'); }}>
            <Image source={require('../../assets/home.png')} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
          {/* Notification bell */}
          <TouchableOpacity style={styles.iconWrap} onPress={() => { /* TODO: open notifications */ }}>
            <Image source={require('../../assets/bluebell.png')} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {useWebView && WebView ? (
          <WebView source={{ uri: 'https://www.educativo.in/' }} style={{ flex: 1 }} startInLoadingState />
        ) : (
          (loading ? (
            <View style={styles.placeholder}>
              <ActivityIndicator size="large" color={APP_BLUE} />
            </View>
          ) : error ? (
            <View style={styles.placeholder}>
              <Text style={{ color: '#c62828' }}>Failed to load content: {error}</Text>
              <TouchableOpacity onPress={loadAll} style={{ marginTop: 8 }}>
                <Text style={{ color: APP_BLUE }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : selectedCourse ? (
            <View style={{ flex: 1 }}>
              <View style={styles.stackHeader}>
                <TouchableOpacity onPress={handleBack}>
                  <Text style={{ fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: '700', marginLeft: 10 }}>{selectedCourse.title}</Text>
                <TouchableOpacity onPress={handleBack} style={{ marginLeft: 'auto', paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Image source={require('../../assets/backarrow.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
                </TouchableOpacity>
              </View>
              <CourseDetailScreen course={selectedCourse} onApply={(c) => {
                // When opening Apply from a course detail
                setViewHistory([...viewHistory, { type: 'course', value: selectedCourse }]);
                setSelectedModule({ id: 'apply', title: 'Apply', initialCourse: selectedCourse.title });
                setSelectedCourse(null);
              }} />
            </View>
          ) : activeTab === 'learn' ? (
              <View style={{ flex: 1 }}>
                <LearnScreen />
              </View>
            ) : selectedModule ? (
            <View style={{ flex: 1 }}>
              <View style={styles.stackHeader}>
                <TouchableOpacity onPress={handleBack}>
                  <Text style={{ fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: '700', marginLeft: 10 }}>{selectedModule.title}</Text>
                <TouchableOpacity onPress={handleBack} style={{ marginLeft: 'auto', paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Image source={require('../../assets/backarrow.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
                </TouchableOpacity>
              </View>
              {selectedModule.id === 'apply' ? (
                <ApplyDetailScreen
                  initialCourse={selectedModule.initialCourse || ''}
                  onDone={() => setSelectedModule(null)}
                />
              ) : selectedModule.id === 'about' ? (
                <AboutScreen />
              ) : selectedModule.id === 'privacy' ? (
                <PrivacyScreen />
              ) : selectedModule.id === 'faq' ? (
                <FAQScreen />
              ) : selectedModule.id === 'contact' ? (
                <ContactScreen />
              ) : selectedModule.id === 'terms' ? (
                <TermsScreen />
              ) : renderModuleContent(selectedModule)}
            </View>
          ) : renderHome())
        )}
      </View>

      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerX }] }]}>
  <View style={styles.drawerHeader}>
    <Text style={{ fontWeight: '700' }}>Menu</Text>
    <TouchableOpacity onPress={() => setDrawerOpen(false)}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>✕</Text>
    </TouchableOpacity>
  </View>
  <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {modules.filter(m => m.id !== 'courses').map(m => (
            <TouchableOpacity key={m.id} style={styles.moduleBtn} 
              onPress={() => { setDrawerOpen(false); loadModule(m.id, m); }}>
              <Text style={styles.moduleText}>{m.title}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.moduleBtn} onPress={() => { setDrawerOpen(false); if (user && user.id) { setSelectedModule({ id: 'dashboard', title: 'My Dashboard' }); } else { Alert.alert('Sign in required', 'Please sign in to access the dashboard'); } }}><Text style={styles.moduleText}>My Dashboard</Text></TouchableOpacity>

          {/* Visible LOGOUT placed right below My Dashboard */}
          <TouchableOpacity onPress={handleLogout} style={[styles.moduleBtn, { marginTop: 6 }]}>
            <Text style={[styles.moduleText, { color: APP_BLUE, fontWeight: '900' }]}>LOGOUT</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Pinned bottom area inside drawer: connect block + copyright (footer) */}
        <View style={styles.drawerBottom} pointerEvents="box-none">
          <View style={styles.connectBlock}>
            <Text style={styles.connectLabel}>Connect with us</Text>
            <View style={styles.footerIconsRow}>
              <Image source={require('../../assets/instagram.png')} style={styles.footerIcon} />
              <Image source={require('../../assets/facebook.png')} style={styles.footerIcon} />
              <Image source={require('../../assets/linkedin.png')} style={styles.footerIcon} />
              <Image source={require('../../assets/whatsapp.png')} style={styles.footerIcon} />
            </View>
            <Text style={[styles.footerText, { textAlign: 'center', marginTop: 8 }]}>Copyright © 2025 All Rights Reserved by Educativo</Text>
          </View>
        </View>
      </Animated.View>

      {/* Tab row placed above footer so modules appear above the footer */}
      <View style={styles.tabRowWrap}>
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, activeTab === 'home' && styles.tabActive]} onPress={() => { setActiveTab('home'); setSelectedModule(null); setSelectedCourse(null); }}>
            <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'learn' && styles.tabActive]} onPress={() => { setActiveTab('learn'); setSelectedModule(null); setSelectedCourse(null); }}>
            <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>LEARN</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Footer moved into drawer */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: HEADER_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 28 },
  hamburger: { padding: 8 },
  hLine: { width: 22, height: 2, backgroundColor: APP_BLUE, marginVertical: 2 },
  headerLogo: { width: 180, height: 64, marginBottom: 6 },
  logoutTop: { paddingHorizontal: 8, paddingVertical: 6 },
  logoutTopText: { color: APP_BLUE, fontWeight: '800', textTransform: 'uppercase', fontSize: 16 },
  headerIconGroup: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: { 
    width: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 4,
  },
  iconImage: { width: 28, height: 28 },
  bellWrap: { width: 48, alignItems: 'center', justifyContent: 'center' },
  bell: { fontSize: 22, color: APP_BLUE },
  bellImage: { width: 28, height: 28 },
  body: { flex: 1 },
  content: { padding: 20, paddingBottom: 80 },
  hero: { alignItems: 'center', marginBottom: 16 },
  heroCentered: { alignItems: 'center', marginBottom: 16, backgroundColor: '#fff', padding: 12 },
  heroLogo: { width: 220, height: 120 },
  logoText: { fontSize: 20, fontWeight: '900', color: APP_BLUE, marginTop: 6 },
  welcomeLabel: { color: APP_BLUE, marginTop: 6, fontSize: 16 },
  welcomeName: { fontSize: 22, fontWeight: '900', color: APP_BLUE, marginTop: 2 },
  heroTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  heroSubtitle: { color: '#666', textAlign: 'center', marginTop: 6 },
  ctaRow: { flexDirection: 'row', marginTop: 12 },
  ctaPrimary: { backgroundColor: APP_BLUE, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginRight: 8 },
  ctaPrimaryText: { color: '#fff', fontWeight: '700' },
  ctaGhost: { borderColor: APP_BLUE, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  ctaGhostText: { color: APP_BLUE, fontWeight: '700' },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: APP_BLUE },
  courseCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 10, backgroundColor: '#ffffff', marginBottom: 12, borderWidth: 1, borderColor: '#e9f0ff', elevation: 2 },
  courseInfo: { flex: 1, paddingRight: 8 },
  courseTitle: { fontWeight: '700' },
  courseSubtitle: { color: '#666', marginTop: 4 },
  applyBtn: { backgroundColor: '#198754', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  applyText: { color: '#fff', fontWeight: '700' },
  partnersRow: { flexDirection: 'row', flexWrap: 'wrap' },
  partnerBox: { backgroundColor: '#eef6ff', padding: 10, borderRadius: 6, marginRight: 8, marginBottom: 8 },
  partnerText: { color: APP_BLUE, fontWeight: '600' },
  welcomeText: { fontSize: 16, fontWeight: '700', color: APP_BLUE, marginBottom: 6, textAlign: 'center' },
  socialIcon: { width: 40, height: 40, borderRadius: 6 },
  drawer: { position: 'absolute', top: HEADER_HEIGHT - 8, left: 0, bottom: 0, width: 320, maxWidth: '86%', backgroundColor: '#fff', padding: 12, elevation: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  featureItem: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e6f0ff' },
  featureTitle: { fontWeight: '700', color: APP_BLUE },
  featureDesc: { color: '#444', marginTop: 6 },
  achievementsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  achievement: { alignItems: 'center', padding: 12, backgroundColor: '#eef6ff', borderRadius: 8, flex: 1, marginHorizontal: 6 },
  achievementCount: { fontWeight: '800', color: APP_BLUE, fontSize: 18 },
  achievementLabel: { color: APP_BLUE, marginTop: 6, fontSize: 12, textAlign: 'center', letterSpacing: 0.5 },
  faqItem: { marginBottom: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#f1f5fb' },
  faqQ: { fontWeight: '700', color: APP_BLUE },
  faqA: { color: '#444', marginTop: 6 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  moduleBtn: { paddingVertical: 12 },
  moduleText: { fontSize: 22, color: APP_BLUE, fontWeight: '600' },
  subitemBtn: { paddingVertical: 10, paddingLeft: 12 },
  subitemText: { color: '#444' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  courseListItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#f1f3f5' },
  stackHeader: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee'},
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8, // Lessened height by 2 notches
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  connectLabel: {
    fontSize: 16, // Slightly smaller for balance
    color: '#003B73',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4, // Less space below icons
  },
  footerIcon: {
    width: 32,
    height: 32,
    marginHorizontal: 2, // Less space between icons
    resizeMode: 'contain',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8, // Less space below copyright
  },
  partnersLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003B73',
    marginBottom: 10,
    textAlign: 'center',
  },
  partnersList: {
    paddingHorizontal: 24,
    marginBottom: 0, // No extra space below the list
    paddingBottom: 0,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  partnerDot: {
    fontSize: 22,
    color: '#003B73',
    marginRight: 10,
    fontWeight: 'bold',
  },
  partnerName: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  tabRowWrap: { width: '100%', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, alignItems: 'center' },
  tabRow: { flexDirection: 'row', width: '100%', backgroundColor: '#fff', borderTopWidth: 0, justifyContent: 'space-between', paddingHorizontal: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: APP_BLUE },
  tabText: { color: '#666', fontWeight: '800', fontSize: 18 },
  tabTextActive: { color: APP_BLUE, fontWeight: '900', fontSize: 18 },
  logoutDrawer: { backgroundColor: APP_BLUE, paddingVertical: 12, marginHorizontal: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  logoutDrawerText: { color: '#fff', fontWeight: '800' },
  // Drawer footer area: make room so the LOGOUT label can sit above it
  drawerBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingTop: 12, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#eee', minHeight: 120 },
  // place connect icons and footer content pinned to the very bottom
  connectBlock: { paddingHorizontal: 16, position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
  logoutLabelWrap: { alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 16 },
  logoutLabel: { color: APP_BLUE, fontWeight: '900', fontSize: 20, letterSpacing: 0.6 },
  // (logoutAboveFooter removed — logout now displayed in-scroll directly under My Dashboard)
});

export default MainScreen;

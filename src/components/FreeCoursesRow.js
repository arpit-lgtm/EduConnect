import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, Linking, FlatList } from 'react-native';

const { width } = Dimensions.get('window');

// Default placeholder image when specific images aren't available
const DEFAULT_IMAGE = require('../../assets/logo.png');

// Define background colors for each category
const CATEGORY_COLORS = {
  genai: {
    default: '#003B73',
    video1: '#004D99',
    video2: '#0061C2',
  },
  python: {
    default: '#014421',
    video1: '#016B34',
    video2: '#018C45',
  },
  business: {
    default: '#800020',
    video1: '#A30028',
    video2: '#C6002E',
  }
};

// Get appropriate thumbnail color based on category, index, and thumbnailKey
const getPlaceholderColor = (categoryId, index, thumbnailKey) => {
  const categoryColors = CATEGORY_COLORS[categoryId];
  
  if (!categoryColors) {
    return '#003B73'; // Default blue if category not found
  }
  
  // If video has a specific thumbnailKey property, use that color
  if (thumbnailKey && categoryColors[thumbnailKey]) {
    return categoryColors[thumbnailKey];
  }
  
  // Use specific video colors for the first two videos, otherwise use default
  if (index === 0 && categoryColors.video1) {
    return categoryColors.video1;
  } else if (index === 1 && categoryColors.video2) {
    return categoryColors.video2;
  }
  
  return categoryColors.default;
};

// Course data with domains and videos
const COURSE_DATA = [
  {
    id: 'genai',
    title: 'Generative AI Tools & Applications',
    videos: [
      { 
        title: 'Top Generative AI Tools 2025', 
        url: 'https://www.youtube.com/watch?v=Ceuy2W2xTRQ',
        thumbnailKey: 'video1' 
      },
      { 
        title: 'From Idea to AI: Building Applications', 
        url: 'https://www.youtube.com/watch?v=dFSnam97YbQ',
        thumbnailKey: 'video2' 
      },
      { 
        title: 'Gen AI Tutorial For Beginners', 
        url: 'https://www.youtube.com/watch?v=ko7Tkp-fyYM' 
      },
      { 
        title: 'Concepts, Tools, and Applications', 
        url: 'https://www.youtube.com/watch?v=mp8ltL1bcLs' 
      },
      { 
        title: 'AI Tools EXPLAINED: How to Use Them', 
        url: 'https://www.youtube.com/watch?v=yHk7Vavmc7Q' 
      }
    ]
  },
  {
    id: 'python',
    title: 'Python for Data Analysis',
    videos: [
      { 
        title: 'Python for Data Analytics - Full Course', 
        url: 'https://www.youtube.com/watch?v=wUSDVGivd-8',
        thumbnailKey: 'video1'
      },
      { 
        title: 'Data Analysis with Python - Full Course', 
        url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
        thumbnailKey: 'video2'
      },
      { 
        title: 'The Beginner\'s Ultimate Guide', 
        url: 'https://www.youtube.com/watch?v=gaPFwH0r4uo' 
      },
      { 
        title: 'Python Fundamentals In 1 Hour', 
        url: 'https://www.youtube.com/watch?v=ZI2PuU6l_ZM' 
      },
      { 
        title: 'How I\'d Learn PYTHON For DATA ANALYSIS', 
        url: 'https://www.youtube.com/watch?v=vaCev1NwQr8' 
      },
      { 
        title: 'Python for Data Analysis (Playlist)', 
        url: 'https://www.youtube.com/playlist?list=PLodYDTuHA29YIff8B2a0ILdFrQ4WqvHwh' 
      },
      { 
        title: 'Python for Data Analytics Full Course 2025', 
        url: 'https://www.youtube.com/watch?v=YgV3TYD1p0w' 
      },
      { 
        title: 'Python for Data Science - Beginners', 
        url: 'https://www.youtube.com/watch?v=9VPvfFs73zc' 
      },
      { 
        title: 'How I Use Python as a Data Analyst', 
        url: 'https://www.youtube.com/watch?v=JQEwPa5FStM' 
      },
      { 
        title: 'Python For Data Analysis Full Course', 
        url: 'https://www.youtube.com/watch?v=vL12MBT1JZw' 
      }
    ]
  },
  {
    id: 'business',
    title: 'AI for Business Leaders',
    videos: [
      { 
        title: 'AI for Business Full Course in 11 Hours', 
        url: 'https://www.youtube.com/watch?v=fkZbCG4mrds',
        thumbnailKey: 'video1'
      },
      { 
        title: 'Master the Future in 60 Minutes!', 
        url: 'https://www.youtube.com/watch?v=iIm8acWm1ns',
        thumbnailKey: 'video2'
      },
      { 
        title: 'Future Of Work with AI', 
        url: 'https://www.youtube.com/watch?v=qYNweeDHiyU' 
      },
      { 
        title: 'Making AI Work for Business Leaders', 
        url: 'https://www.youtube.com/watch?v=9c7zh2MkslY' 
      },
      { 
        title: 'Business Academy: AI for Leaders', 
        url: 'https://www.youtube.com/watch?v=mYHWnUJHDA8' 
      },
      { 
        title: 'Preparing Leaders for the AI Era', 
        url: 'https://www.youtube.com/watch?v=tgcixab_Yk8' 
      },
      { 
        title: 'The Hidden Power of AI', 
        url: 'https://www.youtube.com/watch?v=PmZZYXoDnu8' 
      },
      { 
        title: 'Creating Impact with AI Solutions', 
        url: 'https://www.youtube.com/watch?v=OgtElcWR8-0' 
      },
      { 
        title: 'Key Role in AI Adoption', 
        url: 'https://www.youtube.com/watch?v=Ax9qNfL9BGQ' 
      },
      { 
        title: 'Mastering AI for Strategic Advantage', 
        url: 'https://www.youtube.com/watch?v=bA7FfEhuDFc' 
      }
    ]
  }
];

const FreeCoursesRow = () => {
  // Track which domains are expanded (all collapsed by default as per TODO)
  const [expandedDomains, setExpandedDomains] = useState({});
  
  // Toggle domain expansion
  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };
  
  const openYoutubeLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't open YouTube link", err));
  };

  // Render a video card
  const renderVideoCard = (video, index, categoryId) => {
    const backgroundColor = getPlaceholderColor(categoryId, index, video.thumbnailKey);
    
    return (
      <TouchableOpacity 
        key={`${categoryId}-${index}`}
        style={styles.videoCard}
        onPress={() => openYoutubeLink(video.url)}
      >
        <View style={[styles.videoImageContainer, { backgroundColor }]}>
          {/* YouTube icon */}
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          
          {/* Category label */}
          <View style={styles.categoryLabel}>
            <Text style={styles.categoryText}>{categoryId.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
      </TouchableOpacity>
    );
  };

  // Render a single category section
  const renderCategorySection = (category) => {
    const isExpanded = expandedDomains[category.id] || false;
    
    return (
      <View key={category.id} style={styles.categorySection}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => toggleDomain(category.id)}
        >
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.expandCollapseIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.videosContainer}
            contentContainerStyle={styles.videoScrollContent}
            snapToInterval={width * 0.8 + 20} // Width of card + margin
            decelerationRate="fast"
            snapToAlignment="start"
          >
            {category.videos.map((video, index) => renderVideoCard(video, index, category.id))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Free Courses</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
      
      {/* All categories stacked vertically */}
      <ScrollView style={styles.allCategoriesContainer}>
        {COURSE_DATA.map(category => renderCategorySection(category))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16, // Consistent padding on both sides
    marginTop: 12,
    paddingBottom: 24,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 0, // Remove extra padding since container now has consistent padding
  },
  title: { 
    color: '#003B73', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  viewAll: { 
    color: '#0056b3', 
    fontWeight: '600' 
  },
  allCategoriesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 16,
    width: '100%',
  },
  videoScrollContent: {
    paddingLeft: 0, // Ensure first card aligns with the left edge
    paddingRight: 16, // Add padding to the right edge for better appearance
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003B73',
    paddingLeft: 0, // Remove extra padding to align with videos
  },
  expandCollapseIcon: {
    fontSize: 18,
    color: '#003B73',
    paddingRight: 10,
  },
  videosContainer: {
    flexDirection: 'row',
    marginTop: 12, // Add margin top for spacing after category header
    marginBottom: 8,
    paddingLeft: 0, // Ensure no extra padding on the left
    paddingRight: 0, // Remove extra padding since it's now in videoScrollContent
  },
  videoCard: {
    width: width * 0.75, // Slightly reduced to ensure better view on most screens
    marginRight: 16, // Consistent spacing with other UI elements
    marginLeft: 0, // Ensure no left margin on the first card
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  videoImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  playIcon: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 3,
  },
  videoTitle: {
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    height: 60,
    textAlign: 'left',
    lineHeight: 20,
  }
});

export default FreeCoursesRow;

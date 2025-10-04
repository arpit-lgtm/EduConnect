import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

const { width } = Dimensions.get('window');
const PAGE_WIDTH = width - 40;

// Load the ad manifest
let ADS = [];
try {
  ADS = require('../../assets/ads/ads.json');
} catch (e) {
  ADS = [];
}

// Map expected filenames to static requires. React Native's require must be static.
const IMAGE_MAP = {
  // Use the original assets directly (no normalized folders present)
  'admission.png': (function(){ try { return require('../../assets/ads/admission.png'); } catch (e) { console.error('Failed to load admission.png:', e); return null; } })(),
  'admission.png?refresh=1': (function(){ try { return require('../../assets/ads/admission.png'); } catch (e) { console.error('Failed to load admission.png?refresh=1:', e); return null; } })(),
  'referral.png': (function(){ try { return require('../../assets/ads/referral.png'); } catch (e) { console.error('Failed to load referral.png:', e); return null; } })(),
  'referral.png?refresh=1': (function(){ try { return require('../../assets/ads/referral.png'); } catch (e) { console.error('Failed to load referral.png?refresh=1:', e); return null; } })(),
  'goldengate.png': (function(){ try { return require('../../assets/ads/goldengate.png'); } catch (e) { return null; } })(),
  'liverpool.png': (function(){ try { return require('../../assets/ads/liverpool.png'); } catch (e) { return null; } })(),
  'iitbanglore.png': (function(){ try { return require('../../assets/ads/iitbanglore.png'); } catch (e) { return null; } })(),
  'opjindal.png': (function(){ try { return require('../../assets/ads/opjindal.png'); } catch (e) { return null; } })(),
  'ssbmuniversity.png': (function(){ try { return require('../../assets/ads/ssbmuniversity.png'); } catch (e) { return null; } })(),
  'woolfuniversity.png': (function(){ try { return require('../../assets/ads/woolfuniversity.png'); } catch (e) { return null; } })(),
  'deakin.png': (function(){ try { return require('../../assets/ads/deakin.png'); } catch (e) { return null; } })(),
  'mituniversity.png': (function(){ try { return require('../../assets/ads/mituniversity.png'); } catch (e) { return null; } })(),
};

// (no debug logs in production)

// Pre-load the critical images to ensure they're in the bundle
const ADMISSION_IMAGE = require('../../assets/ads/admission.png');
const REFERRAL_IMAGE = require('../../assets/ads/referral.png');

const HomeHero = ({ onAdPress }) => {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [heights, setHeights] = useState({});
  // targetHeight: single height used for all banners to ensure consistent sizing
  const [targetHeight, setTargetHeight] = useState(null);
  
  // Specifically check if critical images are loaded properly
  useEffect(() => {
    console.log('Pre-loaded images check:');
    console.log('- Admission image:', ADMISSION_IMAGE ? 'LOADED' : 'FAILED');
    console.log('- Referral image:', REFERRAL_IMAGE ? 'LOADED' : 'FAILED');
    
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      // Additional check for admission image in IMAGE_MAP
      console.log('IMAGE_MAP admission image:', IMAGE_MAP['admission.png'] ? 'LOADED' : 'FAILED');
      console.log('IMAGE_MAP referral image:', IMAGE_MAP['referral.png'] ? 'LOADED' : 'FAILED');
    }
  }, []);
  
  const items = ADS.length > 0 ? ADS : [{ id: 'fallback', image: 'admission.png', title: 'Banner' }];

  // Auto-advance every 10s. Use functional update so interval doesn't recreate on every index change.
  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % items.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ x: next * PAGE_WIDTH, animated: true });
        }
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [items.length]);

  // Debug: print the loaded manifest items and which IMAGE_MAP entries resolved (dev only)
  useEffect(() => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      try {
        console.log('HomeHero: items=', items.map(i => ({ id: i.id, image: i.image, title: i.title })));
        const resolved = Object.keys(IMAGE_MAP).filter(k => IMAGE_MAP[k]);
        console.log('HomeHero: IMAGE_MAP resolved keys=', resolved);
      } catch (e) { /* ignore */ }
    }
  }, [items]);

  const renderImage = (item, i) => {
    // Parse image name without query params for fallback
    const baseName = item.image ? item.image.split('?')[0] : null;
    
    // Debug the item we're trying to render
    console.log(`Rendering banner: id=${item.id}, title=${item.title}, image=${item.image}`);
    
    // Try to get the image from IMAGE_MAP with full path including query params
    let mapped = IMAGE_MAP[item.image];
    
    // If not found and there was a query param, try the base name without query
    if (!mapped && baseName && baseName !== item.image) {
      mapped = IMAGE_MAP[baseName];
      console.log(`Trying base image name: ${baseName}, resolved=${mapped ? 'YES' : 'NO'}`);
    }
    
    // If the image is still not loaded and this is the referral banner, try loading it directly
    if (!mapped && (item.id === 'referral')) {
      console.log('Special handling for referral banner');
      try {
        // Force a direct require
        const directImage = require('../../assets/ads/referral.png');
        mapped = directImage;
        console.log('Direct require for referral.png successful');
      } catch (e) {
        console.error('Direct require for referral.png failed:', e.message);
      }
    }
    
    // Debug to check if image is resolved correctly
    console.log(`Banner ${item.id}: image=${item.image}, resolved=${mapped ? 'YES' : 'NO'}`);
    
    // If still not found, use appropriate fallback
    let src;
    if (!mapped) {
      // Special handling for specific banners
      if (item.id === 'referral') {
        console.log('Using pre-loaded referral image');
        src = REFERRAL_IMAGE;
      } else if (item.id === 'admission') {
        console.log('Using pre-loaded admission image');
        src = ADMISSION_IMAGE;
      } else {
        // Default fallback to logo
        src = require('../../assets/logo.png');
      }
    } else {
      src = mapped;
    }
    
    // Fixed banner height using referral.png's 3:2 aspect ratio
    const BANNER_HEIGHT = styles.banner.height;
    
    return (
      <View key={item.id || i} style={{ width: PAGE_WIDTH, alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
            // Special handling for admission & referral banners
            if (item.id === 'admission' || item.id === 'referral') {
              // Use onAdPress for the Apply form
              if (typeof onAdPress === 'function') {
                try { onAdPress(item); } catch (e) { /* swallow handler errors */ }
              }
              return;
            }
            
            // For course ads, open the link in browser
            if (item && item.link) {
              try { 
                console.log(`Opening URL: ${item.link}`);
                Linking.openURL(item.link); 
              } catch (e) { 
                console.error(`Failed to open URL: ${item.link}`, e);
              }
              return;
            }
            
            // Fallback for any other case
            if (typeof onAdPress === 'function') {
              try { onAdPress(item); } catch (e) { /* swallow handler errors */ }
            }
          }}>
          <Image 
            source={src} 
            style={[styles.banner]} 
            resizeMode="cover"
            onError={(e) => {
              console.error(`Error loading image: ${item.image}`, e.nativeEvent.error);
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // No measurement needed - we're using a fixed aspect ratio (3:2) from referral.png
  // and forcing all banners to be the same size with resizeMode="cover"
  useEffect(() => {
    // Optional debug log (dev only)
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('HomeHero: Using fixed banner height with cover mode:', styles.banner.height);
    }
  }, []);

  const handleMomentum = (e) => {
    const pos = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(pos / PAGE_WIDTH);
    if (newIndex !== index) setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: PAGE_WIDTH }}
        contentContainerStyle={{}}
        snapToInterval={PAGE_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentum}
      >
        {items.map(renderImage)}
      </ScrollView>
      <View style={styles.pager}>
        {items.map((_, i) => (
          <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => {
            if (scrollRef.current) scrollRef.current.scrollTo({ x: i * PAGE_WIDTH, animated: true });
            setIndex(i);
          }}>
            <View style={i === index ? styles.dotActive : styles.dot} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  banner: {
    width: PAGE_WIDTH,
    height: 160, // Fixed height matching referral.png aspect ratio (PAGE_WIDTH * (1024/1536))
    borderRadius: 12,
  },
  pager: {
    flexDirection: 'row',
    marginTop: 8,
  },
  // debug styles removed
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#003B73',
    marginHorizontal: 4,
  },
  // debugBorder removed
});

export default HomeHero;

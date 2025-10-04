import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Animated, Image, Dimensions, TouchableOpacity, Linking, Platform, Keyboard } from 'react-native';

const { height } = Dimensions.get('window');

// API host: on Android emulator use 10.0.2.2 to reach host machine; iOS simulator and desktop use localhost
const API_HOST = Platform.OS === 'android' ? 'http://localhost:8081' : 'http://localhost:5000';

// Demo credentials (hardcoded for boss demo)
const DEMO_PHONE = '7977785842';
const DEMO_EMAIL = 'arpit@audentiaresearch.com';

// Hardcoded users file (not shown in UI) for quick demo logins
const HARDCODED_USERS = require('./hardcoded_users');

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotEmailMode, setIsForgotEmailMode] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // seconds
  const [otpLoading, setOtpLoading] = useState(false);
  const otpIntervalRef = useRef(null);
  // OTP verification state for registration
  const [registrationOtp, setRegistrationOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpModalFor, setOtpModalFor] = useState(null); // 'phone' | 'email'
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  // multi-step register flow: 1 = contact/email, 2 = profile details
  const [registerStep, setRegisterStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [latestQualification, setLatestQualification] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [college, setCollege] = useState('');
  const [organization, setOrganization] = useState('');

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const loginFormAnim = useRef(new Animated.Value(0)).current;
  const mainContentAnim = useRef(new Animated.Value(1)).current;
  const registerFormAnim = useRef(new Animated.Value(0)).current;
  // splash animation for short logo splash on login
  const logoSplashAnim = useRef(new Animated.Value(0)).current;
  // In-app welcome overlay (non-native popup)
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const [welcomeStage, setWelcomeStage] = useState(null); // null | 'blank' | 'text'
  const welcomeDelayRef = useRef(null);
  const welcomeHideRef = useRef(null);
  const [suppressUIDuringWelcome, setSuppressUIDuringWelcome] = useState(false);
  // Helper: show blank white page for 2s, then animate welcome text slowly, then call cb
  function showWhiteThenWelcome(name, cb) {
    // clear any previous timers
    if (welcomeDelayRef.current) clearTimeout(welcomeDelayRef.current);
    if (welcomeHideRef.current) clearTimeout(welcomeHideRef.current);

    setWelcomeName(name || '');
    setSuppressUIDuringWelcome(true);

    // Step 1: show animated logo for ~1s
    setShowLogoSplash(true);
    logoSplashAnim.setValue(0);
    Animated.timing(logoSplashAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // After ~1s show welcome text (step 2)
    welcomeDelayRef.current = setTimeout(() => {
      // fade out logo
      Animated.timing(logoSplashAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setShowLogoSplash(false);
      });

      // show welcome overlay and animate text for ~1s, then callback
      setShowWelcomeOverlay(true);
      welcomeAnim.setValue(0);
      Animated.timing(welcomeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

      // keep the welcome text visible ~1000ms then fade and finish
      welcomeHideRef.current = setTimeout(() => {
        Animated.timing(welcomeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          setShowWelcomeOverlay(false);
          setSuppressUIDuringWelcome(false);
          if (cb && typeof cb === 'function') cb();
        });
      }, 1000);
    }, 1000);
  }

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (welcomeDelayRef.current) clearTimeout(welcomeDelayRef.current);
      if (welcomeHideRef.current) clearTimeout(welcomeHideRef.current);
    };
  }, []);

  // shift UI when keyboard appears so bottom controls (BACK) remain visible
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const onShow = (e) => {
      if (e && e.endCoordinates && e.endCoordinates.height) setKeyboardHeight(e.endCoordinates.height);
      else setKeyboardHeight(250);
    };
    const onHide = () => setKeyboardHeight(0);
    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onHide);
    return () => {
      if (showSub && showSub.remove) showSub.remove();
      if (hideSub && hideSub.remove) hideSub.remove();
    };
  }, []);

  // ensure these are declared once near the other useState hooks:
  // splash shown on normal login; welcome overlay shown only after registration
  const [showLogoSplash, setShowLogoSplash] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  // suppressUIDuringWelcome is already declared above; DO NOT redeclare it here.
  // refs used by the form
  const contactInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(formFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowForm(true));
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height / 3],
  });

  const loginFormOpacity = loginFormAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const mainContentOpacity = mainContentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const registerFormOpacity = registerFormAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  // Show the footer only when main content (the Register button) is visible
  const showFooter = !isSignInMode && !isRegisterMode && !isForgotEmailMode && showForm;

  // changed code: handlers to show correct screen on login vs register
  function handleLoginSuccess(user) {
    // Properly cleanup animations
    if (welcomeDelayRef.current) clearTimeout(welcomeDelayRef.current);
    if (welcomeHideRef.current) clearTimeout(welcomeHideRef.current);

    // First hide any existing UI
    setSuppressUIDuringWelcome(true);
    setShowForm(false);

    // Show logo splash
    setShowLogoSplash(true);
    logoSplashAnim.setValue(0);

    // Animate logo fade in
    Animated.sequence([
      Animated.timing(logoSplashAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      // Hold for 2 seconds
      Animated.delay(2000),
      // Fade out
      Animated.timing(logoSplashAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      // Cleanup and navigate
      setShowLogoSplash(false);
      setSuppressUIDuringWelcome(false);
      if (props.onLogin && typeof props.onLogin === 'function') {
        props.onLogin(user);
      }
    });
  }

  function handleRegisterSuccess(user, displayName) {
    // show full welcome overlay (with name) after registration
    setSuppressUIDuringWelcome(true);
    setShowWelcomeOverlay(true);
    setTimeout(() => {
      setShowWelcomeOverlay(false);
      setSuppressUIDuringWelcome(false);
      props.navigation?.replace?.('Main') || (props.onLogin && props.onLogin(user));
    }, 2200);
  }

  // changed code: replace existing login/register success calls:
  // - wherever your current login routine calls "on success", call handleLoginSuccess(user)
  // - wherever your register routine calls "on success", call handleRegisterSuccess(user, name)
  //
  // Example (update your existing functions):
  // async function handleLogin() { ... if (success) handleLoginSuccess(user); }
  // async function handleRegister() { ... if (success) handleRegisterSuccess(user, firstName); }

  function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both login ID and password.');
      return;
    }

    // Disable interaction during login
    setShowForm(false);

    const loginId = email.trim();
    const match = HARDCODED_USERS.find(u => 
      u.id.toLowerCase() === loginId.toLowerCase() && 
      u.password === password
    );

    if (match) {
      // Use the proper success handler
      handleLoginSuccess(match.id);
    } else {
      // Re-enable form on error
      setShowForm(true);
      Alert.alert('Login failed', 'Invalid login ID or password.');
    }
  }

  // moved helpers: must be inside component so they can access refs/state
  // short animated logo splash for normal login (1s total)
  function showLogoThenNavigate(cb) {
    if (welcomeDelayRef.current) clearTimeout(welcomeDelayRef.current);
    if (welcomeHideRef.current) clearTimeout(welcomeHideRef.current);

    setSuppressUIDuringWelcome(true);
    setShowLogoSplash(true);

    logoSplashAnim.setValue(0);
    Animated.timing(logoSplashAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Show logo for 2 seconds, then fade out and callback
    welcomeDelayRef.current = setTimeout(() => {
      Animated.timing(logoSplashAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setShowLogoSplash(false);
        setSuppressUIDuringWelcome(false);
        if (cb && typeof cb === 'function') cb();
      });
    }, 2000);
  }

  // short animated welcome for registration (1s total)
  function showRegisterThenNavigate(name, cb) {
    if (welcomeDelayRef.current) clearTimeout(welcomeDelayRef.current);
    if (welcomeHideRef.current) clearTimeout(welcomeHideRef.current);

    setSuppressUIDuringWelcome(true);
    setWelcomeName(name || '');
    setShowWelcomeOverlay(true);

    welcomeAnim.setValue(0);
    Animated.timing(welcomeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Show welcome overlay for 2 seconds, then fade out and callback
    welcomeDelayRef.current = setTimeout(() => {
      Animated.timing(welcomeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setShowWelcomeOverlay(false);
        setSuppressUIDuringWelcome(false);
        if (cb && typeof cb === 'function') cb();
      });
    }, 2000);
  }

  function handleRegister() {
    // Final registration submission (expects registerStep === 2)
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please enter your first and last name.');
      return;
    }
    // Demo shortcut: if demo credentials are present, show in-app welcome and navigate
        if (contactNumber === DEMO_PHONE || registerEmail === DEMO_EMAIL) {
      showWhiteThenWelcome('Arpit', () => { if (props.onLogin && typeof props.onLogin === 'function') props.onLogin('Arpit'); });
      return;
    }
    const payload = {
      contactNumber: contactNumber || null,
      email: registerEmail || null,
      firstName,
      lastName,
      college,
      organization,
    };

    fetch(`${API_HOST}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // show in-app welcome (no native alert) then navigate
          const userId = (data.user && (data.user.email || data.user.contactNumber || data.user.id)) || registerEmail || contactNumber || 'user';
          const nameToShow = firstName || 'User';
          showRegisterThenNavigate(nameToShow, () => { if (props.onLogin && typeof props.onLogin === 'function') props.onLogin(userId); });
        } else {
          Alert.alert('Error', data.message || 'Registration failed');
        }
      })
      .catch(() => {
        // For demo: if demo credentials were used, allow proceeding to main screen even if backend isn't running
        if (contactNumber === DEMO_PHONE || registerEmail === DEMO_EMAIL) {
          showRegisterThenNavigate('Arpit', () => { if (props.onLogin && typeof props.onLogin === 'function') props.onLogin('Arpit'); });
          return;
        }
        Alert.alert('Error', 'Network error');
      });
  }

  function handleConfirm() {
    // Move from step 1 -> step 2 after at least one verification
    if (!isPhoneVerified && !isEmailVerified) {
      Alert.alert('Error', 'Please verify phone or email before confirming.');
      return;
    }
    setRegisterStep(2);
  }

  function handleSendOTP() {
    // For registration, allow sending OTP to phone or email independently.
    let payload = {};
    // If user provided phone only -> send for phone
    if (contactNumber && !registerEmail) {
      payload = { contactNumber };
    } else if (!contactNumber && registerEmail) {
      payload = { email: registerEmail };
    } else if (contactNumber && registerEmail) {
      // send to both if both provided
      payload = { contactNumber, email: registerEmail };
    } else {
      Alert.alert('Error', 'Please enter phone number or email to send OTP.');
      return;
    }
  // Reset verification when sending a new OTP
  // Reset verification when sending a new OTP
  setIsOtpVerified(false);
  setRegistrationOtp('');
  setOtpLoading(true);
  fetch(`${API_HOST}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        setOtpLoading(false);
        if (data.success) {
            setOtpSent(true);
            setOtpTimer(120); // 2 minutes
          if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
          otpIntervalRef.current = setInterval(() => {
            setOtpTimer(prev => {
              if (prev <= 1) {
                clearInterval(otpIntervalRef.current);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
            // show OTP modal for the primary requested target
            if (payload.contactNumber && !payload.email) {
              setOtpModalFor('phone');
              setShowOtpModal(true);
            } else if (!payload.contactNumber && payload.email) {
              setOtpModalFor('email');
              setShowOtpModal(true);
            } else if (payload.contactNumber && payload.email) {
              // prefer phone modal first
              setOtpModalFor('phone');
              setShowOtpModal(true);
            }
        } else {
          Alert.alert('Error', data.message || 'Failed to send OTP.');
        }
      })
      .catch(() => {
        setOtpLoading(false);
        Alert.alert('Error', 'Network error.');
      });
  }

  async function handleVerifyOtp() {
    if (!registrationOtp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    setVerifyingOtp(true);
    try {
  const payload = { otp: registrationOtp };
  // verify for the specific modal target to avoid server errors
  if (otpModalFor === 'phone') payload.contactNumber = contactNumber;
  else if (otpModalFor === 'email') payload.email = registerEmail;

  const res = await fetch(`${API_HOST}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        if (otpModalFor === 'phone') {
          setIsPhoneVerified(true);
        } else if (otpModalFor === 'email') {
          setIsEmailVerified(true);
        }
        setShowOtpModal(false);
        Alert.alert('Success', 'OTP verified.');
      } else {
        Alert.alert('Error', data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('verify-otp error', err);
      Alert.alert('Error', 'Network error');
    } finally {
      setVerifyingOtp(false);
    }
  }

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
    };
  }, []);

  function handleSignInTransition() {
    Animated.timing(mainContentAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      // Prefill sign-in demo credentials (empty by default; user can choose)
      setEmail('');
      setPassword('');
      setIsSignInMode(true);
      setIsRegisterMode(false);
      setIsForgotEmailMode(false);
      Animated.timing(loginFormAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleForgotEmailTransition() {
    Animated.timing(mainContentAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      setIsForgotEmailMode(true);
      setIsSignInMode(false);
      setIsRegisterMode(false);
      Animated.timing(loginFormAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleForgotEmailBack() {
    Animated.timing(loginFormAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      setIsForgotEmailMode(false);
      Animated.timing(mainContentAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleRegisterTransition() {
    Animated.timing(mainContentAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      setIsRegisterMode(true);
      setIsSignInMode(false);
      setIsForgotEmailMode(false);
      setRegisterStep(1);
      // Prefill demo credentials so the demo can proceed quickly
      setContactNumber(DEMO_PHONE);
      setRegisterEmail(DEMO_EMAIL);
      // mark as verified for demo flow so Confirm is enabled
      setIsPhoneVerified(true);
      setIsEmailVerified(true);
  // Prefill demo profile fields as requested
      setFirstName('Arpit');
      setLastName('Maniar');
      setLatestQualification('Graduate - B.Com');
      setCollege('University of Mumbai');
      setOrganization('Audentia Research');
      setOtpSent(false);
      setOtpTimer(0);
      Animated.timing(registerFormAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleBackTransition() {
    Animated.timing(loginFormAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      setIsSignInMode(false);
      setIsRegisterMode(false);
      setIsForgotEmailMode(false);
      Animated.timing(mainContentAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleRegisterBackTransition() {
    Animated.timing(registerFormAnim, {
      toValue: 0,
      duration: 75,
      useNativeDriver: true,
    }).start(() => {
      // Clear registration-related state so form is empty when reopened
      setIsRegisterMode(false);
      setIsSignInMode(false);
      setIsForgotEmailMode(false);
      setRegisterStep(1);
      setContactNumber('');
      setRegisterEmail('');
      setOtpSent(false);
      setOtpTimer(0);
      setRegistrationOtp('');
      setIsOtpVerified(false);
      setIsPhoneVerified(false);
      setIsEmailVerified(false);
      setFirstName('');
      setLastName('');
      setCollege('');
      setOrganization('');
      if (otpIntervalRef.current) {
        clearInterval(otpIntervalRef.current);
        otpIntervalRef.current = null;
      }
      Animated.timing(mainContentAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }).start();
    });
  }

  const handleTermsPress = () => {
    Linking.openURL('https://example.com/terms');
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://example.com/privacy');
  };

  // Format phone number input
  const handleContactNumberChange = (text) => {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (numericText.length <= 10) {
      setContactNumber(numericText);
    }
  };

  // Add these animation configurations at the top of your component
const animationConfig = {
  timing: {
    duration: 300,
    useNativeDriver: true
  },
  splash: {
    duration: 2000,
    useNativeDriver: true
  }
};

  return (
    <>
      {/* changed code: splash and welcome overlay render */}
      {showLogoSplash && (
        <Animated.View style={[styles.welcomeOverlay, { opacity: logoSplashAnim }]}>
          <Image source={require('./assets/educativo.png')} style={{ width: 300, height: 128, resizeMode: 'contain' }} />
        </Animated.View>
      )}

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#fff' }}>
        {/* Logo - Always visible */}
        {!suppressUIDuringWelcome && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: isRegisterMode ? 'absolute' : 'relative',
              top: isRegisterMode ? 20 : 'auto',
              alignItems: 'center',
              transform: [{ translateY: isRegisterMode ? 0 : logoTranslateY }],
              zIndex: 0,
            }}
          >
            <Image source={require('./assets/logo.png')} style={isRegisterMode ? styles.logoSmall : styles.logo} resizeMode="contain" />
            {/* company logo moved to footer */}
          </Animated.View>
        )}

        {/* Footer with company logo and version at extreme bottom: animated like the Register button */}
        <Animated.View
          // show footer on all pre-login screens (sign-in, forgot, register steps) as long as forms are visible
          style={[styles.footer, { opacity: (!suppressUIDuringWelcome && showForm) ? 1 : 0 }]}
          pointerEvents="none"
        >
          <View style={styles.footerRow}>
            <Text style={styles.footerSideText}>An</Text>
            <Image source={require('./assets/educativo.png')} style={styles.companyLogo} resizeMode="contain" />
            <Text style={styles.footerSideText}>Initiative</Text>
          </View>
          <Text style={styles.versionText}>Version - 1.0</Text>
        </Animated.View>

        {/* Form Container */}
        {!suppressUIDuringWelcome && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: isRegisterMode ? 'flex-start' : 'center',
            alignItems: 'center',
            paddingTop: isRegisterMode ? 140 : 0,
            opacity: formFadeAnim,
            zIndex: 1,
            transform: [{ translateY: (keyboardHeight && (isSignInMode || isForgotEmailMode || isRegisterMode)) ? -keyboardHeight / 8 : 0 }],
          }}
          pointerEvents={showForm ? 'auto' : 'none'}
        >
          <View style={{ width: '100%', alignItems: 'center' }}>
            {/* SIGN IN MODE */}
            {isSignInMode ? (
              <Animated.View style={{ width: '100%', alignItems: 'center', opacity: loginFormOpacity }}>
                <View style={styles.inputContainerSmall}>
                  <TextInput
                    style={styles.inputSmall}
                    placeholder="Login ID"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus={true}
                    selectionColor="#003B73"
                    caretColor="#003B73"
                  />
                </View>

                <View style={styles.inputContainerSmall}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={[styles.inputSmall, { flex: 1, color: '#000' }]}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      selectionColor="#003B73"
                      caretColor="#003B73"
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                      {showPassword ? (
                        <Image source={require('./assets/eye-open.png')} style={{ width: 30, height: 30, marginRight: 4 }} />
                      ) : (
                        <Image source={require('./assets/eye-closed.png')} style={{ width: 24, height: 24, marginRight: 4 }} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.smallLoginButton} onPress={handleLogin}>
                  <Text style={styles.smallLoginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleBackTransition} style={styles.backButton}>
                  <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : isRegisterMode ? (
              <>
                {/* REGISTER MODE - Contact Number and Email */}
                <Animated.View style={{ width: '100%', alignItems: 'center', opacity: registerFormOpacity }}>
                  {registerStep === 1 && (
                    <>
                      <View style={styles.inputContainerSmall}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.countryCode}>+91</Text>
                          <TextInput
                            ref={contactInputRef}
                            style={[styles.inputSmall, { flex: 1 }]}
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChangeText={handleContactNumberChange}
                            keyboardType="phone-pad"
                            maxLength={10}
                            autoFocus={true}
                            selectTextOnFocus={true}
                          />
                        </View>
                      </View>

                      <View style={{ width: 260, alignItems: 'flex-end', marginBottom: 8 }}>
                        {isPhoneVerified ? (
                          <Text style={[styles.signInText, { color: 'green' }]}>NUMBER VERIFIED</Text>
                        ) : otpSent && otpTimer > 0 ? (
                          <Text style={[styles.signInText, { color: 'green' }]}>OTP SENT ({Math.floor(otpTimer/60).toString()}:{(otpTimer%60).toString().padStart(2,'0')})</Text>
                        ) : (
                          <TouchableOpacity onPress={() => { setOtpModalFor('phone'); handleSendOTP(); }} disabled={otpLoading || (otpSent && otpTimer > 0)}>
                            <Text style={[styles.signInText, (otpLoading || (otpSent && otpTimer > 0)) && { color: '#aaa' }]}>
                              {otpSent && otpTimer === 0 ? 'RESEND OTP' : 'SEND OTP'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.inputContainerSmall}>
                        <TextInput
                          ref={emailInputRef}
                          style={styles.inputSmall}
                          placeholder="Email Address"
                          value={registerEmail}
                          onChangeText={setRegisterEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          selectTextOnFocus={true}
                        />
                      </View>

                      <View style={{ width: 260, alignItems: 'flex-end', marginBottom: 8 }}>
                        {isEmailVerified ? (
                          <Text style={[styles.signInText, { color: 'green' }]}>EMAIL VERIFIED</Text>
                        ) : otpSent && otpTimer > 0 ? (
                          <Text style={[styles.signInText, { color: 'green' }]}>OTP SENT ({Math.floor(otpTimer/60).toString()}:{(otpTimer%60).toString().padStart(2,'0')})</Text>
                        ) : (
                          <TouchableOpacity onPress={() => { setOtpModalFor('email'); handleSendOTP(); }} disabled={otpLoading || (otpSent && otpTimer > 0)}>
                            <Text style={[styles.signInText, (otpLoading || (otpSent && otpTimer > 0)) && { color: '#aaa' }]}>
                              {otpSent && otpTimer === 0 ? 'RESEND OTP' : 'SEND OTP'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}

                  {registerStep === 1 ? (
                    <>
                      <TouchableOpacity
                        style={[styles.registerButton, { marginTop: 6, opacity: (isPhoneVerified || isEmailVerified) ? 1 : 0.6 }]}
                        onPress={handleConfirm}
                        disabled={!(isPhoneVerified || isEmailVerified)}
                      >
                        <Text style={styles.registerButtonText}>CONFIRM</Text>
                      </TouchableOpacity>

                      <Text style={styles.termsText}>
                        By clicking continue you agree to the{' '}
                        <Text style={styles.hyperlink} onPress={handleTermsPress}>Terms of Use</Text>{' '}&{' '}
                        <Text style={styles.hyperlink} onPress={handlePrivacyPress}>Privacy Policy</Text>
                      </Text>

                      <TouchableOpacity onPress={handleRegisterBackTransition} style={styles.backButton}>
                        <Text style={styles.backText}>BACK</Text>
                      </TouchableOpacity>
                    </>
                    ) : (
                    <>
                      {/* Back label for step 2: moved below REGISTER button to avoid overlaying fields */}
                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>First Name:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>Last Name:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>Latest Qualification:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="Latest Qualification" value={latestQualification} onChangeText={setLatestQualification} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>City:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="City" value={city} onChangeText={setCity} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>State:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="State" value={state} onChangeText={setState} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>Pincode:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="numeric" />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>College / University:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="College / University" value={college} onChangeText={setCollege} />
                        </View>
                      </View>

                      <View style={styles.formRow}>
                        <Text style={styles.leftFieldLabel}>Organization:</Text>
                        <View style={styles.rightFieldContainer}>
                          <TextInput style={styles.inputSmall} placeholder="Organization" value={organization} onChangeText={setOrganization} />
                        </View>
                      </View>

                      <TouchableOpacity style={[styles.registerButton, { marginTop: 6 }]} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>REGISTER</Text>
                      </TouchableOpacity>

                      {/* Back button below the Register button so it doesn't overlap labels */}
                      <TouchableOpacity onPress={handleRegisterBackTransition} style={styles.backButton}>
                        <Text style={styles.backText}>BACK</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Animated.View>

{showOtpModal && (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
    <View style={{ width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 12 }}>Enter 6-digit OTP</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginBottom: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
<View 
  key={`otp-${i.toString()}`} 
  style={{ 
    width: 40, 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}
>
  <Text style={{ fontSize: 24 }}>  {/* ← Wrap in Text */}
    {(registrationOtp[i] || '').toString()}
  </Text>
</View>
        ))}
      </View>
      <TextInput
        value={registrationOtp}
        onChangeText={(t) => setRegistrationOtp(t.replace(/[^0-9]/g, '').slice(0,6))}
        keyboardType="number-pad"
        maxLength={6}
        style={{ width: '100%', height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 8, marginBottom: 12 }}
        autoFocus={true}
      />
      <TouchableOpacity onPress={handleVerifyOtp} style={{ width: '100%', backgroundColor: '#0056b3', paddingVertical: 12, borderRadius: 6, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>CONFIRM</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowOtpModal(false)} style={{ marginTop: 8 }}>
        <Text style={{ color: '#666' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
              </>
            ) : isForgotEmailMode ? (
              <Animated.View style={{ width: '100%', alignItems: 'center', opacity: loginFormOpacity }}>
                <Text style={{ width: 260, color: '#666', marginBottom: 6 }}>Please enter your registered email address:</Text>
                <View style={styles.inputContainerSmall}>
                  <TextInput style={styles.inputSmall} placeholder="Registered Email" keyboardType="email-address" autoCapitalize="none" autoFocus={true} />
                </View>
                <View style={{ width: 260, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity onPress={handleForgotEmailBack}><Text style={styles.signInText}>BACK</Text></TouchableOpacity>
                  {otpSent && otpTimer > 0 ? (
                    <Text style={[styles.signInText, { color: 'green' }]}>OTP SENT ({Math.floor(otpTimer/60).toString()}:{(otpTimer%60).toString().padStart(2,'0')})</Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOTP} disabled={otpLoading || (otpSent && otpTimer > 0)}>
                      <Text style={[styles.signInText, (otpLoading || (otpSent && otpTimer > 0)) && { color: '#aaa' }]}>{otpSent && otpTimer === 0 ? 'RESEND OTP' : 'SEND OTP'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ) : (
              /* MAIN CONTENT MODE */
              <Animated.View style={{ width: '100%', alignItems: 'center', opacity: mainContentOpacity }}>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegisterTransition}><Text style={styles.registerButtonText}>REGISTER</Text></TouchableOpacity>
                <View style={styles.labelsCol}>
                  <View style={styles.labelsRow}>
                    <Text style={styles.leftLabel}>ALREADY REGISTERED ?</Text>
                    <Text style={styles.rightLabel}>FORGOT PASSWORD ?</Text>  {/* removed numberOfLines={1} */}
                  </View>
                  <View style={styles.signInRow}>
                    <TouchableOpacity onPress={handleSignInTransition} style={styles.signInButton}>
                      <Text allowFontScaling={false} style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotEmailTransition} style={styles.signInButton}>
                      <Text allowFontScaling={false} style={styles.signInText}>Click Here</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
          {keyboardHeight ? 
  <View style={{height: keyboardHeight / 3}} /> : 
  null}
                </Animated.View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  logoSmall: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  companyLogo: {
    width: 160,
    height: 48,
    marginTop: 2,
    marginBottom: 2,
  },
  footerTopText: {
    fontSize: 18,
    color: '#003B73',
    fontWeight: '700',
    marginBottom: 0,
  },
  footerMiddleText: {
    // match the top text ('An') style as requested
    fontSize: 18,
    color: '#003B73',
    fontWeight: '700',
    marginTop: 0,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 46,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSideText: {
    fontSize: 18,
    color: '#003B73',
    fontWeight: '700',
    marginHorizontal: 8,
  },
  labelsCol: {
    width: 260,
    marginTop: 8,
  },
  formRow: {
    // wider row and shifted slightly left for neater alignment
    width: 360,
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  leftFieldLabel: {
    color: '#666',
    flexShrink: 1,       // match the forgot-password style
    textAlign: 'left',
    fontSize: 12, // reduced by 2 notches
  },
  rightFieldContainer: {
    width: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    minHeight: 44,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
  },
  signInButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signInText: {
    color: '#0056b3',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 14,
    marginLeft: -6,
  },
  registerButton: {
    width: 260,
    backgroundColor: '#003B73',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  smallLoginButton: {
    width: 100,
    backgroundColor: '#003B73',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    elevation: 2,
  },
  smallLoginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 260,
    marginTop: 2,
  },
  leftLabel: {
    color: '#666',
    flexShrink: 1,       // match the forgot-password style
    textAlign: 'left',
    fontSize: 12, // reduced by 2 notches
    marginLeft: 6,
  },
  rightLabel: {
    color: '#666',
    flexShrink: 1,        // allow wrapping if needed
    textAlign: 'right',
    fontSize: 12, // reduced by 2 notches
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  backText: {
    color: '#003B73',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainerSmall: {
    width: 260,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputSmall: {
    fontSize: 16,
    paddingVertical: 10,
    // Ensure the TextInput is properly clickable
    minHeight: 40,
  },
  welcomeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 9999,
  },
  welcomeBox: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeHeader: {
    // 25% smaller than name
    fontSize: 32,
    color: '#003B73',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  welcomeBlue: {
    // reduced size: show name smaller so it doesn't dominate the welcome
    fontSize: 44,
    color: '#003B73',
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    width: 260,
    lineHeight: 18,
  },
  hyperlink: {
    color: '#003B73',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default Login;
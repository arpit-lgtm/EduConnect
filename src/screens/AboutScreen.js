import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const APP_BLUE = '#003B73';

const AboutScreen = () => {
  const handleApplyNow = () => {
    Linking.openURL('https://www.educativo.in/apply_educativo.html');
  };

  const handleSocialMedia = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* About Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.paragraph}>
            We are committed to delivering innovative, flexible, and personalized learning 
            experiences that foster personal growth, career advancement, and a lifelong love 
            for learning.
          </Text>
          <Text style={styles.paragraph}>
            At Educativo Education, we're not just an online higher education company; we're 
            your gateway to academic excellence in the digital era. As the world evolves, 
            so does the way we learn and grow. Our mission is to empower individuals like you 
            to reach new heights in your educational journey, regardless of where you are 
            or where you want to go.
          </Text>
          <Text style={styles.paragraph}>
            Founded in 2020 by a team of education experts and technology innovators, Educativo 
            has rapidly grown to become one of India's leading online education platforms. 
            We partner with top universities both nationally and internationally to bring 
            quality education directly to students, regardless of geographical constraints.
          </Text>
        </View>
        
        {/* Our Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.paragraph}>
            Educativo began with a simple yet powerful vision: to democratize access to quality 
            higher education. What started as a small initiative to connect students with online 
            learning resources has evolved into a comprehensive platform serving thousands of 
            students across India and beyond.
          </Text>
          <Text style={styles.paragraph}>
            Through dedication to academic excellence and student success, we've built strong 
            partnerships with prestigious universities, developed innovative learning solutions, 
            and created a supportive community for our students to thrive.
          </Text>
        </View>
        
        {/* How We Work Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Work</Text>
          <View style={styles.workItem}>
            <Text style={styles.workTitle}>Personalized Learning Paths</Text>
            <Text style={styles.workText}>
              We create customized learning journeys tailored to individual goals, learning 
              styles, and career aspirations, ensuring that every student receives an education 
              that meets their unique needs.
            </Text>
          </View>
          <View style={styles.workItem}>
            <Text style={styles.workTitle}>Industry-Aligned Curriculum</Text>
            <Text style={styles.workText}>
              Our courses are designed in collaboration with industry experts to ensure that 
              students acquire relevant skills and knowledge demanded by today's employers.
            </Text>
          </View>
          <View style={styles.workItem}>
            <Text style={styles.workTitle}>Flexible Learning Model</Text>
            <Text style={styles.workText}>
              Our digital-first approach allows students to learn at their own pace, balancing 
              education with work and personal commitments without sacrificing quality.
            </Text>
          </View>
          <View style={styles.workItem}>
            <Text style={styles.workTitle}>Comprehensive Support System</Text>
            <Text style={styles.workText}>
              From enrollment to graduation and beyond, our dedicated team provides academic 
              guidance, technical support, and career counseling to ensure student success.
            </Text>
          </View>
        </View>
        
        {/* Our Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Excellence</Text>
            <Text style={styles.valueText}>
              We strive for excellence in everything we do, from course development to student 
              support, maintaining the highest standards of quality in educational delivery.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueText}>
              We embrace innovation and technology to enhance the learning experience, constantly 
              exploring new methods to make education more engaging and effective.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Inclusivity</Text>
            <Text style={styles.valueText}>
              We believe in education for all, breaking down barriers of geography, economics, 
              and background to create inclusive learning opportunities.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Integrity</Text>
            <Text style={styles.valueText}>
              We operate with transparency, honesty, and ethical practices, building trust 
              with our students, partners, and the broader educational community.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Student-Centricity</Text>
            <Text style={styles.valueText}>
              Our students are at the heart of everything we do. Their success drives our 
              decisions, innovations, and continuous improvement efforts.
            </Text>
          </View>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <View style={styles.visionItem}>
            <Text style={styles.visionTitle}>Global Excellence</Text>
            <Text style={styles.visionText}>
              To be a globally recognized institution that stands as a symbol of educational 
              excellence, innovation, and impact.
            </Text>
          </View>
          <View style={styles.visionItem}>
            <Text style={styles.visionTitle}>Digital Transformation</Text>
            <Text style={styles.visionText}>
              To lead in the digital transformation of education, utilizing cutting-edge 
              technology to enhance and personalize the learning experience.
            </Text>
          </View>
          <View style={styles.visionItem}>
            <Text style={styles.visionTitle}>Accessible Education</Text>
            <Text style={styles.visionText}>
              To make high-quality higher education accessible to learners from all walks of 
              life, transcending geographical, social, and economic boundaries.
            </Text>
          </View>
          <View style={styles.visionItem}>
            <Text style={styles.visionTitle}>Career Advancement</Text>
            <Text style={styles.visionText}>
              To be the trusted partner in our students' career advancement, equipping them 
              with skills and qualifications that open doors to new opportunities.
            </Text>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission</Text>
          <Text style={styles.missionText}>
            EMPOWERING FUTURES, ELEVATING SUCCESS - YOUR ACADEMIC JOURNEY, OUR COMMITMENT AT EDUCATIVO EDUCATION.
          </Text>
          <Text style={styles.paragraph}>
            Our mission is to transform lives through accessible, quality education that prepares 
            students for professional success and personal growth. We aim to create a global 
            community of lifelong learners equipped to meet the challenges of an evolving world.
          </Text>
        </View>
        
        {/* What Sets Us Apart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Sets Us Apart</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Industry-Expert Faculty</Text>
            <Text style={styles.featureText}>
              Learn from professors who are leaders in their fields, bringing real-world 
              experience and cutting-edge knowledge to the virtual classroom.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Interactive Learning Experience</Text>
            <Text style={styles.featureText}>
              Our platform facilitates engaging, collaborative learning through live sessions, 
              discussion forums, case studies, and project-based assignments.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Career Advancement Services</Text>
            <Text style={styles.featureText}>
              From resume building to interview preparation and networking opportunities, 
              we provide comprehensive support for career growth.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Global Recognition</Text>
            <Text style={styles.featureText}>
              Our partnerships with esteemed universities ensure that your degree or 
              certification is recognized and respected worldwide.
            </Text>
          </View>
        </View>
        
        {/* University Partners */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our University Partners</Text>
          <View style={styles.partnersList}>
            <Text style={styles.partnerItem}>- Amity University Online</Text>
            <Text style={styles.partnerItem}>- DY Patil University (Navi Mumbai)</Text>
            <Text style={styles.partnerItem}>- MIT University of Management</Text>
            <Text style={styles.partnerItem}>- Online Manipal University</Text>
            <Text style={styles.partnerItem}>- Liverpool Business School</Text>
            <Text style={styles.partnerItem}>- Golden Gate University</Text>
            <Text style={styles.partnerItem}>- O.P. Jindal Global University</Text>
            <Text style={styles.partnerItem}>- Deakin (Global) Business School</Text>
          </View>
        </View>

        {/* Footer - Empty */}
        <View style={styles.footer}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  mainBanner: {
    backgroundColor: '#e3ecfb',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: APP_BLUE,
    textAlign: 'center',
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: APP_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: APP_BLUE,
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  visionItem: {
    marginBottom: 16,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  visionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
  },
  missionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: APP_BLUE,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: 16,
  },
  partnersList: {
    marginTop: 8,
  },
  partnerItem: {
    fontSize: 16,
    lineHeight: 32,
    color: '#444',
    textAlign: 'center',
  },
  workItem: {
    marginBottom: 16,
  },
  workTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  workText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
  },
  valueItem: {
    marginBottom: 16,
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  valueText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
  },
  teamItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f8ff',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: APP_BLUE,
  },
  teamMemberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teamMemberTitle: {
    fontSize: 16,
    fontStyle: 'italic',
    color: APP_BLUE,
    marginBottom: 8,
  },
  teamMemberBio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  testimonialItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f8ff',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#5b92e5',
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  awardItem: {
    marginBottom: 14,
  },
  awardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  awardText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  socialButton: {
    backgroundColor: '#e3ecfb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  socialButtonText: {
    color: APP_BLUE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: APP_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginBottom: 16,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  copyright: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});

export default AboutScreen;

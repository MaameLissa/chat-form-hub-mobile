import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MetaAIScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meta AI (Demo)</Text>
      </View>
      <View style={styles.body}>
        <Image source={require('../assets/meta-ai.jpg')} style={styles.hero} />
        <Text style={styles.title}>Coming soon</Text>
        <Text style={styles.subtitle}>This is a placeholder screen for the Meta AI feature.</Text>
        <TouchableOpacity style={styles.cta} activeOpacity={0.8}>
          <Ionicons name="sparkles-outline" size={18} color="#fff" />
          <Text style={styles.ctaText}>Try a sample prompt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  hero: { width: 240, height: 240, borderRadius: 16, marginTop: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' },
  cta: { marginTop: 24, backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default MetaAIScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from "react-native";

const METRICS = [
  { label: "Total Students", value: "12,840", trend: "+4.3%" },
  { label: "Active Teachers", value: "624", trend: "+1.2%" },
  { label: "Attendance Today", value: "92.6%", trend: "+0.8%" },
  { label: "Pending Fees", value: "$84,200", trend: "-3.1%" },
];

const MODULES = [
  "Admissions",
  "Students",
  "Attendance",
  "Fees",
  "Academics",
  "Exams",
  "Library",
  "Transport",
];

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1200;
  const isTablet = width >= 768;
  const isMobile = width < 640;

  const metricColumns = isDesktop ? 4 : isTablet ? 2 : 1;

  return (
    <ScrollView style={styles.page} contentContainerStyle={[styles.content, { paddingLeft: isDesktop ? 260 : 16 }]}>
      <Text style={styles.heading}>Education ERP Dashboard</Text>
      <Text style={styles.subheading}>
        Multi-branch overview for schools, colleges, coaching, and universities.
      </Text>

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        {METRICS.map((metric) => (
          <View
            key={metric.label}
            style={[styles.card, { width: `${100 / metricColumns - 2}%` }]}
          >
            <Text style={styles.cardLabel}>{metric.label}</Text>
            <Text style={styles.cardValue}>{metric.value}</Text>
            <Text style={styles.cardTrend}>{metric.trend} this week</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Core Modules</Text>
      <View style={styles.moduleGrid}>
        {MODULES.map((moduleName) => (
          <Pressable key={moduleName} style={styles.modulePill}>
            <Text style={styles.moduleText}>{moduleName}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.roadmapCard}>
        <Text style={styles.roadmapTitle}>Phase 0 In Progress</Text>
        <Text style={styles.roadmapText}>• Tenant + branch setup</Text>
        <Text style={styles.roadmapText}>• Role-based dashboards</Text>
        <Text style={styles.roadmapText}>• Supabase auth + RLS integration</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 16, gap: 14, maxWidth: 1400 },
  heading: { fontSize: 28, fontWeight: "700", color: "#13213c" },
  subheading: { color: "#5c6b89", fontSize: 14, marginBottom: 6 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  gridMobile: { justifyContent: "center" },
  card: {
    minWidth: 220,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f5",
  },
  cardLabel: { color: "#6d7891", fontSize: 12 },
  cardValue: { fontSize: 24, fontWeight: "700", color: "#13213c", marginVertical: 6 },
  cardTrend: { color: "#1f9d63", fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#13213c", marginTop: 8 },
  moduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  modulePill: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dbe3f2",
  },
  moduleText: { color: "#31405f", fontWeight: "600" },
  roadmapCard: {
    backgroundColor: "#13213c",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  roadmapTitle: { color: "#ffffff", fontSize: 18, fontWeight: "700", marginBottom: 6 },
  roadmapText: { color: "#dfe7ff", marginBottom: 4 },
});

export default HomeScreen;



import React from "react";
import { ScrollView, Text, View, StyleSheet, Platform, useWindowDimensions } from "react-native";

const modules = [
  "Super Admin & Multi-Branch",
  "Admission & Enquiry CRM",
  "Student Management",
  "Attendance",
  "Fees & Accounts",
  "Academics",
  "Timetable",
  "Exam & Result",
  "LMS / Online Learning",
  "HR & Payroll",
  "Reports & Analytics",
  "Security & Audit",
];

const ModulesScreen = () => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && width >= 1024;
  return (
    <ScrollView style={styles.page} contentContainerStyle={[styles.container, { paddingLeft: isWebDesktop ? 260 : 16 }]}>
      <Text style={styles.title}>Module Build Tracker</Text>
      <Text style={styles.subtitle}>Initial scaffold to start building your full premium ERP.</Text>
      {modules.map((moduleName, index) => (
        <View key={moduleName} style={styles.item}>
          <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
          <Text style={styles.name}>{moduleName}</Text>
          <Text style={styles.status}>{index < 2 ? "In Progress" : "Planned"}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#13213c" },
  subtitle: { color: "#5c6b89", marginBottom: 8 },
  item: {
    backgroundColor: "#fff",
    borderColor: "#dbe3f2",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  index: { color: "#6d7891", width: 28 },
  name: { flex: 1, color: "#13213c", fontWeight: "600" },
  status: { color: "#a06a00", fontWeight: "700" },
});

export default ModulesScreen;

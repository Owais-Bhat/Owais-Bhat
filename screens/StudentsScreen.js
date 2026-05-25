import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TextInput, Pressable, Platform, useWindowDimensions } from "react-native";
import { fetchStudents } from "../services/studentsService";

const StudentsScreen = () => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && width >= 1024;
  const [students, setStudents] = useState(() => []);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [attendance, setAttendance] = useState("");

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, []);

  const avgAttendance = useMemo(() => {
    if (!students.length) return 0;
    const total = students.reduce((sum, student) => sum + Number(student.attendance), 0);
    return Math.round(total / students.length);
  }, [students]);

  const addStudent = () => {
    if (!name.trim() || !className.trim() || !attendance.trim()) return;
    const numericAttendance = Number(attendance);
    if (Number.isNaN(numericAttendance)) return;

    const newStudent = {
      id: `S-${2200 + students.length + 1}`,
      name: name.trim(),
      className: className.trim(),
      attendance: numericAttendance,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setName("");
    setClassName("");
    setAttendance("");
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={[styles.container, { paddingLeft: isWebDesktop ? 260 : 16 }]}>
      <Text style={styles.title}>Student Management</Text>
      <Text style={styles.subtitle}>Profiles, class mapping, and attendance snapshot.</Text>
      <View style={styles.topCard}>
        <Text style={styles.topLabel}>Average Attendance</Text>
        <Text style={styles.topValue}>{avgAttendance}%</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Quick Add Student</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Student name" style={styles.input} />
        <TextInput value={className} onChangeText={setClassName} placeholder="Class / Batch" style={styles.input} />
        <TextInput value={attendance} onChangeText={setAttendance} placeholder="Attendance %" keyboardType="numeric" style={styles.input} />
        <Pressable style={styles.button} onPress={addStudent}><Text style={styles.buttonText}>Add Student</Text></Pressable>
      </View>

      {students.map((student) => (
        <View key={student.id} style={styles.card}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.meta}>{student.id}</Text>
          <Text style={styles.className}>{student.className}</Text>
          <Text style={styles.attendance}>Attendance: {student.attendance}%</Text>
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
  topCard: { backgroundColor: "#13213c", borderRadius: 12, padding: 12 },
  topLabel: { color: "#dfe7ff" },
  topValue: { color: "#fff", fontSize: 26, fontWeight: "700" },
  formCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#dbe3f2" },
  formTitle: { fontWeight: "700", color: "#13213c", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#dbe3f2", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  button: { backgroundColor: "#2f6df6", borderRadius: 10, padding: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#dbe3f2" },
  name: { fontWeight: "700", color: "#13213c", fontSize: 16 },
  meta: { color: "#62708f", marginTop: 2 },
  className: { color: "#31405f", marginTop: 6 },
  attendance: { color: "#1f9d63", marginTop: 4, fontWeight: "600" },
});

export default StudentsScreen;

import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TextInput, Pressable, Platform, useWindowDimensions } from "react-native";
import { fetchLeads } from "../services/admissionsService";

const AdmissionsScreen = () => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && width >= 1024;
  const [leads, setLeads] = useState(() => []);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [stage, setStage] = useState("");

  useEffect(() => {
    fetchLeads().then(setLeads);
  }, []);

  const counters = useMemo(() => {
    const total = leads.length;
    const enquiry = leads.filter((item) => item.stage === "Enquiry").length;
    const demo = leads.filter((item) => item.stage === "Demo Booked").length;
    return { total, enquiry, demo };
  }, [leads]);

  const addLead = () => {
    if (!name.trim() || !source.trim() || !stage.trim()) return;
    const newLead = {
      id: `L-${1000 + leads.length + 1}`,
      name: name.trim(),
      source: source.trim(),
      stage: stage.trim(),
      followUp: new Date().toISOString().slice(0, 10),
    };
    setLeads((prev) => [newLead, ...prev]);
    setName("");
    setSource("");
    setStage("");
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={[styles.container, { paddingLeft: isWebDesktop ? 260 : 16 }]}>
      <Text style={styles.title}>Admissions CRM</Text>
      <Text style={styles.subtitle}>Lead tracking, follow-up visibility, and instant intake.</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.summaryValue}>{counters.total}</Text><Text style={styles.summaryLabel}>Total Leads</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryValue}>{counters.enquiry}</Text><Text style={styles.summaryLabel}>Enquiry</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryValue}>{counters.demo}</Text><Text style={styles.summaryLabel}>Demo</Text></View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Quick Add Lead</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Student name" style={styles.input} />
        <TextInput value={source} onChangeText={setSource} placeholder="Source (Walk-in / Website / WhatsApp)" style={styles.input} />
        <TextInput value={stage} onChangeText={setStage} placeholder="Stage (Enquiry / Demo Booked / Docs Pending)" style={styles.input} />
        <Pressable style={styles.button} onPress={addLead}><Text style={styles.buttonText}>Add Lead</Text></Pressable>
      </View>

      {leads.map((lead) => (
        <View key={lead.id} style={styles.card}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.meta}>{lead.id} • {lead.source}</Text>
          <Text style={styles.stage}>Stage: {lead.stage}</Text>
          <Text style={styles.follow}>Follow-up: {lead.followUp}</Text>
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
  summaryRow: { flexDirection: "row", gap: 8 },
  summaryCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#dbe3f2", padding: 10 },
  summaryValue: { fontSize: 20, fontWeight: "700", color: "#13213c" },
  summaryLabel: { color: "#62708f", fontSize: 12 },
  formCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#dbe3f2" },
  formTitle: { fontWeight: "700", color: "#13213c", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#dbe3f2", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  button: { backgroundColor: "#2f6df6", borderRadius: 10, padding: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#dbe3f2" },
  name: { fontWeight: "700", color: "#13213c", fontSize: 16 },
  meta: { color: "#62708f", marginTop: 2 },
  stage: { color: "#31405f", marginTop: 6 },
  follow: { color: "#1f9d63", marginTop: 4, fontWeight: "600" },
});

export default AdmissionsScreen;

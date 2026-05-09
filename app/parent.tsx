import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ParentGate } from '@/components/ParentGate';
import { useSettings } from '@/contexts/settings-context';
import { useProgress } from '@/contexts/progress-context';

export default function ParentScreen() {
  const [ok, setOk] = useState(false);
  const { kidMode, soundEnabled, updateSettings } = useSettings();
  const { getTodayProgress, resetProgress } = useProgress();

  if (!ok) return <ParentGate onPassed={() => setOk(true)} />;
  const today = getTodayProgress();
  return <View style={styles.c}><Text style={styles.h}>Parent Dashboard</Text>
    <Text>Mode</Text>
    <View style={styles.row}><TouchableOpacity style={styles.b} onPress={() => updateSettings({ kidMode: 'junior' })}><Text>Junior {kidMode==='junior'?'✓':''}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.b} onPress={() => updateSettings({ kidMode: 'bigKid' })}><Text>Big Kid {kidMode==='bigKid'?'✓':''}</Text></TouchableOpacity></View>
    <TouchableOpacity style={styles.b} onPress={() => updateSettings({ soundEnabled: !soundEnabled })}><Text>Sound: {soundEnabled ? 'On' : 'Off'}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.b} onPress={resetProgress}><Text>Reset today/all progress</Text></TouchableOpacity>
    <Text>Today's completed subjects: {today.join(', ') || 'None yet'}</Text>
    <Text style={styles.trust}>No accounts. No ads. Progress is stored on this device.</Text>
  </View>;
}
const styles=StyleSheet.create({c:{flex:1,padding:20,backgroundColor:'#F6FAFF',gap:12},h:{fontSize:28,fontWeight:'700'},row:{flexDirection:'row',gap:10},b:{backgroundColor:'#fff',padding:12,borderRadius:10},trust:{marginTop:12,fontWeight:'600'}});

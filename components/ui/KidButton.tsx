import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
export function KidButton({ label, onPress, style }: { label: string; onPress: () => void; style?: ViewStyle }) {
  return <TouchableOpacity style={[styles.btn, style]} onPress={onPress}><Text style={styles.t}>{label}</Text></TouchableOpacity>;
}
const styles=StyleSheet.create({btn:{backgroundColor:'#4F9DFF',padding:16,borderRadius:16,minHeight:56,justifyContent:'center'},t:{color:'#fff',fontWeight:'700',fontSize:18,textAlign:'center'}});

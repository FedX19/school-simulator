import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function ScreenShell({ title, children }: { title: string; children: ReactNode }) {
  return <View style={s.c}><Text style={s.h}>{title}</Text>{children}</View>;
}
const s=StyleSheet.create({c:{flex:1,backgroundColor:'#FFF8EF',padding:16},h:{fontSize:30,fontWeight:'700',marginBottom:12}});

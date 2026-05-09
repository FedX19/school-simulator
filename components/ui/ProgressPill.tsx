import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function ProgressPill({ text }: { text: string }) { return <View style={s.p}><Text style={s.t}>{text}</Text></View>; }
const s=StyleSheet.create({p:{backgroundColor:'#E9F3FF',paddingHorizontal:14,paddingVertical:8,borderRadius:20,alignSelf:'flex-start'},t:{fontWeight:'700'}});

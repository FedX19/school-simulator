import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export function ParentGate({ onPassed }: { onPassed: () => void }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const expected = useMemo(() => 13, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Parent Check</Text>
      <Text style={styles.q}>What is 7 + 6?</Text>
      <TextInput value={answer} onChangeText={setAnswer} keyboardType="number-pad" style={styles.input} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.btn} onPress={() => (Number(answer) === expected ? onPassed() : setError('Try again'))}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({wrap:{padding:24},title:{fontSize:28,fontWeight:'700'},q:{fontSize:22,marginVertical:12},input:{backgroundColor:'#fff',borderRadius:12,padding:12,fontSize:20},error:{color:'red'},btn:{backgroundColor:'#333',padding:14,borderRadius:12,marginTop:12},btnText:{color:'#fff',textAlign:'center',fontWeight:'700'}});

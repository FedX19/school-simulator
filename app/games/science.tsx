import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useProgress } from '@/contexts/progress-context';
import { useSettings } from '@/contexts/settings-context';
import { speak } from '@/utils/speech';
import { KidButton } from '@/components/ui/KidButton';
import { ScreenShell } from '@/components/ui/ScreenShell';

const junior=[{q:'Which animal says woof?',a:'🐶',o:['🐶','🐱','🐮']},{q:'Which animal says meow?',a:'🐱',o:['🐸','🐱','🐷']}];
const big=[{q:'What planet is known as the Red Planet?',a:'Mars',o:['Mars','Venus','Jupiter']},{q:'What do plants need to make food?',a:'Sunlight',o:['Sunlight','Plastic','Sand']}];
export default function(){const {completeSubject}=useProgress(); const {kidMode,soundEnabled}=useSettings(); const [i,setI]=useState(0); const [score,setScore]=useState(0);
const list=useMemo(()=>kidMode==='junior'?Array.from({length:8},(_,x)=>junior[x%junior.length]):Array.from({length:8},(_,x)=>big[x%big.length]),[kidMode]);
const q=list[i]; useEffect(()=>{speak(q.q,{kidMode,soundEnabled});},[q,kidMode,soundEnabled]);
if(i>=list.length)return <ScreenShell title='Science'><Text>Score {score}/{list.length}</Text><KidButton label='Complete Science ✓' onPress={()=>completeSubject('science')} /></ScreenShell>;
return <ScreenShell title='Science'><Text>{q.q}</Text><KidButton label='🔁 Replay Audio' onPress={()=>speak(q.q,{kidMode,soundEnabled})} />{q.o.map(o=><KidButton key={o} label={o} onPress={()=>{if(o===q.a)setScore(score+1);setI(i+1);}} style={{marginTop:8}} />)}</ScreenShell>}

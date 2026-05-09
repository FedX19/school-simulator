import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { useSettings } from '@/contexts/settings-context';
import { useProgress } from '@/contexts/progress-context';
import { speak } from '@/utils/speech';
import { KidButton } from '@/components/ui/KidButton';
import { ScreenShell } from '@/components/ui/ScreenShell';
const jr='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0,8).map(l=>({q:`Find letter ${l}`,a:l,o:[l,'B','C','D']}));
const bk=[{q:'Passage: Mia planted seeds. After rain, green sprouts appeared. What helped the seeds grow?',a:'Rain',o:['Rain','Shoes','Moon']},{q:'Tom read nightly and finished a book. Why did he finish?',a:'He read every night',o:['He read every night','He slept','He lost it']}];
export default function(){const {kidMode,soundEnabled}=useSettings();const qs=useMemo(()=>kidMode==='junior'?jr:Array.from({length:5},(_,i)=>bk[i%bk.length]),[kidMode]);const [i,setI]=useState(0);const [s,setS]=useState(0);const {completeSubject}=useProgress();const q=qs[i];useEffect(()=>{if(q)speak(q.q,{kidMode,soundEnabled});},[q,kidMode,soundEnabled]);if(!q)return <ScreenShell title='Reading'><Text>Score {s}/{qs.length}</Text><KidButton label='Complete Reading ✓' onPress={()=>completeSubject('reading')} /></ScreenShell>;return <ScreenShell title='Reading'><Text>{q.q}</Text><KidButton label='🔁 Replay Audio' onPress={()=>speak(q.q,{kidMode,soundEnabled})} />{q.o.map(o=><KidButton key={o+i} label={o} onPress={()=>{if(o===q.a)setS(s+1);setI(i+1);}} style={{marginTop:8}}/>)}</ScreenShell>}

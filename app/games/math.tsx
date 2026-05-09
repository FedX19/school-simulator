import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { useProgress } from '@/contexts/progress-context';
import { useSettings } from '@/contexts/settings-context';
import { speak } from '@/utils/speech';
import { KidButton } from '@/components/ui/KidButton';
import { ScreenShell } from '@/components/ui/ScreenShell';
const junior=Array.from({length:8},(_,i)=>({q:`How many apples? ${'🍎'.repeat((i%5)+1)}`,a:String((i%5)+1),o:['1','2','3','4','5']}));
const big=[['12 + 7','19'],['20 - 8','12'],['6 × 7','42'],['33 - 19','14'],['9 × 4','36'],['45 + 18','63'],['56 - 29','27'],['8 × 9','72']].map(x=>({q:x[0],a:x[1],o:[x[1],'10','24','48']}));
export default function(){const {kidMode,soundEnabled}=useSettings();const qs=useMemo(()=>kidMode==='junior'?junior:big,[kidMode]);const [i,setI]=useState(0);const [s,setS]=useState(0);const {completeSubject}=useProgress();const q=qs[i];useEffect(()=>{if(q)speak(q.q,{kidMode,soundEnabled});},[q,kidMode,soundEnabled]);if(!q)return <ScreenShell title='Math'><Text>Score {s}/{qs.length}</Text><KidButton label='Complete Math ✓' onPress={()=>completeSubject('math')} /></ScreenShell>;return <ScreenShell title='Math'><Text>{q.q}</Text><KidButton label='🔁 Replay Audio' onPress={()=>speak(q.q,{kidMode,soundEnabled})} />{q.o.map(o=><KidButton key={o+i} label={o} onPress={()=>{if(o===q.a)setS(s+1);setI(i+1);}} style={{marginTop:8}}/>)}</ScreenShell>}

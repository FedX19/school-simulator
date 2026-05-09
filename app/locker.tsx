import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress, Subject } from '@/contexts/progress-context';
import { useSettings } from '@/contexts/settings-context';
import { KidButton } from '@/components/ui/KidButton';
import { ScreenShell } from '@/components/ui/ScreenShell';
import { ProgressPill } from '@/components/ui/ProgressPill';

const BOOKS = [
  ['reading','Reading'],['math','Math'],['science','Science'],['social-studies','Social Studies'],['feelings','Feelings'],['writing','Writing'],['art','Art'],['music','Music'],['shapes','Shapes'],['health','Health'],['pe','P.E.'],['life-skills','Life Skills'],['study-hall','Study Hall'],
] as [Subject,string][];

function pickDaily(mode:'junior'|'bigKid', seed:number){
  const priority: Subject[] = mode==='junior' ? ['reading','math','science','feelings','shapes','art','music','pe','life-skills'] : ['reading','math','science','social-studies','writing','study-hall','health','life-skills'];
  const start=seed%Math.max(priority.length-4,1); return priority.slice(start,start+5) as Subject[];
}

export default function Locker(){
 const {getTodayProgress}=useProgress(); const {kidMode}=useSettings(); const router=useRouter(); const today=getTodayProgress();
 const seed=Number(new Date().toISOString().slice(0,10).replaceAll('-',''));
 const missions=useMemo(()=>pickDaily(kidMode,seed),[kidMode,seed]);
 const complete=missions.filter(m=>today.includes(m)).length;
 return <ScreenShell title="Today’s School Quest"><ProgressPill text={`${complete} of 5 Missions Complete`} />
 <ScrollView>
  {missions.map(m=><KidButton key={m} label={`${today.includes(m)?'✅ ':''}${BOOKS.find(b=>b[0]===m)?.[1]}`} onPress={()=>router.push(`/games/${m}` as any)} style={{marginTop:10}} />)}
  {complete===5&&<Text style={styles.cele}>🎉 Mission Complete! ⭐</Text>}
  <Text style={styles.sub}>More subjects</Text>
  {BOOKS.filter(b=>!missions.includes(b[0])).map(([s,t])=><KidButton key={s} label={t} onPress={()=>router.push(`/games/${s}` as any)} style={{marginTop:8,backgroundColor:'#7FB1E8'}} />)}
  <KidButton label="Parent" onPress={()=>router.push('/parent')} style={{marginTop:16,backgroundColor:'#666',padding:10,minHeight:40}} />
 </ScrollView></ScreenShell>
}
const styles=StyleSheet.create({cele:{fontSize:28,textAlign:'center',margin:20},sub:{fontSize:18,fontWeight:'700',marginTop:16}});

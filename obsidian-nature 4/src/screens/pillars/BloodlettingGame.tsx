import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Circle, Line, Path, Polygon } from 'react-native-svg';
import {
  ROLES,
  getRole,
  scorePsyche,
  optionMeta,
  QUOTE_POOL,
  RoleDef,
  DoctorRole,
  Quote,
} from '@/data/bedchamberGame';
import { useAppStore } from '@/store/useAppStore';

/**
 * The Bedchamber — Pillar III treatment game.
 *
 * FIRST-PERSON CAMERA with SECOND-PERSON NARRATION: the view is through your own
 * eyes (the patient on the bed ahead, your hands/instruments in the foreground,
 * your mask beak framing the frame as the Plague Doctor), while the text
 * addresses "you."
 *
 * You choose a role (Doctor of Physic or Plague Doctor). That choice sets a
 * period-accurate educational curriculum and, together with the tools/actions
 * you pick while treating the patient, is scored across psychological dimensions
 * and saved for the Pillar III analysis report.
 *
 * Historical medicine only — see the disclaimer. The player is the physician;
 * nothing here is health advice.
 */
type Phase = 'role' | 'curriculum' | 'treat' | 'result';

const PX = {
  dark: '#05070B',
  stone: '#2A2018',
  gold: '#D9A741',
  ember: '#FF2A3A',
  ox: '#7A0A12',
  bone: '#E9E4D6',
  parch: '#C8C2B0',
  faint: '#5A6272',
  glass: 'rgba(210,235,240,0.06)',
  stroke: 'rgba(180,220,230,0.22)',
};

export function BloodlettingGame() {
  const nav = useNavigation<any>();
  const setBedchamberResult = useAppStore((s) => s.setBedchamberResult);

  const [phase, setPhase] = useState<Phase>('role');
  const [roleId, setRoleId] = useState<DoctorRole | null>(null);
  const [step, setStep] = useState(0); // index into role.decisions
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [quoteChoices, setQuoteChoices] = useState<Record<string, Quote>>({});
  // A tool has been chosen; the scroll is open awaiting a resonant quote.
  const [pending, setPending] = useState<{ decisionId: string; optionId: string } | null>(null);

  const role = roleId ? getRole(roleId) : null;

  const choose = (id: DoctorRole) => {
    setRoleId(id);
    setChoices({});
    setQuoteChoices({});
    setStep(0);
    setPhase('curriculum');
  };

  // Step 1: pick the tool -> record it and open the educational scroll.
  const pickTool = (decisionId: string, optionId: string) => {
    setChoices((c) => ({ ...c, [decisionId]: optionId }));
    setPending({ decisionId, optionId });
  };

  // Step 2: pick the resonant quote -> record it, close scroll, advance.
  const pickQuote = (q: Quote) => {
    if (!pending || !role) return;
    const nextQuotes = { ...quoteChoices, [pending.decisionId]: q };
    setQuoteChoices(nextQuotes);
    setPending(null);
    if (step + 1 < role.decisions.length) {
      setStep(step + 1);
    } else {
      finish(nextQuotes);
    }
  };

  const finish = (finalQuotes: Record<string, Quote>) => {
    if (!role) return;
    const { top, profile } = scorePsyche(role, choices, finalQuotes);
    const resonantQuotes = role.decisions
      .map((d) => {
        const q = finalQuotes[d.id];
        const opt = d.options.find((o) => o.id === choices[d.id]);
        return q && opt ? { tool: opt.label, quote: q.text, play: q.play } : null;
      })
      .filter((x): x is { tool: string; quote: string; play: string } => x !== null);
    setBedchamberResult({
      role: role.id,
      roleName: role.name,
      choices: labelChoices(role, choices),
      resonantQuotes,
      top,
      profile,
      playedAt: Date.now(),
    });
    setPhase('result');
  };

  const pendingMeta = pending && role ? optionMeta(role.id, pending.decisionId, pending.optionId) : undefined;
  const pendingOption =
    pending && role
      ? role.decisions.find((d) => d.id === pending.decisionId)?.options.find((o) => o.id === pending.optionId)
      : undefined;

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => nav.goBack()}>
            <Text style={styles.leave}>‹ Leave</Text>
          </Pressable>
          <Text style={styles.title}>THE BEDCHAMBER</Text>
          <Text style={styles.count}>{role ? role.name.split(' ')[0] : '—'}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
          {phase === 'role' && <RoleSelect onChoose={choose} />}
          {phase === 'curriculum' && role && <Curriculum role={role} onBegin={() => setPhase('treat')} />}
          {phase === 'treat' && role && (
            <Treat role={role} step={step} onPick={pickTool} />
          )}
          {phase === 'result' && role && (
            <Result role={role} choices={choices} quoteChoices={quoteChoices} onDone={() => nav.goBack()} />
          )}
        </ScrollView>
      </SafeAreaView>

      {/* educational scroll — tool info + four Shakespeare lines to resonate with */}
      {pending && pendingMeta && pendingOption && (
        <ToolScroll
          toolLabel={pendingOption.label}
          info={pendingMeta.info}
          quotes={QUOTE_POOL[pendingMeta.theme]}
          onPick={pickQuote}
        />
      )}
    </View>
  );
}

function ToolScroll({
  toolLabel,
  info,
  quotes,
  onPick,
}: {
  toolLabel: string;
  info: string;
  quotes: Quote[];
  onPick: (q: Quote) => void;
}) {
  return (
    <View style={styles.scrollOverlay}>
      <View style={styles.scrollSheet}>
        <View style={styles.scrollRodTop} />
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <Text style={styles.scrollTool}>{toolLabel}</Text>
          <Text style={styles.scrollInfo}>{info}</Text>
          <Text style={styles.scrollPrompt}>Four voices from Shakespeare echo this instrument. Choose the line that resonates with you.</Text>
          {quotes.map((q, i) => (
            <Pressable key={i} style={styles.quoteRow} onPress={() => onPick(q)}>
              <Text style={styles.quoteText}>“{q.text}”</Text>
              <Text style={styles.quotePlay}>— {q.play}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.scrollRodBottom} />
      </View>
    </View>
  );
}

/* ----------------------------------------------------------------- phases */

function RoleSelect({ onChoose }: { onChoose: (id: DoctorRole) => void }) {
  return (
    <View>
      <Text style={styles.h1}>Who will you be?</Text>
      <Text style={styles.body}>
        A patient is dying beyond this door. Your calling — and the age you practise in — decides what you
        know and what you reach for.
      </Text>
      {ROLES.map((r) => (
        <Pressable key={r.id} onPress={() => onChoose(r.id)} style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <MaskIcon role={r.id} />
            <View style={{ flex: 1 }}>
              <Text style={styles.roleName}>{r.name}</Text>
              <Text style={styles.era}>{r.era}</Text>
              <Text style={styles.tagline}>{r.tagline}</Text>
            </View>
          </View>
        </Pressable>
      ))}
      <Text style={styles.disclaimer}>
        A historical recreation. Bloodletting, bubo-lancing, purging, and miasma theory are real history,
        medically discredited and dangerous. This is history — never health advice.
      </Text>
    </View>
  );
}

function Curriculum({ role, onBegin }: { role: RoleDef; onBegin: () => void }) {
  return (
    <View>
      <Text style={styles.h1}>{role.name}</Text>
      <Text style={styles.era}>{role.era}</Text>
      <Text style={[styles.body, { marginTop: 10 }]}>{role.intro}</Text>
      <Text style={styles.section}>YOUR CURRICULUM</Text>
      {role.curriculum.map((c) => (
        <View key={c.title} style={styles.card}>
          <Text style={styles.cardTitle}>{c.title}</Text>
          <Text style={styles.cardBody}>{c.body}</Text>
        </View>
      ))}
      <Pressable style={styles.primary} onPress={onBegin}>
        <Text style={styles.primaryText}>Enter the sick-chamber</Text>
      </Pressable>
    </View>
  );
}

function Treat({ role, step, onPick }: { role: RoleDef; step: number; onPick: (d: string, o: string) => void }) {
  const decision = role.decisions[step];
  return (
    <View>
      <Scene role={role.id} />
      {step === 0 && <Text style={styles.patient}>{role.patient}</Text>}
      <Text style={styles.stepTag}>
        Treatment · {step + 1} of {role.decisions.length}
      </Text>
      <Text style={styles.prompt}>{decision.prompt}</Text>
      {decision.options.map((o) => (
        <Pressable key={o.id} style={styles.option} onPress={() => onPick(decision.id, o.id)}>
          <Text style={styles.optionLabel}>{o.label}</Text>
          <Text style={styles.optionNote}>{o.note}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Result({
  role,
  choices,
  quoteChoices,
  onDone,
}: {
  role: RoleDef;
  choices: Record<string, string>;
  quoteChoices: Record<string, Quote>;
  onDone: () => void;
}) {
  const { top, profile } = scorePsyche(role, choices, quoteChoices);
  return (
    <View>
      <Text style={styles.h1}>The Chamber Falls Quiet</Text>
      <Text style={styles.body}>
        You practised as a {role.name}. The tools you reached for — and the lines that resonated — are a
        mirror.
      </Text>

      <View style={[styles.card, { borderColor: PX.gold }]}>
        <Text style={styles.section}>WHAT YOUR HAND REVEALED</Text>
        <Text style={styles.cardBody}>{profile}</Text>
        {top.length > 0 && (
          <Text style={[styles.cardBody, { color: PX.gold, marginTop: 8 }]}>
            Dominant tendencies: {top.join(' · ')}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>YOUR CHOICES</Text>
        {role.decisions.map((d) => {
          const opt = d.options.find((o) => o.id === choices[d.id]);
          const q = quoteChoices[d.id];
          return (
            <View key={d.id} style={{ marginBottom: 8 }}>
              <Text style={styles.cardBody}>• {opt?.label ?? '—'}</Text>
              {q && (
                <Text style={[styles.cardBody, { color: PX.gold, fontStyle: 'italic', marginLeft: 10 }]}>
                  “{q.text}” — {q.play}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.disclaimer}>
        Saved to your Pillar III record. Your role and the tools you chose are folded into your analysis
        report as a read on your psyche and behaviour under pressure.
      </Text>

      <Pressable style={styles.primary} onPress={onDone}>
        <Text style={styles.primaryText}>Return to the pillar</Text>
      </Pressable>
    </View>
  );
}

/* ----------------------------------------------------------------- pixel art */

/**
 * First-person view of the sick-chamber: a perspective room with the patient on
 * the bed ahead of you, and your own hands / instruments in the foreground. As
 * the Plague Doctor, the beak of your mask frames the bottom of the view.
 */
function Scene({ role }: { role: DoctorRole }) {
  return (
    <View style={styles.sceneWrap}>
      <Svg width="100%" height={190} viewBox="0 0 200 150">
        {/* room in one-point perspective (vanishing toward the back wall) */}
        <Polygon points="0,0 60,22 140,22 200,0" fill="#0F0B08" />
        <Polygon points="0,0 60,22 60,92 0,150" fill="#17110C" />
        <Polygon points="200,0 140,22 140,92 200,150" fill="#17110C" />
        <Rect x="60" y="22" width="80" height="70" fill="#140F0C" />
        <Polygon points="60,92 140,92 200,150 0,150" fill="#2A2018" />
        {/* floorboard perspective lines */}
        <Line x1="60" y1="92" x2="0" y2="150" stroke="#241A14" strokeWidth="1" />
        <Line x1="140" y1="92" x2="200" y2="150" stroke="#241A14" strokeWidth="1" />
        <Line x1="86" y1="92" x2="66" y2="150" stroke="#241A14" strokeWidth="1" />
        <Line x1="114" y1="92" x2="134" y2="150" stroke="#241A14" strokeWidth="1" />

        {/* window on the back wall, night + moon */}
        <Rect x="78" y="34" width="26" height="30" fill="#0B0F17" stroke="#241A14" strokeWidth="2" />
        <Circle cx="97" cy="45" r="4" fill="#D9C9A0" />
        <Line x1="91" y1="34" x2="91" y2="64" stroke="#241A14" strokeWidth="1" />
        {/* candle sconce on the right wall */}
        <Rect x="150" y="52" width="4" height="12" fill="#D9A741" />
        <Circle cx="152" cy="50" r="3" fill="#FFB74D" />

        {/* bed + patient ahead, widening toward you */}
        <Polygon points="72,74 128,74 150,112 50,112" fill="#3A2A1B" stroke="#241A14" strokeWidth="2" />
        <Rect x="80" y="69" width="20" height="9" fill="#C8C2B0" />
        <Circle cx="90" cy="70" r="5" fill="#C8B79A" />
        <Polygon points="88,86 128,86 146,110 70,110" fill="#7A0A12" opacity={0.5} />

        {/* ---- first-person foreground ---- */}
        {role === 'physic' ? (
          <>
            {/* illuminated Bible resting on the bed, gilt title on the cover */}
            <Polygon points="96,95 122,93 124,103 98,105" fill="#5A2A12" stroke="#3A1A08" strokeWidth="1" />
            <Polygon points="122,93 124,94 126,104 124,103" fill="#E9E4D6" />
            <Polygon points="101,97 117,96 118,100 102,101" fill="#D9A741" />
            <Line x1="109" y1="96.8" x2="109" y2="100.2" stroke="#5A2A12" strokeWidth="0.8" />
            <Line x1="107.4" y1="98.4" x2="110.6" y2="98.4" stroke="#5A2A12" strokeWidth="0.8" />
            <Circle cx="98.5" cy="96.2" r="1" fill="#D9A741" />
            <Circle cx="121" cy="94.2" r="1" fill="#D9A741" />
            {/* your forearms entering the frame */}
            <Polygon points="0,150 46,150 34,122 4,128" fill="#C8B79A" />
            <Polygon points="200,150 154,150 166,122 196,128" fill="#C8B79A" />
            {/* a matula flask held up to the light */}
            <Path d="M20 120 h14 l-2 9 a7 9 0 1 1 -10 0 Z" fill="#DCD2B0" stroke="#8B7A55" strokeWidth="1" />
            <Path d="M22 129 a5 6 0 1 0 10 0 Z" fill="#B8862B" opacity={0.85} />
          </>
        ) : (
          <>
            {/* candlelight glow on the bedside table (left of the bed) */}
            <Circle cx="33" cy="90" r="16" fill="#FFB74D" opacity={0.13} />
            {/* bedside table */}
            <Polygon points="16,100 50,100 54,109 12,109" fill="#3A2A1B" stroke="#241A14" strokeWidth="1" />
            <Line x1="19" y1="109" x2="20" y2="120" stroke="#241A14" strokeWidth="2" />
            <Line x1="47" y1="109" x2="46" y2="120" stroke="#241A14" strokeWidth="2" />
            {/* lit candle 1 */}
            <Rect x="26" y="90" width="4" height="10" fill="#E9E4D6" />
            <Path d="M28 83 q3 4 0 7 q-3 -3 0 -7 Z" fill="#FF8A3D" />
            <Circle cx="28" cy="87" r="1.1" fill="#FFE08A" />
            {/* lit candle 2 (taller) */}
            <Rect x="38" y="88" width="4" height="12" fill="#E9E4D6" />
            <Path d="M40 80 q3 4 0 7 q-3 -3 0 -7 Z" fill="#FF8A3D" />
            <Circle cx="40" cy="84" r="1.1" fill="#FFE08A" />

            {/* rosary draped on the patient's blanket */}
            {[
              [92, 89], [95, 94], [98, 98], [101, 100], [104, 98], [107, 94], [110, 89],
            ].map((p, i) => (
              <Circle key={`bead-${i}`} cx={p[0]} cy={p[1]} r={1.3} fill="#B3121E" />
            ))}
            {/* pendant cross */}
            <Line x1="101" y1="100" x2="101" y2="107" stroke="#7A0A12" strokeWidth="1.4" />
            <Line x1="98.5" y1="103" x2="103.5" y2="103" stroke="#7A0A12" strokeWidth="1.4" />

            {/* a silver dagger laid on the bed */}
            <Polygon points="110,104 129,98 130,100.5 111,106.5" fill="#D8DCE0" stroke="#8A8F98" strokeWidth="0.6" />
            <Line x1="111" y1="104.4" x2="128" y2="99" stroke="#FFFFFF" strokeWidth="0.6" opacity={0.5} />
            <Line x1="128" y1="96.5" x2="131" y2="102.5" stroke="#B8BCC4" strokeWidth="2" />
            <Polygon points="130,99 137,98 137,101 130,102" fill="#3A2A1B" stroke="#241A14" strokeWidth="0.5" />
            <Circle cx="138.5" cy="100" r="1.6" fill="#C0C4CC" stroke="#8A8F98" strokeWidth="0.4" />

            {/* the beak of your own mask, framing the lower view */}
            <Polygon points="0,150 0,112 34,150" fill="#120D0A" />
            <Polygon points="200,150 200,112 166,150" fill="#120D0A" />
            <Polygon points="90,150 100,114 110,150" fill="#1A1512" stroke="#241A14" strokeWidth="1" />
            {/* a gloved hand and cane reaching in from the right */}
            <Polygon points="200,150 150,150 164,126 198,132" fill="#1A1512" />
            <Line x1="150" y1="150" x2="126" y2="94" stroke="#3A2A1B" strokeWidth="3" />
          </>
        )}
      </Svg>
      <Text style={styles.viewTag}>First-person view — you are the {role === 'physic' ? 'Doctor of Physic' : 'Plague Doctor'}</Text>
    </View>
  );
}

function MaskIcon({ role }: { role: DoctorRole }) {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44">
      <Circle cx="22" cy="22" r="20" fill={PX.glass} stroke={PX.stroke} strokeWidth="1" />
      {role === 'physic' ? (
        // matula flask
        <Path d="M16 12 h12 l-2 10 a6 8 0 1 1 -8 0 Z" fill="none" stroke={PX.gold} strokeWidth="1.6" />
      ) : (
        // beaked mask
        <Path d="M14 16 q8 -4 14 0 q4 2 2 6 q-8 10 -18 8 q6 -4 8 -8 q-4 -3 -6 -6 Z" fill="none" stroke={PX.gold} strokeWidth="1.6" />
      )}
    </Svg>
  );
}

/* map chosen option ids -> human labels for the saved record */
function labelChoices(role: RoleDef, choices: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const d of role.decisions) {
    const o = d.options.find((x) => x.id === choices[d.id]);
    if (o) out[d.prompt] = o.label;
  }
  return out;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PX.dark },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  leave: { color: PX.parch, fontSize: 15 },
  title: { color: PX.gold, letterSpacing: 3, fontSize: 14 },
  count: { color: PX.bone, fontSize: 12 },
  h1: { color: PX.bone, fontSize: 24, marginBottom: 8 },
  body: { color: PX.parch, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  era: { color: PX.gold, fontSize: 12, letterSpacing: 1 },
  tagline: { color: PX.parch, fontSize: 13, marginTop: 4 },
  roleName: { color: PX.bone, fontSize: 18 },
  section: { color: PX.gold, fontSize: 12, letterSpacing: 2, marginTop: 6, marginBottom: 8 },
  card: { backgroundColor: PX.glass, borderWidth: 1, borderColor: PX.stroke, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTitle: { color: PX.bone, fontSize: 15, marginBottom: 4 },
  cardBody: { color: PX.parch, fontSize: 14, lineHeight: 21, marginBottom: 2 },
  sceneWrap: { borderWidth: 2, borderColor: '#241A14', marginBottom: 12, overflow: 'hidden', borderRadius: 4 },
  viewTag: { color: '#5A6272', fontSize: 10, letterSpacing: 1, textAlign: 'center', paddingVertical: 4, backgroundColor: '#0B0F17' },
  patient: { color: PX.bone, fontSize: 15, lineHeight: 22, fontStyle: 'italic', marginBottom: 8 },
  stepTag: { color: PX.faint, fontSize: 12, letterSpacing: 1, marginTop: 4 },
  prompt: { color: PX.bone, fontSize: 17, lineHeight: 24, marginTop: 4, marginBottom: 12 },
  option: { backgroundColor: PX.glass, borderWidth: 1, borderColor: PX.stroke, borderRadius: 12, padding: 14, marginBottom: 10 },
  optionLabel: { color: PX.bone, fontSize: 15, marginBottom: 4 },
  optionNote: { color: PX.faint, fontSize: 12, lineHeight: 17 },
  primary: { backgroundColor: PX.ox, borderWidth: 1, borderColor: PX.ember, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  primaryText: { color: PX.bone, fontSize: 15, letterSpacing: 1 },
  disclaimer: { color: PX.faint, fontSize: 12, lineHeight: 18, marginVertical: 12 },

  // educational parchment scroll
  scrollOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5,7,11,0.9)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  scrollSheet: { width: '100%', maxWidth: 380, maxHeight: '82%', backgroundColor: '#EFE7D2' },
  scrollRodTop: { height: 12, backgroundColor: '#5A3A1E', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  scrollRodBottom: { height: 12, backgroundColor: '#5A3A1E', borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  scrollTool: { color: '#3A2A1B', fontSize: 20, marginBottom: 8 },
  scrollInfo: { color: '#4A3A28', fontSize: 14, lineHeight: 21, marginBottom: 14 },
  scrollPrompt: { color: '#7A0A12', fontSize: 13, fontStyle: 'italic', marginBottom: 12 },
  quoteRow: { borderTopWidth: 1, borderTopColor: '#C9BC9A', paddingVertical: 12 },
  quoteText: { color: '#2A2018', fontSize: 15, lineHeight: 22 },
  quotePlay: { color: '#7A5A2E', fontSize: 12, marginTop: 4, textAlign: 'right' },
});

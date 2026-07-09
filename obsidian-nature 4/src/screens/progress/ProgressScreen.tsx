import React from 'react';
import { View } from 'react-native';
import { ScreenBackground, SectionHeader, Title, Body, Caption, GlassCard, PrimaryButton } from '@/components/ui';
import { TextField } from '@/components/Questionnaire';
import { ReportView } from '@/components/ReportView';
import { analyseLifeStageContext } from '@/analysis/lacanian';
import { openManageSubscriptions } from '@/services/iap';
import { useAuth } from '@/auth/AuthProvider';
import { useAppStore, isElderTrack } from '@/store/useAppStore';
import { enneagramName } from '@/data/enneagram';
import { FUNCTION_NAMES } from '@/data/cognition';
import { TEMPERAMENT_DESC } from '@/data/temperament';
import { PILLARS } from '@/data/pillars';
import { palette, spacing } from '@/theme/theme';

/**
 * Progress Report — a single place showing every assessment result, the intake
 * Lacanian analysis report, each per-pillar formulation grade, homework grades,
 * and (for the elder track) the life-stage integration entries.
 */
export function ProgressScreen() {
  const { signOut } = useAuth();
  const s = useAppStore();
  const elder = isElderTrack(s.profile.age);
  // Only paying, under-70 subscribers have a subscription to manage.
  const isSubscriber = s.hasFullAccess && (s.profile.age ?? 0) < 70;

  const homeworkGraded = s.pillars.flatMap((p) => p.homework).filter((h) => h.gradeReport);

  return (
    <ScreenBackground>
      <SectionHeader title="Progress Report" sigil="lack" />

      {/* Assessment results */}
      <GlassCard>
        <Title>Assessment Results</Title>
        {s.enneagram ? (
          <Body>Enneagram: Type {s.enneagram.type} — {enneagramName(s.enneagram.type)}{s.enneagram.wing ? ` (wing ${s.enneagram.wing})` : ''}</Body>
        ) : (
          <Caption>Enneagram — not yet taken</Caption>
        )}
        {s.cognition ? (
          <Body>
            Cognition: {s.cognition.type} — dominant {FUNCTION_NAMES[s.cognition.functionStack[0]]}, inferior{' '}
            {FUNCTION_NAMES[s.cognition.functionStack[3]]}
          </Body>
        ) : (
          <Caption>Jungian cognition — not yet taken</Caption>
        )}
        {s.temperament ? (
          <Body>Temperament: {s.temperament.primary} / {s.temperament.secondary} — {TEMPERAMENT_DESC[s.temperament.primary]}</Body>
        ) : (
          <Caption>Temperament — not yet taken</Caption>
        )}
      </GlassCard>

      {/* Intake report */}
      {s.intakeReport && (
        <>
          <SectionHeader title="Intake Analysis" sigil="threshold" />
          <ReportView report={s.intakeReport} />
        </>
      )}

      {/* Pillar grades */}
      <SectionHeader title="The Seven Pillars" sigil="seal" />
      {PILLARS.map((p) => {
        const prog = s.pillars.find((x) => x.id === p.id)!;
        const last = prog.reports.at(-1);
        return (
          <GlassCard key={p.id}>
            <Body>
              {roman(p.id)}. {p.name}
              {'  '}
              <Caption>
                {prog.completedAt ? `Sealed · Grade ${last?.grade?.letter ?? '—'}` : prog.startedAt ? 'In progress' : 'Not begun'}
              </Caption>
            </Body>
          </GlassCard>
        );
      })}

      {/* Homework grades */}
      {homeworkGraded.length > 0 && (
        <>
          <SectionHeader title="Homework Grades" sigil="lack" />
          {homeworkGraded.map((h) => h.gradeReport && <ReportView key={h.id} report={h.gradeReport} />)}
        </>
      )}

      {/* Elder life-stage integration */}
      {elder && <LifeStageSection />}

      {isSubscriber && (
        <>
          <SectionHeader title="Subscription" sigil="threshold" />
          <GlassCard>
            <Body>Obsidian Nature — $5.99 / month</Body>
            <Caption style={{ marginBottom: spacing.sm }}>
              View, change, or cancel your subscription in your store account settings. The App Store
              (or Google Play) owns that flow — we can{'’'}t change it on your behalf.
            </Caption>
            <PrimaryButton label="Manage Subscription" variant="aero" onPress={openManageSubscriptions} />
          </GlassCard>
        </>
      )}

      <View style={{ height: spacing.lg }} />
      <PrimaryButton label="Sign out" variant="ghost" onPress={signOut} />
    </ScreenBackground>
  );
}

/** Elder-track: integrate a younger loved one, analysed through 3 lenses. */
function LifeStageSection() {
  const s = useAppStore();
  const [f, setF] = React.useState({
    loved_one_age_range: '',
    loved_one_stage: '',
    background: '',
    updates: '',
    feelings: '',
    fears: '',
  });

  return (
    <>
      <SectionHeader title="Life-Stage Integration" sigil="archetype" />
      <GlassCard>
        <Caption style={{ marginBottom: spacing.sm }}>
          For integrating a partner, friend, or loved one in a younger stage of life. Your entries are read
          through Lacanian, Freudian, and Jungian lenses.
        </Caption>
        <Caption>THEIR AGE RANGE</Caption>
        <TextField value={f.loved_one_age_range} onChange={(t) => setF({ ...f, loved_one_age_range: t })} placeholder="e.g. 30–40" multiline={false} />
        <Caption style={{ marginTop: spacing.sm }}>THEIR STAGE OF LIFE</Caption>
        <TextField value={f.loved_one_stage} onChange={(t) => setF({ ...f, loved_one_stage: t })} placeholder="e.g. raising young children" multiline={false} />
        <Caption style={{ marginTop: spacing.sm }}>BACKGROUND</Caption>
        <TextField value={f.background} onChange={(t) => setF({ ...f, background: t })} />
        <Caption style={{ marginTop: spacing.sm }}>UPDATES</Caption>
        <TextField value={f.updates} onChange={(t) => setF({ ...f, updates: t })} />
        <Caption style={{ marginTop: spacing.sm }}>FEELINGS</Caption>
        <TextField value={f.feelings} onChange={(t) => setF({ ...f, feelings: t })} />
        <Caption style={{ marginTop: spacing.sm }}>FEARS</Caption>
        <TextField value={f.fears} onChange={(t) => setF({ ...f, fears: t })} />
        <PrimaryButton
          label="Add & analyse this context"
          variant="aero"
          onPress={() => {
            s.addLifeStageContext({
              loved_one_age_range: f.loved_one_age_range || 'unspecified',
              loved_one_stage: f.loved_one_stage || 'unspecified',
              background: f.background,
              updates: f.updates,
              feelings: f.feelings,
              fears: f.fears,
            });
            setF({ loved_one_age_range: '', loved_one_stage: '', background: '', updates: '', feelings: '', fears: '' });
          }}
        />
      </GlassCard>

      {s.profile.lifeStageContexts.map((c, i) => (
        <GlassCard key={i} glow>
          <Body>{analyseLifeStageContext(s.profile.workingWithAnalyst ? 'clinician' : 'patient', c)}</Body>
        </GlassCard>
      ))}
    </>
  );
}

function roman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}

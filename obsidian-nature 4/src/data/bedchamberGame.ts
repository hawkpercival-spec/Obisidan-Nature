/**
 * The Bedchamber — a second-person treatment game for Pillar III.
 *
 * The player chooses a role — Doctor of Physic or Plague Doctor — which sets the
 * educational curriculum (period-accurate) AND becomes a projective instrument:
 * the role, and the tools/actions chosen while treating the patient, are scored
 * across psychological dimensions and folded into the Pillar III analysis report.
 *
 * SAFETY: historical medicine only. Bloodletting, bubo-lancing, purging, and
 * miasma theory are real history and are medically discredited / dangerous. The
 * player is the physician treating an NPC patient; nothing is health advice.
 */

export type PsycheDim = 'Control' | 'Caution' | 'Empathy' | 'Detachment' | 'Ritual' | 'Boldness';
export type DoctorRole = 'physic' | 'plague';

export type ThemeId =
  | 'blood' | 'physic' | 'plague' | 'stars' | 'steel' | 'air' | 'prayer' | 'mercy' | 'discretion' | 'purge';

/** A real Shakespeare line, tagged with the psyche dimension it leans toward. */
export type Quote = { text: string; play: string; tag: PsycheDim };

export type CurriculumCard = { title: string; body: string };
export type DecisionOption = { id: string; label: string; note: string; tags: PsycheDim[] };
export type Decision = { id: string; prompt: string; options: DecisionOption[] };

export type RoleDef = {
  id: DoctorRole;
  name: string;
  era: string;
  tagline: string;
  intro: string; // second-person setup
  curriculum: CurriculumCard[];
  patient: string; // second-person patient description
  decisions: Decision[];
};

export const DIM_DESC: Record<PsycheDim, string> = {
  Control: 'a need to master the situation and impose order',
  Caution: 'a careful, risk-aware, self-protective stance',
  Empathy: 'an orientation toward the suffering of the other',
  Detachment: 'clinical distance and emotional insulation',
  Ritual: 'reliance on procedure, symbol, and prescribed form',
  Boldness: 'decisiveness and a willingness to act and risk',
};

const DOCTOR_OF_PHYSIC: RoleDef = {
  id: 'physic',
  name: 'Doctor of Physic',
  era: 'University-trained · 13th–17th century',
  tagline: 'Galenic learning, humoral balance, and the stars.',
  intro:
    'You are a Doctor of Physic, schooled in Latin on Hippocrates, Galen, and Avicenna’s Canon. You reason from the four humors: illness is imbalance, and your task is to restore it.',
  curriculum: [
    { title: 'Galenic / Humoral Theory', body: 'Health is the balance of blood, yellow bile, black bile, and phlegm. You diagnose which humor is in excess and treat by its opposite quality.' },
    { title: 'Uroscopy', body: 'You judge the body by its urine — colour, sediment, and smell held in a matula flask — a central diagnostic ritual of the learned physician.' },
    { title: 'Astrological Medicine', body: 'The “zodiac man” links body parts to the stars. Treatments and bleedings are timed to lunar and planetary hours for the crisis day.' },
    { title: 'Therapeutics & Regimen', body: 'Bloodletting, purges, dietary regimen, and compounded herbal simples — prescribed to shift the humoral balance back toward equilibrium.' },
  ],
  patient:
    'A merchant lies flushed and feverish, pulse racing, complaining of hot blood and a pounding head. The family watches from the doorway.',
  decisions: [
    {
      id: 'diagnose',
      prompt: 'You must first read the illness. How do you proceed?',
      options: [
        { id: 'urine', label: 'Examine the urine in the matula', note: 'Uroscopy — the learned physician’s signature diagnostic ritual.', tags: ['Ritual', 'Detachment'] },
        { id: 'pulse', label: 'Take the pulse and question the patient', note: 'Attending to the body and the person directly.', tags: ['Empathy', 'Caution'] },
        { id: 'stars', label: 'Cast the horoscope for the crisis day', note: 'Timing the illness by the heavens before acting.', tags: ['Ritual', 'Control'] },
      ],
    },
    {
      id: 'treat',
      prompt: 'The blood runs hot. How do you treat it?',
      options: [
        { id: 'bleed', label: 'Open a vein to let the excess blood', note: 'Phlebotomy — direct, forceful, and timed by the calendar. (Historical; discredited.)', tags: ['Boldness', 'Control'] },
        { id: 'purge', label: 'Prescribe a purge and a cooling regimen', note: 'Adjust the humors gradually through diet and evacuation.', tags: ['Caution', 'Control'] },
        { id: 'herbs', label: 'Compound a gentle herbal electuary', note: 'A measured, less invasive remedy.', tags: ['Caution', 'Empathy'] },
      ],
    },
    {
      id: 'bedside',
      prompt: 'The family looks to you. What is your bearing?',
      options: [
        { id: 'latin', label: 'Explain the imbalance in learned Latin', note: 'Authority through erudition and distance.', tags: ['Detachment', 'Control'] },
        { id: 'reassure', label: 'Reassure the patient and family gently', note: 'Tending to fear as well as fever.', tags: ['Empathy'] },
        { id: 'withdraw', label: 'Warn of the crisis and withdraw', note: 'Protecting your judgment and reputation.', tags: ['Detachment', 'Caution'] },
      ],
    },
  ],
};

const PLAGUE_DOCTOR: RoleDef = {
  id: 'plague',
  name: 'Plague Doctor',
  era: 'Black Death 1347+ · 17th-century outbreaks',
  tagline: 'Miasma, the beaked mask, and the courage of proximity.',
  intro:
    'You are a Plague Doctor, hired by a stricken city. You believe disease travels in bad air — miasma — and you enter houses others flee. Your beaked mask is packed with aromatic herbs against the stench of contagion.',
  curriculum: [
    { title: 'Miasma Theory', body: 'Disease was thought to spread through corrupted “bad air.” Sweet and pungent smells were believed to hold the miasma at bay.' },
    { title: 'The Costume', body: 'The iconic beaked mask (attributed to Charles de Lorme, 1619), stuffed with herbs, plus a waxed leather coat and a cane to examine patients at a distance.' },
    { title: 'Buboes & Interventions', body: 'Plague swellings (buboes) were lanced or cauterised to drain them — brutal, and often futile.' },
    { title: 'Prevention & Public Role', body: 'Vinegar, herbs, fumigation, quarantine, and flight. Plague doctors also recorded deaths and enforced isolation — often civic functionaries, not learned physicians.' },
  ],
  patient:
    'A young woman shivers with black swellings at the throat and groin, breath shallow, the room thick with the smell of sickness. No one else will come near.',
  decisions: [
    {
      id: 'approach',
      prompt: 'The air itself feels dangerous. How do you enter?',
      options: [
        { id: 'mask', label: 'Don the herb-packed beaked mask first', note: 'Protection and procedure before proximity.', tags: ['Caution', 'Ritual'] },
        { id: 'rush', label: 'Go straight to the patient’s side', note: 'Reaching the suffering before protecting yourself.', tags: ['Boldness', 'Empathy'] },
        { id: 'fumigate', label: 'Burn aromatic fires to clear the miasma', note: 'Purifying the air by prescribed ritual first.', tags: ['Ritual', 'Caution'] },
      ],
    },
    {
      id: 'treat',
      prompt: 'The buboes are swollen and hard. What do you do?',
      options: [
        { id: 'lance', label: 'Lance the buboes to drain them', note: 'Direct and drastic intervention. (Historical; discredited.)', tags: ['Boldness', 'Control'] },
        { id: 'poultice', label: 'Apply vinegar and herb poultices', note: 'A gentler, protective remedy.', tags: ['Caution', 'Empathy'] },
        { id: 'quarantine', label: 'Order flight and quarantine of the house', note: 'Containment over treatment.', tags: ['Detachment', 'Caution'] },
      ],
    },
    {
      id: 'bedside',
      prompt: 'She is failing. How do you bear yourself?',
      options: [
        { id: 'cane', label: 'Keep your distance and observe with the cane', note: 'Safety and clinical remove.', tags: ['Detachment', 'Control'] },
        { id: 'comfort', label: 'Comfort her closely despite the danger', note: 'Presence over self-protection.', tags: ['Empathy', 'Boldness'] },
        { id: 'record', label: 'Record the death for the city rolls', note: 'The civic duty of the plague office.', tags: ['Detachment', 'Ritual'] },
      ],
    },
  ],
};

export const ROLES: RoleDef[] = [DOCTOR_OF_PHYSIC, PLAGUE_DOCTOR];
export const getRole = (id: DoctorRole) => ROLES.find((r) => r.id === id)!;

/**
 * The educational scroll. When a tool is chosen, a scroll shows information about
 * the tool and FOUR Shakespeare lines that echo its spirit; the player picks the
 * one that resonates, and that pick feeds the analysis.
 *
 * NOTE: Shakespeare never names period medical instruments literally, so these
 * are genuine, well-known lines chosen for THEMATIC resonance (blood, physic,
 * plague, steel, prayer, mercy, fate, discretion, purge). Verify verbatim
 * wording/attribution before shipping if exactness matters to you.
 */
export const QUOTE_POOL: Record<ThemeId, Quote[]> = {
  blood: [
    { text: 'It will have blood, they say; blood will have blood.', play: 'Macbeth', tag: 'Boldness' },
    { text: 'I am in blood stepp’d in so far that returning were as tedious as go o’er.', play: 'Macbeth', tag: 'Control' },
    { text: 'Who would have thought the old man to have had so much blood in him?', play: 'Macbeth', tag: 'Detachment' },
    { text: 'Will all great Neptune’s ocean wash this blood clean from my hand?', play: 'Macbeth', tag: 'Caution' },
  ],
  physic: [
    { text: 'Throw physic to the dogs; I’ll none of it.', play: 'Macbeth', tag: 'Boldness' },
    { text: 'By medicine life may be prolong’d, yet death will seize the doctor too.', play: 'Cymbeline', tag: 'Detachment' },
    { text: 'Canst thou not minister to a mind diseased?', play: 'Macbeth', tag: 'Empathy' },
    { text: 'Our remedies oft in ourselves do lie, which we ascribe to heaven.', play: 'All’s Well That Ends Well', tag: 'Control' },
  ],
  plague: [
    { text: 'A plague o’ both your houses!', play: 'Romeo and Juliet', tag: 'Boldness' },
    { text: 'The red plague rid you for learning me your language!', play: 'The Tempest', tag: 'Detachment' },
    { text: 'They have the plague, and caught it of your eyes.', play: 'Love’s Labour’s Lost', tag: 'Empathy' },
    { text: 'Now the red pestilence strike all trades in Rome.', play: 'Coriolanus', tag: 'Control' },
  ],
  stars: [
    { text: 'The fault, dear Brutus, is not in our stars, but in ourselves.', play: 'Julius Caesar', tag: 'Control' },
    { text: 'It is the stars, the stars above us, govern our conditions.', play: 'King Lear', tag: 'Ritual' },
    { text: 'A pair of star-cross’d lovers take their life.', play: 'Romeo and Juliet', tag: 'Caution' },
    { text: 'When he shall die, take him and cut him out in little stars.', play: 'Romeo and Juliet', tag: 'Empathy' },
  ],
  steel: [
    { text: 'Is this a dagger which I see before me?', play: 'Macbeth', tag: 'Boldness' },
    { text: 'I will speak daggers to her, but use none.', play: 'Hamlet', tag: 'Caution' },
    { text: 'There’s daggers in men’s smiles.', play: 'Macbeth', tag: 'Detachment' },
    { text: 'Give me the daggers.', play: 'Macbeth', tag: 'Control' },
  ],
  air: [
    { text: 'Something is rotten in the state of Denmark.', play: 'Hamlet', tag: 'Caution' },
    { text: 'O, my offence is rank, it smells to heaven.', play: 'Hamlet', tag: 'Ritual' },
    { text: 'The air bites shrewdly; it is very cold.', play: 'Hamlet', tag: 'Detachment' },
    { text: 'Foul whisperings are abroad.', play: 'Macbeth', tag: 'Control' },
  ],
  prayer: [
    { text: 'My words fly up, my thoughts remain below.', play: 'Hamlet', tag: 'Ritual' },
    { text: 'The devil can cite Scripture for his purpose.', play: 'The Merchant of Venice', tag: 'Detachment' },
    { text: 'There’s a divinity that shapes our ends.', play: 'Hamlet', tag: 'Caution' },
    { text: 'We are such stuff as dreams are made on.', play: 'The Tempest', tag: 'Empathy' },
  ],
  mercy: [
    { text: 'The quality of mercy is not strain’d.', play: 'The Merchant of Venice', tag: 'Empathy' },
    { text: 'How far that little candle throws his beams! So shines a good deed in a naughty world.', play: 'The Merchant of Venice', tag: 'Boldness' },
    { text: 'Give sorrow words; the grief that does not speak whispers the o’er-fraught heart and bids it break.', play: 'Macbeth', tag: 'Caution' },
    { text: 'The web of our life is of a mingled yarn, good and ill together.', play: 'All’s Well That Ends Well', tag: 'Detachment' },
  ],
  discretion: [
    { text: 'The better part of valour is discretion.', play: 'Henry IV, Part 1', tag: 'Caution' },
    { text: 'Cowards die many times before their deaths.', play: 'Julius Caesar', tag: 'Boldness' },
    { text: 'All the world’s a stage, and all the men and women merely players.', play: 'As You Like It', tag: 'Detachment' },
    { text: 'What’s done cannot be undone.', play: 'Macbeth', tag: 'Control' },
  ],
  purge: [
    { text: 'I will purge thy mortal grossness.', play: 'A Midsummer Night’s Dream', tag: 'Control' },
    { text: 'Diseases desperate grown by desperate appliance are relieved, or not at all.', play: 'Hamlet', tag: 'Boldness' },
    { text: 'Things without all remedy should be without regard: what’s done is done.', play: 'Macbeth', tag: 'Detachment' },
    { text: 'The purest treasure mortal times afford is spotless reputation.', play: 'Richard II', tag: 'Caution' },
  ],
};

/** Per-option scroll metadata: educational blurb + which quote theme applies. */
export const OPTION_META: Record<string, { info: string; theme: ThemeId }> = {
  // Doctor of Physic
  'physic:diagnose:urine': { info: 'The matula — a clear glass flask for uroscopy. The physician judged the four humors from the colour, sediment, and smell of the patient’s urine, held to the light. It was the signature diagnostic of the learned doctor.', theme: 'physic' },
  'physic:diagnose:pulse': { info: 'The pulse and the patient’s own account. Reading the beat at the wrist and questioning the sufferer directly attended to the body and the person, not the flask.', theme: 'mercy' },
  'physic:diagnose:stars': { info: 'Astrological medicine. The “zodiac man” tied body parts to the heavens; the crisis day and the hour of treatment were timed to the moon and planets.', theme: 'stars' },
  'physic:treat:bleed': { info: 'Phlebotomy — opening a vein with a lancet to draw off “excess” blood, timed by lunar and seasonal calendars. Direct, forceful, and (we now know) harmful.', theme: 'blood' },
  'physic:treat:purge': { info: 'Purges and dietary regimen. Laxatives, emetics, and a cooling diet were used to evacuate and rebalance the humors gradually.', theme: 'purge' },
  'physic:treat:herbs': { info: 'A compounded herbal electuary — measured simples blended into a gentler remedy, chosen when the physician wished to soothe rather than strike.', theme: 'physic' },
  'physic:bedside:latin': { info: 'Authority through learning. Explaining the imbalance in Latin displayed erudition and held the room — and the patient — at a scholarly distance.', theme: 'discretion' },
  'physic:bedside:reassure': { info: 'Bedside comfort. Tending the patient’s fear as well as the fever — the humane art beneath the doctrine.', theme: 'mercy' },
  'physic:bedside:withdraw': { info: 'The prognosis and the retreat. Naming the crisis and withdrawing protected the physician’s judgment and reputation.', theme: 'discretion' },
  // Plague Doctor
  'plague:approach:mask': { info: 'The beaked mask (Charles de Lorme, 1619), packed with aromatic herbs believed to filter the miasma, worn with a waxed coat before entering the sick-room.', theme: 'air' },
  'plague:approach:rush': { info: 'Reaching the sufferer first. To go straight to the bedside before protecting yourself was to put care — or courage — ahead of caution.', theme: 'mercy' },
  'plague:approach:fumigate': { info: 'Fumigation. Aromatic fires and pungent smoke were burned to “purify” the corrupted air of the chamber before treatment.', theme: 'air' },
  'plague:treat:lance': { info: 'Lancing the buboes. The plague swellings were cut or cauterised to drain them — brutal, and usually futile.', theme: 'blood' },
  'plague:treat:poultice': { info: 'Vinegar and herb poultices. A gentler, protective dressing laid over the swellings — the plague doctor’s milder art.', theme: 'physic' },
  'plague:treat:quarantine': { info: 'Quarantine and flight. Sealing or emptying the house — containment chosen over cure when treatment offered little.', theme: 'discretion' },
  'plague:bedside:cane': { info: 'The cane. Used to examine and direct the patient at arm’s length, keeping the doctor safely apart from the contagion.', theme: 'discretion' },
  'plague:bedside:comfort': { info: 'Nearness to the dying. To comfort closely despite the danger was to choose presence over self-protection.', theme: 'mercy' },
  'plague:bedside:record': { info: 'The city rolls. Plague doctors were often civic functionaries who recorded the dead and enforced isolation — duty amid the dying.', theme: 'plague' },
};

export function optionMeta(roleId: DoctorRole, decisionId: string, optionId: string) {
  return OPTION_META[`${roleId}:${decisionId}:${optionId}`];
}

/**
 * Score across psyche dimensions from BOTH the tools chosen and the Shakespeare
 * lines that resonated, then build a short profile.
 * @param quoteChoices decisionId -> the Quote the player picked
 */
export function scorePsyche(role: RoleDef, choices: Record<string, string>, quoteChoices?: Record<string, Quote>) {
  const tags: Record<PsycheDim, number> = { Control: 0, Caution: 0, Empathy: 0, Detachment: 0, Ritual: 0, Boldness: 0 };
  for (const d of role.decisions) {
    const chosen = d.options.find((o) => o.id === choices[d.id]);
    chosen?.tags.forEach((t) => (tags[t] += 1));
    const q = quoteChoices?.[d.id];
    if (q) tags[q.tag] += 1;
  }
  const top = (Object.keys(tags) as PsycheDim[])
    .filter((k) => tags[k] > 0)
    .sort((a, b) => tags[b] - tags[a])
    .slice(0, 2);
  const profile =
    top.length >= 2
      ? `Your treatment leaned toward ${DIM_DESC[top[0]]} and ${DIM_DESC[top[1]]}.`
      : top.length === 1
        ? `Your treatment leaned toward ${DIM_DESC[top[0]]}.`
        : 'Your choices were evenly balanced across tendencies.';
  return { tags, top, profile };
}

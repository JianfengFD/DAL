import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, ENGINE_DATA } from './engine.js';

function tryAction(game, id, choiceId) {
  const action = game.getActions().find(a => a.id === id);
  const choice = action?.choices.find(c => c.id === choiceId);
  if (!action?.available || !choice?.available || choice.cost > game.state.ap) return false;
  const result = game.act(id, { choiceId });
  assert.equal(result.ok, true, `${id}/${choiceId}: ${result.message}`);
  return true;
}
function resolveLetter(game) {
  const event = game.getPendingEvent();
  if (!event) return;
  const weights = { health: 3, integrity: 3, reputation: 2, knowledge: 1, insight: 1, stress: -2, risk: -4, money: 0.5, funding: 0.1, departmentSupport: 1, teachingReputation: 1 };
  const score = o => Object.entries(o.effects || {}).reduce((sum, [key, value]) => sum + (Number(value) || 0) * (weights[key] || 0.5), 0);
  const choice = [...event.options].sort((a, b) => score(b) - score(a))[0];
  assert.equal(game.chooseEvent(choice.id).ok, true);
}

/** A legal player policy. It only uses the same public actions as the UI;
 * no edits to state, guaranteed grants, or forced publication outcomes. */
function honestPlan(game) {
  resolveLetter(game);
  const s = game.state, rank = game.career.rank;
  if (tryAction(game, 'job', 'advance')) return;
  if (rank === 3 && tryAction(game, 'job', 'direct_lecturer')) return;
  if (s.stats.stress > 50 || s.stats.health < 55) if (tryAction(game, 'rest', 'walk')) return;
  if (rank >= 4 && s.teaching.yearHours < 32 && [0, 3].includes(s.quarter % 4)) {
    if (!s.flags.preparedLecture && s.teaching.quality < 70 && tryAction(game, 'teach', 'prepare')) return;
    if (tryAction(game, 'teach', 'lecture')) return;
  }
  const grantWanted = rank >= 3 && s.metrics.grantsWon < (rank >= 6 ? 4 : 2);
  const grant = game.getActions().find(a => a.id === 'grant');
  const eligibleGrant = grantWanted && grant?.available && [rank >= 4 ? 'general' : 'youth', 'seed'].find(id => grant.choices.find(c => c.id === id)?.available);
  if (eligibleGrant) {
    if ((s.flags.proposalDrafts || 0) < 2 && tryAction(game, 'write', 'proposal')) return;
    if (tryAction(game, 'grant', eligibleGrant)) return;
  }
  if (rank <= 2 && (s.degreeProgress < 100 || s.stats.knowledge < [38, 50, 62][rank])) if (tryAction(game, 'study', 'course')) return;
  if (rank === 2 && s.stats.insight < 40) if (tryAction(game, 'study', 'deep')) return;
  if (rank >= 4 && s.teaching.reputation < (rank >= 6 ? 45 : rank >= 5 ? 30 : 16)) if (tryAction(game, 'teach', 'prepare')) return;
  if (rank >= 6 && s.metrics.studentsMentored < 2) {
    if (s.students.filter(x => !x.graduated).length < 2 && tryAction(game, 'mentor', 'recruit')) return;
    if (tryAction(game, 'mentor', 'guide')) return;
  }
  const p = game.activeProject;
  if (!p) { if (tryAction(game, 'research', 'new_standard')) return; }
  else if (p.progress < 100) {
    if (tryAction(game, 'research', 'experiment')) return;
    if (tryAction(game, 'rest', 'work')) return;
  } else if (p.writing < 100) {
    if (tryAction(game, 'write', p.quality < 75 ? 'polish' : 'draft')) return;
  } else if (tryAction(game, 'submit', p.quality >= 82 ? 'frontier' : p.quality >= 48 ? 'specialist' : 'campus')) return;
  if (rank >= 4 && s.department.support < 60) if (tryAction(game, 'admin', 'service')) return;
  assert.equal(tryAction(game, 'rest', 'walk'), true);
}
function playQuarter(game, plan = honestPlan) {
  resolveLetter(game);
  for (let guard = 0; game.state.ap > 0 && !game.state.ended; guard++) {
    assert.ok(guard < 12, 'action policy must make progress'); plan(game);
  }
  resolveLetter(game);
  if (!game.state.ended) assert.equal(game.endQuarter().ok, true);
}
function assertInvariants(game) {
  const s = game.state;
  assert.ok(Number.isFinite(s.money) && s.money >= -20);
  assert.ok(Number.isFinite(s.funding) && s.funding >= 0);
  assert.ok(s.ap >= 0 && s.ap <= 4);
  for (const [key, value] of Object.entries(s.stats)) assert.ok(Number.isFinite(value) && value >= 0 && value <= 100, `${key}=${value}`);
  assert.equal(s.age, 18 + s.quarter / 4);
  assert.ok(s.projects.every(p => p.progress >= 0 && p.progress <= 100 && p.writing >= 0 && p.writing <= 100));
}

test('three scenarios expose usable rule and institution data', () => {
  for (const scenario of ['undergrad', 'phd', 'young_pi']) {
    const g = new Game({ scenario, seed: 10 });
    assert.equal(g.state.ap, 4); assert.equal(g.getActions().length, 17);
    assert.ok(g.getActions().every(a => a.id && a.label && a.choices.every(c => c.id && c.label)));
    assert.equal(g.getEconomy().annualSalary, g.career.salary);
    assert.ok(g.state.department.name); assert.ok(g.state.colleagues.length >= 2);
    assertInvariants(g);
  }
  assert.equal(new Game({ fieldId: 'computation' }).state.department.id, 'information');
  assert.equal(new Game({ fieldId: 'mathematics' }).state.department.id, 'basic');
  assert.ok(ENGINE_DATA.hats.length >= 7);
});

test('invalid, disabled, and unaffordable actions do not mutate state or RNG', () => {
  const g = new Game({ seed: 77 });
  for (const [id, payload] of [['missing', {}], ['study', { choiceId: 'fake' }], ['submit', { choiceId: 'summit' }], ['hat', { choiceId: 'academician' }]]) {
    const before = g.serialize();
    assert.equal(g.act(id, payload).ok, false);
    assert.equal(g.serialize(), before);
  }
  for (let i = 0; i < 4; i++) g.act('study', { choiceId: 'course' });
  const before = g.serialize(); assert.equal(g.act('rest', { choiceId: 'walk' }).ok, false); assert.equal(g.serialize(), before);
});

test('zero cost focus switching works with no AP and expensive choices expose time limits', () => {
  const g = new Game({ seed: 8, scenario: 'young_pi' });
  g.act('research', { choiceId: 'new_standard' });
  const first = g.activeProject.id;
  g.act('research', { choiceId: 'new_frontier' });
  g.act('rest', { choiceId: 'walk' });
  const curriculum = g.getActions().find(a => a.id === 'teach').choices.find(c => c.id === 'curriculum');
  assert.equal(curriculum.available, false); assert.match(curriculum.reason, /时间/);
  g.act('rest', { choiceId: 'walk' });
  assert.equal(g.state.ap, 0);
  assert.equal(g.getActions().find(a => a.id === 'research').available, true);
  assert.equal(g.act('research', { choiceId: `focus_${first}` }).ok, true);
  assert.equal(g.activeProject.id, first); assert.equal(g.state.ap, 0);
});

test('save and load preserve deterministic RNG and complete continuation', () => {
  const original = new Game({ scenario: 'young_pi', seed: '澄江-2026', name: '林知远' });
  for (let i = 0; i < 5; i++) playQuarter(original);
  const restored = Game.deserialize(original.serialize());
  assert.equal(restored.serialize(), original.serialize());
  for (let i = 0; i < 20; i++) {
    playQuarter(original); playQuarter(restored);
    assert.equal(restored.serialize(), original.serialize(), `diverged in quarter ${i}`);
  }
  assert.throws(() => Game.deserialize('{bad'), /JSON/);
  assert.throws(() => Game.deserialize('{}'), /存档/);
  const broken = JSON.parse(original.serialize()); broken.state.stats.health = null;
  assert.throws(() => Game.deserialize(broken), /状态/);
});

test('public strategy can graduate through every degree and become a professor', () => {
  const g = new Game({ seed: 131, scenario: 'undergrad' });
  const stages = new Set([g.state.career]);
  for (let q = 0; q < 132 && g.state.career !== 'professor'; q++) {
    playQuarter(g); stages.add(g.state.career); assertInvariants(g);
  }
  assert.equal(g.state.career, 'professor', `stalled at ${g.state.career} age ${g.state.age}`);
  for (const id of ['undergraduate', 'master', 'phd', 'postdoc', 'assistant', 'lecturer', 'associate', 'professor']) assert.ok(stages.has(id), id);
  for (const degree of ['bachelor', 'master', 'doctor']) assert.ok(g.state.flags.degrees.includes(degree));
  assert.ok(g.state.stats.integrity >= 75); assert.ok(g.state.metrics.studentsMentored >= 2);
  assert.ok(!g.state.ended && !g.state.flags.healthCrises);
  const bachelor = g.state.history.find(h => h.type === 'career' && h.from === 'undergraduate');
  assert.ok(bachelor.quarter >= 16, 'degree cannot be rushed before minimum residence');
});

test('young PI can meet the initial six year tenure deadline through honest play', () => {
  const g = new Game({ seed: 131, scenario: 'young_pi' }), deadline = g.state.flags.tenureDeadline;
  for (let q = 0; q < 24 && g.career.rank < 6; q++) playQuarter(g);
  assert.ok(g.career.rank >= 6, `not promoted: ${g.paperScore} paper score, ${g.state.metrics.grantsWon} grants`);
  assert.ok(g.state.quarter <= deadline);
  assert.equal(g.state.flags.probationStrikes, 0);
  assert.ok(g.state.teaching.reputation >= 28);
});

test('grant awards fund research without putting public money in personal wallet', () => {
  let awarded = false;
  for (let seed = 1; seed < 100; seed++) {
    const g = new Game({ seed, scenario: 'young_pi' }), money = g.state.money, funding = g.state.funding;
    assert.equal(g.act('grant', { choiceId: 'seed' }).ok, true);
    assert.equal(g.state.money, money);
    if (g.state.funding > funding) { assert.equal(g.state.funding, funding + 12); awarded = true; break; }
  }
  assert.ok(awarded);
});

test('personal debt does not block an expense fully covered by the separate research ledger', () => {
  const initial = new Game({ seed: 11, scenario: 'young_pi' });
  initial.act('research', { choiceId: 'new_standard' });
  // An imported financial fixture covers a valid debt state without forcing
  // unrelated random audits merely to reach this resource boundary.
  const fixture = JSON.parse(initial.serialize());
  fixture.state.money = -12; fixture.state.funding = 10;
  const g = Game.deserialize(fixture);
  assert.equal(g.getActions().find(a => a.id === 'research').choices.find(c => c.id === 'experiment').available, true);
  assert.equal(g.act('research', { choiceId: 'experiment' }).ok, true);
  assert.equal(g.state.money, -12); assert.equal(g.state.funding, 9.75);
  assert.equal(g.getActions().find(a => a.id === 'rest').choices.find(c => c.id === 'holiday').available, false);
});

test('prior publications cannot complete a new startup grant without new research', () => {
  const g = new Game({ seed: 131, scenario: 'young_pi' });
  const initialGrant = g.state.grants[0];
  assert.equal(initialGrant.startScore, g.paperScore);
  for (let q = 0; q < 20; q++) {
    // Select only life/administrative letter responses when available; no
    // research actions, publications, or direct modifications to the state.
    const event = g.getPendingEvent(); if (event) g.chooseEvent(event.options[0].id);
    while (g.state.ap > 0) assert.equal(g.act('rest', { choiceId: 'walk' }).ok, true);
    assert.equal(g.endQuarter().ok, true);
  }
  assert.equal(g.state.projects.length, 0);
  assert.equal(initialGrant.status, '执行中'); assert.equal(initialGrant.extended, true);
  assert.equal(g.state.metrics.grantsCompleted, 0);
});

test('open colleague cooperation updates the canonical relationship shown in UI', () => {
  const g = new Game({ seed: 1, scenario: 'young_pi' }), id = g.state.colleagues[0].id;
  const before = g.state.relationships[id].trust;
  assert.equal(g.act('network', { choiceId: 'collaborate' }).ok, true);
  assert.equal(g.state.relationships[id].trust, before + 4);
  assert.equal(g.state.colleagues.find(c => c.id === id).trust, before + 4);
  assert.equal(g.act('network', { choiceId: id }).ok, true);
  assert.equal(g.state.colleagues.find(c => c.id === id).trust, g.state.relationships[id].trust);
});

test('a graduating student cannot also transfer out in the same quarter', () => {
  const g = new Game({ seed: 6, scenario: 'young_pi' });
  g.act('mentor', { choiceId: 'recruit' }); g.act('research', { choiceId: 'new_standard' });
  g.act('mentor', { choiceId: 'push' }); g.act('rest', { choiceId: 'walk' }); g.endQuarter();
  for (let q = 0; q < 10 && !g.state.students[0].graduated && !g.state.ended; q++) {
    const letter = g.getPendingEvent(); if (letter) g.chooseEvent(letter.options.at(-1).id);
    for (let i = 0; i < 2; i++) tryAction(g, 'mentor', 'push');
    while (g.state.ap > 0) g.act('rest', { choiceId: 'walk' });
    g.endQuarter();
  }
  assert.ok(g.state.students[0].graduated);
  const countedGraduates = g.state.students.filter(st => st.graduated && !st.left).length;
  assert.equal(g.state.metrics.studentsMentored, countedGraduates);
  const name = g.state.students[0].name;
  assert.ok(!(g.state.logs.some(l => l.message.includes(`${name}完成学位`)) && g.state.logs.some(l => l.message.includes(`${name}申请转组`))));
});

test('event responses apply once and block advancing time until answered', () => {
  const g = new Game({ seed: 3 });
  for (let i = 0; i < 24 && !g.getPendingEvent(); i++) g.endQuarter();
  assert.ok(g.getPendingEvent());
  const before = g.serialize(); assert.equal(g.endQuarter().ok, false); assert.equal(g.serialize(), before);
  const event = g.getPendingEvent(), id = event.options[0].id;
  assert.equal(g.chooseEvent(id).ok, true);
  const after = g.serialize(); assert.equal(g.chooseEvent(id).ok, false); assert.equal(g.serialize(), after);
  assert.ok(g.state.flags.seenEvents.includes(event.id));
});

test('teaching changes promotion criteria and administration has real effects', () => {
  const g = new Game({ seed: 42, scenario: 'young_pi' });
  const researchScoreTarget = g.getCareerOptions()[0].requirements.find(r => r.label === '成果积分').target;
  const salary = g.getEconomy().annualSalary;
  assert.equal(g.act('job', { choiceId: 'teaching_track' }).ok, true);
  assert.ok(g.getCareerOptions()[0].requirements.find(r => r.label === '成果积分').target < researchScoreTarget);
  assert.ok(g.getCareerOptions()[0].requirements.find(r => r.label === '教学口碑').target >= 60);
  assert.ok(g.getEconomy().annualSalary < salary);
  const expertise = g.state.administration.research;
  assert.equal(g.act('admin', { choiceId: 'research' }).ok, true);
  assert.ok(g.state.flags.adminPrepared && g.state.administration.research > expertise);
  assert.ok(g.state.administration.pending.some(p => p.office === 'education'));
});

test('corrupt choices leave explicit risk and can lead to retraction or audit', () => {
  let consequences = false;
  for (let seed = 1; seed <= 6; seed++) {
    const g = new Game({ seed, scenario: 'young_pi' });
    assert.equal(g.act('deal', { choiceId: 'authorship' }).ok, true);
    assert.equal(g.act('deal', { choiceId: 'embezzle' }).ok, true);
    assert.ok(g.state.stats.risk >= 50 && g.state.stats.integrity < 65);
    for (let q = 0; q < 16 && !g.state.ended; q++) { resolveLetter(g); g.endQuarter(); }
    assertInvariants(g);
    if (g.state.metrics.audits > 0) consequences = true;
  }
  assert.ok(consequences);
});

test('hundreds of legal random turns maintain resource and stat invariants', () => {
  let rng = 2026;
  const random = () => { rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0; return rng / 4294967296; };
  for (let seed = 10; seed < 16; seed++) {
    const g = new Game({ seed, scenario: seed % 2 ? 'young_pi' : 'phd', difficulty: 'hard' });
    for (let q = 0; q < 60 && !g.state.ended; q++) {
      resolveLetter(g);
      for (let i = 0; i < 4 && g.state.ap > 0 && !g.state.ended; i++) {
        const actions = g.getActions().filter(a => a.available && !['job'].includes(a.id));
        const a = actions[Math.floor(random() * actions.length)];
        const choices = a.choices.filter(c => c.available && c.cost <= g.state.ap && !c.id.startsWith('focus_'));
        if (!choices.length) continue;
        assert.equal(g.act(a.id, { choiceId: choices[Math.floor(random() * choices.length)].id }).ok, true);
        assertInvariants(g);
      }
      resolveLetter(g); if (!g.state.ended) assert.equal(g.endQuarter().ok, true); assertInvariants(g);
    }
  }
});

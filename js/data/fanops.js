// Fan Ops: new missions made for this site. Mission files live in /ops/ and open in the designer.
// status is worked out below: 'playtested' once a mission has PLAYTESTS_NEEDED logged playtests, otherwise 'untested'.
// testNotes: what playtesters should watch for. changes: version history. playtests: logged reports.
export const PLAYTESTS_NEEDED = 3;

export const FANOPS = [
  { id: 'bird-in-the-hand', file: 'ops/bird-in-the-hand.sasmission.json', title: 'Bird in the Hand', author: 'Ivan',
    version: '1.0', type: 'Rescue', needs: ['Core'], tiles: 6, layout: '3x2', operators: 3, deck: 'Maroon', window: '12/6',
    stealth: { easy: 8, normal: 7, hard: 6 }, major: '9', minor: '7',
    premise: 'An RAF navigator is hiding in a farmer\'s barn while military police search the village. Cross the river by the guarded bridge, the rowing boat or Anders\' scuba gear, reach him before the search truck does, and bring him home.',
    testNotes: [
      'On which turn was the navigator activated, and on which turn did the special event card come out?',
      'Event window 12/6: was the race to the barn too tight, too loose, or about right?',
      'How did you cross the river (bridge, rowing boat, swim, or a mix)? Did the bridge guards feel avoidable or unavoidable?',
      'Did anyone escape by rowing the boat off the west edge? Was that route worth the effort?',
      'The Axis Officer is worth 2 points: did you go for him, and was the risk worth it?',
      'Stealth on Normal (7): on which turn did the alarm sound, and what set it off?',
      'Did you ambush the truck when it stopped at the barn? Was it too easy or too hard?',
      'Was any part of the briefing unclear when you reached it, especially the navigator rules?',
    ],
    changes: [],
    playtests: [] },
];

FANOPS.forEach(m => { m.status = (m.playtests || []).length >= PLAYTESTS_NEEDED ? 'playtested' : 'untested'; });

export const STATUS = {
  untested: { label: 'Needs playtest', note: `Fewer than ${PLAYTESTS_NEEDED} playtests so far. Rules may change after feedback.` },
  playtested: { label: 'Playtested', note: `Played at least ${PLAYTESTS_NEEDED} times and adjusted after feedback.` },
};

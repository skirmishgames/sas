// SAS: Rogue Regiment mission designer catalogue.
// Art supplied by Robert Butler (Word Forge Games) to the community map editors
// by Magnus G (TileSystem set) and Paolo Roscio / Paul Manley (SAS Map Editor).
// Sizes are in board squares. One map tile is 10 x 10 squares.

export const SQ = 48; // source art pixels per square

export const BOXES = {
  RR: 'SAS: Rogue Regiment',
  TWD: 'They Who Dare',
  HM: 'Heavy Metal',
  HD: 'Hot Dogs',
  JA: 'Jäger',
  KS: 'Kickstarter content',
  ATP: 'ATP Timer',
};

// Double-sided map tiles 1 to 12 (A and B faces), plus the bunker interior.
export const TILES = [];
for (let n = 1; n <= 12; n++) {
  for (const s of ['A', 'B']) {
    TILES.push({ id: `${n}${s}`, num: String(n), side: s, name: `Tile ${n}${s}`, src: `assets/tiles/${n}${s}.webp`, box: 'RR' });
  }
}
TILES.push({ id: 'bunker', num: 'bunker', side: '', name: 'Bunker', src: 'assets/tiles/bunker.webp', box: 'RR' });

// Vehicle roles. Border colours follow the mission book.
export const ROLES = {
  patrol: { name: 'Patrol', color: '#111111' },
  convoy: { name: 'Convoy', color: '#ffffff' },
  guard: { name: 'Guard', color: '#f2c200' },
  assault: { name: 'Assault', color: '#e01b1b' },
  scout: { name: 'Scout', color: '#1aa3e8' },
};

// kind: tile | spawn | token | vehicle | opvehicle | objective | marker
// key: label used in the mission key. {role} is replaced for Axis vehicles.
export const PIECES = [
  // Spawn and entry tiles (small tiles, 3 x 4 squares)
  { id: 'entry-exit', kind: 'spawn', name: 'Operator Entry/Exit Tile', key: 'Operator Entry/Exit Tile', w: 3, h: 4, box: 'RR', faces: ['assets/spawn/entry-exit1b.webp', 'assets/spawn/entry-exit1a.webp'], faceNames: ['Entry/Exit (grass side)', 'Entry/Exit (Willys side)'] },
  { id: 'spawn-white', kind: 'spawn', name: 'White Spawn Tile', w: 3, h: 4, box: 'RR', faces: ['assets/spawn/spawn-white1a.webp', 'assets/spawn/spawn-white1b.webp'] },
  { id: 'spawn-black', kind: 'spawn', name: 'Black Spawn Tile', w: 3, h: 4, box: 'RR', faces: ['assets/spawn/spawn-black1a.webp', 'assets/spawn/spawn-black1b.webp'] },
  { id: 'spawn-mixed', kind: 'spawn', name: 'Mixed Spawn Tile', w: 3, h: 4, box: 'RR', faces: ['assets/spawn/spawn-mixed1a.webp', 'assets/spawn/spawn-mixed1b.webp'] },

  // Operators and allies (1 square tokens)
  { id: 'op-jock', kind: 'token', name: 'Operator Jock', key: 'Operator Jock Start', src: 'assets/tokens/operator-jock.png', box: 'RR', max: 1 },
  { id: 'op-paddy', kind: 'token', name: 'Operator Paddy', key: 'Operator Paddy Start', src: 'assets/tokens/operator-paddy.png', box: 'RR', max: 1 },
  { id: 'op-ginger', kind: 'token', name: 'Operator Ginger', key: 'Operator Ginger Start', src: 'assets/tokens/operator-ginger.png', box: 'RR', max: 1 },
  { id: 'op-anders', kind: 'token', name: 'Operator Anders', key: 'Operator Anders Start', src: 'assets/tokens/operator-anders.png', box: 'RR', max: 1 },
  { id: 'op-nancy', kind: 'token', name: 'Operator Nancy', key: 'Operator Nancy Start', src: 'assets/tokens/operator-nancy.png', box: 'TWD', max: 1 },
  { id: 'op-henri', kind: 'token', name: 'Operator Henri', key: 'Operator Henri Start', src: 'assets/tokens/operator-henri.png', box: 'KS', max: 1 },
  { id: 'op-generic', kind: 'token', name: 'Operator (any)', key: 'Operator Start', src: 'assets/tokens/operator-generic.png', box: 'RR', max: 6 },
  { id: 'resistance', kind: 'token', name: 'Resistance Unit', key: 'Resistance Unit', src: 'assets/tokens/resistance-unit.png', box: 'RR', max: 8 },
  { id: 'sas-support', kind: 'token', name: 'SAS Support Unit', key: 'SAS Support Unit', src: 'assets/tokens/sas-support-unit.png', box: 'TWD', max: 8 },

  // Axis units
  { id: 'axis-guard', kind: 'token', name: 'Axis Guard', key: 'Axis Guard', src: 'assets/tokens/axis-guard.png', box: 'RR', facing: true },
  { id: 'axis-officer', kind: 'token', name: 'Axis Officer', key: 'Axis Officer', src: 'assets/tokens/axis-officer1.png', box: 'RR', facing: true, max: 3 },
  { id: 'axis-officer-2', kind: 'token', name: 'Axis Officer (orange)', key: 'Axis Officer', src: 'assets/tokens/axis-officer2.png', box: 'RR', facing: true, max: 3 },
  { id: 'radio-operator', kind: 'token', name: 'Radio Operator', key: 'Axis Radio Operator', src: 'assets/tokens/radio-operator.png', box: 'KS', facing: true, max: 1 },
  { id: 'dog', kind: 'token', name: 'Guard Dog', key: 'Guard Dog', src: 'assets/tokens/dog.png', box: 'HD', facing: true, max: 6 },

  // Objects and markers
  { id: 'fuel-barrel', kind: 'token', name: 'Fuel Barrel', key: 'Fuel Barrel', src: 'assets/tokens/fuel-barrel.png', box: 'RR', max: 4 },
  { id: 'intel-1', kind: 'token', name: 'Intel (briefcase)', key: 'Intel', src: 'assets/tokens/intel1.png', box: null },
  { id: 'intel-2', kind: 'token', name: 'Intel (documents)', key: 'Plans', src: 'assets/tokens/intel2.png', box: null },
  { id: 'objective', kind: 'token', name: 'Objective (yellow)', key: 'Objective', src: 'assets/tokens/objective.png', box: null },
  { id: 'objective-2', kind: 'token', name: 'Objective (orange)', key: 'Objective', src: 'assets/tokens/objective-2.png', box: null },
  { id: 'objective-3', kind: 'token', name: 'Objective (red)', key: 'Objective', src: 'assets/tokens/objective-3.png', box: null },
  { id: 'ladder-top', kind: 'token', name: 'Ladder Top', key: 'Ladder Top', src: 'assets/tokens/ladder-top.png', box: null },
  { id: 'ladder-bottom', kind: 'token', name: 'Ladder Bottom', key: 'Ladder Bottom', src: 'assets/tokens/ladder-bottom.png', box: null },
  { id: 'ladder-top-2', kind: 'token', name: 'Ladder Top (second pair)', key: 'Ladder Top', src: 'assets/tokens/ladder-top-2.png', box: null },
  { id: 'ladder-bottom-2', kind: 'token', name: 'Ladder Bottom (second pair)', key: 'Ladder Bottom', src: 'assets/tokens/ladder-bottom-2.png', box: null },

  // Axis vehicles. Role is chosen per placement.
  { id: 'motorbike', kind: 'vehicle', name: 'Motorbike', w: 2, h: 2, box: 'RR', faces: ['assets/vehicles/motorbike1.webp', 'assets/vehicles/motorbike2.webp'] },
  { id: 'kubelwagen', kind: 'vehicle', name: 'Kübelwagen', w: 3, h: 2, box: 'RR', faces: ['assets/vehicles/kubelwagen.webp'] },
  { id: 'halftrack', kind: 'vehicle', name: 'Half-Track', w: 3, h: 2, box: 'RR', faces: ['assets/vehicles/halftrack1.webp', 'assets/vehicles/halftrack2.webp'] },
  { id: 'truck', kind: 'vehicle', name: 'Truck', w: 4, h: 2, box: 'RR', faces: ['assets/vehicles/truck.webp'] },
  { id: 'panzer3', kind: 'vehicle', name: 'Panzer III', w: 3, h: 2, box: 'TWD', faces: ['assets/vehicles/panzer3.webp'] },
  { id: 'armoured-car', kind: 'vehicle', name: 'Armoured Car', w: 3, h: 2, box: 'HM', faces: ['assets/vehicles/armoured-car.webp'] },
  { id: 'heavy-armoured-car', kind: 'vehicle', name: 'Heavy Armoured Car', w: 3, h: 2, box: 'HM', faces: ['assets/vehicles/heavy-armoured-car.webp'] },
  { id: 'troop-truck', kind: 'vehicle', name: 'Troop Transport Truck', w: 4, h: 2, box: 'HM', faces: ['assets/vehicles/troop-truck.webp'] },
  { id: 'flame-halftrack', kind: 'vehicle', name: 'Flamethrower Half-Track', w: 3, h: 2, box: 'HD', faces: ['assets/vehicles/flame-halftrack1.webp', 'assets/vehicles/flame-halftrack2.webp'] },
  { id: 'hmg-kubelwagen', kind: 'vehicle', name: 'HMG Kübelwagen', w: 2, h: 3, box: 'JA', faces: ['assets/vehicles/hmg-kubel-a.webp', 'assets/vehicles/hmg-kubel-b.webp'] },
  { id: 'kettenkrad', kind: 'vehicle', name: 'Kettenkrad', w: 3, h: 2, box: 'JA', faces: ['assets/vehicles/kettenkrad.webp'] },
  { id: 'sturmboot', kind: 'vehicle', name: 'Sturmboot', w: 4, h: 2, box: 'JA', faces: ['assets/vehicles/sturmboot.webp'] },
  { id: 'stummel', kind: 'vehicle', name: 'Stummel Half-Track', w: 3, h: 2, box: 'KS', faces: ['assets/vehicles/stummel.webp'] },
  { id: 'aa-truck', kind: 'vehicle', name: 'Anti Aircraft Truck', w: 4, h: 2, box: 'KS', faces: ['assets/vehicles/aa-truck.webp'] },

  // Operator vehicles
  { id: 'willys', kind: 'opvehicle', name: 'Willys Jeep', w: 3, h: 2, box: 'RR', faces: ['assets/vehicles/willys.webp'], max: 1 },
  { id: 'rowboat', kind: 'opvehicle', name: 'Rowing Boat', w: 3, h: 2, box: 'RR', faces: ['assets/vehicles/rowboat.webp'], max: 1 },
  { id: 'op-truck', kind: 'opvehicle', name: 'Truck (Operator)', key: 'Truck', w: 4, h: 2, box: 'RR', faces: ['assets/vehicles/op-truck.webp'] },
  { id: 'support-willys', kind: 'opvehicle', name: 'Support Willys', w: 3, h: 2, box: 'TWD', faces: ['assets/vehicles/support-willys.webp'], max: 1 },
  { id: 'typhoon', kind: 'opvehicle', name: 'Hawker Typhoon', w: 6, h: 5, box: 'TWD', faces: ['assets/vehicles/typhoon.webp'], max: 1, contain: true },

  // Objective pieces (small tiles)
  { id: 'supply-dump', kind: 'objective', name: 'Supply Dump', w: 2, h: 2, box: 'RR', faces: ['assets/objectives/supply1a.webp', 'assets/objectives/supply1b.webp'], max: 5, objective: true },
  { id: 'aa-gun', kind: 'objective', name: 'AA Gun', w: 2, h: 2, box: 'TWD', faces: ['assets/objectives/aa-gun.webp'], max: 2 },
  { id: 'command-halftrack', kind: 'objective', name: 'Command Half-Track', w: 2, h: 3, box: 'ATP', faces: ['assets/objectives/command-half-track1a.webp', 'assets/objectives/command-half-track1b.webp'], max: 1, objective: true },
  { id: 'fuel-truck-torpedo', kind: 'objective', name: 'Fuel Truck / Torpedo Store', w: 2, h: 4, box: 'ATP', faces: ['assets/objectives/fuel-truck1.webp', 'assets/objectives/torpedoes.webp'], faceNames: ['Fuel Truck', 'Torpedo Store'], max: 1, objective: true },
  { id: 'seehund-fuel', kind: 'objective', name: 'Seehund / Fuel Truck', w: 2, h: 4, box: 'HD', faces: ['assets/objectives/seehund1.webp', 'assets/objectives/fuel-truck2.webp'], faceNames: ['Seehund', 'Fuel Truck'], max: 1, objective: true },
  { id: 'seehund-roadblock', kind: 'objective', name: 'Seehund / Roadblock', w: 2, h: 3, box: 'HD', faces: ['assets/objectives/seehund2.webp', 'assets/objectives/roadblock.webp'], faceNames: ['Seehund', 'Roadblock'], max: 1 },

  // Free marker for anything else worth pointing out on the map
  { id: 'marker', kind: 'marker', name: 'Custom marker', key: 'Marker', box: null },
];

export const PIECE = Object.fromEntries(PIECES.map(p => [p.id, p]));
export const TILE = Object.fromEntries(TILES.map(t => [t.id, t]));

export const PALETTE_GROUPS = [
  { id: 'tiles', name: 'Map tiles' },
  { id: 'spawn', name: 'Spawn & entry', kinds: ['spawn'] },
  { id: 'units', name: 'Units', ids: ['op-jock', 'op-paddy', 'op-ginger', 'op-anders', 'op-nancy', 'op-henri', 'op-generic', 'resistance', 'sas-support', 'axis-guard', 'axis-officer', 'axis-officer-2', 'radio-operator', 'dog'] },
  { id: 'items', name: 'Items', ids: ['fuel-barrel', 'intel-1', 'intel-2', 'objective', 'objective-2', 'objective-3', 'ladder-top', 'ladder-bottom', 'ladder-top-2', 'ladder-bottom-2', 'marker'] },
  { id: 'axisveh', name: 'Axis vehicles', kinds: ['vehicle'] },
  { id: 'opveh', name: 'Operator vehicles', kinds: ['opvehicle'] },
  { id: 'objectives', name: 'Objective tiles', kinds: ['objective'] },
  { id: 'routes', name: 'Routes' },
];

export const MISSION_TYPES = ['Escape & Evade', 'Rescue', 'Raid', 'Assassination', 'Convoy', 'Firefight', 'Sabotage'];
export const EVENT_DECKS = ['Maroon', 'Tan', 'Green', 'Heavy Metal', 'Hot Dogs', 'Jäger', 'Kickstarter'];

// Rule book p.28, creating your own missions: tile count to operators and Normal stealth.
export function recommendedFor(tileCount) {
  if (tileCount <= 4) return { operators: '2', normal: 6 };
  if (tileCount <= 7) return { operators: '3', normal: 7 };
  return { operators: '4 + Willys Jeep', normal: 8 };
}

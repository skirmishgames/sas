// Mission index data. Extracted from the SAS: Rogue Regiment mission book and SAS Declassified.
// Summaries are paraphrased; see the books for full briefings.
export const SERIES = ["Core", "They Who Dare", "Heavy Metal", "Hot Dogs", "Jäger", "Kickstarter", "Black Box"];
export const EXPANSIONS = ["Core", "They Who Dare", "Heavy Metal", "Hot Dogs", "Jäger", "Kickstarter", "ATP Timer"];
export const MISSIONS = [
 {
  "id": "mb-p2",
  "source": "SAS Mission Book",
  "page": 2,
  "series": "Core",
  "number": "1",
  "title": "Scattered",
  "type": "Escape & Evade",
  "operators": "1*",
  "operatorCount": 1,
  "deck": "Maroon",
  "window": "None",
  "major": "1",
  "minor": null,
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Jock",
   "Anders"
  ],
  "key": [
   "Operator Jock Start",
   "Axis Guard",
   "Mixed Spawn Tile"
  ],
  "objectives": [
   "Operator Anders"
  ],
  "summary": "Jock alone must get through the Axis guards to the room where Anders is held prisoner. The mission ends the moment he enters it, and fails if he dies.",
  "special": [
   "Anders is not playable",
   "Single Operator mission"
  ],
  "needs": [
   "Core"
  ],
  "tags": [],
  "order": 0,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p3",
  "source": "SAS Mission Book",
  "page": 3,
  "series": "Core",
  "number": "2",
  "title": "Over & Out",
  "type": "Escape & Evade",
  "operators": "2",
  "operatorCount": 2,
  "deck": "Maroon",
  "window": "None",
  "major": "2",
  "minor": null,
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Jock",
   "Anders"
  ],
  "key": [
   "Operator Jock Start",
   "Operator Anders Start",
   "Mixed Spawn Tile",
   "Operator Exit Tile"
  ],
  "objectives": [],
  "summary": "Jock and Anders must fight across a guarded river and reach the exit tile where the Willys Jeep waits. Both must make it out to succeed.",
  "special": [
   "River crossing"
  ],
  "needs": [
   "Core"
  ],
  "tags": [],
  "order": 1,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p4",
  "source": "SAS Mission Book",
  "page": 4,
  "series": "Core",
  "number": "3",
  "title": "Rally Point Charlie",
  "type": "Rescue",
  "operators": "4 + Willys Jeep*",
  "operatorCount": 4,
  "deck": "Maroon",
  "window": "18/6",
  "major": "4",
  "minor": null,
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Paddy",
   "Ginger",
   "Jock",
   "Anders"
  ],
  "key": [
   "Operator Paddy Start",
   "Operator Ginger Start",
   "Fuel Barrel",
   "Axis Half-Track Patrol",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Willys Jeep"
  ],
  "objectives": [],
  "summary": "Paddy and Ginger hold out against the Axis until the Willys Jeep arrives, then all four Operators must leave the board aboard it.",
  "special": [
   "Special event card places Willys Jeep",
   "Jock and Anders start in Jeep",
   "Jeep may exit any edge"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Event window",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 2,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p5",
  "source": "SAS Mission Book",
  "page": 5,
  "series": "Core",
  "number": "4",
  "title": "Butcher & Bolt",
  "type": "Raid",
  "operators": "3",
  "operatorCount": 3,
  "deck": "Tan",
  "window": "None",
  "major": "11",
  "minor": "9",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 6,
  "layout": "3x2",
  "namedOperators": [],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Fuel Barrel",
   "Axis Motorbike Patrol",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Blow up three supply dumps using explosives and kill the Axis Officer, then get the team back to the entry and exit tile.",
  "special": [
   "Supply dumps need explosives"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Axis Officer",
   "Supply dumps",
   "Vehicle patrols"
  ],
  "order": 3,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p6",
  "source": "SAS Mission Book",
  "page": 6,
  "series": "Core",
  "number": "5",
  "title": "Head of the Snake",
  "type": "Assassination",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Tan",
  "window": "18/6",
  "major": "6",
  "minor": "5",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Axis Motorbike Convoy",
   "Axis Kübelwagen Convoy",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer"
  ],
  "summary": "Kill the Axis Officer before his replacement vehicle carries him off the board, then return the Operators to the entry and exit tile.",
  "special": [
   "Special event card places convoy",
   "Convoy picks up Axis Officer"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Axis Officer",
   "Convoy",
   "Event window",
   "Rowing Boat",
   "Willys Jeep"
  ],
  "order": 4,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p7",
  "source": "SAS Mission Book",
  "page": 7,
  "series": "Core",
  "number": "6",
  "title": "Convoy",
  "type": "Convoy",
  "operators": "3",
  "operatorCount": 3,
  "deck": "Maroon",
  "window": "15/6",
  "major": "13",
  "minor": "11",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 6,
  "layout": "3x2",
  "namedOperators": [],
  "key": [
   "Operator Start",
   "Fuel Barrel",
   "Axis Motorbike Scout",
   "Mixed Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Truck Convoy",
   "Axis Half-Track Convoy"
  ],
  "summary": "Destroy all five convoy vehicles, two half-tracks and three trucks, before they leave the board, then escape. Half-tracks need explosives.",
  "special": [
   "Special event card places convoy",
   "Half-tracks need explosives"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Convoy",
   "Event window"
  ],
  "order": 5,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p8",
  "source": "SAS Mission Book",
  "page": 8,
  "series": "Core",
  "number": "7",
  "title": "Jail Break",
  "type": "Rescue",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Tan",
  "window": "None",
  "major": "8",
  "minor": "7",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [],
  "key": [
   "Operator Start",
   "Truck",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Half-Track Guard",
   "Fuel Barrel",
   "Ladder Top",
   "Ladder Bottom",
   "White Spawn Tile",
   "Black Spawn Tile"
  ],
  "objectives": [
   "Resistance Start"
  ],
  "summary": "Break four Resistance prisoners out of the Axis base, activating them by reaching them, then lead everyone off the West board edge.",
  "special": [
   "Ladder squares count as adjacent",
   "Resistance units activated by proximity",
   "Exit via West edge",
   "Interior prison inset map"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Ladders",
   "Resistance",
   "Vehicle patrols"
  ],
  "order": 6,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p9",
  "source": "SAS Mission Book",
  "page": 9,
  "series": "Core",
  "number": "8",
  "title": "Fortress",
  "type": "Raid",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Tan",
  "window": "None",
  "major": "14",
  "minor": "12",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Destroy four supply dumps with explosives and kill the Axis Officer in the fortress, then bring the Operators back to the entry and exit tile.",
  "special": [
   "Supply dumps need explosives"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Axis Officer",
   "Rowing Boat",
   "Supply dumps",
   "Willys Jeep"
  ],
  "order": 7,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p10",
  "source": "SAS Mission Book",
  "page": 10,
  "series": "Core",
  "number": "9",
  "title": "Libérateurs",
  "type": "Firefight",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Tan",
  "window": "15/6*",
  "major": "5+",
  "minor": "3",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Resistance Unit",
   "Axis Officer",
   "Axis Guard",
   "Fuel Barrel",
   "Axis Half-Track Patrol",
   "Axis Half-Track Assault",
   "Axis Motorbike Assault",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Mixed Spawn Tile",
   "Operator Entry Tile"
  ],
  "objectives": [],
  "summary": "Help the Resistance free the village, then survive the retreating Axis column's assault until every Axis unit is destroyed, keeping as many Operators and Resistance units alive as possible.",
  "special": [
   "Remove 9 event cards before window",
   "Battle Section starts at special card",
   "Resistance units",
   "Mixed spawn tile",
   "Assault vehicles"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Axis Officer",
   "Event window",
   "Resistance",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 8,
  "seriesSlug": "core",
  "errata": []
 },
 {
  "id": "mb-p11",
  "source": "SAS Mission Book",
  "page": 11,
  "series": "They Who Dare",
  "number": "1",
  "title": "A Parting Gift",
  "type": "Assassination",
  "operators": "1",
  "operatorCount": 1,
  "deck": "Green",
  "window": "None",
  "major": "3",
  "minor": null,
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Nancy"
  ],
  "key": [
   "Operator Nancy Start",
   "Axis Guard",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry Tile"
  ],
  "objectives": [
   "Axis Officer"
  ],
  "summary": "Nancy must kill the Axis Officer by any means, then get back out through her entry tile.",
  "special": [
   "Solo Operator",
   "Did you know SOE note"
  ],
  "needs": [
   "Core",
   "They Who Dare"
  ],
  "tags": [
   "Axis Officer"
  ],
  "order": 9,
  "seriesSlug": "they-who-dare",
  "errata": []
 },
 {
  "id": "mb-p12",
  "source": "SAS Mission Book",
  "page": 12,
  "series": "They Who Dare",
  "number": "2",
  "title": "Out to Lunch",
  "type": "Espionage",
  "operators": "3",
  "operatorCount": 3,
  "deck": "Green",
  "window": "12/6",
  "major": "6",
  "minor": "4",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 6,
  "layout": "3x2",
  "namedOperators": [
   "Nancy"
  ],
  "key": [
   "Operator Start",
   "Axis Officer",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Kübelwagen Convoy",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer's Office"
  ],
  "summary": "Sneak into the Axis Officer's office while he is away at lunch, spend enough time inside unspotted to gather intelligence, then get out before he returns.",
  "special": [
   "Officer drives off in Kübelwagen",
   "Kübelwagen rotates on special card",
   "Unspotted Operator spends 4 AP"
  ],
  "needs": [
   "Core",
   "They Who Dare"
  ],
  "tags": [
   "Axis Officer",
   "Convoy",
   "Event window",
   "Vehicle patrols"
  ],
  "order": 10,
  "seriesSlug": "they-who-dare",
  "errata": []
 },
 {
  "id": "mb-p13",
  "source": "SAS Mission Book",
  "page": 13,
  "series": "They Who Dare",
  "number": "3",
  "title": "Panzer Hunters",
  "type": "Convoy",
  "operators": "4 + Willys Jeep, Hawker Typhoon + 4 SAS Support Units",
  "operatorCount": 4,
  "deck": "Green",
  "window": "18/6",
  "major": "14",
  "minor": "12",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 12,
  "layout": "4x3",
  "namedOperators": [
   "Nancy"
  ],
  "key": [
   "Operator Start",
   "SAS Support Unit Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Officer",
   "Axis Guard",
   "Axis Motorbike Scout",
   "Axis AA Gun",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry Tile"
  ],
  "objectives": [
   "Axis Truck Convoy",
   "Axis Panzer III Convoy",
   "Axis Half Track Convoy"
  ],
  "summary": "Ambush the westbound armoured convoy and destroy all five vehicles before it leaves the board, then escape.",
  "special": [
   "Special event card places convoy",
   "Armoured targets need explosives",
   "Hawker Typhoon support",
   "SAS Support Units",
   "Rowing boat"
  ],
  "needs": [
   "Core",
   "They Who Dare"
  ],
  "tags": [
   "Armour",
   "Axis Officer",
   "Convoy",
   "Event window",
   "Hawker Typhoon",
   "Rowing Boat",
   "SAS support units",
   "Willys Jeep"
  ],
  "order": 11,
  "seriesSlug": "they-who-dare",
  "errata": []
 },
 {
  "id": "mb-p14",
  "source": "SAS Mission Book",
  "page": 14,
  "series": "They Who Dare",
  "number": "4",
  "title": "Wunderwaffe",
  "type": "Espionage",
  "operators": "4 + Willys Jeep, Hawker Typhoon + 4 SAS Support Units",
  "operatorCount": 4,
  "deck": "Green",
  "window": "None",
  "major": "8",
  "minor": "5",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 12,
  "layout": "4x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "SAS Support Unit Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Half Track Patrol",
   "Axis Panzer III Guard",
   "Axis Panzer III Assault",
   "Axis AA Gun",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Safe Room"
  ],
  "summary": "Kill the Axis Officer, take his safe key, open the safe to get the plans, and carry them back to the entry tile.",
  "special": [
   "Safe key pickup from corpse",
   "Spend 4 AP in safe room",
   "Key and plans transferable",
   "Hawker Typhoon support",
   "SAS Support Units",
   "Rowing boat"
  ],
  "needs": [
   "Core",
   "They Who Dare"
  ],
  "tags": [
   "Armour",
   "Axis Officer",
   "Hawker Typhoon",
   "Intel",
   "Rowing Boat",
   "SAS support units",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 12,
  "seriesSlug": "they-who-dare",
  "errata": [
   "m-wunderwaffe"
  ]
 },
 {
  "id": "mb-p15",
  "source": "SAS Mission Book",
  "page": 15,
  "series": "They Who Dare",
  "number": "5",
  "title": "Unleashed",
  "type": "Raid",
  "operators": "4 + Willys Jeep, Support Willys Jeep + 4 SAS Support Units",
  "operatorCount": 4,
  "deck": "Green",
  "window": "None",
  "major": "18",
  "minor": "16",
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 12,
  "layout": "4x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "SAS Support Unit Start",
   "Willys Jeep",
   "Support Willys Jeep",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Half Track Patrol",
   "Axis Panzer III Guard",
   "Axis Kübelwagen Convoy",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Blow up the four supply dumps with explosives, kill all three Axis Officers, and escape through the entry tile.",
  "special": [
   "Supply dumps need explosives",
   "HQ officer flees by Kübelwagen on alarm",
   "Support Willys Jeep",
   "SAS Support Units"
  ],
  "needs": [
   "Core",
   "They Who Dare"
  ],
  "tags": [
   "Armour",
   "Axis Officer",
   "Convoy",
   "SAS support units",
   "Supply dumps",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 13,
  "seriesSlug": "they-who-dare",
  "errata": []
 },
 {
  "id": "mb-p16",
  "source": "SAS Mission Book",
  "page": 16,
  "series": "Heavy Metal",
  "number": null,
  "title": "Rolling Thunder",
  "type": "Convoy",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Heavy Metal",
  "window": "12/6",
  "major": "12",
  "minor": "10",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Axis Guard",
   "Axis Motorbike Scout",
   "Axis Troop Transport",
   "Truck Patrol",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Truck Convoy",
   "Axis Heavy Armoured Car Convoy"
  ],
  "summary": "Ambush the convoy and destroy its two Heavy Armoured Cars and two Trucks before it exits the board, then escape.",
  "special": [
   "Special event card places convoy",
   "Armoured targets need explosives",
   "Heavy Metal event deck"
  ],
  "needs": [
   "Core",
   "Heavy Metal"
  ],
  "tags": [
   "Armour",
   "Convoy",
   "Event window",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 14,
  "seriesSlug": "heavy-metal",
  "errata": []
 },
 {
  "id": "mb-p17",
  "source": "SAS Mission Book",
  "page": 17,
  "series": "Hot Dogs",
  "number": null,
  "title": "Seehund",
  "type": "Sabotage",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Hot Dogs",
  "window": "9/3",
  "major": "6",
  "minor": "5",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard Dog",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Flamethrower Half-Track Patrol",
   "Axis Flamethrower Half-Track Guard",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Exit Tile"
  ],
  "objectives": [
   "Seehund"
  ],
  "summary": "Destroy the docked Seehund mini-sub with explosives before it leaves, then get the Operators out through the exit tile.",
  "special": [
   "Seehund has 7 health",
   "Armoured target needs explosives",
   "Guard dogs",
   "Flamethrower half-tracks",
   "Hot Dogs event deck"
  ],
  "needs": [
   "Core",
   "Hot Dogs"
  ],
  "tags": [
   "Event window",
   "Guard dogs",
   "Vehicle patrols"
  ],
  "order": 15,
  "seriesSlug": "hot-dogs",
  "errata": []
 },
 {
  "id": "mb-p18",
  "source": "SAS Mission Book",
  "page": 18,
  "series": "Jäger",
  "number": null,
  "title": "The Great Raid",
  "type": "Raid",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Tan",
  "window": "None",
  "major": "16",
  "minor": "14",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Sturmboot Patrol",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Blow up all four supply dumps with explosives and kill both Axis Officers, then get the team back to the entry tile.",
  "special": [
   "Explosive weapons only vs dumps",
   "River with rowing boat",
   "Axis Sturmboot patrol"
  ],
  "needs": [
   "Core",
   "Jäger"
  ],
  "tags": [
   "Axis Officer",
   "Rowing Boat",
   "Supply dumps",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 16,
  "seriesSlug": "jager",
  "errata": []
 },
 {
  "id": "mb-p19",
  "source": "SAS Mission Book",
  "page": 19,
  "series": "Kickstarter",
  "number": null,
  "title": "Hellraisers",
  "type": "Raid",
  "operators": "2",
  "operatorCount": 2,
  "deck": "Kickstarter",
  "window": "None",
  "major": "10",
  "minor": "9",
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 4,
  "layout": "2x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "A small team sabotages a lightly held outpost: demolish three supply dumps with explosives, eliminate the officer and withdraw.",
  "special": [
   "Explosive weapons only vs dumps",
   "Fails below 9 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Axis Officer",
   "Supply dumps",
   "Vehicle patrols"
  ],
  "order": 17,
  "seriesSlug": "kickstarter",
  "errata": [
   "m-hellraisers"
  ]
 },
 {
  "id": "mb-p20",
  "source": "SAS Mission Book",
  "page": 20,
  "series": "Kickstarter",
  "number": null,
  "title": "End of the Road",
  "type": "Convoy",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Kickstarter",
  "window": "15/6",
  "major": "14",
  "minor": "12",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Truck Convoy",
   "Axis Stummel Half-Track Convoy"
  ],
  "summary": "Wreck all five convoy vehicles before they leave the board, then withdraw to the entry tile.",
  "special": [
   "Special event card places convoy",
   "Half-tracks need explosives",
   "Fails below 12 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Convoy",
   "Event window",
   "Rowing Boat",
   "Willys Jeep"
  ],
  "order": 18,
  "seriesSlug": "kickstarter",
  "errata": []
 },
 {
  "id": "mb-p21",
  "source": "SAS Mission Book",
  "page": 21,
  "series": "Kickstarter",
  "number": null,
  "title": "Hunted",
  "type": "Escape & Evade",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Kickstarter",
  "window": "None",
  "major": "4",
  "minor": "3",
  "stealth": {
   "easy": 6,
   "normal": 5,
   "hard": 4
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Fuel Barrel",
   "Axis Half-Track Guard",
   "Axis Motorbike Patrol",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Exit Tile"
  ],
  "objectives": [],
  "summary": "No targets to destroy: the Operators just slip past heavy Axis patrols and reach the waiting Jeep.",
  "special": [
   "Escape only, no objectives",
   "Fails below 3 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Vehicle patrols"
  ],
  "order": 19,
  "seriesSlug": "kickstarter",
  "errata": []
 },
 {
  "id": "mb-p22",
  "source": "SAS Mission Book",
  "page": 22,
  "series": "Kickstarter",
  "number": null,
  "title": "The Commando Order",
  "type": "Rescue",
  "operators": "5 + Willys Jeep*",
  "operatorCount": 5,
  "deck": "Kickstarter",
  "window": "15/3",
  "major": "5",
  "minor": null,
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Fuel Barrel",
   "Axis Half-Track Patrol",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Captured Operator"
  ],
  "summary": "One Operator starts captured. Reach and free him before the alarm or special event, then everyone escapes.",
  "special": [
   "5th Operator starts captured",
   "Captured Operator shot if not freed",
   "Fails below 5 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Captive",
   "Event window",
   "Rowing Boat",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 20,
  "seriesSlug": "kickstarter",
  "errata": []
 },
 {
  "id": "mb-p23",
  "source": "SAS Mission Book",
  "page": 23,
  "series": "Kickstarter",
  "number": null,
  "title": "Highwaymen",
  "type": "Convoy",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Kickstarter",
  "window": "12/6",
  "major": "12",
  "minor": "10",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Axis Guard",
   "Axis Half-Track Guard",
   "Axis Motorbike Scout",
   "Axis Motorbike Convoy",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Truck Convoy"
  ],
  "summary": "Ambush the supply convoy and destroy its four trucks before it leaves the board, then pull out.",
  "special": [
   "Special event card places convoy",
   "Fails below 10 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Convoy",
   "Event window",
   "Willys Jeep"
  ],
  "order": 21,
  "seriesSlug": "kickstarter",
  "errata": []
 },
 {
  "id": "mb-p24",
  "source": "SAS Mission Book",
  "page": 24,
  "series": "Kickstarter",
  "number": null,
  "title": "Ungentlemanly Warfare",
  "type": "Assassination",
  "operators": "4 + Willys Jeep",
  "operatorCount": 4,
  "deck": "Kickstarter",
  "window": "12/6",
  "major": "8",
  "minor": "7",
  "stealth": {
   "easy": 9,
   "normal": 8,
   "hard": 7
  },
  "tiles": 9,
  "layout": "3x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Willys Jeep",
   "Axis Guard",
   "Axis Half-Track Guard",
   "Axis Kübelwagen Convoy",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer"
  ],
  "summary": "Kill both Axis Officers before a staff car can carry either off the board, then escape.",
  "special": [
   "Special event card places Kübelwagen",
   "Officer boards car and drives off",
   "Fails below 7 victory points"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Axis Officer",
   "Convoy",
   "Event window",
   "Willys Jeep"
  ],
  "order": 22,
  "seriesSlug": "kickstarter",
  "errata": []
 },
 {
  "id": "mb-p25",
  "source": "SAS Mission Book",
  "page": 25,
  "series": "Black Box",
  "number": "1",
  "title": "Silent Night Part 1",
  "type": "Raid",
  "operators": "3",
  "operatorCount": 3,
  "deck": "Maroon",
  "window": "None",
  "major": "9",
  "minor": "8",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 6,
  "layout": "3x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Rowing Boat",
   "Axis Guard",
   "Axis Half-Track Patrol",
   "Fuel Barrel",
   "Mixed Spawn Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Destroy the supply dumps and kill the officer on this board, then exit via the east edge, in sync with the second board.",
  "special": [
   "Played simultaneously with Part 2",
   "Alarm shared between both boards",
   "Escape via east board edge",
   "Mixed spawn tile"
  ],
  "needs": [
   "Core"
  ],
  "tags": [
   "Axis Officer",
   "Rowing Boat",
   "Supply dumps",
   "Vehicle patrols"
  ],
  "order": 23,
  "seriesSlug": "black-box",
  "errata": []
 },
 {
  "id": "mb-p26",
  "source": "SAS Mission Book",
  "page": 26,
  "series": "Black Box",
  "number": null,
  "title": "Silent Night Part 2",
  "type": "Raid",
  "operators": "3",
  "operatorCount": 3,
  "deck": "Kickstarter",
  "window": "None",
  "major": "9",
  "minor": "8",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 6,
  "layout": "3x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Blow up two supply dumps with explosives, eliminate the Axis Officer, then leave by the west board edge. A twin mission is played at the same time, and the alarm is shared.",
  "special": [
   "Played simultaneously with Silent Night Part 1",
   "Alarm shared between both boards",
   "Dumps need explosive weapons",
   "Exit via west board edge"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Axis Officer",
   "Supply dumps",
   "Vehicle patrols"
  ],
  "order": 24,
  "seriesSlug": "black-box",
  "errata": []
 },
 {
  "id": "mb-p27",
  "source": "SAS Mission Book",
  "page": 27,
  "series": "Black Box",
  "number": null,
  "title": "The Great Escape",
  "type": "Escape & Evade",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Kickstarter",
  "window": "None",
  "major": "4",
  "minor": "3",
  "stealth": {
   "easy": 7,
   "normal": 6,
   "hard": 5
  },
  "tiles": 12,
  "layout": "4x3",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Truck",
   "Axis Officer",
   "Axis Guard",
   "Axis Motorbike Patrol",
   "Axis Motorbike Guard",
   "Fuel Barrel",
   "Ladder Top",
   "Ladder Bottom",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Exit Tile"
  ],
  "objectives": [
   "Store Room"
  ],
  "summary": "Break out of the prison building, recover confiscated kit from the store room, and get every Operator off the map to the exit tile.",
  "special": [
   "Each Operator spends 4 AP in store room",
   "Equipment unusable until reclaimed",
   "Ladder squares adjacent",
   "Separate interior prison tile"
  ],
  "needs": [
   "Core",
   "Kickstarter"
  ],
  "tags": [
   "Axis Officer",
   "Ladders",
   "Vehicle patrols"
  ],
  "order": 25,
  "seriesSlug": "black-box",
  "errata": []
 },
 {
  "id": "mb-p28",
  "source": "SAS Mission Book",
  "page": 28,
  "series": "Black Box",
  "number": null,
  "title": "Rogue Two",
  "type": "Espionage",
  "operators": "6 + Willys Jeep, Hawker Typhoon + 4 SAS Support Units",
  "operatorCount": 6,
  "deck": "Kickstarter",
  "window": "None",
  "major": "12",
  "minor": "7",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 12,
  "layout": "4x3",
  "namedOperators": [
   "Nancy"
  ],
  "key": [
   "Operator Start",
   "SAS Support Unit Start",
   "Willys Jeep",
   "Rowing Boat",
   "Axis Guard",
   "Axis Officer",
   "Axis Sturmboot Patrol",
   "Axis AA Gun Truck Patrol",
   "Axis Panzer III Guard",
   "Axis AA Gun",
   "Fuel Barrel",
   "Ladder Top",
   "Ladder Bottom",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "The Plans"
  ],
  "summary": "Sneak into the defended compound, steal the secret weapon plans, and carry them back to the entry/exit tile with as many Operators as possible alive.",
  "special": [
   "SAS Support Units",
   "Hawker Typhoon support",
   "Ladder squares adjacent",
   "Separate interior facility tile",
   "River with boats"
  ],
  "needs": [
   "Core",
   "They Who Dare",
   "Jäger",
   "Kickstarter"
  ],
  "tags": [
   "Armour",
   "Axis Officer",
   "Hawker Typhoon",
   "Intel",
   "Ladders",
   "Rowing Boat",
   "SAS support units",
   "Vehicle patrols",
   "Willys Jeep"
  ],
  "order": 26,
  "seriesSlug": "black-box",
  "errata": []
 },
 {
  "id": "decl-p2",
  "source": "SAS Declassified",
  "page": 2,
  "series": "Heavy Metal",
  "number": null,
  "title": "Over & Out Redux",
  "type": "Escape & Evade",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Heavy Metal",
  "window": "None",
  "major": "4",
  "minor": null,
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Axis Troop Transport Truck Patrol",
   "Fuel Barrel",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Exit Tile"
  ],
  "objectives": [],
  "summary": "Get all Operators across the river past reinforced Axis security and out through the exit tile at the Willys Jeep.",
  "special": [
   "Playable with base game components",
   "Swap Troop Transport for Half-Track patrol",
   "River crossing"
  ],
  "needs": [
   "Core",
   "Heavy Metal"
  ],
  "tags": [
   "Vehicle patrols"
  ],
  "order": 27,
  "seriesSlug": "heavy-metal",
  "errata": []
 },
 {
  "id": "decl-p3",
  "source": "SAS Declassified",
  "page": 3,
  "series": "Heavy Metal",
  "number": null,
  "title": "Slaughter & Scarper",
  "type": "Raid",
  "operators": "4",
  "operatorCount": 4,
  "deck": "Heavy Metal",
  "window": "None",
  "major": "12",
  "minor": "10",
  "stealth": {
   "easy": 8,
   "normal": 7,
   "hard": 6
  },
  "tiles": 8,
  "layout": "4x2",
  "namedOperators": [
   "Jock"
  ],
  "key": [
   "Operator Start",
   "Axis Guard",
   "Fuel Barrel",
   "Axis Motorbike Patrol",
   "White Spawn Tile",
   "Black Spawn Tile",
   "Operator Entry/Exit Tile"
  ],
  "objectives": [
   "Axis Officer",
   "Supply Dump"
  ],
  "summary": "Demolish three supply dumps with explosives, kill the Axis Officer, and bring the team back out through the entry/exit tile.",
  "special": [
   "Dumps need explosive weapons",
   "Operators start at entry/exit tile"
  ],
  "needs": [
   "Core",
   "Heavy Metal"
  ],
  "tags": [
   "Axis Officer",
   "Supply dumps",
   "Vehicle patrols"
  ],
  "order": 28,
  "seriesSlug": "heavy-metal",
  "errata": []
 }
];

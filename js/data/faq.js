// Official FAQ and errata for SAS: Rogue Regiment, from the "SAS FAQ - Errata" sheet by Robert Butler (Word Forge Games).
// Wording follows the source sheet.

export const FAQ_SOURCE = 'SAS FAQ & Errata sheet (Word Forge Games)';

export const FAQ = [
  { id: 'overview', title: 'Overview', items: [
    { id: 'alarm', q: 'When does the alarm sound?', a: 'The alarm sounds when either the stealth tracker reaches the alarm symbol or an explosive weapon (a weapon with an alarm symbol as its earshot range) is used. This includes exploding fuel barrels.' },
    { id: 'axis-los', q: "What is the range of an Axis unit's LOS?", a: 'Axis units have a 90 degree field of view to their front, for a distance of 8 squares. Additionally they can see one adjacent square to their left and right.' },
    { id: 'spotted', q: 'When is an Operator spotted?', a: 'If an Operator carries out an action within Axis LOS they are spotted (unless the action results in the Axis unit being killed). If an Axis unit rotates and gains LOS to an Operator for any reason (a loud weapon, sprint action, event card, or a failed attack) the Operator is spotted. If during the course of its movement, a patrol gains LOS to an Operator, the Operator is spotted. If an Operator carries out an assassination attack and the target of the attack is within the LOS of another Axis unit, the Operator is spotted.' },
    { id: 'move-through', q: 'Can Operators move through squares containing Axis units?', a: 'Yes, and likewise Axis units can move through squares containing Operators, providing that the Operator or Axis unit can finish their turn in an unoccupied square.' },
    { id: 'elevation', q: 'Are hedge, crate and the first row of rock squares fully visible?', a: 'Yes, these squares are considered to be at a higher elevation so always fully visible unless something blocks LOS (e.g. another rock square).' },
    { id: 'rock-out', q: 'Can an Operator see out of a rock square?', a: 'Yes, unless something blocks LOS (e.g. another rock square).' },
  ] },
  { id: 'operator-phase', title: 'Operator Phase', items: [
    { id: 'sprint-earshot', q: 'Where is earshot range of the sprint action measured from?', a: 'Sprint action earshot is measured from each of the squares that the Operator moves into (not the starting square).' },
    { id: 'op-cover', q: 'Are Operator attacks on Axis units ever modified for cover?', a: 'No, cover modifiers are only applied when Axis units attack Operators adjacent to low cover.' },
    { id: 'assassinate-wall', q: 'Can an assassination attack be made over a low wall?', a: 'Yes, assassination attacks can be made over low walls and through windows.' },
    { id: 'move-attack-corpse', q: 'Can the move & attack action be used to assassinate and then move into the square containing the corpse to pick it up?', a: 'Yes.' },
    { id: 'mark-barrel', q: 'Can the mark target action be used on fuel barrels?', a: 'Yes.' },
    { id: 'mark-crouch', q: 'Can an Operator crouch after marking a target?', a: 'No.' },
    { id: 'mark-aim', q: 'Can the mark target action be combined with the take aim action?', a: 'No, as marked attacks can only take place during the Axis Advance Phase, Event Phase or the Axis Patrol Phase. Note that a crouched Operator cannot use a mark target action.' },
    { id: 'mark-reaction', q: "Do Axis units make reaction attacks in response to an Operator's marked attack?", a: 'No.' },
    { id: 'item-occupied', q: 'Can an item be placed into an occupied square?', a: 'Yes. Note that traps and mines are triggered when Axis units "move into" the square so placing into an occupied square will not trigger them.' },
  ] },
  { id: 'objects', title: 'Objects & Equipment', items: [
    { id: 'trap-los', q: 'If an Axis unit gains LOS on an Operator at the same time as stepping into the square containing the trap, is the Operator spotted?', a: 'No, the Operator is not spotted and the Axis unit does not flip to alert or shout a warning.' },
    { id: 'speargun', q: 'As attacks with the Speargun are classed as assassinations, can it still be used if the Operator is spotted?', a: 'Yes, as the Speargun does not require the Operator to sneak up on Axis units it can still be used. Additionally, it is not a requirement that the Operator is positioned in the square directly behind the target.' },
    { id: 'scuba-crouch', q: 'When using Scuba gear can Anders exit the water crouched?', a: 'Yes, if the Operator is exiting the water with a move action (not sprint) the scuba token can be swapped for his regular token in either standing or crouched mode.' },
    { id: 'explosion-facing', q: 'When an explosion triggers the alarm do Axis units turn to face the explosion?', a: 'No, Axis units never turn to face explosions. If an explosion triggers the alarm they flip to alert, maintaining current facing. Players must then nominate an Operator to be spotted (if there are no spotted Operators on the board already).' },
    { id: 'walls-blast', q: 'Do walls block explosive weapons such as grenades, mines or bombs?', a: 'No, any Axis units under the blast template can have successful attack rolls allocated to them.' },
    { id: 'chain-explosion', q: 'Do explosions set off other explosive weapons?', a: 'Attacks from explosive weapons may be allocated to fuel barrels to detonate them, but bombs & mines cannot be detonated in this manner.' },
  ] },
  { id: 'op-vehicles', title: 'Operator Vehicles', items: [
    { id: 'deploy-ap', q: 'Can Operators deployed from a vehicle use their normal 4AP in the same turn?', a: 'Yes. Operators deployed from a vehicle can move and fight in the same turn.' },
    { id: 'move-full', q: 'Does a vehicle using a move action have to move the full amount of squares stated for the action?', a: 'No, it can move "up to" the stated amount.' },
    { id: 'gunner-seat', q: 'Does a vehicle need to have an Operator in the appropriate gunners seat to use the attack action?', a: 'Yes, to use the rear gun on the Willys Jeep there would need to be an Operator in the rear gunners seat.' },
    { id: 'leave-map', q: 'Can Operator vehicles partially leave the map to drive around obstacles?', a: 'Yes, Operator vehicles can do this in the same manner as Axis vehicles.' },
    { id: 'inside-actions', q: 'Can Operators take their normal actions while inside vehicles, such as attacking?', a: 'No.' },
  ] },
  { id: 'twd', title: 'They Who Dare', items: [
    { id: 'nancy-interaction', q: 'When Nancy ends an interaction does the Axis unit turn back to face its patrol line / sentry point?', a: 'No, the Axis unit will maintain its facing (and in the case of patrolmen no longer facing their patrol line, not move) until an event card indicates that they should rotate.' },
    { id: 'nancy-garotte', q: 'Can Nancy abandon the garotte and leave the victim alive?', a: 'Yes but the Axis unit would turn, flip to alert & shout. Nancy would be spotted and immediately attacked.' },
  ] },
  { id: 'advance', title: 'Axis Advance Phase', items: [
    { id: 'alert-no-target', q: 'What do alert Axis units do if they are not on patrol lines or sentry points and there are no spotted Operators on the board?', a: 'In this rare circumstance the Axis units will follow the rules for guards (maintain current facing unless reacting to earshot or another Operator is spotted) until they are either killed or the alarm sounds.' },
    { id: 'sentries-sections', q: 'Do sentries behave differently in the Stealth and Battle Sections?', a: 'Yes, in the Stealth Section sentries will leave their points to advance on spotted Operators whereas during the Battle Section, sentries still on a point will only abandon it if there are no other Axis units available to advance.' },
  ] },
  { id: 'event', title: 'Event Phase', items: [
    { id: 'cigarette-vehicle', q: 'Can the cigarette token be used on a vehicle?', a: 'No, only Axis Infantry and Officers.' },
    { id: 'spawn-attack', q: 'Can Axis units on a spawn tile attack or be attacked?', a: 'No, Axis units on spawn tiles in both the Stealth Section and Battle Section can only attack or be attacked once they have entered the board.' },
  ] },
  { id: 'attack', title: 'Axis Attack Phase', items: [
    { id: 'axis-attack-alert', q: 'Do attacks made by Axis units alert other Axis units or advance the stealth meter?', a: 'No, only "loud" attacks by Operators alert Axis units and advance the stealth meter (attacks using weapons with an earshot value greater than 0).' },
  ] },
  { id: 'end', title: 'End Phase', items: [
    { id: 'multi-criteria', q: 'If the alarm sounds in the end phase due to multiple criteria being met (e.g. alert Axis units AND the presence of the Willys Jeep) are all Operators meeting criteria spotted?', a: 'Yes. In the case stated above both Operators in the Willys AND the closest Operator to alert Axis units would be spotted.' },
  ] },
  { id: 'axis-vehicles', title: 'Axis Vehicles', items: [
    { id: 'vehicle-low-wall', q: 'Do Axis vehicles see over low walls when adjacent or looking down the length of them?', a: 'Yes, a vehicle adjacent to a low wall or with a low wall in line with the left or right side of its occupied squares has full visibility just like infantry units.' },
    { id: 'vehicle-los', q: "When attacking an Axis vehicle which square needs to be within my Operator's LOS?", a: 'Operators only need LOS to a single square containing a vehicle to make an attack.' },
  ] },
  { id: 'axis-units', title: 'Axis Units', items: [
    { id: 'mortar-dump', q: 'Will a Mortar Team attack if there is risk of hitting a supply dump?', a: 'No, Mortar Teams treat supply dumps like Axis units and will not attack Operators within 7 squares of them.' },
    { id: 'mortar-assassinate', q: 'Can an assassination attack be used against a Mortar Team?', a: 'Yes, but the attack will only kill one of the units, the remaining unit will flip to alert and the Operator is spotted.' },
  ] },
];

export const ERRATA = [
  { id: 'rb-10', group: 'Rule book', where: 'Page 10', text: 'In the Officer LOS diagram the second hedge square from the left should be fully visible.' },
  { id: 'rb-11', group: 'Rule book', where: 'Page 11', text: "Paddy's token should be showing the crouched side in the blind fire diagram." },
  { id: 'rb-17', group: 'Rule book', where: 'Page 17', text: "Jock's token should be the spotted version in all of the Axis Attack Phase diagrams." },
  { id: 'm-wunderwaffe', group: 'Missions', where: 'They Who Dare 4 - Wunderwaffe', mission: 'mb-p14', text: 'In the map key "Axis Panzer II Assault" should be "Axis Panzer III Assault".' },
  { id: 'm-hellraisers', group: 'Missions', where: 'Kickstarter - Hellraisers', mission: 'mb-p19', text: 'In the map key "Axis Motorbike Convoy" should be "Axis Motorbike Patrol".' },
  { id: 'henri', group: 'Other', where: "Henri's Operator board", text: 'Kickstarter Operator "Henri" has an error on both sides of his Operator board. The stick grenade should have a range of 6 just like the regular grenade.' },
];

# SAS: Rogue Regiment mission designer

A fan-made mission designer for SAS: Rogue Regiment, the solo and co-operative WW2 stealth game designed by Robert Butler and published by Word Forge Games.

Live at https://sas.skirmishgames.app

## What it does

- Build a map from the game's double-sided tiles (1A to 12B, plus the bunker). The tool stops you using both sides of the same tile.
- Place spawn tiles, the Operator entry/exit tile, Operators, Axis guards and officers, items, objective tiles and vehicles.
- Give each Axis vehicle a role: patrol, convoy, guard, assault or scout. The border colour and key label follow the mission book.
- Draw patrol and convoy routes square by square.
- Fill in the briefing, victory points, recommended setup and stealth tracker.
- See and print a mission sheet laid out like the mission book, with the key built from the pieces on the map.
- Missions save in the browser. Export a mission file, a share link, the sheet as PNG, or the map on its own.

Works on phones and desktop. Nothing is sent to a server.

## Credits

SAS: Rogue Regiment, its tile and token art belong to Robert Butler and Word Forge Games and are used with permission. Piece art comes from the community map editor toolkits: the TileSystem SAS set by Magnus G (MagWiz), and the SAS Map Editor by Paul Manley with additions by Paolo Roscio. Fonts: Russo One and Lato (SIL Open Font License).

Made by Ivan (https://boardgamegeek.com/profile/slyfoxbgg). Contact: skirmishgames.app@gmail.com

## Development

Static site, no build step.

```
python3 -m http.server 8765      # serve locally
node tools/stamp.js              # version CSS and JS links before a release
node test/smoke.js http://localhost:8765/   # Playwright smoke test, desktop and phone
```

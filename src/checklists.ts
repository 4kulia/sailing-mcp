export interface ChecklistSection {
  title: string;
  /** Free-form rules/notes that precede the numbered items. */
  notes?: string[];
  items: string[];
}

export interface Checklist {
  id: string;
  title: string;
  summary: string;
  credit?: string;
  sections: ChecklistSection[];
}

export const CHECKLIST_IDS = [
  "charter_checkin",
  "safety_briefing",
  "pre_departure",
  "heavy_weather",
  "charter_checkout",
] as const;

export type ChecklistId = (typeof CHECKLIST_IDS)[number];

const CHARTER_CHECKIN: Checklist = {
  id: "charter_checkin",
  title: "Charter check-in checklist (1–2 weeks bareboat charter)",
  summary:
    "Full boat acceptance checklist for taking over a bareboat charter yacht: deck, interior, safety gear, engine, electronics and the conversation with the charter manager.",
  credit:
    'Based on the check-in list by Dima Ryzhov (telegram channel "Kapitan Bayan"), edited by Alexander Dragoni.',
  sections: [
    {
      title: "General rules",
      items: [
        "Best of all: arrive a day before the charter starts; have a look at the yacht and talk to the previous crew",
        "Do not rush",
        "Keep personal belongings on the boat to a minimum during check-in",
        "Involve the first mate in checking critical systems and equipment; give inexperienced crew members something simple — water, lights or power sockets",
        "Your own checklist first, the charter company's checklist after",
        "Photograph everything and save the photos to the cloud",
        "In a notebook, sketch the locations of important systems and equipment (fuses, tank selector valves, shore-power breaker, etc.)",
      ],
    },
    {
      title: "Part 1. Preparation",
      items: [
        "Check battery voltage, disconnect shore power and switch on lights and navigation electronics in addition to the fridge; check the voltage again after an hour",
        "Switch on the fridge, assess its volume, check its water drain",
        "Check the water level in the bilges",
        "Check all pumps in the heads",
        "Wipe the engine drip tray completely dry",
        "Provisions on board: food/water, spices, cleaning products, toilet paper",
      ],
    },
    {
      title: "Part 2. On deck — hull",
      items: [
        "Topsides, bow, stern — any visible chips and scratches",
        "Below the waterline: dive, check with a GoPro, or ask for a survey (*if needed)",
      ],
    },
    {
      title: "Part 2. On deck — upper deck, everything from bow to stern",
      items: [
        "Deck filler caps: identify all of them (water, fuel, holding tanks)",
        "Condition of the anchor and chain; how to drop the anchor manually (with the engine running)",
        "Condition of lifelines, stanchions, pushpit/pulpit rails; strength of the cleats",
        "Standing rigging: tension of shrouds and stays, condition of turnbuckles",
        "Running rigging: lines, tracks, cars, winches and handles, clutches, flag halyards",
        "Special attention(!) to the headsail furler drum and wrap, the gooseneck fitting and the mainsheet/boom attachment",
        "Blocks and deck hardware: integrity, attachment",
        "Open the sails if the wind allows",
        "Steering: steering cables, rudder play, centre mark, wheel locks, equal rudder angle left = right",
        "Sprayhood, bimini: damage above and underneath (open/close them if in doubt)",
        "Rescue equipment (danbuoy, horseshoe buoys with lines, emergency ladder for recovery from the water)",
        "Fenders: count and check them",
        "Scuppers (cockpit drain openings)",
        "Passerelle/gangway, transom, swim ladder",
        "Solar panels",
      ],
    },
    {
      title: "Part 2. On deck — cockpit and lockers",
      items: [
        "Manual bilge pump",
        "Deck shower and tap",
        "Gas bottles (count, weigh, check volume and the locker)",
        "Liferaft: ease of possible activation, check the service date, painter attachment point",
        "Dinghy: pump (try topping the dinghy up), oars and rowlocks, seat, outboard motor (start it, check forward/reverse), petrol/oil (2-stroke/4-stroke) + spare fuel can",
        "Emergency tiller — test it",
        "Boat hook — test it",
        "Spare anchor (*+ chain)",
        "Mooring lines: number, length, condition",
        "Water hose and adapters",
        "220V shore-power cable (+ breaker + adapters)",
        "Day shapes: anchor ball, motoring cone",
        "Anchor chain snubber/lock, lead line",
        "All the small stuff (*use the charter company's checklist afterwards)",
      ],
    },
    {
      title: "Part 3. Inside — main check: open everything",
      items: [
        "Hatches and portlights: open-close, pour water over them (bucket + towel)",
        "Lift all floorboards. Keel bolts, seacocks, fittings, valves, hoses",
        "Doors, lockers, cabin lighting, power sockets, curtains and mosquito nets on the portlights",
        "Batteries: location, fuses, mounting, charge indicators",
        "Water and fuel tanks: location, levels, switching between tanks",
        "Gas: stove + gimbal lock, valves, hoses",
        "Engine: WOBBLE (Water-Oil-Belts-Bilge-Exhaust), transmission, manual shut-off, fuel valve",
        "First run the transmission for 5 minutes at low revs — then check the oil condition. Engine start and electronics checks are best done with the technician",
        "Heads: fresh water, shower and toilet pumps (+ the 12V fuse), holding tanks (where fitted)",
        "Boiler / water heater (*switch on shore power)",
        "Electric bilge pump (all modes)",
        "Bed linen, galley crockery",
      ],
    },
    {
      title: "Part 3. Inside — safety",
      items: [
        "Lifejackets and safety harnesses (count them, check the firing indicators, unscrew the gas cylinders and screw them back in)",
        "Fire: extinguishers (location, type, expiry date), fire blanket, smoke and gas detectors",
        "EPIRB",
      ],
    },
    {
      title: "Part 3. Inside — spares, tools, sundries",
      items: [
        "Grab bag (location, contents)",
        "Engine spares: impeller (+ screwdriver + grease), belt, filters (fuel, oil, + removal tool)",
        "Tool box (rigging cutters!)",
        "Drogue / sea anchor (*if needed)",
        "First aid kit (+ your own)",
        "Bosun's chair",
        "Softwood emergency plugs (+ try them for fit)",
        "Keys for fuel and water filler caps and for the boat; water and electricity adapters",
        "Paper charts + accessories, pilot books, instrument manuals",
        "Hand-bearing compass, binoculars, torch + batteries",
        "Documents: registration, transit log, charter contract, insurance, crew list (x100 if needed), dates",
        "Find the MMSI and call sign (if not posted, find them in the insurance papers and stick them next to the VHF)",
        "Flags: courtesy flags and signal flags C, N, Q (*if needed)",
        "Pyrotechnics: red handheld flares x5, orange smoke x2, parachute rockets x2 (+ expiry dates, + how to use them)",
        "Fog horn",
        "Dinghy repair kit",
        "Duct/insulating tape, sealant, cable ties, WD-40",
      ],
    },
    {
      title: "Part 4. Engine start",
      items: [
        "Check battery voltage",
        "Engine check: write down the engine hours, start the engine, try all gears, prop walk, tachometer",
        "Bow thruster: type (+ fuse)",
        "Anchor windlass + fuse",
        "Sail-drive oil",
      ],
    },
    {
      title: "Part 5. Electronics and instruments",
      items: [
        "Chartplotter: settings, MOB button, depth sounder reference point (keel/waterline offset)",
        "Radar, AIS",
        "Autopilot: test it",
        "Wind instrument (anemometer/wind vane)",
        "VHF (volume, squelch, distress button + test with the handheld radio)",
        "Navigation lights (*after dark)",
        "Instrument backlighting",
        "Steering compass, check deviation*",
        "Air conditioning + fuse",
        "Webasto / diesel heater (+ 12V fuse)",
        "Inverter (+ 12V fuse)",
        "Sound system / music",
      ],
    },
    {
      title: "Part 6. With the charter manager — rules",
      notes: ["Critical = safety and basic comfort."],
      items: [
        "Insist on fixing critical defects",
        "Do not insist on non-critical ones",
        "Record in writing anything that was not checked (sails, underwater hull, watermaker, lights, etc.)",
      ],
    },
    {
      title: "Part 6. With the charter manager — questions",
      items: [
        "Tell me about the boat's main known problems",
        "Discuss everything still open on the checklist",
        "Water and fuel level gauges, tank volume and shape, holding tanks",
        "Anchor chain: length and markings (*drop the anchor with caution the first time)",
        "Draft of the boat, air draft (mast clearance)",
        "Charter company contacts (whom to call and when)",
        "Ask for the list of documents required by the authorities, and about the logbook",
        "Useful information about the boat and the region",
        "Phone numbers of rescue services and the coastguard",
      ],
    },
  ],
};

const SAFETY_BRIEFING: Checklist = {
  id: "safety_briefing",
  title: "Crew safety briefing (before leaving the dock)",
  summary:
    "Skipper's safety brief for a new crew: personal safety gear, moving around the boat, man overboard, fire and gas, emergency equipment, radio, life below deck and skipper incapacitation.",
  sections: [
    {
      title: "Personal safety",
      items: [
        "Lifejackets: where they are stowed, how to adjust the fit, how to put one on, manual inflation tube and firing handle",
        "When lifejackets are mandatory: skipper's rules (e.g. on deck under way, at night, in fog, in rough weather, for non-swimmers and children always)",
        "Harnesses and tethers: how to clip on, jackstay runs and strong clipping points, when clipping on is required (night, heavy weather, leaving the cockpit)",
        "One hand for yourself, one for the boat; move on the windward side, stay low",
        "Footwear and clothing: non-slip shoes on deck, warm/waterproof layers accessible",
        "Seasickness: tell the skipper early, take medication in advance, stay on deck looking at the horizon, be sick over the LEEWARD side",
        "Sun protection: hat, sunscreen, drink enough water",
      ],
    },
    {
      title: "Moving around the boat",
      items: [
        "The boom is dangerous: keep your head below it, beware of accidental gybes, listen for 'ready about' / 'gybe-ho' commands",
        "Winches and loaded lines: never wrap a line around your hand, keep fingers clear of winch drums, how to ease a loaded sheet safely",
        "Do not hold on to lifelines, running rigging or the sprayhood frame as your only support",
        "Companionway: go down facing the ladder, keep washboards and hatch in place at sea, one person at a time",
        "Hatches and portlights closed at sea; check before heeling or motoring into waves",
        "Where crew may and may not sit under way (foredeck, coachroof, transom)",
      ],
    },
    {
      title: "Man overboard (MOB)",
      items: [
        "Whoever sees it shouts 'MAN OVERBOARD' loudly and keeps pointing at the casualty without taking their eyes off them",
        "Press the MOB button on the chartplotter",
        "Throw the danbuoy / horseshoe buoy / anything that floats towards the casualty",
        "Skipper (or helm) performs the recovery manoeuvre; crew follow the skipper's commands",
        "How the casualty is brought back on board: swim ladder, halyard + winch, recovery sling; engine in NEUTRAL when the casualty is near the propeller",
        "If the skipper is the one overboard: who takes command and what they do first (see 'If the skipper is incapacitated')",
      ],
    },
    {
      title: "Fire and gas",
      items: [
        "Fire extinguisher locations, types and how to use them (aim at the base of the flames)",
        "Fire blanket location (galley) and how to use it on a pan fire",
        "Engine compartment fire port: where it is and how to discharge an extinguisher through it without opening the compartment",
        "Gas routine: turn the gas off at the bottle (and at the valve) after every use; where the bottle and the shut-off valves are",
        "What to do if you smell gas: no switches, no flames, ventilate, pump the bilge by hand, tell the skipper",
        "Smoking policy; no naked flames below deck",
      ],
    },
    {
      title: "Emergency equipment",
      items: [
        "Liferaft: where it is, how to launch it (painter attached, throw to leeward, pull the painter to inflate) — only abandon ship on the skipper's order, step UP into the raft",
        "Grab bag: location and contents",
        "Flares: where they are stowed, which type to use when, how to fire them (read the instructions now, not in the emergency)",
        "EPIRB and/or PLB: location and how to activate",
        "First aid kit location; who on board has medical training",
        "Manual and electric bilge pumps: locations, handles, how to operate",
        "Seacocks and softwood plugs: locations, how to close them in case of flooding",
        "Emergency tiller: where it is and how to fit it",
        "Bolt cutters / rigging cutters: where they are (in case of dismasting)",
      ],
    },
    {
      title: "Radio and calling for help",
      items: [
        "VHF: how to switch it on, channel 16 for distress and calling, how to transmit",
        "DSC distress button: where it is, when and how to press it (lift the cover, hold 5 seconds)",
        "MAYDAY procedure: the script/card is posted at the nav station — boat name, call sign, MMSI, position, nature of distress, people on board",
        "Boat name, call sign and MMSI: where they are written down",
        "Coastguard / rescue phone numbers and the charter company emergency number (saved in phones)",
        "Position: how to read lat/long from the chartplotter for a distress call",
      ],
    },
    {
      title: "Below deck",
      items: [
        "Heads: how to operate the pump/valves, NOTHING goes in that hasn't been eaten first (except marine toilet paper), holding tank valve positions",
        "Galley: stove gimbal and crash bar, kettle/pan clamps, never leave the stove unattended under way",
        "Electrical panel: which breakers matter (nav lights, instruments, bilge pump, fridge), battery monitor basics",
        "Fresh water is limited: short showers, taps off, washing-up rules",
        "Where to stow personal gear so nothing flies in a seaway; keep companionway and side decks clear",
      ],
    },
    {
      title: "If the skipper is incapacitated",
      items: [
        "Who is second in command",
        "How to stop the boat: heave-to or drop/furl sails and motor slowly; engine start/stop procedure",
        "How to call for help: DSC distress button + MAYDAY on channel 16 (script at the nav station)",
        "Where the ship's papers, crew list and insurance documents are kept",
      ],
    },
  ],
};

const PRE_DEPARTURE: Checklist = {
  id: "pre_departure",
  title: "Pre-departure checks (daily, before leaving the berth or anchorage)",
  summary:
    "Daily routine before getting under way: weather and passage plan, engine WOBBLE checks, deck preparation, securing below and briefing the crew.",
  sections: [
    {
      title: "Weather and plan",
      items: [
        "Get the latest weather forecast (wind, gusts, waves, visibility, thunderstorms) and check it against actual observations",
        "Tides, currents and tidal gates for the route; bridge and lock opening times if relevant",
        "Passage plan: route, hazards, waypoints, ETA in daylight, ports of refuge / alternates",
        "Check Notices to Skippers / navigational warnings for the area",
        "Tell someone ashore (or the marina/charter base) where you are going and when you expect to arrive",
      ],
    },
    {
      title: "Engine and systems (WOBBLE)",
      items: [
        "W — Water: coolant level; raw-water seacock open, strainer clean",
        "O — Oil: engine oil level (and gearbox/sail-drive if accessible)",
        "B — Belts: tension and condition, no black dust",
        "B — Bilge: dry, no new oil/water/fuel; bilge pump working",
        "E — Exhaust: after starting, confirm cooling water flows from the exhaust",
        "Fuel: tank level sufficient for the passage plus reserve (rule of thirds); water separator/pre-filter checked",
        "Batteries: voltage checked, switch on the correct banks",
        "Steering: full and free movement of the wheel/tiller; autopilot engages",
      ],
    },
    {
      title: "On deck",
      items: [
        "Rig visual check: shrouds, pins, split rings, halyards not fouled or wrapped",
        "Sails ready: cover off / lazy jacks set, reef chosen for the forecast, sheets led and free",
        "Anchor secured for sea (or ready to drop if manoeuvring in tight waters)",
        "Dinghy: hoisted, secured on deck or streamed on a proper towline; outboard secured",
        "Deck clear: lines coiled, nothing to trip over or fall overboard",
        "Fenders and mooring lines: plan for slipping them, crew tasked; stow them once clear",
        "Navigation lights and day shapes as required",
        "Instruments on: chartplotter, depth, log, wind, VHF on channel 16",
      ],
    },
    {
      title: "Below deck",
      items: [
        "Everything stowed and secured; lockers latched, floorboards in place",
        "Hatches and portlights closed and dogged",
        "Galley secure: gas off at the bottle, kettle/pots stowed, thermos filled for the passage",
        "Seacocks set as required (heads closed at sea if that is the boat's routine)",
        "Bilge checked dry immediately before departure",
        "Log entry: date, time, crew on board, engine hours, weather, plan",
      ],
    },
    {
      title: "Crew",
      items: [
        "Brief the crew on the plan: route, expected weather, duration, jobs for leaving the berth",
        "Lifejackets on or at hand per the skipper's rules; harnesses ready if conditions require",
        "Watch schedule agreed for longer passages",
        "Seasickness medication taken in advance by those who need it",
        "Everyone knows where the MOB gear, VHF and first aid kit are (see the safety_briefing checklist for new crew)",
      ],
    },
  ],
};

const HEAVY_WEATHER: Checklist = {
  id: "heavy_weather",
  title: "Heavy weather preparation",
  summary:
    "Preparing boat and crew when strong wind or rough sea is expected: sail plan, securing the boat, crew safety, navigation and contingency planning.",
  sections: [
    {
      title: "Sail plan and boat handling",
      items: [
        "Get the latest forecast; watch the barometer trend and the sky",
        "Reef early — if you are thinking about reefing, reef now; it is far easier before the wind arrives",
        "Rig storm sails (storm jib, trysail) if carried, or set up the deep reef while it is still calm",
        "Check that reefing lines, halyards and sheets run free and are not chafed",
        "Review heavy-weather tactics with the crew: heaving-to, running off, motor-sailing; practice heaving-to if there is time",
      ],
    },
    {
      title: "Crew safety",
      items: [
        "Everyone into lifejackets and harnesses; clip on in the cockpit and always when leaving it",
        "Rig jackstays if not already rigged",
        "Seasickness medication for everyone susceptible — well before it gets rough",
        "Warm, waterproof clothing on before the weather arrives; spare dry layers accessible",
        "Set short watches; send off-watch crew to rest while they still can",
        "Hot food and drinks prepared in advance (thermos flasks, sandwiches) — cooking may become impossible",
        "Brief the crew: what to expect, how long it should last, everyone's job",
      ],
    },
    {
      title: "Securing the boat",
      items: [
        "Close and dog all hatches and portlights; washboards in and secured",
        "Secure everything below: lockers latched, heavy items (tools, anchors, batteries, floorboards) checked, galley stowed",
        "Secure everything on deck: lash the dinghy (or deflate and stow), spare anchor, boat hook, bimini/sprayhood as appropriate",
        "Pump the bilges dry now and check them regularly — a dry bilge shows new leaks immediately",
        "Check cockpit drains are clear; fit the companionway washboards even between waves",
        "Charge batteries, handheld VHF, phones and torches while the engine can still run comfortably",
      ],
    },
    {
      title: "Navigation and contingency",
      items: [
        "Fix and log your position now, and keep logging it regularly in case electronics fail",
        "Update the passage plan: identify ports of refuge and safe water you can reach on either tack",
        "Give dangerous lee shores, shallows and overfalls a wide margin — searoom is safety",
        "Check tidal streams: wind against tide dramatically steepens the sea",
        "Consider informing the coastguard or someone ashore of your position and intentions",
        "Review when you would call for help and where the DSC button, flares and EPIRB are",
      ],
    },
  ],
};

const CHARTER_CHECKOUT: Checklist = {
  id: "charter_checkout",
  title: "Charter check-out (returning the boat)",
  summary:
    "End-of-charter routine: fuel and tanks, cleaning and inventory, honest damage report, photos, documents and the deposit.",
  sections: [
    {
      title: "Before the last leg",
      items: [
        "Plan to arrive at the base the evening before or with a generous margin — do not race the deadline in bad weather",
        "Confirm the return time, berth and fuel arrangements with the charter base",
        "Empty and flush the holding tanks in a permitted zone well before entering the harbour",
      ],
    },
    {
      title: "Fuel and systems",
      items: [
        "Refill the fuel tank(s) at the agreed fuel dock; keep the receipt",
        "Refill the dinghy outboard fuel can if the contract requires it",
        "Top up water tanks if the contract requires it",
        "Note the final engine hours in the log",
        "Report any systems that failed or behaved oddly during the charter — even if they seem minor",
      ],
    },
    {
      title: "Cleaning and inventory",
      items: [
        "Remove all personal belongings; check every cabin, locker and the bilges",
        "Remove all rubbish and leftover food (leave sealed dry goods only if the base allows)",
        "Clean the boat or order final cleaning per the contract; leave the fridge open and dry",
        "Complete the inventory against the charter company's list: crockery, safety gear, winch handles, cushions, dinghy gear",
        "Return the dinghy, outboard and fuel can in the same state you received them",
      ],
    },
    {
      title: "Handover",
      items: [
        "Walk the boat with the base technician; report all damage and losses honestly BEFORE they find them — it is usually cheaper and always better for your record",
        "Photograph the boat again: hull, topsides, cockpit, cabins, fuel gauge, engine hours — the same way you did at check-in",
        "If an underwater inspection (diver check) is standard at this base, be present for it if possible",
        "Return keys, ship's papers, transit log and any courtesy flags or equipment on loan",
        "Settle extras (fuel, cleaning, damages) and get the deposit release confirmed in writing",
        "Get a written/signed confirmation of the boat's condition at handover",
      ],
    },
  ],
};

export const CHECKLISTS: Record<ChecklistId, Checklist> = {
  charter_checkin: CHARTER_CHECKIN,
  safety_briefing: SAFETY_BRIEFING,
  pre_departure: PRE_DEPARTURE,
  heavy_weather: HEAVY_WEATHER,
  charter_checkout: CHARTER_CHECKOUT,
};

export function countItems(cl: Checklist): number {
  return cl.sections.reduce((n, s) => n + s.items.length, 0);
}

const PRESENTATION_RULE =
  "PRESENTATION RULE FOR THE ASSISTANT: this is a safety checklist — its value is completeness. " +
  "Relay EVERY numbered item below to the user, in order, keeping the section structure. " +
  "Do NOT summarize, shorten, merge or omit items. Translate if the user speaks another language, " +
  "but translate every item. If output length is limited, split into several messages rather than dropping items.";

export function formatChecklist(cl: Checklist): string {
  const total = countItems(cl);
  const lines: string[] = [];
  lines.push(`# ${cl.title}`);
  lines.push("");
  lines.push(PRESENTATION_RULE);
  lines.push("");
  lines.push(`Total items: ${total} in ${cl.sections.length} sections. The user must see all ${total}.`);
  if (cl.credit) lines.push(`Credit: ${cl.credit}`);
  for (const section of cl.sections) {
    lines.push("");
    lines.push(`## ${section.title} (${section.items.length} items)`);
    if (section.notes) for (const note of section.notes) lines.push(`> ${note}`);
    section.items.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
  }
  lines.push("");
  lines.push(
    `End of checklist — ${total} items in ${cl.sections.length} sections. Verify the response you give the user contains all of them.`,
  );
  return lines.join("\n");
}

export function formatChecklistIndex(): string {
  const lines: string[] = [];
  lines.push("# Available sailing checklists");
  lines.push("");
  lines.push("Call this tool again with 'checklist' set to one of the ids below to get the full list.");
  lines.push(
    "When you then show a checklist to the user, you must present every item — never a summary.",
  );
  lines.push("");
  for (const id of CHECKLIST_IDS) {
    const cl = CHECKLISTS[id];
    lines.push(`- ${id} — ${cl.title} (${countItems(cl)} items)`);
    lines.push(`  ${cl.summary}`);
  }
  return lines.join("\n");
}

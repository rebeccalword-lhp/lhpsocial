import { useState, useEffect, useRef } from "react";

// LHP Social brand tokens (v4 design refresh — May 2026)
// Light palette: navy reserved for headlines, teal for accents, lime for highlights.
const LHP4 = {
  navy:       "#001D44",
  navySoft:   "#0F2A4F",
  teal:       "#1A9B9D",
  tealBright: "#32DAD8",
  lime:       "#A6B813",
  ink:        "#0B2545",
  body:       "#3E5A7A",
  mute:       "#7592B0",
  pageBg:     "#F4FAFD",
  tintBlue:   "#E5F0F7",
  tintTeal:   "#DDF0EE",
  card:       "#FFFFFF",
  hair:       "rgba(0, 29, 68, 0.10)",
  hairSoft:   "rgba(0, 29, 68, 0.06)",
};

// Time-of-day greeting helper for the home screen header
const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning, LHP.";
  if (h >= 12 && h < 17) return "Good afternoon, LHP.";
  if (h >= 17 && h < 22) return "Good evening, LHP.";
  return "Welcome to LHP Social.";
};

// Live date pill — e.g. "MON · MAY 25"
const getDatePill = () => {
  const d = new Date();
  const day = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  return `${day} · ${month} ${d.getDate()}`;
};

// Clean SVG icons per category — monoline style, stroked, no fills
const CatIcon = ({ id, color, size = 28 }) => {
  const s = { width: size, height: size, display: "block" };
  const p = { stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  switch (id) {
    case "families": return (
      <svg style={s} viewBox="0 0 28 28"><circle cx="10" cy="8" r="3.5" {...p}/><path d="M3 22c0-4 3-6 7-6s7 2 7 6" {...p}/><circle cx="21" cy="9" r="2.8" {...p}/><path d="M16 22c0-3 2-5 5-5s5 2 5 5" {...p}/></svg>
    );
    case "seniors": return (
      <svg style={s} viewBox="0 0 28 28"><circle cx="14" cy="7" r="3.5" {...p}/><path d="M8 28v-8l-2-4c-.5-1 0-2 1-2h14c1 0 1.5 1 1 2l-2 4v8" {...p}/><line x1="11" y1="20" x2="11" y2="28" {...p}/><line x1="17" y1="20" x2="17" y2="28" {...p}/><path d="M6 14c-2 1-3 3-2 5" {...p}/></svg>
    );
    case "fitness": return (
      <svg style={s} viewBox="0 0 28 28"><circle cx="19" cy="6" r="2.5" {...p}/><path d="M5 16l5-5 4 3 4-6 5 3" {...p}/><path d="M3 22h6l2-4h6l2 4h6" {...p}/></svg>
    );
    case "arts": return (
      <svg style={s} viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" {...p}/><circle cx="10" cy="11" r="1.5" {...p} fill={color}/><circle cx="17" cy="9" r="1.5" {...p} fill={color}/><circle cx="20" cy="16" r="1.5" {...p} fill={color}/><circle cx="10" cy="18" r="1.5" {...p} fill={color}/><circle cx="15" cy="20" r="1.5" {...p} fill={color}/></svg>
    );
    case "library": return (
      <svg style={s} viewBox="0 0 28 28"><rect x="4" y="6" width="5" height="18" rx="1" {...p}/><rect x="11" y="6" width="5" height="18" rx="1" {...p}/><path d="M18 6l5 17" {...p}/><line x1="4" y1="10" x2="9" y2="10" {...p}/><line x1="11" y1="10" x2="16" y2="10" {...p}/></svg>
    );
    case "nightlife": return (
      <svg style={s} viewBox="0 0 28 28"><path d="M8 22V8l12 7-12 7z" {...p}/><path d="M22 10c1 1 1.5 2.5 1.5 4s-.5 3-1.5 4" {...p}/><path d="M24.5 7c2 2 3 4.5 3 7s-1 5-3 7" {...p}/></svg>
    );
    case "social": return (
      <svg style={s} viewBox="0 0 28 28"><rect x="4" y="4" width="9" height="9" rx="1.5" {...p}/><rect x="15" y="4" width="9" height="9" rx="1.5" {...p}/><rect x="4" y="15" width="9" height="9" rx="1.5" {...p}/><circle cx="19.5" cy="19.5" r="4.5" {...p}/></svg>
    );
    case "spirit": return (
      <svg style={s} viewBox="0 0 28 28"><line x1="14" y1="3" x2="14" y2="25" {...p}/><line x1="7" y1="10" x2="21" y2="10" {...p}/><path d="M9 3c0 4 10 4 10 8s-10 4-10 8" {...p}/></svg>
    );
    case "sales": return (
      <svg style={s} viewBox="0 0 28 28"><path d="M4 4h8l12 12-8 8L4 12V4z" {...p}/><circle cx="9" cy="9" r="1.8" {...p} fill={color}/><line x1="17" y1="11" x2="11" y2="17" {...p} strokeDasharray="1.5 1.5"/></svg>
    );
    case "community": return (
      <svg style={s} viewBox="0 0 28 28"><rect x="10" y="13" width="8" height="12" rx="1" {...p}/><path d="M4 25V14l10-9 10 9v11" {...p}/><line x1="1" y1="25" x2="27" y2="25" {...p}/></svg>
    );
    default: return null;
  }
};

const categories = [
  { id: "families", label: "Families & Kids", color: "#0077B6", bg: "#E8F4FD", description: "Fun for the whole crew" },
  { id: "seniors", label: "55+ & Seniors", color: "#00B4A6", bg: "#E6F9F7", description: "Tailored for you" },
  { id: "fitness", label: "Fitness & Sports", color: "#52B788", bg: "#EDFAF3", description: "Get moving" },
  { id: "arts", label: "Arts & Creativity", color: "#48CAE4", bg: "#E0F7FC", description: "Make something beautiful" },
  { id: "library", label: "Library", color: "#0096C7", bg: "#E0F4FB", description: "Books, programs & more" },
  { id: "nightlife", label: "Nightlife & Music", color: "#0077B6", bg: "#E8F0FF", description: "Live music & local bars" },
  { id: "social", label: "Games & Social", color: "#48CAE4", bg: "#E0F7FC", description: "Trivia, games & good vibes" },
  { id: "spirit", label: "Spirituality", color: "#7B5EA7", bg: "#F0EBF8", description: "Churches & spiritual life" },
  { id: "sales", label: "Garage & Yard Sales", color: "#E07A1F", bg: "#FEF3E7", description: "Local deals & finds" },
  { id: "community", label: "Community", color: "#023E8A", bg: "#E8F0FB", description: "City news & events" },
];

const sections = [
  { id: "all", label: "All" },
  { id: "community", label: "Community" },
  { id: "families", label: "Families" },
  { id: "fitness", label: "Fitness" },
  { id: "arts", label: "Arts" },
  { id: "social", label: "Games" },
  { id: "nightlife", label: "Music" },
  { id: "sales", label: "Sales" },
  { id: "library", label: "Library" },
  { id: "seniors", label: "Seniors" },
];

const venues = [
  { id: "all", label: "All Venues" },
  { id: "packys", label: "🍺 Packy's" },
  { id: "nautidawg", label: "⚓ Nauti Dawg" },
  { id: "papas", label: "🦞 Papa's Raw Bar" },
  { id: "galuppis", label: "🎸 Galuppi's" },
  { id: "cove", label: "🍻 Cove Brewery" },
  { id: "dangminds", label: "🧠 Dangerous Minds" },
  { id: "city", label: "🌴 City of LHP" },
];

const featuredEvents = [
  // PACKY'S — NOVEMBER 2026 LINEUP NOT AVAILABLE (checked 10/26; site lineup is an image, no flyer in the Inbox).
  // The evergreen packys-live card below holds the slot under "Every Week" and
  // states the standing Wed/Fri/Sat pattern. Drop dated cards here when the
  // monthly flyer lands — same shape as the Galuppi's cards below.

  // PACKY'S — EVERGREEN fallback (shows under "Every Week"; dated cards above take over the calendar)
  { id: "packys-live", venue: "packys", title: "Live Music @ Packy's Sports Pub 🎸", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP · 954-657-8423", date: "Every Friday & Saturday", time: "8:00 PM – 12:00 AM", price: "Check venue for details", emoji: "🎸", note: "Local live music every Friday and Saturday night.", link: "https://www.packyslhp.com/live-music/", color: "#0077B6", category: ["nightlife"] },
  { id: "f2", venue: "nautidawg", title: "Mark Zaden @ The Nauti Dawg ⚓", org: "The Nauti Dawg Marina Cafe · Mark Zaden & The Weedline Band", date: "Every Friday & Sunday", time: "5:30 – 9:30 PM", price: "Check venue for details", emoji: "⚓", note: "At the new Nauti Bar right at B Dock", link: "https://nautidawg.com", color: "#00B4A6", category: ["nightlife"] },
  { id: "papas_live", venue: "papas", title: "Live Music @ Papa's Raw Bar", org: "Papa's Raw Bar · 4610 N Federal Hwy, LHP", date: "Fri & Sat nights · Sun afternoons", time: "Fri/Sat 7–10 PM · Sun 1–4 PM", price: "Free", emoji: "🦞", note: "Live music on the water.", link: null, color: "#00B4A6", category: ["nightlife"] },
  // CITY OF LIGHTHOUSE POINT — CONCERTS IN THE PARK (also listed in Community/Families)
  // GALUPPI'S — OCTOBER 2026 (pulled from galuppis.com/live-music-schedule, 9/29)
  { id: "ga-o22", venue: "galuppis", title: "Halloween Rock N' Roll Night 🎃", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Wed, Oct 28", time: "Evening", price: "RSVP", emoji: "🎸", note: "Featuring History of Rock N' Roll", link: "https://www.galuppis.com/event/history-of-rock-n-roll/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-10-28" },
  { id: "ga-o23", venue: "galuppis", title: "Diamond Dreams — Neil Diamond Tribute 🎤", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Thu, Oct 29", time: "Evening", price: "$49.95/person", emoji: "🎸", note: "Tribute to Neil Diamond", link: "https://www.galuppis.com/event/diamond-dreams-10/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-10-29" },
  { id: "ga-o24", venue: "galuppis", title: "Neon Blonde", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Thu, Oct 29", time: "Evening", price: "Free · No entry fee", emoji: "🎸", note: "Hits from the '80s through today", link: "https://www.galuppis.com/event/neon-blonde-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-10-29" },
  { id: "ga-o25", venue: "galuppis", title: "Private Stock", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Fri, Oct 30", time: "Evening", price: "RSVP", emoji: "🎸", note: "The ultimate rock star tribute show", link: "https://www.galuppis.com/event/private-stock-5/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-10-30" },
  { id: "ga-o26", venue: "galuppis", title: "The Original Studio-54 Band 🪩", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sat, Oct 31", time: "Evening", price: "RSVP", emoji: "🎸", note: "Earth, Wind & Fire, Chic, Donna Summer & more", link: "https://www.galuppis.com/event/the-original-studio-54-band-33/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-10-31" },
  { id: "cove1", venue: "cove", title: "Reggae Sundays — Live Music 🎵", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Sunday", time: "1:00 – 5:00 PM", price: "Free", emoji: "🎵", note: "Reggae vibes every Sunday afternoon", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife"] },
  { id: "cove3", venue: "cove", title: "Trivia Night 🎯", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Tuesday", time: "7:00 – 9:00 PM", price: "Free", emoji: "🎯", note: "Weekly trivia every Tuesday night", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife", "social"] },
  { id: "cove4", venue: "cove", title: "On Wednesdays We Drink Wine 🍷", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Wednesday", time: "12:00 – 11:00 PM", price: "Wine specials", emoji: "🍷", note: "Midweek wine night at the brewery", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife"] },
  { id: "cove5", venue: "cove", title: "Boots & Brews Line Dancing 🤠", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Thursday", time: "6:30 – 9:00 PM", price: "Free", emoji: "🤠", note: "Line dancing every Thursday — all levels welcome", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife", "social"] },
  { id: "cove6", venue: "cove", title: "First Responder Fridays — BOGO Beer 🚒", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Friday", time: "12:00 – 11:00 PM", price: "BOGO beer for first responders", emoji: "🚒", note: "Buy-one-get-one beer for first responders", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife"] },
  { id: "cove7", venue: "cove", title: "Brews & Tunes — Live Music 🎵", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Saturday", time: "6:00 – 9:00 PM", price: "Free", emoji: "🎵", note: "Live music Saturday evenings", link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife"] },
  // DANGEROUS MINDS — OCTOBER 2026 (pulled from dangerousmindsbrewing.com/events, 9/29)
  { id: "dm-o11", venue: "dangminds", title: "Mother Nature", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, Oct 30", time: "6:00 – 9:00 PM", price: "Free", emoji: "🎵", note: "Cover band — classic and contemporary rock.", link: "https://dangerousmindsbrewing.com/event/2216", color: "#52B788", category: ["nightlife"], endDate: "2026-10-30" },
  { id: "dm-o12", venue: "dangminds", title: "Shannon Battle", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, Oct 31", time: "6:00 – 9:00 PM", price: "Free", emoji: "🎵", note: "A mellow and eclectic mix of rock classics and originals.", link: "https://dangerousmindsbrewing.com/event/2217", color: "#52B788", category: ["nightlife"], endDate: "2026-10-31" },
  // GALUPPI'S — NOVEMBER 2026 (pulled from galuppis.com/live-music-schedule, 10/26; page 1 only — Nov 28–30 not captured)
  { id: "ga-n1", venue: "galuppis", title: "The Brass Evolution", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 1", time: "Check venue for details", price: "Free · No entry fee", emoji: "🎸", note: "South Florida's premier rock 'n' horn band", link: "https://www.galuppis.com/event/the-brass-evolution-30/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-01" },
  { id: "ga-n2", venue: "galuppis", title: "Elton John & Billy Joel Dueling Piano Show", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Wed, Nov 4", time: "Check venue for details", price: "$39.95/person", emoji: "🎸", note: "Tributes to Elton John & Billy Joel", link: "https://www.galuppis.com/event/elton-john-billy-joel-dueling-piano-show/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-04" },
  { id: "ga-n3", venue: "galuppis", title: "The Landsharks", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Thu, Nov 5", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to Jimmy Buffett", link: "https://www.galuppis.com/event/the-landsharks-3/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-05" },
  { id: "ga-n4", venue: "galuppis", title: "The Long Run", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Fri, Nov 6", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to The Eagles", link: "https://www.galuppis.com/event/the-long-run-4/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-06" },
  { id: "ga-n5", venue: "galuppis", title: "Wide Awake", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sat, Nov 7", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to U2", link: "https://www.galuppis.com/event/wide-awake-3/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-07" },
  { id: "ga-n6", venue: "galuppis", title: "Marvels of Motown", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 8", time: "Check venue for details", price: "$49.95/person", emoji: "🎸", note: "11-piece horn band", link: "https://www.galuppis.com/event/marvels-of-motown-9/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-08" },
  { id: "ga-n7", venue: "galuppis", title: "Crazy Horses & The Leo Rock Band", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 8", time: "Check venue for details", price: "Free · No entry fee", emoji: "🎸", note: "Tribute to Neil Young", link: "https://www.galuppis.com/event/crazy-horses-the-leo-rock-band/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-08" },
  { id: "ga-n8", venue: "galuppis", title: "Dino's Tribute to The Rat Pack", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Wed, Nov 11", time: "Check venue for details", price: "$39.95/person", emoji: "🎸", note: "Tribute to The Rat Pack", link: "https://www.galuppis.com/event/dinos-tribute-to-the-rat-pack-3/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-11" },
  { id: "ga-n9", venue: "galuppis", title: "AfterImage", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Thu, Nov 12", time: "Check venue for details", price: "Free · No entry fee", emoji: "🎸", note: "Tribute to Rush", link: "https://www.galuppis.com/event/afterimage-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-12" },
  { id: "ga-n10", venue: "galuppis", title: "Hot Brass", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Fri, Nov 13", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to Chicago and Earth, Wind & Fire", link: "https://www.galuppis.com/event/hot-brass-5/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-13" },
  { id: "ga-n11", venue: "galuppis", title: "Elton & The Jets", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sat, Nov 14", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to Elton John", link: "https://www.galuppis.com/event/elton-the-jets/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-14" },
  { id: "ga-n12", venue: "galuppis", title: "Linda Ronstadt Tribute", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 15", time: "Check venue for details", price: "$49.95/person", emoji: "🎸", note: "Sylvia Z & The North 40", link: "https://www.galuppis.com/event/linda-ronstat-tribute/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-15" },
  { id: "ga-n13", venue: "galuppis", title: "Completely Unchained & The Strangers", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 15", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Eddie Van Halen celebration of life", link: "https://www.galuppis.com/event/completely-unchained-nov-15/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-15" },
  { id: "ga-n14", venue: "galuppis", title: "High Tide presents Yacht Rock", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Wed, Nov 18", time: "Check venue for details", price: "$49.95/person", emoji: "🎸", note: "Classics from the '70s & '80s", link: "https://www.galuppis.com/event/high-tide-presents-yacht-rock-7/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-18" },
  { id: "ga-n15", venue: "galuppis", title: "The 807 Band", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Thu, Nov 19", time: "Check venue for details", price: "Free · No entry fee", emoji: "🎸", note: "Rock, classic & dance", link: "https://www.galuppis.com/event/the-807-band-15/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-19" },
  { id: "ga-n16", venue: "galuppis", title: "Across the Universe", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Fri, Nov 20", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to The Beatles", link: "https://www.galuppis.com/event/across-the-universe-6/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-20" },
  { id: "ga-n17", venue: "galuppis", title: "Spektora", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sat, Nov 21", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "High-energy rock", link: "https://www.galuppis.com/event/spektora-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-21" },
  { id: "ga-n18", venue: "galuppis", title: "Steph Stills Band", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 22", time: "Check venue for details", price: "Free · No entry fee", emoji: "🎸", note: "Jazz rock & hits of the MTV era", link: "https://www.galuppis.com/event/steph-stills-band-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-22" },
  { id: "ga-n19", venue: "galuppis", title: "Sounds of the Four Seasons", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Sun, Nov 22", time: "Check venue for details", price: "$49.95/person", emoji: "🎸", note: "Tribute to Frankie Valli & The Four Seasons", link: "https://www.galuppis.com/event/sounds-of-the-four-seasons-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-22" },
  { id: "ga-n20", venue: "galuppis", title: "Jive Talkin'", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Tue, Nov 24", time: "Check venue for details", price: "$49.95/person", emoji: "🎸", note: "Tribute to The Bee Gees", link: "https://www.galuppis.com/event/jive-talkin-8/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-24" },
  { id: "ga-n21", venue: "galuppis", title: "Southern Blood", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Wed, Nov 25", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Southern rock hits from the '70s & '80s", link: "https://www.galuppis.com/event/southern-blood-7/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-25" },
  { id: "ga-n22", venue: "galuppis", title: "Rock of ABBA", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", date: "Fri, Nov 27", time: "Check venue for details", price: "RSVP", emoji: "🎸", note: "Tribute to ABBA", link: "https://www.galuppis.com/event/rock-of-abba-6/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-11-27" },
  // COVE BREWERY — HALLOWEEN (pulled from covebrewery.com, 10/26)
  { id: "cove-hw-bash", venue: "cove", title: "Halloween Bash 🎃", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Sat, Oct 31", time: "6:00 – 11:00 PM", price: "Check venue for details", emoji: "🎃", note: null, link: "https://www.covebrewery.com/events", color: "#52B788", category: ["nightlife"], endDate: "2026-10-31" },
  // DANGEROUS MINDS — NOVEMBER 2026 (pulled from dangerousmindsbrewing.com/events, 10/26; cover not listed on the site — cards say "Check venue for details")
  { id: "dm-n1", venue: "dangminds", title: "Nosh & Gress", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, Nov 6", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: "Acoustic classic and contemporary rock — from The Eagles to Tom Petty and Fleetwood Mac.", link: "https://dangerousmindsbrewing.com/event/2242", color: "#52B788", category: ["nightlife"], endDate: "2026-11-06" },
  { id: "dm-n2", venue: "dangminds", title: "The G-Man", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, Nov 7", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: null, link: "https://dangerousmindsbrewing.com/event/2243", color: "#52B788", category: ["nightlife"], endDate: "2026-11-07" },
  { id: "dm-n3", venue: "dangminds", title: "Rich Tench", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sun, Nov 8", time: "4:00 – 7:00 PM", price: "Check venue for details", emoji: "🎵", note: "Creating and performing music in South Florida for over 20 years.", link: "https://dangerousmindsbrewing.com/event/2245", color: "#52B788", category: ["nightlife"], endDate: "2026-11-08" },
  { id: "dm-n4", venue: "dangminds", title: "Leah Simmons", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, Nov 13", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: "Independent singer-songwriter and guitarist.", link: "https://dangerousmindsbrewing.com/event/2247", color: "#52B788", category: ["nightlife"], endDate: "2026-11-13" },
  { id: "dm-n5", venue: "dangminds", title: "Shannon Battle", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, Nov 14", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: "A mellow and eclectic mix of rock classics and originals.", link: "https://dangerousmindsbrewing.com/event/2248", color: "#52B788", category: ["nightlife"], endDate: "2026-11-14" },
  { id: "dm-n6", venue: "dangminds", title: "Travis Williamson", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, Nov 20", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: null, link: "https://dangerousmindsbrewing.com/event/2251", color: "#52B788", category: ["nightlife"], endDate: "2026-11-20" },
  { id: "dm-n7", venue: "dangminds", title: "Rich Tench", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sun, Nov 22", time: "4:00 – 7:00 PM", price: "Check venue for details", emoji: "🎵", note: "Creating and performing music in South Florida for over 20 years.", link: "https://dangerousmindsbrewing.com/event/2246", color: "#52B788", category: ["nightlife"], endDate: "2026-11-22" },
  { id: "dm-n8", venue: "dangminds", title: "Manny Estrella", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, Nov 27", time: "7:00 – 10:00 PM", price: "Check venue for details", emoji: "🎵", note: null, link: "https://dangerousmindsbrewing.com/event/2253", color: "#52B788", category: ["nightlife"], endDate: "2026-11-27" },
  { id: "dm-n9", venue: "dangminds", title: "Spare Change", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, Nov 28", time: "6:00 – 9:00 PM", price: "Check venue for details", emoji: "🎵", note: "Steve (bass/vocals) and Gary (guitar/vocals) — 30 years in the South Florida music scene.", link: "https://dangerousmindsbrewing.com/event/2254", color: "#52B788", category: ["nightlife"], endDate: "2026-11-28" },
];

const byteEvents = [
  { id: "b1", title: "Backgammon Night ♟️", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Thursday", time: "Check venue for details", location: "Byte & Coffee, Lighthouse Point", price: "Check venue for details", color: "#48CAE4", tags: ["backgammon", "games", "weekly", "social"], note: "All skill levels welcome. Casual evening of backgammon, drinks & good vibes.", ages: null, link: "https://bytencoffee.com/events/" },
  { id: "b2", title: "Board Game Night 🎲", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Thursday", time: "Check venue for details", location: "Byte & Coffee, Lighthouse Point", price: "Check venue for details", color: "#48CAE4", tags: ["board-games", "games", "weekly", "social"], note: "Grab a seat, choose a game, enjoy 10% off drinks!", ages: null, link: "https://bytencoffee.com/events/" },
  { id: "b3", title: "Mahjong Night 🀄", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Tuesday", time: "Check venue for details", location: "Byte & Coffee, Lighthouse Point", price: "Check venue for details", color: "#48CAE4", tags: ["mahjong", "games", "weekly", "social"], note: "Relaxed, welcoming atmosphere. Sets provided — players welcome to bring their own.", ages: null, link: "https://bytencoffee.com/events/" },
];

// Auto-expiry helper: events with an endDate disappear the day after.
// Events without an endDate (recurring/evergreen) stay forever.
const isEventActive = (event) => {
  if (!event.endDate) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Parse as a local date (not UTC) so today's events stay visible all day in Florida
  const [y, m, d] = event.endDate.split("-").map(Number);
  const end = new Date(y, m - 1, d);
  end.setHours(0, 0, 0, 0);
  return end >= today;
};

// Chronological sort helper for the events list.
// Reads the human date text ("Sat, Oct 3", "Thursdays · Oct 1, 8, 15 & 29",
// "Wednesdays · Oct 7 – Nov 18") and returns the next upcoming date.
// Returns null for ongoing items (weekly/evergreen, "through Oct 17", or a
// series that has already started) — those sort after the dated events.
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const getNextDate = (event) => {
  const text = event.date || "";
  if (/through|every|ongoing|apply now/i.test(text)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = event.endDate ? parseInt(event.endDate.slice(0, 4), 10) : today.getFullYear();
  const mk = (mon, day) => new Date(year, MONTHS[mon.slice(0, 3).toLowerCase()], parseInt(day, 10));
  // Range, e.g. "Oct 6 – 27" or "Sep 22 – Oct 29": ongoing once it has started
  const range = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})\s*[–-]\s*(?:[A-Z][a-z]+\.?\s+)?\d{1,2}/);
  if (range) {
    const start = mk(range[1], range[2]);
    return start > today ? start : null;
  }
  // Single dates and lists, e.g. "Sat, Oct 3" or "Oct 1, 8, 15 & 29"
  const dates = [];
  const re = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}(?:\s*(?:,|&|and)\s*\d{1,2})*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    m[2].split(/\s*(?:,|&|and)\s*/).forEach((d) => dates.push(mk(m[1], d)));
  }
  if (!dates.length) return null;
  const upcoming = dates.filter((d) => d >= today).sort((a, b) => a - b);
  return upcoming.length ? upcoming[0] : null;
};

// Parse a music time string into minutes since midnight for sorting.
// Handles formats like "5:30 PM", "5:30 – 8:30 PM", "7–10 PM", "1–4 PM", "8:00 PM – 12:00 AM".
// Returns 9999 if it can't parse so unparsable events sort to the end.
const parseTimeForSort = (timeStr) => {
  if (!timeStr) return 9999;
  // Grab the first time number group (hour and optional minutes)
  const firstTime = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!firstTime) return 9999;
  // Find the AM/PM marker — could be after the first time or the second
  const firstAmPm = timeStr.match(/(\d{1,2})(?::\d{2})?\s*(AM|PM)/i);
  const trailingAmPm = timeStr.match(/(AM|PM)\s*$/i);
  let hr = parseInt(firstTime[1], 10);
  const min = firstTime[2] ? parseInt(firstTime[2], 10) : 0;
  // Use the AM/PM directly tied to the first time if present, otherwise fall back to the trailing one
  const ampm = (firstAmPm && parseInt(firstAmPm[1], 10) === hr ? firstAmPm[2] : trailingAmPm ? trailingAmPm[1] : null);
  if (!ampm) return 9999;
  const upper = ampm.toUpperCase();
  if (upper === "PM" && hr !== 12) hr += 12;
  if (upper === "AM" && hr === 12) hr = 0;
  return hr * 60 + min;
};

// Group dated music events by endDate, sorted chronologically, with shows sorted by start time within each day.
const groupMusicByDate = (events) => {
  const recurring = events.filter((e) => !e.endDate);
  const dated = events.filter((e) => e.endDate);
  const buckets = {};
  dated.forEach((ev) => {
    if (!buckets[ev.endDate]) buckets[ev.endDate] = [];
    buckets[ev.endDate].push(ev);
  });
  const sortedDates = Object.keys(buckets).sort();
  const groups = sortedDates.map((date) => ({
    date,
    label: new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
    events: buckets[date].sort((a, b) => parseTimeForSort(a.time) - parseTimeForSort(b.time)),
  }));
  return { recurring, groups };
};

const events = [
  // SPIRITUALITY
  { id: "ch1", title: "Sunday Services — Coastal Community Church", org: "Coastal Community Church · 3901 NE 22nd Ave, Lighthouse Point", category: ["spirit"], date: "Every Sunday", time: "8:45 AM · 10:15 AM · 11:45 AM", location: "3901 NE 22nd Ave, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["church", "worship", "sunday", "kids-ministry", "weekly"], note: "Kids Ministry at all services · Special Space class for children with special needs at 11:45 AM · Next Steps class at 10:15 AM", ages: "All ages", link: "https://coastalcommunity.tv/lhp/" },
  { id: "ch2", title: "Sunday Mass — St. Paul the Apostle", org: "Saint Paul the Apostle Catholic Church · (954) 943-9154", category: ["spirit"], date: "Every Sunday", time: "7:30 AM · 9:00 AM · 11:30 AM · Sat Vigil 4:30 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "mass", "sunday", "weekly"], note: "Saturday Vigil Mass at 4:30 PM · Confessions: Saturdays 3:30–4:30 PM or by request", ages: "All ages", link: "https://stpaulslhp.org/mass-times/" },
  { id: "ch3", title: "Daily Mass — St. Paul the Apostle", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "Mon–Fri 7:30 AM & 11:00 AM · Saturday 11:00 AM", time: "7:30 AM & 11:00 AM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "mass", "daily", "weekday"], note: null, ages: null, link: "https://stpaulslhp.org/mass-times/" },
  { id: "ch4", title: "Adoration — St. Paul the Apostle 🕯️", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "First Friday of each month", time: "11:30 AM – 5:00 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "adoration", "prayer", "first-friday"], note: "Includes prayer, benediction and exposition of the Blessed Sacrament.", ages: null, link: "https://stpaulslhp.org/mass-times/" },
  { id: "ch5", title: "Women's Rosary Cenacle 📿", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit", "seniors"], date: "Every Monday", time: "9:30 AM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All women welcome", color: "#7B5EA7", tags: ["catholic", "rosary", "women", "prayer", "weekly"], note: null, ages: "Women", link: "https://stpaulslhp.org/mass-times/" },
  { id: "ch6", title: "Men's Rosary Cenacle 📿", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "Every Wednesday", time: "7:00 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All men welcome", color: "#7B5EA7", tags: ["catholic", "rosary", "men", "prayer", "weekly"], note: null, ages: "Men", link: "https://stpaulslhp.org/mass-times/" },
  { id: "ch7", title: "Sunday Services — The Pink Church 🌸", org: "The Pink Church · 2331 NE 26th Ave, Pompano Beach, FL 33062", category: ["spirit"], date: "Every Sunday", time: "9:30 AM (Contemporary) · 11:00 AM (Traditional)", location: "2331 NE 26th Ave, Pompano Beach, FL 33062", price: "Free · All welcome", color: "#7B5EA7", tags: ["church", "worship", "sunday", "contemporary", "traditional", "weekly"], note: "Contemporary service at 9:30 AM · Traditional service at 11:00 AM", ages: "All ages", link: "https://thepinkchurch.org/" },

  // LIBRARY — OCTOBER 2026 (from the library calendar, 9/29; Open/Full/Waitlist
  // statuses are a snapshot of that date — confirm before heading over)
  // LIBRARY — NOVEMBER 2026 (from Becky's screenshots of the library calendar, 10/27; status as of that date)
  { id: "lib-n1", title: "ABCs of Investing 📈", org: "Lighthouse Point Library", category: ["library", "seniors", "community"], date: "Thursdays · Nov 5, 12 & 19", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#023E8A", tags: ["library", "finance", "investing", "adults"], note: "Register on the library calendar.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-19" },
  { id: "lib-n2", title: "Family Story Time 📚", org: "Lighthouse Point Library", category: ["library", "families"], date: "Fridays · Nov 6, 13 & 20", time: "10:30 – 11:30 AM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Waitlist", color: "#0096C7", tags: ["library", "kids", "storytime", "weekly"], note: "Waitlist as of Oct 27. Register on the library calendar.", ages: "Babies 0–3 · Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-20" },
  { id: "lib-n3", title: "The Knitting & Crocheting Group 🧶", org: "Lighthouse Point Library", category: ["library", "arts", "seniors", "social"], date: "Wednesdays · Nov 4 & 18", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#48CAE4", tags: ["library", "knitting", "crochet", "adults"], note: "Register on the library calendar.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-18" },
  { id: "lib-n4", title: "S.T.E.A.M. America 250! 🇺🇸", org: "Lighthouse Point Library", category: ["library", "families"], date: "Mon, Nov 2", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#0096C7", tags: ["library", "steam", "kids"], note: "Register on the library calendar.", ages: "Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-02" },
  { id: "lib-n5", title: "Friends Zoom Book Club 💻", org: "Lighthouse Point Library", category: ["library", "social"], date: "Wed, Nov 4", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#023E8A", tags: ["library", "book-club", "virtual", "adults"], note: "Meets on Zoom. Register on the library calendar.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-04" },
  { id: "lib-n6", title: "Family Makerspace 🛠️", org: "Lighthouse Point Library", category: ["library", "families", "arts"], date: "Mon, Nov 9", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#0096C7", tags: ["library", "makerspace", "kids"], note: "Register on the library calendar.", ages: "Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-09" },
  { id: "lib-n7", title: "Pajama Story Time with Miss Doreen 🌙", org: "Lighthouse Point Library", category: ["library", "families"], date: "Tue, Nov 10", time: "6:30 – 7:30 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#0096C7", tags: ["library", "storytime", "pajamas", "kids"], note: "Register on the library calendar.", ages: "Babies 0–3 · Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-10" },
  { id: "lib-n8", title: "Community Partners: Property Appraiser & Supervisor of Elections 🏠🗳️", org: "Lighthouse Point Library", category: ["library", "community", "seniors"], date: "Mon, Nov 16", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Walk-ins welcome", color: "#023E8A", tags: ["library", "community", "taxes", "elections", "outreach"], note: "Broward County Property Appraiser and Supervisor of Elections staff at the library.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-16" },
  { id: "lib-n9", title: "Shrinky Dink Ornament 🎄", org: "Lighthouse Point Library", category: ["library", "families", "arts"], date: "Mon, Nov 16", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#48CAE4", tags: ["library", "crafts", "holiday", "kids", "teens"], note: "Register on the library calendar.", ages: "Youth 7–17 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-16" },
  { id: "lib-n10", title: "Read to a Therapy Dog 🐶", org: "Lighthouse Point Library", category: ["library", "families"], date: "Tue, Nov 17", time: "6:30 – 6:45 PM · 6:45 – 7:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Waitlist", color: "#0096C7", tags: ["library", "reading", "dogs", "kids"], note: "Two 15-minute sessions. Waitlist as of Oct 27. Register on the library calendar.", ages: "Youth 4–17 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-17" },
  { id: "lib-n11", title: "Friends Mystery Book Club 🔍", org: "Lighthouse Point Library", category: ["library", "social"], date: "Tue, Nov 24", time: "2:00 – 3:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#023E8A", tags: ["library", "book-club", "mystery", "adults"], note: "Meets every other month. Register on the library calendar.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-24" },
  { id: "lib-n12", title: "CDBG Senior Programs 🧓", org: "Lighthouse Point Library", category: ["library", "seniors", "fitness"], date: "Tuesdays & Wednesdays in November", time: "Yoga Tue 9 AM · Strength Bands Wed 9 AM (Tue, Nov 10 at 10 AM) · Needle Felting Thu, Nov 12 & 19, 3:30 PM · Zoom Book Club Wed, Nov 18, 4 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Some sessions full", color: "#00B4A6", tags: ["library", "seniors", "cdbg", "yoga", "crafts"], note: "Grant-funded programs for Lighthouse Point residents 62+. Register in person at the library. Strength Bands and the Zoom Book Club were open as of Oct 27; Yoga and Needle Felting were full.", ages: "LHP residents 62+", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-25" },
  { id: "lib-n13", title: "Library Holiday Hours 🦃", org: "Lighthouse Point Library", category: ["library", "community"], date: "Nov 11 · Nov 25 – 28", time: "See details", location: "Lighthouse Point Library, 2200 NE 38th St", price: null, color: "#023E8A", tags: ["library", "holiday", "hours"], note: "Closed Wed, Nov 11 (Veterans Day). Open 10 AM – 4 PM Wed, Nov 25. Closed Thu – Sat, Nov 26 – 28 (Thanksgiving).", ages: null, link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-11-28" },
  { id: "lib-o1", title: "ABCs of Investing 📈", org: "Lighthouse Point Library", category: ["library", "seniors", "community"], date: "Thursdays · Oct 1, 8, 15, 22 & 29", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#023E8A", tags: ["library", "finance", "investing", "adults"], note: "Presented by library volunteer Kerry Harrison. Bring a notepad and pen. The library is closed Oct 15 for staff training — confirm that session before you go.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-29" },
  { id: "lib-o2", title: "Family Story Time 📚", org: "Lighthouse Point Library", category: ["library", "families"], date: "Fridays · Oct 2, 9, 16, 23 & 30", time: "10:30 – 11:30 AM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Waitlist", color: "#0096C7", tags: ["library", "kids", "storytime", "weekly"], note: "Songs, stories and movement to build early literacy. Waitlist as of Sep 29 — registration covers all dates.", ages: "Babies 0–3 · Youth 4–6 · Youth 7–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-30" },
  { id: "lib-o4", title: "The Knitting Group 🧶", org: "Lighthouse Point Library", category: ["library", "arts", "seniors", "social"], date: "Wednesdays · Oct 7, 14, 21 & 28", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Open", color: "#48CAE4", tags: ["library", "knitting", "crochet", "adults"], note: "Learn to knit or crochet from peers and a library volunteer. New participants bring worsted yarn, size 8 needles and a G or H hook. Registration required.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-28" },
  { id: "lib-o11", title: "Community Partners: Property Appraiser & Supervisor of Elections 🏠🗳️", org: "Lighthouse Point Library", category: ["library", "community", "seniors"], date: "Mon, Oct 26", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Walk-ins welcome", color: "#023E8A", tags: ["library", "community", "taxes", "elections", "outreach"], note: "Broward Property Appraiser staff help with exemptions and assessments in the Community Room. Supervisor of Elections staff answer voting questions in the City Hall lobby.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-26" },
  { id: "lib-o12", title: "Papier-Mâché Masks 🎭", org: "Lighthouse Point Library", category: ["library", "families", "arts"], date: "Mon, Oct 26", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#48CAE4", tags: ["library", "crafts", "halloween", "kids"], note: "Family craft — make a mask just in time for Halloween.", ages: "Youth 7–17 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-26" },
  { id: "lib-o13", title: "Not-So-Scary Costume Storytime 🎃", org: "Lighthouse Point Library", category: ["library", "families"], date: "Tue, Oct 27", time: "6:30 – 7:30 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#E07A1F", tags: ["library", "kids", "storytime", "halloween", "costumes"], note: "Wear your costume for Halloween stories and songs.", ages: "All ages · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-27" },
  { id: "lib-o14", title: "CDBG Senior Programs 🧓", org: "Lighthouse Point Library", category: ["library", "seniors", "fitness"], date: "Tuesdays & Wednesdays in October", time: "Yoga Tue 9 AM · Strength Bands Wed 9 AM · Appy Hour Oct 8, 3:30 PM · Paper Quilling Oct 22 & 29, 3:30 PM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Most sessions full", color: "#00B4A6", tags: ["library", "seniors", "cdbg", "yoga", "technology", "crafts"], note: "Grant-funded programs for Lighthouse Point residents 62+. In-person registration at the library. Yoga, Strength Bands and Paper Quilling were full as of Sep 29 — waitlist is by lottery. One-on-one Tech Assist by appointment.", ages: "LHP residents 62+", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-10-29" },
  // COMMUNITY
  // FITNESS
  { id: 11, title: "Adult Pickleball Clinics 🏓", org: "John Trudel Community Center · George Bulger, Professional Player & Certified Coach", category: ["fitness"], date: "Wednesdays", time: "6:00 – 7:00 PM", location: "John Trudel Community Center", price: "$15", color: "#52B788", tags: ["pickleball", "sports", "weekly", "all-levels"], note: "Beginner, intermediate and advanced welcome. Instruction by George Bulger, Professional Player & Certified Coach. Advance registration required at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com" },
  { id: "sfbs1", title: "Wednesday Night Fever — Baseball Training ⚾", org: "South Florida Baseball School · Dan Witt Park", category: ["fitness", "families"], date: "Every Wednesday", time: "6:00 – 9:00 PM", location: "Dan Witt Park, 4521 NE 22nd Ave", price: "$50/session", color: "#52B788", tags: ["baseball", "youth", "training", "weekly"], note: "Intense baseball-specific training.", ages: null, link: "https://www.sfbspro.com" },
  { id: "tc1", title: "Cardio Tennis 2.0+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Monday", time: "9:00 – 10:30 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "cardio", "weekly", "adult"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "2.0+ level", link: null },
  { id: "tc2", title: "Adult Intermediate Tennis Clinic 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Monday", time: "6:30 – 8:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "intermediate", "weekly", "adult", "evening"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "Intermediate level", link: null },
  { id: "tc3", title: "Advanced LiveBall Tennis 3.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Tuesday", time: "7:00 – 8:30 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "advanced", "liveball", "weekly", "adult", "evening"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "3.5+ level", link: null },
  { id: "tc4", title: "LiveBall Tennis 2.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Wednesday", time: "6:30 – 8:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "liveball", "weekly", "adult", "evening"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "2.5+ level", link: null },
  { id: "tc5", title: "Advanced LiveBall Tennis 3.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Thursday", time: "6:30 – 8:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "advanced", "liveball", "weekly", "adult", "evening"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "3.5+ level", link: null },
  { id: "tc6", title: "Beginners Tennis 0–1.8 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Thursday", time: "6:30 – 8:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#0096C7", tags: ["tennis", "beginners", "weekly", "adult", "evening"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "Beginners 0–1.8", link: null },
  { id: "tc7", title: "LiveBall Tennis 2.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Friday", time: "8:30 – 10:00 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "liveball", "weekly", "adult", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "2.5+ level", link: null },
  { id: "tc8", title: "LiveBall Tennis 3.0+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Friday", time: "10:00 – 11:30 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "liveball", "weekly", "adult", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "3.0+ level", link: null },
  { id: "tc9", title: "Beginners Tennis 0–1.8 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Saturday", time: "8:00 – 9:00 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#0096C7", tags: ["tennis", "beginners", "weekly", "saturday", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "Beginners 0–1.8", link: null },
  { id: "tc10", title: "Intermediate Tennis 2.0–2.5 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Saturday", time: "9:00 – 10:30 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "intermediate", "weekly", "saturday", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "2.0–2.5 level", link: null },
  { id: "tc11", title: "Advanced LiveBall Tennis 3.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Saturday", time: "9:00 – 10:30 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "advanced", "liveball", "weekly", "saturday", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "3.5+ level", link: null },
  { id: "tc12", title: "LiveBall Tennis 2.5+ 🎾", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness"], date: "Every Sunday", time: "9:00 – 10:30 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "liveball", "weekly", "sunday", "morning"], note: "Sign up on Court Reserve app or call the Pro Shop. Members 7 days advance · Non-members 5 days prior.", ages: "2.5+ level", link: null },
  // LHP TENNIS CENTER — ROGY JUNIOR DEVELOPMENT (USTA Junior Development Pathway)
  // Clinics run daily; each player attends ONCE a week and is assigned a day when they call to register.
  // FALL ROGY — Aug 24 – Oct 17, 2026
  // WINTER ROGY — Oct 19 – Dec 19, 2026 (live as of the October refresh; Fall cards expire after Oct 17)
  { id: "rogy-w-blue", title: "Winter ROGY Junior Tennis — Blue ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19", time: "3:30 – 4:15 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $154 · Jr. Member $140", color: "#0096C7", tags: ["tennis", "rogy", "usta", "junior", "kids", "winter", "blue"], note: "USTA Junior Development Pathway. Clinics run daily — each player attends once a week and is assigned a day when they call to register. Sign up through the Pro Shop at (954) 946-7306.", ages: "Ages 4–5", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-red", title: "Winter ROGY Junior Tennis — Red ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19", time: "4:30 – 5:30 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $182 · Jr. Member $168", color: "#D62839", tags: ["tennis", "rogy", "usta", "junior", "kids", "winter", "red"], note: "USTA Junior Development Pathway. Clinics run daily — each player attends once a week and is assigned a day when they call to register. Sign up through the Pro Shop at (954) 946-7306.", ages: "Ages 6–7", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-orange", title: "Winter ROGY Junior Tennis — Orange ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19", time: "4:00 – 5:00 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $182 · Jr. Member $168", color: "#E07A1F", tags: ["tennis", "rogy", "usta", "junior", "kids", "winter", "orange"], note: "USTA Junior Development Pathway. Clinics run daily — each player attends once a week and is assigned a day when they call to register. Sign up through the Pro Shop at (954) 946-7306.", ages: "Ages 8–10", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-green", title: "Winter ROGY Junior Tennis — Green ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19", time: "4:00 – 5:30 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $231 · Jr. Member $217", color: "#52B788", tags: ["tennis", "rogy", "usta", "junior", "kids", "winter", "green"], note: "USTA Junior Development Pathway. Clinics run daily — each player attends once a week and is assigned a day when they call to register. Sign up through the Pro Shop at (954) 946-7306.", ages: "Ages 10–12", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-yellow", title: "Winter ROGY Junior Tennis — Yellow ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19 · Monday or Wednesday", time: "5:00 – 6:30 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $231 · Jr. Member $217", color: "#E0A800", tags: ["tennis", "rogy", "usta", "junior", "youth", "winter", "yellow"], note: "USTA Junior Development Pathway. Pick Monday or Wednesday — one day a week. Your day is confirmed when you call the Pro Shop at (954) 946-7306 to register.", ages: "Ages 12 & up", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-topflight", title: "Winter ROGY Junior Tennis — Top Flight ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Oct 19 – Dec 19 · Monday or Wednesday", time: "4:00 – 5:30 PM · One day a week", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $231 · Jr. Member $217", color: "#7B5EA7", tags: ["tennis", "rogy", "usta", "junior", "advanced", "winter", "top-flight"], note: "USTA Junior Development Pathway — highest junior level. Pick Monday or Wednesday — one day a week. Your day is confirmed when you call the Pro Shop at (954) 946-7306 to register.", ages: "Ages 12 & up", link: null, endDate: "2026-12-19" },
  { id: "rogy-w-teens", title: "Winter ROGY Junior Tennis — Teens ❄️", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Thursdays · Oct 19 – Dec 19", time: "5:30 – 7:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Non-Member $264 · Jr. Member $244", color: "#C2409A", tags: ["tennis", "rogy", "usta", "teens", "junior", "winter"], note: "USTA Junior Development Pathway. Meets Thursday evenings. Register through the Pro Shop at (954) 946-7306.", ages: "Ages 13–18", link: null, endDate: "2026-12-19" },
  // LHP TENNIS CENTER — THANKSGIVING CAMP (FM School of Tennis) — Nov 23–26, 2026
  { id: "tc-thanksgiving-young", title: "Thanksgiving Tennis Camp — Ages 5–7 🦃", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Nov 23 – Nov 26", time: "9:00 – 11:00 AM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "$45 a day · Jr. Member $40 a day", color: "#E07A1F", tags: ["tennis", "camp", "thanksgiving", "holiday", "kids", "junior"], note: "FM School of Tennis holiday camp. Sign up by calling (954) 946-7306 or emailing lhp@fm-tennis.com. Junior Members save $5 a day.", ages: "Ages 5–7", link: null, endDate: "2026-11-26" },
  { id: "tc-thanksgiving-older", title: "Thanksgiving Tennis Camp — Ages 7½ & Up 🦃", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Nov 23 – Nov 26", time: "9:00 AM – 12:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "$65 a day · Jr. Member $60 a day", color: "#E07A1F", tags: ["tennis", "camp", "thanksgiving", "holiday", "kids", "youth", "junior"], note: "FM School of Tennis holiday camp. Sign up by calling (954) 946-7306 or emailing lhp@fm-tennis.com. Junior Members save $5 a day.", ages: "Ages 7½ & up", link: null, endDate: "2026-11-26" },
  // LHP YOGA — 2032 E Sample Rd, Lighthouse Point (recurring evergreen + dated workshops)
  { id: "yoga-vinyasa", title: "Vinyasa Yoga 🧘", org: "LHP Yoga · 2032 E Sample Rd, Lighthouse Point", category: ["fitness"], date: "Every morning", time: "9:00 AM", location: "2032 E Sample Rd, Lighthouse Point, FL 33064", price: "$30 drop-in · Other pricing options available", color: "#52B788", tags: ["yoga", "fitness", "cardio", "balance", "daily"], note: "Daily vinyasa for all levels — improves strength, cardio, balance & mood.", ages: "All levels", link: "https://www.lhp.yoga" },
  { id: "yoga-hatha", title: "Hatha Yoga 🧘", org: "LHP Yoga · 2032 E Sample Rd, Lighthouse Point", category: ["fitness"], date: "Mon · Wed · Thu · Sat · Sun", time: "10:30 AM", location: "2032 E Sample Rd, Lighthouse Point, FL 33064", price: "$30 drop-in · Other pricing options available", color: "#52B788", tags: ["yoga", "fitness", "strength", "weekly"], note: "Foundational yoga class for strength. All levels welcome.", ages: "All levels", link: "https://www.lhp.yoga" },
  // ARTS & KIDS
  { id: 33, title: "Compost Pilot Program — Limited Spots!", org: "City of Lighthouse Point × Filthy Organics", category: ["community"], date: "Apply now — first come, first served", time: "Ongoing", location: "Citywide", price: "Free · First 50 residents", color: "#52B788", tags: ["sustainability", "composting", "free"], note: "5-gallon compost bucket + twice-weekly drop-off access", ages: null, link: "https://www.lighthousepointfl.gov/369/Composting" },

  // OCTOBER — REC & CITY (from the John Trudel Community Center calendar export, 9/29)
  // Weekly series
  { id: "oct-mat-yogalates", title: "Mat Yogalates 🧘", org: "John Trudel Community Center · (954) 784-3439", category: ["fitness", "seniors"], date: "Tuesdays & Fridays in October", time: "9:00 – 10:00 AM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#52B788", tags: ["yoga", "pilates", "fitness", "weekly"], note: "Mat-based yoga and Pilates blend. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-30" },
  { id: "oct-chair-yoga", title: "Chair Yoga 🪑", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "fitness"], date: "Wednesdays & Fridays in October", time: "10:30 – 11:30 AM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["yoga", "seniors", "low-impact", "weekly"], note: "Gentle seated yoga for balance and flexibility. Register at lhp.recdesk.com.", ages: "Adults · 55+", link: "https://lhp.recdesk.com", endDate: "2026-10-30" },
  { id: "oct-baton", title: "Baton Twirling 🪄", org: "John Trudel Community Center · (954) 784-3439", category: ["arts", "families", "fitness"], date: "Thursdays · Oct 8 – 29", time: "4:00 – 5:00 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["baton", "kids", "dance", "weekly"], note: "Four-week session. Register at lhp.recdesk.com.", ages: "Youth", link: "https://lhp.recdesk.com", endDate: "2026-10-29" },
  { id: "oct-robotics-k2", title: "Robotics & Coding — Grades K–2 🤖", org: "John Trudel Community Center · (954) 784-3439", category: ["families"], date: "Thursdays in October", time: "4:30 – 5:30 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["robotics", "coding", "stem", "kids"], note: "Build and code robots. Register at lhp.recdesk.com.", ages: "Grades K–2", link: "https://lhp.recdesk.com", endDate: "2026-10-29" },
  { id: "oct-robotics-35", title: "Robotics & Coding — Grades 3–5 🤖", org: "John Trudel Community Center · (954) 784-3439", category: ["families"], date: "Thursdays in October", time: "5:45 – 6:45 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["robotics", "coding", "stem", "kids"], note: "Build and code robots. Register at lhp.recdesk.com.", ages: "Grades 3–5", link: "https://lhp.recdesk.com", endDate: "2026-10-29" },
  { id: "oct-youth-digital-art", title: "Youth Digital Art Class 🖥️", org: "John Trudel Community Center · (954) 784-3439", category: ["arts", "families"], date: "Mondays · Oct 5 – Nov 9", time: "5:00 – 6:00 PM", location: "John Trudel Community Center, Teen Room", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["art", "digital", "kids", "new", "weekly"], note: "New six-week class. Register at lhp.recdesk.com.", ages: "Youth", link: "https://lhp.recdesk.com", endDate: "2026-11-09" },
  { id: "oct-studio-art", title: "Studio Art Class 🎨", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Mondays · Oct 5, 12, 19 & 26", time: "6:30 – 8:00 PM", location: "John Trudel Community Center, Teen Room", price: "$40 per class", color: "#48CAE4", tags: ["art", "painting", "adults"], note: "A different medium each week: oil (Oct 5), watercolor (Oct 12), acrylic (Oct 19), oil (Oct 26). Sign up for one or all at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-26" },
  { id: "oct-mahjong-mon", title: "Mahjong Open Play — Free 🀄", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "community", "social"], date: "Mondays · Oct 5, 12, 19 & 26", time: "6:00 – 8:00 PM", location: "John Trudel Community Center, Room A", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "social"], note: "Drop in and play — all levels welcome.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-26" },
  { id: "oct-mahjong-thu", title: "Mahjong & More Open Play 🀄", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "social", "community"], date: "Thursdays · Oct 1, 8, 15 & 29", time: "2:00 – 4:00 PM", location: "John Trudel Community Center, Room A", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "social"], note: "Mahjong, canasta and other table games — drop in. No session Oct 22.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-29" },
  { id: "oct-youth-pickle", title: "Youth Pickleball 🏓", org: "Dan Witt Park · (954) 784-3439", category: ["fitness", "families"], date: "Mondays · Oct 5 – 26", time: "Beginner/Intermediate 3:30–5 PM · Advanced 5–6:30 PM", location: "Pickleball Courts 1–4, Dan Witt Park", price: "See lhp.recdesk.com", color: "#52B788", tags: ["pickleball", "youth", "fall"], note: "Four-week session. Register at lhp.recdesk.com.", ages: "Youth", link: "https://lhp.recdesk.com", endDate: "2026-10-26" },
  { id: "sep-taichi", title: "Tai Chi for Arthritis 🌿", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "fitness"], date: "Tuesdays & Thursdays · Sep 22 – Oct 29", time: "11:00 AM – 12:00 PM", location: "John Trudel Community Center, Rooms A&B", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["tai-chi", "seniors", "arthritis", "low-impact"], note: "Evidence-based program for joint health and balance. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-29" },
  { id: "sep-cdsm", title: "Chronic Disease Self-Management Class", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "community"], date: "Wednesdays · Oct 7 – Nov 18", time: "2:45 – 4:30 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["health", "seniors", "workshop", "series"], note: "Six-week workshop series. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-18" },
  { id: "sep-creative-writing", title: "Creative Writing Class ✍️", org: "John Trudel Community Center · (954) 784-3439", category: ["arts", "seniors"], date: "Fridays · Sep 25 – Nov 13", time: "10:00 AM – 12:00 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["writing", "workshop", "adults", "weekly"], note: "Eight-week session. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-13" },
  { id: "sep-bright-smart", title: "Parent & Me Tiny Innovators + STEM Innovators 🔧", org: "John Trudel Community Center · (954) 784-3439", category: ["families"], date: "Tuesdays · Oct 6 – 27", time: "Tiny Innovators 12:30–1:15 PM · STEM Innovators 1:30–2:30 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["stem", "robotics", "homeschool", "parent-and-me", "new"], note: "Hands-on STEM on Tuesdays — a parent-and-me class for little ones, then STEM Innovators for older kids. Register at lhp.recdesk.com.", ages: "Toddlers with a parent · Homeschool youth", link: "https://lhp.recdesk.com", endDate: "2026-10-27" },
  // One-time October events
  { id: "oct-pumpkin", title: "Pumpkin Painting Class 🎃", org: "John Trudel Community Center · (954) 784-3439", category: ["arts", "families"], date: "Tue, Oct 27", time: "5:00 – 6:30 PM", location: "John Trudel Community Center", price: "See lhp.recdesk.com", color: "#E07A1F", tags: ["pumpkin", "painting", "halloween", "family"], note: "Paint a pumpkin for your porch. Register at lhp.recdesk.com.", ages: "All ages", link: "https://lhp.recdesk.com", endDate: "2026-10-27" },
  { id: "oct-candle", title: "Candle Making Workshop 🕯️", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Wed, Oct 28", time: "6:00 – 8:00 PM", location: "John Trudel Community Center", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["candles", "crafts", "workshop", "adults"], note: "Make your own scented candles to take home. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-10-28" },
  // NOVEMBER — REC & CITY (from the John Trudel Community Center calendar export, 10/27; details confirmed by Becky)
  // Weekly series
  { id: "nov-mat-yogalates", title: "Mat Yogalates 🧘", org: "John Trudel Community Center · (954) 784-3439", category: ["fitness", "seniors"], date: "Tuesdays & Fridays · Nov 6 – 24", time: "9:00 – 10:00 AM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#52B788", tags: ["yoga", "pilates", "fitness", "weekly"], note: "Mat-based yoga and Pilates blend. Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-24" },
  { id: "nov-chair-yoga", title: "Chair Yoga 🪑", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "fitness"], date: "Wednesdays & Fridays · Nov 4 – 25", time: "10:30 – 11:30 AM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["yoga", "seniors", "low-impact", "weekly"], note: "No class Wed, Nov 11. Register at lhp.recdesk.com.", ages: "Adults · 55+", link: "https://lhp.recdesk.com", endDate: "2026-11-25" },
  { id: "nov-sat-yoga", title: "Saturday Yoga 🧘", org: "John Trudel Community Center · (954) 784-3439", category: ["fitness"], date: "Saturdays · Nov 7, 14 & 21", time: "10:30 – 11:30 AM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#52B788", tags: ["yoga", "fitness", "weekend"], note: "Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-21" },
  { id: "nov-baton", title: "Baton Twirling 🪄", org: "John Trudel Community Center · (954) 784-3439", category: ["arts", "families", "fitness"], date: "Thursdays · Nov 5 – 19", time: "4:00 – 5:00 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["baton", "kids", "dance", "weekly"], note: "Register at lhp.recdesk.com.", ages: "Youth", link: "https://lhp.recdesk.com", endDate: "2026-11-19" },
  { id: "nov-innovators", title: "Innovators Class 🤖", org: "John Trudel Community Center · (954) 784-3439", category: ["families"], date: "Thursdays · Nov 12 & 19", time: "Grades K–2 4:30–5:30 PM · Grades 3–5 5:45–6:45 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["stem", "kids", "innovators"], note: "Register at lhp.recdesk.com.", ages: "Grades K–5", link: "https://lhp.recdesk.com", endDate: "2026-11-19" },
  { id: "nov-tiny-innovators", title: "Parent & Me Tiny Innovators + Homeschool STEM Innovators 🔧", org: "John Trudel Community Center · (954) 784-3439", category: ["families"], date: "Tuesdays · Nov 10 – Dec 8", time: "Tiny Innovators 12:30–1:15 PM · STEM Innovators 1:30–2:30 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["stem", "homeschool", "parent-and-me"], note: "Register at lhp.recdesk.com.", ages: "Toddlers with a parent · Homeschool youth", link: "https://lhp.recdesk.com", endDate: "2026-12-08" },
  { id: "nov-studio-art", title: "Studio Art Class 🎨", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Mondays · Nov 2, 9, 16 & 30", time: "6:30 – 8:00 PM (Nov 9 until 8:30 PM)", location: "John Trudel Community Center, Teen Room", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["art", "painting", "adults"], note: "A different project each week: watercolor (Nov 2), flowerpot mosaic (Nov 9), oil paint (Nov 16), coffee paint (Nov 30). Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-30" },
  { id: "nov-mahjong-mon", title: "Mahjong Mondays Open Play — Free 🀄", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "community", "social"], date: "Mondays · Nov 9, 16, 23 & 30", time: "6:00 – 8:00 PM", location: "John Trudel Community Center, Room A", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "social"], note: "Drop in and play.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-30" },
  { id: "nov-mahjong-thu", title: "Mahjong Matinee Open Play — Free 🀄", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "social", "community"], date: "Thursdays · Nov 5 & 19", time: "2:00 – 4:00 PM", location: "John Trudel Community Center, Room A", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "social"], note: "Drop in and play.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-19" },
  { id: "nov-youth-pickle", title: "Youth Pickleball 🏓", org: "Dan Witt Park · (954) 784-3439", category: ["fitness", "families"], date: "Mondays · Nov 2 – 30", time: "3:30 – 5:00 PM · 5:00 – 6:30 PM", location: "Pickleball Courts 1–4, Dan Witt Park", price: "See lhp.recdesk.com", color: "#52B788", tags: ["pickleball", "youth", "fall"], note: "Two session times each Monday. Register at lhp.recdesk.com.", ages: "Youth", link: "https://lhp.recdesk.com", endDate: "2026-11-30" },
  { id: "nov-wiggles", title: "Miss Wendy's Wiggles & Giggles 🎶", org: "John Trudel Community Center · (954) 784-3439", category: ["families", "arts"], date: "Wednesdays · Nov 4, 18 & 25", time: "9:30 – 10:15 AM · 10:30 – 11:15 AM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["toddlers", "music", "movement", "weekly"], note: "Two session times each Wednesday — pick one. Register at lhp.recdesk.com.", ages: "Toddlers", link: "https://lhp.recdesk.com", endDate: "2026-11-25" },
  // One-time November events
  { id: "nov-hoop-shoot", title: "2026 Elks Hoop Shoot 🏀", org: "LHP Recreation & the local Elks Lodge · (954) 784-3439", category: ["families", "fitness", "community"], date: "Sun, Nov 1", time: "10:00 AM – 1:00 PM", location: "Dan Witt Park Basketball Courts 1 & 2", price: null, color: "#E07A1F", tags: ["basketball", "youth", "contest"], note: "Boys and girls in three age groups: 8–9, 10–11 and 12–13. Open to the public. Register at lhp.recdesk.com or in person at the park. A partner event of LHP Recreation and the local Elks Lodge.", ages: "Ages 8–13", link: "https://lhp.recdesk.com", endDate: "2026-11-01" },
  { id: "nov-marine-life", title: "Marine Life for Seniors & Adults 🐠", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors"], date: "Wed, Nov 4", time: "1:00 – 2:00 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["seniors", "presentation", "marine-life"], note: "Register at lhp.recdesk.com.", ages: "Seniors & adults", link: "https://lhp.recdesk.com", endDate: "2026-11-04" },
  { id: "nov-ornament", title: "Ceramic Ornament Painting 🎄", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Wed, Nov 4", time: "5:00 – 7:00 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["painting", "ceramics", "holiday"], note: "Register at lhp.recdesk.com.", ages: null, link: "https://lhp.recdesk.com", endDate: "2026-11-04" },
  { id: "nov-mahjong-101", title: "Mahjong 101 — Beginner Instruction 🀄", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "social"], date: "Tue, Nov 10", time: "6:00 – 8:30 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["mahjong", "beginners", "class"], note: "Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-10" },
  { id: "nov-sfbs-camp", title: "All Day Power Camp ⚾", org: "South Florida Baseball School · Dan Witt Park", category: ["families", "fitness"], date: "Wed, Nov 11 (Veterans Day)", time: "9:00 AM – 4:00 PM · Check-in 8:30 AM", location: "Dan Witt Park, Lighthouse Point", price: "$90 per camper", color: "#52B788", tags: ["baseball", "youth", "camp", "no-school"], note: "Bring your own lunch and come in full baseball gear. Confirm attendance by email: Coachbruce1966@gmail.com.", ages: "Ages 6–14", link: "https://www.sfbspro.com", endDate: "2026-11-11" },
  { id: "nov-digestive", title: "Digestive Health Presentation", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "community"], date: "Thu, Nov 12", time: "1:00 – 2:00 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["health", "presentation"], note: "Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-12" },
  { id: "nov-artnest-monsters", title: "artNest: Little Monsters Mommy & Me 🎨", org: "John Trudel Community Center · (954) 784-3439", category: ["families", "arts"], date: "Fri, Nov 13", time: "10:00 – 11:00 AM", location: "John Trudel Community Center, Patio", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["art", "parent-and-me", "kids"], note: "Register at lhp.recdesk.com.", ages: "Little ones with a parent", link: "https://lhp.recdesk.com", endDate: "2026-11-13" },
  { id: "nov-pasta", title: "Pasta Making Class 🍝", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Sun, Nov 15", time: "1:00 – 3:30 PM", location: "John Trudel Community Center, Kitchen", price: "See lhp.recdesk.com", color: "#E07A1F", tags: ["cooking", "pasta", "class"], note: "Register at lhp.recdesk.com.", ages: null, link: "https://lhp.recdesk.com", endDate: "2026-11-15" },
  { id: "nov-artnest-squish", title: "artNest: Fall Squishfest 🍂", org: "John Trudel Community Center · (954) 784-3439", category: ["families", "arts"], date: "Sun, Nov 15", time: "4:00 – 5:00 PM", location: "John Trudel Community Center, Patio", price: "See lhp.recdesk.com", color: "#48CAE4", tags: ["art", "kids", "fall"], note: "Register at lhp.recdesk.com.", ages: "Kids", link: "https://lhp.recdesk.com", endDate: "2026-11-15" },
  { id: "nov-succulent", title: "Pumpkin Succulent Arrangement 🎃🌵", org: "John Trudel Community Center · (954) 784-3439", category: ["arts"], date: "Wed, Nov 18", time: "6:00 – 7:30 PM", location: "John Trudel Community Center, Room A", price: "See lhp.recdesk.com", color: "#E07A1F", tags: ["succulents", "crafts", "fall"], note: "Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-18" },
  { id: "nov-tech-ed", title: "Technology Education Presentation 💻", org: "John Trudel Community Center · (954) 784-3439", category: ["seniors", "community"], date: "Thu, Nov 19", time: "1:00 – 3:00 PM", location: "John Trudel Community Center, Room B", price: "See lhp.recdesk.com", color: "#00B4A6", tags: ["technology", "presentation"], note: "Register at lhp.recdesk.com.", ages: "Adults", link: "https://lhp.recdesk.com", endDate: "2026-11-19" },
  // City & parks — standing items
  { id: "farmers-market", title: "LHP Farmer's Market 🥕", org: "Dan Witt Park · (954) 784-3439", category: ["community", "families"], date: "2nd Sunday of every month · Next: Sun, Nov 8", time: "9:00 AM – 12:30 PM", location: "Dan Witt Park", price: null, color: "#023E8A", tags: ["market", "monthly", "local"], note: "Open to the public.", ages: "All ages", link: "https://www.lighthousepointfl.gov/Calendar.aspx?EID=2024&month=11&year=2026" },
  { id: "nov-veterans-day", title: "Veterans Day — Parks Open 🇺🇸", org: "City of Lighthouse Point", category: ["community"], date: "Wed, Nov 11", time: "All day", location: "Lighthouse Point", price: null, color: "#023E8A", tags: ["holiday", "veterans-day"], note: "City offices are closed. Parks are open.", ages: null, link: "https://www.lighthousepointfl.gov/Calendar.aspx?EID=1863&month=11&year=2026", endDate: "2026-11-11" },
  { id: "nov-thanksgiving", title: "Thanksgiving — Parks Open 🦃", org: "City of Lighthouse Point", category: ["community"], date: "Thu & Fri, Nov 26 – 27", time: "All day", location: "Lighthouse Point", price: null, color: "#023E8A", tags: ["holiday", "thanksgiving"], note: "City offices are closed. Parks are open.", ages: null, link: "https://www.lighthousepointfl.gov/Calendar.aspx?EID=1864&month=11&year=2026", endDate: "2026-11-27" },
  { id: "nov-vuln-workshop", title: "Vulnerability Assessment Community Workshop", org: "City of Lighthouse Point", category: ["community"], date: "Tue, Nov 10", time: "5:00 PM", location: "Check the city calendar for details", price: null, color: "#023E8A", tags: ["city", "workshop", "community"], note: "Community workshop listed on the city calendar.", ages: null, link: "https://www.lighthousepointfl.gov/Calendar.aspx?EID=2012&month=11&year=2026", endDate: "2026-11-10" },
  // RESIDENT & BUSINESS SUBMISSIONS (Google Form)
  { id: "wiggles-aug", title: "Miss Wendy's Wiggles & Giggles 🎶", org: "John Trudel Community Center · (954) 784-3439", category: ["families", "arts"], date: "Wednesdays through Oct 28", time: "9:30 – 10:15 AM · 10:30 – 11:15 AM", location: "John Trudel Community Center", price: "$200 resident · $240 non-resident · 8-week session", color: "#0077B6", tags: ["toddlers", "music", "movement", "weekly"], note: "Two session times each Wednesday — pick one. 8-week session. Register at lhp.recdesk.com.", ages: "9 months – 2½ years", link: "https://lhp.recdesk.com", endDate: "2026-10-28" },
  // GALUPPI'S — NON-MUSIC (October)
  { id: "gal-spook-oct", title: "Spooktacular Halloween Brunch 👻", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", category: ["families"], date: "Sat, Oct 31", time: "See event page", location: "Galuppi's, Pompano Beach", price: "$50 deposit · Sold out", color: "#E07A1F", tags: ["brunch", "kids", "halloween", "costumes"], note: "Costumes and spooky kids' activities. Reserve through Galuppi's.", ages: "Families with kids", link: "https://www.galuppis.com/kids-event/spooktacular-halloween-brunch/", endDate: "2026-10-31" },
  { id: "cove-costume-oct", title: "Kids + Pets Costume Contest 🎃🐶", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", category: ["families", "community"], date: "Fri, Oct 30", time: "4:00 – 8:00 PM", location: "Cove Brewery, 1500 SE 3rd Ct, Deerfield Beach", price: null, color: "#E07A1F", tags: ["halloween", "costumes", "kids", "pets"], note: null, ages: "Kids & pets", link: "https://www.covebrewery.com/events", endDate: "2026-10-30" },
  { id: "gal-yoga-nov", title: "Yoga, FIIT & Brunch at Galuppi's 🧘", org: "Galuppi's · 1103 N Federal Hwy, Pompano Beach", category: ["fitness"], date: "Sun, Nov 22", time: "Check venue for details", location: "Galuppi's, Pompano Beach", price: "Free class · RSVP", color: "#52B788", tags: ["yoga", "fitness", "free", "brunch"], note: "Free yoga class followed by brunch.", ages: "All levels", link: "https://www.galuppis.com/event/yoga-fiit-brunch-wellness-event/", endDate: "2026-11-22" },
  // LOCAL ATTRACTION — HILLSBORO LIGHTHOUSE (monthly tour; update date each month
  // from hillsborolighthouse.org/tours)
  { id: "hillsboro-dec", title: "Hillsboro Lighthouse Tour", org: "Hillsboro Lighthouse Preservation Society · (954) 942-2102", category: ["families", "seniors", "community"], date: "Sat, Dec 5", time: "Sail times 9:00 · 10:00 · 11:00 AM · 12:00 · 1:00 · 2:00 · 3:00 PM", location: "Shuttle from South Florida Diving HQ · 101 N Riverside Dr, Pompano Beach", price: "$35/person transportation fee · Included with HLPS membership", color: "#0077B6", tags: ["lighthouse", "history", "landmark", "tour", "monthly", "outdoor"], note: "Check-in opens 30 minutes before the first sail and stays open until the last boat. No seat reservations — first come, first served. Closed-toe shoes required; no backpacks, bags, food or drinks. Children must stay with an adult. The climb is 167 narrow, steep steps. Paid city parking across the street.", ages: "All ages · children with an adult", link: "https://www.hillsborolighthouse.org/tours", endDate: "2026-12-05" },
  // DANGEROUS MINDS BREWING
  { id: "dm_run", title: "Run to Hops 🏃", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["fitness", "social", "community"], date: "Every Tuesday", time: "6:30 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free · 15% off food & beer after", color: "#52B788", tags: ["running", "fitness", "social", "weekly", "beer"], note: "2 or 4 mile run with @team_fortlauderdale. All participants get 15% off food & craft beer!", ages: null, link: "https://dangerousmindsbrewing.com/event/1968" },
  { id: "dm_crok", title: "Crokinole Night 🟢", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social"], date: "Every Tuesday", time: "7:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free", color: "#48CAE4", tags: ["crokinole", "games", "social", "weekly", "free"], note: "Flick wooden discs, rack up points, knock opponents off the board. No experience needed — beginners always welcome!", ages: null, link: "https://dangerousmindsbrewing.com/event/1972" },
  { id: "dm_triv1", title: "Trivia Night 🎯", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social"], date: "Every Thursday", time: "7:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free · Prizes for top teams", color: "#48CAE4", tags: ["trivia", "games", "social", "free", "prizes"], note: "Free to play — top teams each night win prizes!", ages: null, link: "https://dangerousmindsbrewing.com/Events" },
  { id: "dm_halloween_oct", title: "Halloween Party 🎃", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social", "nightlife"], date: "Sat, Oct 31", time: "6:00 – 10:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: null, color: "#E07A1F", tags: ["halloween", "party", "social"], note: "The brewery's annual Halloween party.", ages: null, link: "https://dangerousmindsbrewing.com/event/2269", endDate: "2026-10-31" },
  { id: "dm_dine_nov", title: "Dine to Donate — Gilda's Club South Florida 💛", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["community"], date: "Wed, Nov 4", time: "6:00 – 10:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: null, color: "#023E8A", tags: ["charity", "fundraiser", "dining"], note: "15% of net food and drink sales go to Gilda's Club South Florida.", ages: null, link: "https://dangerousmindsbrewing.com/event/2240", endDate: "2026-11-04" },
  { id: "dm_learncrok_nov", title: "Learn to Crokinole 🟢", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social"], date: "Sat, Nov 14", time: "3:00 – 6:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free to play", color: "#48CAE4", tags: ["crokinole", "games", "beginners", "free"], note: "Never played? Learn with Jason Talbot from SE Florida Crokinole.", ages: null, link: "https://dangerousmindsbrewing.com/event/2249", endDate: "2026-11-14" },
  { id: "dm_brits_nov", title: "Brits & Brews 🇬🇧", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social", "community"], date: "Wed, Nov 18", time: "7:00 – 9:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: null, color: "#48CAE4", tags: ["british", "social", "monthly"], note: "Relaxed monthly social gathering hosted by brewery owner Adam.", ages: null, link: "https://dangerousmindsbrewing.com/event/2250", endDate: "2026-11-18" },
  { id: "dm_lucky7_nov", title: "Lucky 7 Anniversary Party 🍀", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social", "community", "nightlife"], date: "Sat, Nov 21", time: "12:00 – 10:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: null, color: "#52B788", tags: ["anniversary", "party", "brewery"], note: null, ages: null, link: "https://dangerousmindsbrewing.com/event/2234", endDate: "2026-11-21" },
  // GARAGE & YARD SALES
];

const allEvents = [...events, ...byteEvents].filter(isEventActive);
const visibleFeaturedEvents = featuredEvents.filter(isEventActive);

// Single music card — shared by date-grouped view and flat-venue view.
const MusicCard = ({ ev, saved, onSave }) => (
  <div style={{ ...styles.musicCard, borderLeft: `4px solid ${ev.color}` }}>
    <div style={styles.musicLeft}>
      <div style={styles.musicEmoji}>{ev.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={styles.musicTitle}>{ev.title}</div>
        <div style={styles.musicOrg}>{ev.org}</div>
        <div style={styles.musicMeta}><span>📅 {ev.date}</span><span>⏰ {ev.time}</span></div>
        {ev.note && <div style={styles.musicNote}>ℹ️ {ev.note}</div>}
        <div style={styles.musicBottom}>
          <span style={{ ...styles.musicPrice, color: ev.color }}>🎟 {ev.price}</span>
          {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" style={{ ...styles.musicLink, color: ev.color }}>More Info →</a>}
        </div>
      </div>
    </div>
    <button onClick={onSave} style={{ ...styles.musicSave, color: saved ? ev.color : "#cce4f0" }}>
      {saved ? "♥" : "♡"}
    </button>
  </div>
);

export default function LHPApp() {
  const trackCategoryClick = (label) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "category_click", {
        event_category: "navigation",
        event_label: label,
      });
    }
  };

  // Refs for scroll-to-section behavior when a category is selected
  const musicRef = useRef(null);
  const eventsRef = useRef(null);

  // Scroll to the relevant section after category selection.
  // Music & Nightlife → music section. All other categories → events list.
  // Selecting "All" (null) doesn't scroll — user is browsing top of page.
  const scrollToCategory = (catId) => {
    if (!catId) return;
    // Small delay so React renders the new filtered view before we measure offsets
    setTimeout(() => {
      const target = catId === "nightlife" ? musicRef.current : eventsRef.current;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [savedEvents, setSavedEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lhp_saved") || "[]"); } catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [musicVenue, setMusicVenue] = useState("all");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showInstallSheet, setShowInstallSheet] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    }
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    // Detect if already installed (running as PWA).
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setInstalled(true);
    } else {
      // iOS Safari never fires beforeinstallprompt — show the banner so users
      // can still get the manual "Add to Home Screen" tutorial.
      const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
      const dismissed = (() => { try { return localStorage.getItem("lhp_install_dismissed") === "1"; } catch { return false; } })();
      if (isIOS && !dismissed) {
        setShowInstallBanner(true);
      }
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    // If we have a native install prompt (Android/Chrome), use it.
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
      return;
    }
    // No native prompt (iOS Safari) — show the manual tutorial sheet.
    setShowInstallSheet(true);
  };

  const eventPriority = (e) => {
    const org = e.org.toLowerCase();
    if (org.includes("john trudel") || org.includes("lhp rec") || org.includes("lhp recreation") || org.includes("lhp tennis") || org.includes("dan witt") || org.includes("city of lighthouse point") || org.includes("fletcher hall")) return 1;
    if (org.includes("lighthouse point library") || org.includes("lighthousepoint lib")) return 2;
    return 3;
  };

  const filtered = allEvents.filter((e) => {
    const matchCat = activeCategory ? e.category.includes(activeCategory) : true;
    const matchSearch = search
      ? e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        e.org.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  }).sort((a, b) => {
    // 1. Dated events first, soonest on top. 2. Ongoing/weekly programs after.
    // Ties break by source (City → Library → others), then start time.
    const da = getNextDate(a), db = getNextDate(b);
    if (da && db && da - db !== 0) return da - db;
    if (da && !db) return -1;
    if (!da && db) return 1;
    const p = eventPriority(a) - eventPriority(b);
    if (p !== 0) return p;
    return parseTimeForSort(a.time) - parseTimeForSort(b.time);
  });

  const toggleSave = (id) =>
    setSavedEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("lhp_saved", JSON.stringify(next)); } catch {}
      return next;
    });

  const showMusic = !activeCategory || activeCategory === "nightlife";

  const visibleMusic = showMusic
    ? musicVenue === "all" ? visibleFeaturedEvents : visibleFeaturedEvents.filter(e => e.venue === musicVenue)
    : [];

  const activeCat = categories.find((c) => c.id === activeCategory);

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <img
              src="/lhp-lighthouse-medium_1.png"
              alt="LHP lighthouse"
              style={styles.logoLighthouse}
            />
            <div style={styles.wordmark}>
              <span style={styles.wordmarkLHP}>LHP</span>
              <span style={styles.wordmarkSocial}>SOCIAL</span>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.datePill}>{getDatePill()}</div>
            <button onClick={() => setShowSaved(true)} style={styles.savedBadge}>♡ {savedEvents.length}</button>
          </div>
        </div>
      </div>

      {/* Designer's mark — "Built by a local, for locals." sits below the wordmark */}
      <div style={styles.designerMarkWrap}>
        <div style={styles.designerMark}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 1.2L5.6 2.4 6.8 2.6 5.6 3.4 5.6 4.6 5 3.8 4.4 4.6 4.4 3.4 3.2 2.6 4.4 2.4z" fill={LHP4.lime}/>
            <rect x="3.5" y="4.6" width="3" height="6.5" rx="0.3" fill={LHP4.navy}/>
            <path d="M2.5 11.1 L7.5 11.1 L8 13 L2 13 Z" fill={LHP4.navy}/>
          </svg>
          <span style={styles.designerMarkText}>Built by a local, <em style={styles.designerMarkEm}>for locals.</em></span>
        </div>
      </div>

      {/* Time-of-day greeting */}
      <div style={styles.greeting}>
        <div style={styles.greetingHello}>{getGreeting()}</div>
        <div style={styles.greetingSub}>Here's what's happening around the point.</div>
      </div>

      {showInstallBanner && !installed && (
        <div style={styles.installBanner}>
          <div style={styles.installBannerLeft}>
            <div style={styles.installIcon}>
              <div style={styles.installIconBeam} />
              <img
                src="/lhp-lighthouse-medium_1.png"
                alt=""
                style={styles.installIconLighthouse}
              />
            </div>
            <div>
              <div style={styles.installTitle}>Add LHP Social to your phone</div>
              <div style={styles.installSub}>Get one-tap access to local events</div>
            </div>
          </div>
          <div style={styles.installActions}>
            <button style={styles.installBtn} onClick={handleInstall}>
              <svg width="14" height="16" viewBox="0 0 18 22" fill="none" style={{ marginRight: 5 }}>
                <path d="M9 1v13M9 1L5.2 4.9M9 1l3.8 3.9" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 8.5h-1A1.5 1.5 0 0 0 1 10v9.5A1.5 1.5 0 0 0 2.5 21h13a1.5 1.5 0 0 0 1.5-1.5V10a1.5 1.5 0 0 0-1.5-1.5h-1" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Install
            </button>
            <button style={styles.installDismiss} onClick={() => {
              setShowInstallBanner(false);
              try { localStorage.setItem("lhp_install_dismissed", "1"); } catch {}
            }}>✕</button>
          </div>
        </div>
      )}

      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search events, classes, programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>}
      </div>
      {search && (
        <div style={styles.searchResultNote}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<strong>{search}</strong>"
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Browse by category</div>
        <div style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const newCat = isActive ? null : cat.id;
                  trackCategoryClick(newCat || "all");
                  setActiveCategory(newCat);
                  scrollToCategory(newCat);
                }}
                style={{
                  ...styles.categoryCard,
                  background: isActive ? cat.bg : "#fff",
                  border: `1.5px solid ${isActive ? cat.color : LHP4.hairSoft}`,
                  boxShadow: isActive
                    ? `0 4px 16px ${cat.color}25`
                    : `0 1px 2px ${LHP4.hairSoft}, 0 2px 8px rgba(0,29,68,0.04)`,
                }}>
                <div style={{ marginBottom: 6 }}>
                  <CatIcon id={cat.id} color={cat.color} size={26} />
                </div>
                <span style={{ ...styles.catLabel, color: cat.color }}>{cat.label}</span>
                <span style={{ ...styles.catDesc, color: LHP4.mute }}>{cat.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.tabBarWrap}>
        <div style={styles.tabBar}>
          {sections.map((tab) => {
            const isActive = tab.id === "all" ? activeCategory === null : activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  const newCat = tab.id === "all" ? null : tab.id;
                  trackCategoryClick(tab.id);
                  setActiveCategory(newCat);
                  scrollToCategory(newCat);
                }}
                style={{
                  ...styles.tab,
                  background: isActive ? LHP4.navy : "#fff",
                  color: isActive ? "#fff" : LHP4.navy,
                  fontWeight: isActive ? 800 : 600,
                  borderColor: isActive ? LHP4.navy : LHP4.hairSoft,
                }}>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.registerBanner}>
        <span style={styles.registerText}>📋 Registration required for Library & Recreation programs</span>
        <div style={styles.registerLinks}>
          <a href="https://lighthousepointlib.librarycalendar.com/events/month" target="_blank" rel="noreferrer" style={styles.registerLink}>Library calendar →</a>
          <a href="https://lhp.recdesk.com/Community/Home" target="_blank" rel="noreferrer" style={styles.registerLink}>Recreation →</a>
        </div>
      </div>

      <div style={styles.disclaimerBanner}>
        <span style={styles.disclaimerText}>Please confirm event details with the venue before heading out.</span>
      </div>

      {showMusic && (
        <div ref={musicRef} style={styles.featuredWrap}>
          <div style={styles.featuredHeader}>
            <div style={styles.featuredLabel}>🎶 LIVE MUSIC</div>
            <div style={styles.venueToggle}>
              {venues.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setMusicVenue(id)}
                  style={{ ...styles.venueBtn, background: musicVenue === id ? LHP4.navy : "#fff", color: musicVenue === id ? "#fff" : LHP4.navy, fontWeight: musicVenue === id ? 800 : 600, border: `1px solid ${musicVenue === id ? LHP4.navy : LHP4.hairSoft}` }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {musicVenue === "papas" && <div style={styles.venueInfo}>🦞 <strong>Papa's Raw Bar</strong> — 4610 N Federal Hwy · Fri/Sat 7–10 PM · Sun 1–4 PM</div>}
          {musicVenue === "nautidawg" && <div style={styles.venueInfo}>⚓ <strong>The Nauti Dawg Marina Cafe</strong> — B Dock · Live music Fri & Sun 5:30–9:30 PM · Happy Hour Mon–Fri 3–6 PM</div>}
          {musicVenue === "packys" && <div style={styles.venueInfo}>🍺 <strong>Packy's Sports Pub</strong> — 4480 N Federal Hwy, LHP · Live bands Fri & Sat 8 PM–12 AM · Happy Hour Mon–Fri</div>}
          {musicVenue === "galuppis" && <div style={styles.venueInfo}>🎸 <strong>Galuppi's</strong> — Pompano Beach · <a href="https://www.galuppis.com/live-music-schedule/" target="_blank" rel="noreferrer" style={{ color: "#0077B6", fontWeight: 800 }}>Full schedule →</a></div>}
          {musicVenue === "cove" && <div style={styles.venueInfo}>🍻 <strong>Cove Brewery</strong> — 1500 SE 3rd Ct, Deerfield Beach · Craft beer, live music & weekly events</div>}
          {musicVenue === "dangminds" && <div style={styles.venueInfo}>🧠 <strong>Dangerous Minds Brewing</strong> — 1901 N Federal Hwy, Pompano Beach · Tue–Sun 1–10 PM · <a href="https://dangerousmindsbrewing.com" target="_blank" rel="noreferrer" style={{ color: "#0077B6", fontWeight: 800 }}>dangerousmindsbrewing.com →</a></div>}
          {musicVenue === "all" ? (
            (() => {
              const { recurring, groups } = groupMusicByDate(visibleMusic);
              return (
                <>
                  {recurring.length > 0 && (
                    <>
                      <div style={styles.musicDateHeader}>
                        <span style={styles.musicDateBadge}>♾️ Every Week</span>
                        <span style={styles.musicDateCount}>{recurring.length} ongoing</span>
                      </div>
                      <div style={styles.musicList}>
                        {recurring.map((ev) => (
                          <MusicCard key={ev.id} ev={ev} saved={savedEvents.includes(ev.id)} onSave={() => toggleSave(ev.id)} />
                        ))}
                      </div>
                    </>
                  )}
                  {groups.map((g) => (
                    <div key={g.date}>
                      <div style={styles.musicDateHeader}>
                        <span style={styles.musicDateBadge}>📅 {g.label}</span>
                        <span style={styles.musicDateCount}>{g.events.length} show{g.events.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div style={styles.musicList}>
                        {g.events.map((ev) => (
                          <MusicCard key={ev.id} ev={ev} saved={savedEvents.includes(ev.id)} onSave={() => toggleSave(ev.id)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()
          ) : (
            <div style={styles.musicList}>
              {visibleMusic.map((ev) => (
                <MusicCard key={ev.id} ev={ev} saved={savedEvents.includes(ev.id)} onSave={() => toggleSave(ev.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      <div ref={eventsRef} style={styles.section}>
        <div style={styles.eventsHeader}>
          <div style={styles.sectionLabel}>
            {activeCategory ? activeCat?.label : search ? "Search Results" : "All Events & Programs"}
          </div>
          <div style={styles.eventCount}>{filtered.length} found</div>
        </div>
        {filtered.length === 0 && activeCategory === "sales" && (
          <div style={styles.salesEmptyState}>
            <div style={styles.salesEmptyEmoji}>🏷️</div>
            <div style={styles.salesEmptyTitle}>No sales posted this week</div>
            <div style={styles.salesEmptySub}>Got one coming up? Let your neighbors know — it's free to list.</div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScBHLgRpq_VymUVHTplqTy8TSvO9Ca9nzyITLJYejKRlaLXdg/viewform"
              target="_blank"
              rel="noreferrer"
              style={styles.salesEmptyBtn}
            >
              + Submit your sale →
            </a>
          </div>
        )}
        {filtered.length === 0 && activeCategory !== "sales" && (
          <div style={styles.emptyState}>No events found. Try a different search or category.</div>
        )}
        <div style={styles.eventList}>
          {filtered.map((event) => (
            <div key={event.id} style={styles.eventCard}>
              <div style={{ ...styles.eventAccent, background: event.color }} />
              <div style={styles.eventBody}>
                <div style={styles.eventTop}>
                  <div style={styles.eventTitle}>{event.title}</div>
                  <button onClick={() => toggleSave(event.id)} style={{ ...styles.saveBtn, color: savedEvents.includes(event.id) ? event.color : "#cce4f0" }}>
                    {savedEvents.includes(event.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div style={styles.eventOrg}>{event.org}</div>
                <div style={styles.eventMeta}>
                  <span>📅 {event.date}</span>
                  <span>⏰ {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>
                <div style={styles.badgeRow}>
                  {event.ages && <span style={{ ...styles.ageBadge, color: event.color, background: event.color + "12", border: `1px solid ${event.color}30` }}>👤 {event.ages}</span>}
                  {event.price && <span style={{ ...styles.priceBadge, color: event.color, background: event.color + "12", border: `1px solid ${event.color}30` }}>💲 {event.price}</span>}
                </div>
                {event.note && <div style={styles.noteBadge}>ℹ️ {event.note}</div>}
                <div style={styles.tagRow}>{(event.tags || []).map((tag) => <span key={tag} style={styles.tag}>#{tag}</span>)}</div>
                {event.link && <a href={event.link} target="_blank" rel="noreferrer" style={{ ...styles.ctaBtn, background: event.color }}>More Info / Register →</a>}
              </div>
            </div>
          ))}
        </div>
        {activeCategory === "sales" && (
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScBHLgRpq_VymUVHTplqTy8TSvO9Ca9nzyITLJYejKRlaLXdg/viewform" target="_blank" rel="noreferrer" style={styles.submitSaleBtn}>
            + Submit your garage sale →
          </a>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerIcon}>📚</div>
        <div style={styles.footerText}>Lighthouse Point Library</div>
        <div style={styles.footerSub}>2200 NE 38th St · (954) 946-6398</div>
        <a href="https://lighthousepointlib.librarycalendar.com/events/month" target="_blank" rel="noreferrer" style={styles.footerBtn}>View Full Library Calendar →</a>
        <div style={styles.footerDivider} />
        <div style={styles.footerText}>John Trudel Community Center</div>
        <div style={styles.footerSub}>4521 NE 22nd Ave · (954) 784-3439</div>
        <a href="https://lhp.recdesk.com/Community/Home" target="_blank" rel="noreferrer" style={{ ...styles.footerBtn, background: LHP4.tintTeal, color: LHP4.teal, border: `1px solid ${LHP4.hairSoft}` }}>Register at lhp.recdesk.com →</a>
        <div style={styles.footerDivider} />
        <div style={styles.footerText2}>Own a local business? List your events & deals.</div>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScBHLgRpq_VymUVHTplqTy8TSvO9Ca9nzyITLJYejKRlaLXdg/viewform" target="_blank" rel="noreferrer" style={{ ...styles.footerBtn2, display: "block", textDecoration: "none", textAlign: "center" }}>+ Submit an Event or Special</a>
        <div style={styles.footerDivider} />
        <div style={styles.footerDisclaimer}>
          LHP Social is an independent community platform and is not affiliated with or operated by the City of Lighthouse Point.
        </div>
        <div style={styles.footerLinkRow}>
          <button onClick={() => setShowAbout(true)} style={styles.privacyLink}>About</button>
          <span style={{ color: LHP4.mute, fontSize: 11, opacity: 0.4 }}>·</span>
          <button onClick={() => setShowPrivacy(true)} style={styles.privacyLink}>Privacy Policy</button>
        </div>
        <div style={styles.footerCopyright}>© 2026 lhpsocial.com</div>
      </div>

      {/* v4 bottom signature — "Stay Connected. Stay Local." sign-off */}
      <div style={styles.bottomSignature}>
        <div style={styles.bottomSignatureRow}>
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path d="M5.5 9.2C2 6.5 1 5 1 3.2 1 1.8 2 1 3.2 1c.9 0 1.7.5 2.3 1.4C6.1 1.5 6.9 1 7.8 1 9 1 10 1.8 10 3.2c0 1.8-1 3.3-4.5 6z" fill={LHP4.lime}/>
          </svg>
          <span>Stay Connected.</span>
          <span style={styles.bottomSignatureLime}>Stay Local.</span>
        </div>
      </div>

      {showPrivacy && (
        <div style={styles.modalOverlay} onClick={() => setShowPrivacy(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Privacy Policy</div>
              <button style={styles.modalClose} onClick={() => setShowPrivacy(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalSection}>LHP Social respects your privacy.</p>
              <p style={styles.modalSection}>Information submitted through contact forms or event submissions may include names, email addresses, event details, or other information voluntarily provided by users. This information is used only for reviewing event submissions, responding to inquiries, and communicating about posted events or updates.</p>
              <p style={styles.modalSection}>LHP Social does not sell personal information to third parties.</p>
              <p style={styles.modalSection}>Basic website analytics (Google Analytics) may be used to understand website traffic and improve the user experience.</p>
              <p style={styles.modalSection}>Users should avoid submitting sensitive personal information through forms on this website.</p>
              <div style={styles.modalDivider} />
              <p style={styles.modalDisclaimer}>LHP Social is an independent community platform and is not affiliated with or operated by the City of Lighthouse Point. While we try to keep information accurate and current, event details may change. Visitors should confirm dates, times, and locations directly with event organizers.</p>
              <p style={styles.modalContact}>Questions? Contact: <a href="mailto:hello@lhpsocial.com" style={{ color: "#0096C7", fontWeight: 700 }}>hello@lhpsocial.com</a></p>
            </div>
          </div>
        </div>
      )}
      {showSaved && (
        <div style={styles.modalOverlay} onClick={() => setShowSaved(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>♥ My Saved Events</div>
              <button style={styles.modalClose} onClick={() => setShowSaved(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              {savedEvents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>♡</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#023E8A", marginBottom: 6 }}>No saved events yet</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>Tap the ♡ on any event to save it here</div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: "#7aabb8", marginBottom: 14 }}>Your saved events are stored on this device. Tap ♥ again on any event to remove it.</p>
                  {[...visibleFeaturedEvents, ...byteEvents, ...allEvents].filter(e => savedEvents.includes(e.id)).map(ev => (
                    <div key={ev.id} style={{ ...styles.eventCard, marginBottom: 10 }}>
                      <div style={{ ...styles.eventAccent, background: ev.color || "#0077B6" }} />
                      <div style={styles.eventBody}>
                        <div style={styles.eventTop}>
                          <div style={styles.eventTitle}>{ev.title}</div>
                          <button onClick={() => toggleSave(ev.id)} style={{ ...styles.saveBtn, color: ev.color || "#0077B6" }}>♥</button>
                        </div>
                        <div style={styles.eventOrg}>{ev.org}</div>
                        <div style={styles.eventMeta}>
                          <span>📅 {ev.date}</span>
                          <span>⏰ {ev.time}</span>
                        </div>
                        {ev.price && <div style={{ fontSize: 11, fontWeight: 700, color: ev.color || "#0077B6" }}>🎟 {ev.price}</div>}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setSavedEvents([]); try { localStorage.removeItem("lhp_saved"); } catch {} }} style={{ width: "100%", marginTop: 8, padding: "10px", fontSize: 12, fontWeight: 700, background: "none", border: "1.5px solid #eee", borderRadius: 10, color: "#aaa", cursor: "pointer" }}>Clear all saved events</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div style={styles.modalOverlay} onClick={() => setShowAbout(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>About LHP Social</div>
              <button style={styles.modalClose} onClick={() => setShowAbout(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalSection}>LHP Social was created to help residents stay connected to what's happening in Lighthouse Point.</p>
              <p style={styles.modalSection}>The site shares local events, programs, activities, community happenings, and information from organizations serving the Lighthouse Point area.</p>
              <p style={styles.modalSection}><strong style={{ color: "#023E8A" }}>The goal is simple:</strong> Make it easier for residents and families to find things to do, support local programs, and stay involved in the community.</p>
              <p style={styles.modalSection}>Events and information may come from public sources, local organizations, businesses, schools, nonprofits, community groups, and resident submissions.</p>
              <div style={styles.modalDivider} />
              <p style={styles.modalDisclaimer}>LHP Social is independently operated and is not affiliated with or operated by the City of Lighthouse Point. While we try to keep information accurate and current, event details may change. Visitors should confirm dates, times, and locations directly with event organizers when possible.</p>
              <div style={styles.modalDivider} />
              <p style={{ ...styles.modalSection, fontWeight: 700, color: "#023E8A", fontSize: 13 }}>Have an event to share?</p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScBHLgRpq_VymUVHTplqTy8TSvO9Ca9nzyITLJYejKRlaLXdg/viewform" target="_blank" rel="noreferrer" style={{ ...styles.ctaBtn, background: "#0077B6", display: "inline-block", marginBottom: 12 }}>+ Submit an Event →</a>
              <p style={styles.modalContact}>Questions? Contact: <span style={{ color: "#0096C7", fontWeight: 700 }}>hello@lhpsocial.com</span></p>
            </div>
          </div>
        </div>
      )}

      {showInstallSheet && (
        <div style={styles.modalOverlay} onClick={() => setShowInstallSheet(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.installSheetHero}>
              <div style={styles.installSheetIcon}>
                <div style={styles.installSheetIconBeam} />
                <img src="/lhp-lighthouse-medium_1.png" alt="" style={styles.installSheetIconLighthouse} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.installSheetTitle}>Install LHP Social</div>
                <div style={styles.installSheetSub}>Three taps and it lives on your home screen. No app store, no account.</div>
              </div>
              <button style={styles.modalClose} onClick={() => setShowInstallSheet(false)}>✕</button>
            </div>

            <div style={styles.installSheetDivider} />

            <div style={styles.installStepRow}>
              <div style={styles.installStepNum}>1</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.installStepTitle}>Tap the Share button</div>
                <div style={styles.installStepSub}>At the bottom of Safari</div>
              </div>
              <div style={styles.installStepGlyph}>
                <svg width="20" height="20" viewBox="0 0 18 22" fill="none">
                  <path d="M9 1v13M9 1L5.2 4.9M9 1l3.8 3.9" stroke="#0A84FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 8.5h-1A1.5 1.5 0 0 0 1 10v9.5A1.5 1.5 0 0 0 2.5 21h13a1.5 1.5 0 0 0 1.5-1.5V10a1.5 1.5 0 0 0-1.5-1.5h-1" stroke="#0A84FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div style={styles.installStepHair} />

            <div style={styles.installStepRow}>
              <div style={styles.installStepNum}>2</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.installStepTitle}>Choose Add to Home Screen</div>
                <div style={styles.installStepSub}>Scroll the share sheet if you don't see it</div>
              </div>
              <div style={styles.installStepGlyphWide}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#000", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Add to Home Screen</span>
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <rect x="1" y="1" width="20" height="20" rx="5.5" stroke="#000" strokeWidth="1.6"/>
                  <path d="M11 6.5v9M6.5 11h9" stroke="#000" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div style={styles.installStepHair} />

            <div style={styles.installStepRow}>
              <div style={styles.installStepNum}>3</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.installStepTitle}>Tap Add</div>
                <div style={styles.installStepSub}>Top right corner. That's it.</div>
              </div>
              <div style={styles.installStepAddBtn}>Add</div>
            </div>

            <div style={styles.installTipStrip}>
              <svg width="14" height="14" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
                <path d="M5 1l1.2 2.5L9 4l-2 2 .5 2.8L5 7.5 2.5 8.8 3 6 1 4l2.8-.5L5 1z" fill={LHP4.lime}/>
              </svg>
              <span>Opens like a real app — no Safari bars, just your weekend.</span>
            </div>

            <div style={styles.installSheetSig}>Built by a Local, for Locals.</div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { fontFamily: "'Nunito', 'Segoe UI', sans-serif", background: LHP4.pageBg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 48 },
  // v4 light header — small lighthouse + LHP SOCIAL wordmark + date pill
  header: { background: LHP4.pageBg, padding: "18px 18px 12px", borderBottom: `1px solid ${LHP4.hairSoft}` },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  logoRow: { display: "flex", alignItems: "center", gap: 9 },
  logoLighthouse: { height: 40, width: "auto", display: "block", flexShrink: 0 },
  wordmark: { fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif', fontWeight: 900, fontSize: 21, letterSpacing: -0.6, lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap" },
  wordmarkLHP: { color: LHP4.navy },
  wordmarkSocial: { color: LHP4.teal, marginLeft: 5 },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  datePill: { fontSize: 10, color: LHP4.mute, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" },
  savedBadge: { background: LHP4.tintTeal, border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 13, fontWeight: 700, color: LHP4.teal, cursor: "pointer" },
  // v4 greeting block (time-of-day aware)
  greeting: { padding: "16px 20px 6px" },
  greetingHello: { fontSize: 26, fontWeight: 800, color: LHP4.navy, letterSpacing: -0.5, lineHeight: 1.15 },
  greetingSub: { marginTop: 5, fontSize: 13.5, color: LHP4.body, fontWeight: 500 },
  searchWrap: { margin: "14px 16px 0", background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", padding: "10px 14px", boxShadow: `0 1px 2px ${LHP4.hairSoft}, 0 4px 14px rgba(0,29,68,0.05)`, border: `1px solid ${LHP4.hairSoft}`, gap: 8 },
  searchIcon: { fontSize: 16 },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 14, color: LHP4.navy, fontFamily: "inherit", background: "transparent" },
  clearBtn: { background: "none", border: "none", color: LHP4.mute, cursor: "pointer", fontSize: 14, padding: 0 },
  searchResultNote: { margin: "6px 16px 0", fontSize: 12, color: LHP4.teal, fontWeight: 700 },
  section: { padding: "20px 16px 0" },
  sectionLabel: { fontWeight: 800, fontSize: 15, color: LHP4.navy, marginBottom: 12, letterSpacing: -0.3 },
  categoryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  // Toned-down category tiles — white-ish background, color reserved for icon/accent
  categoryCard: { display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "14px", borderRadius: 14, cursor: "pointer", transition: "all 0.18s ease", textAlign: "left", gap: 3 },
  catEmoji: { fontSize: 26, marginBottom: 4 },
  catLabel: { fontWeight: 800, fontSize: 13, lineHeight: 1.2 },
  catDesc: { fontSize: 11, fontWeight: 500 },
  tabBarWrap: { overflowX: "auto", padding: "16px 16px 0", scrollbarWidth: "none" },
  tabBar: { display: "flex", gap: 8, width: "max-content" },
  tab: { border: `1px solid ${LHP4.hairSoft}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" },
  registerBanner: { margin: "14px 16px 0", background: LHP4.tintTeal, borderRadius: 12, padding: "10px 14px" },
  registerText: { fontSize: 12, color: LHP4.navy, fontWeight: 700, display: "block", marginBottom: 5 },
  registerLinks: { display: "flex", gap: 16 },
  registerLink: { fontSize: 12, color: LHP4.teal, fontWeight: 800, textDecoration: "none" },
  disclaimerBanner: { margin: "8px 16px 0", padding: "6px 12px" },
  disclaimerText: { fontSize: 10, color: LHP4.mute, fontWeight: 500, lineHeight: 1.4, display: "block", textAlign: "center", fontStyle: "italic" },
  byteWrap: { margin: "16px 16px 0", background: "#fff", borderRadius: 18, padding: "16px", boxShadow: "0 2px 14px rgba(72,202,228,0.12)", border: "2px solid #E0F7FC" },
  byteHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 },
  byteTitle: { fontWeight: 900, fontSize: 15, color: "#0096C7" },
  byteLink: { fontSize: 12, color: "#0096C7", fontWeight: 800, textDecoration: "none" },
  byteSub: { fontSize: 11, color: "#aaa", fontWeight: 500, marginBottom: 12 },
  byteCards: { display: "flex", flexDirection: "column", gap: 10 },
  byteCard: { background: "#E0F7FC", borderRadius: 12, padding: "12px", display: "flex", gap: 10, alignItems: "flex-start" },
  byteCardEmoji: { fontSize: 24, flexShrink: 0 },
  byteCardTitle: { fontWeight: 800, fontSize: 13, color: "#0077B6", marginBottom: 2 },
  byteCardTime: { fontSize: 11, color: "#555", fontWeight: 600, marginBottom: 3 },
  byteCardNote: { fontSize: 11, color: "#888", fontStyle: "italic", marginBottom: 4 },
  byteCardPrice: { fontSize: 11, fontWeight: 700 },
  byteCardSave: { background: "none", border: "none", fontSize: 18, cursor: "pointer", flexShrink: 0 },
  featuredWrap: { padding: "16px 16px 0" },
  featuredHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 },
  featuredLabel: { fontSize: 11, fontWeight: 900, color: LHP4.navy, letterSpacing: 1.5, textTransform: "uppercase" },
  venueToggle: { display: "flex", gap: 5, flexWrap: "wrap" },
  venueBtn: { border: "none", borderRadius: 12, padding: "4px 10px", fontSize: 11, cursor: "pointer", transition: "all 0.15s" },
  venueInfo: { background: LHP4.tintTeal, borderRadius: 10, padding: "8px 12px", fontSize: 11, color: LHP4.navy, fontWeight: 600, marginBottom: 10 },
  musicList: { display: "flex", flexDirection: "column", gap: 8 },
  musicDateHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 8px", paddingBottom: 6, borderBottom: `1.5px solid ${LHP4.hairSoft}` },
  musicDateBadge: { fontSize: 12, fontWeight: 900, color: LHP4.navy, letterSpacing: 0.3 },
  musicDateCount: { fontSize: 10, fontWeight: 700, color: LHP4.teal, background: LHP4.tintTeal, padding: "2px 8px", borderRadius: 10 },
  musicCard: { background: "#fff", borderRadius: 14, padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: `0 1px 2px ${LHP4.hairSoft}, 0 4px 12px rgba(0,29,68,0.05)`, border: `1px solid ${LHP4.hairSoft}` },
  musicLeft: { display: "flex", gap: 10, alignItems: "flex-start", flex: 1 },
  musicEmoji: { fontSize: 22, flexShrink: 0, marginTop: 2 },
  musicTitle: { fontWeight: 800, fontSize: 13, color: LHP4.navy, lineHeight: 1.3, marginBottom: 2 },
  musicOrg: { fontSize: 11, color: LHP4.mute, fontWeight: 600, marginBottom: 4 },
  musicMeta: { display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: LHP4.body, fontWeight: 600, marginBottom: 3 },
  musicNote: { fontSize: 11, color: LHP4.mute, fontStyle: "italic", marginBottom: 4 },
  musicBottom: { display: "flex", gap: 10, alignItems: "center" },
  musicPrice: { fontSize: 11, fontWeight: 700 },
  musicLink: { fontSize: 11, fontWeight: 800, textDecoration: "none" },
  musicSave: { background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 0, flexShrink: 0 },
  salesWrap: { margin: "16px 16px 0", background: "#fff", borderRadius: 18, padding: "16px", boxShadow: "0 2px 14px rgba(224,122,31,0.10)", border: "2px solid #FEF3E7" },
  salesHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 },
  salesTitle: { fontWeight: 900, fontSize: 15, color: "#E07A1F" },
  salesAddLink: { fontSize: 12, color: "#E07A1F", fontWeight: 800, textDecoration: "none" },
  salesSub: { fontSize: 11, color: "#aaa", fontWeight: 500, marginBottom: 12 },
  salesEmpty: { background: "#FEF3E7", borderRadius: 12, padding: "20px", textAlign: "center" },
  salesEmoji: { fontSize: 32, marginBottom: 8 },
  salesEmptyText: { fontWeight: 800, fontSize: 14, color: "#E07A1F", marginBottom: 4 },
  salesEmptySub: { fontSize: 12, color: "#bbb", marginBottom: 14 },
  salesBtn: { display: "inline-block", background: "#E07A1F", color: "#fff", borderRadius: 10, padding: "8px 18px", fontSize: 12, fontWeight: 800, textDecoration: "none" },
  salesList: { display: "flex", flexDirection: "column", gap: 10 },
  saleCard: { background: "#FEF3E7", borderRadius: 12, padding: "12px", display: "flex", gap: 10, alignItems: "flex-start" },
  saleEmoji: { fontSize: 22, flexShrink: 0 },
  saleTitle: { fontWeight: 800, fontSize: 13, color: "#E07A1F", marginBottom: 4 },
  saleMeta: { fontSize: 11, color: "#555", fontWeight: 600, marginBottom: 2 },
  saleNote: { fontSize: 11, color: "#888", fontStyle: "italic", marginTop: 3, marginBottom: 3 },
  salePrice: { fontSize: 11, fontWeight: 700, color: "#E07A1F", marginTop: 4 },
  eventsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  eventCount: { fontSize: 12, color: LHP4.teal, fontWeight: 700, background: LHP4.tintTeal, padding: "3px 10px", borderRadius: 10 },
  eventList: { display: "flex", flexDirection: "column", gap: 12 },
  emptyState: { textAlign: "center", color: LHP4.mute, fontSize: 14, padding: "32px 0" },
  salesEmptyState: { textAlign: "center", padding: "32px 20px", background: "#FEF3E7", borderRadius: 16, border: "2px dashed #E07A1F40" },
  salesEmptyEmoji: { fontSize: 36, marginBottom: 10 },
  salesEmptyTitle: { fontWeight: 800, fontSize: 15, color: "#E07A1F", marginBottom: 6 },
  salesEmptySub: { fontSize: 12, color: "#a06030", marginBottom: 16, lineHeight: 1.5 },
  salesEmptyBtn: { display: "inline-block", background: "#E07A1F", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 2px 8px rgba(224,122,31,0.25)" },
  eventCard: { background: "#fff", borderRadius: 14, overflow: "hidden", display: "flex", boxShadow: `0 1px 2px ${LHP4.hairSoft}, 0 4px 14px rgba(0,29,68,0.05)`, border: `1px solid ${LHP4.hairSoft}` },
  eventAccent: { width: 4, flexShrink: 0 },
  eventBody: { padding: "14px", flex: 1 },
  eventTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  eventTitle: { fontWeight: 800, fontSize: 15, color: LHP4.navy, lineHeight: 1.3, flex: 1 },
  saveBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1, flexShrink: 0 },
  eventOrg: { fontSize: 12, color: LHP4.mute, fontWeight: 600, marginTop: 2, marginBottom: 8 },
  eventMeta: { display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: LHP4.body, fontWeight: 600, marginBottom: 8 },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 },
  ageBadge: { borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 },
  priceBadge: { borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 },
  noteBadge: { fontSize: 11, color: LHP4.mute, fontStyle: "italic", marginBottom: 8 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 },
  tag: { background: LHP4.tintTeal, color: LHP4.teal, fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "2px 7px" },
  ctaBtn: { display: "inline-block", color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", textDecoration: "none" },
  submitSaleBtn: { display: "block", background: "#E07A1F", color: "#fff", borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", textDecoration: "none", textAlign: "center", marginTop: 14, boxShadow: "0 2px 10px rgba(224,122,31,0.25)" },
  // v4 footer — light card style with navy text and lime accent
  footer: { margin: "28px 16px 0", background: "#fff", borderRadius: 18, padding: "24px 20px", textAlign: "center", border: `1px solid ${LHP4.hairSoft}`, boxShadow: `0 1px 2px ${LHP4.hairSoft}` },
  footerIcon: { fontSize: 28, marginBottom: 6 },
  footerText: { color: LHP4.navy, fontSize: 15, fontWeight: 800, marginBottom: 4 },
  footerSub: { color: LHP4.mute, fontSize: 11, marginBottom: 12 },
  footerBtn: { display: "block", background: LHP4.navy, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%", textDecoration: "none", boxSizing: "border-box", marginBottom: 4 },
  footerDivider: { height: 1, background: LHP4.hairSoft, margin: "16px 0" },
  footerText2: { color: LHP4.body, fontSize: 13, fontWeight: 600, marginBottom: 10, marginTop: 4 },
  footerBtn2: { background: LHP4.tintTeal, color: LHP4.teal, border: `1px solid ${LHP4.hairSoft}`, borderRadius: 12, padding: "10px 24px", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%" },
  footerDisclaimer: { color: LHP4.mute, fontSize: 11, fontWeight: 500, lineHeight: 1.5, marginTop: 4, padding: "0 4px" },
  privacyLink: { background: "none", border: "none", color: LHP4.mute, fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline", marginTop: 8, padding: 0 },
  footerCopyright: { color: LHP4.mute, fontSize: 10, marginTop: 6, opacity: 0.7 },
  footerLinkRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 10 },
  // v4 bottom signature lockup — sign-off at end of page
  bottomSignature: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "22px 16px 18px" },
  bottomSignatureRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: LHP4.mute },
  bottomSignatureLime: { color: LHP4.lime },
  // Designer's mark — slightly elevated "Built by a local, for locals."
  designerMarkWrap: { display: "flex", justifyContent: "center", padding: "12px 16px 4px" },
  designerMark: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#fff", border: `1px solid ${LHP4.hairSoft}`, borderRadius: 999, boxShadow: `0 1px 2px ${LHP4.hairSoft}` },
  designerMarkText: { fontSize: 12, fontWeight: 600, color: LHP4.navy, letterSpacing: 0.1 },
  designerMarkEm: { fontStyle: "italic", color: LHP4.teal, fontWeight: 700 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 14px", borderBottom: `1px solid ${LHP4.hairSoft}` },
  modalTitle: { fontWeight: 900, fontSize: 16, color: LHP4.navy },
  modalClose: { background: "none", border: "none", fontSize: 18, color: LHP4.mute, cursor: "pointer", padding: 4 },
  modalBody: { overflowY: "auto", padding: "16px 20px 32px" },
  modalSection: { fontSize: 13, color: LHP4.body, lineHeight: 1.6, marginBottom: 12 },
  modalDivider: { height: 1, background: LHP4.hairSoft, margin: "14px 0" },
  modalDisclaimer: { fontSize: 12, color: LHP4.mute, fontStyle: "italic", lineHeight: 1.6, marginBottom: 10 },
  modalContact: { fontSize: 12, color: LHP4.body, marginTop: 8 },
  // v4 install banner — light card, lighthouse icon with beam, navy button
  installBanner: { margin: "12px 16px 0", background: "#fff", borderRadius: 18, padding: "11px 12px", boxShadow: "0 12px 28px rgba(0, 29, 68, 0.12), 0 4px 10px rgba(0, 29, 68, 0.05)", border: `1px solid ${LHP4.hairSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  installBannerLeft: { display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0 },
  installIcon: { width: 44, height: 44, borderRadius: 10, background: `linear-gradient(160deg, ${LHP4.navySoft} 0%, ${LHP4.navy} 55%, #00132A 100%)`, display: "grid", placeItems: "center", flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset, 0 2px 8px rgba(0, 29, 68, 0.30)" },
  installIconBeam: { position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: `radial-gradient(80% 100% at 50% 100%, ${LHP4.teal}55 0%, transparent 70%)` },
  installIconLighthouse: { height: 27, width: "auto", position: "relative", zIndex: 2, filter: "brightness(0) invert(1)", opacity: 0.96 },
  installTitle: { fontWeight: 700, fontSize: 14, color: LHP4.navy, lineHeight: 1.2, letterSpacing: -0.1 },
  installSub: { fontSize: 11.5, color: LHP4.mute, fontWeight: 500, marginTop: 2, lineHeight: 1.3 },
  installActions: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
  installBtn: { background: LHP4.navy, color: "#fff", border: "none", borderRadius: 999, padding: "0 12px", height: 36, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", letterSpacing: 0.1, boxShadow: "0 2px 6px rgba(0, 29, 68, 0.25)" },
  installDismiss: { background: "none", border: "none", color: "#bbb", fontSize: 14, cursor: "pointer", padding: 4 },
  installSheetHero: { display: "flex", alignItems: "center", gap: 14, padding: "20px 20px 0" },
  installSheetIcon: { width: 64, height: 64, borderRadius: 14, background: `linear-gradient(160deg, ${LHP4.navySoft} 0%, ${LHP4.navy} 55%, #00132A 100%)`, display: "grid", placeItems: "center", flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset, 0 4px 12px rgba(0, 29, 68, 0.30)" },
  installSheetIconBeam: { position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: `radial-gradient(80% 100% at 50% 100%, ${LHP4.teal}55 0%, transparent 70%)` },
  installSheetIconLighthouse: { height: 40, width: "auto", position: "relative", zIndex: 2, filter: "brightness(0) invert(1)", opacity: 0.96 },
  installSheetTitle: { fontSize: 18, fontWeight: 800, letterSpacing: -0.3, color: LHP4.navy, lineHeight: 1.15 },
  installSheetSub: { fontSize: 12.5, color: LHP4.mute, marginTop: 3, lineHeight: 1.35 },
  installSheetDivider: { height: 1, background: LHP4.hairSoft, margin: "18px 20px 6px" },
  installStepRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 20px" },
  installStepNum: { width: 26, height: 26, borderRadius: 999, background: LHP4.tintTeal, color: LHP4.teal, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 },
  installStepTitle: { fontSize: 15, fontWeight: 700, color: LHP4.navy, lineHeight: 1.25 },
  installStepSub: { fontSize: 12.5, color: LHP4.mute, marginTop: 2, lineHeight: 1.35 },
  installStepHair: { height: 1, background: "rgba(0, 29, 68, 0.04)", marginLeft: 60 },
  installStepGlyph: { width: 38, height: 38, borderRadius: 10, background: "#EEF2F7", display: "grid", placeItems: "center", flexShrink: 0 },
  installStepGlyphWide: { minWidth: 160, height: 38, borderRadius: 10, background: "#F2F2F7", display: "flex", alignItems: "center", padding: "0 10px", gap: 8, flexShrink: 0 },
  installStepAddBtn: { height: 34, padding: "0 16px", borderRadius: 999, background: "#0A84FF", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 2px 6px rgba(10,132,255,0.35)", flexShrink: 0 },
  installTipStrip: { margin: "16px 20px 0", background: LHP4.tintTeal, color: LHP4.teal, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600 },
  installSheetSig: { margin: "18px 20px 24px", textAlign: "center", fontSize: 11, fontStyle: "italic", color: LHP4.mute, opacity: 0.85, letterSpacing: 0.1 },
};

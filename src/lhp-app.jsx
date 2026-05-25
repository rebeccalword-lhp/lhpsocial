import { useState, useEffect, useRef } from "react";

// LHP Social brand tokens (v4 design refresh — May 2026)
// Used by the new header logo lockup and install bar.
// Existing per-event/per-category colors throughout the data stay as-is.
const LHP4 = {
  navy:       "#001D44",
  navySoft:   "#0F2A4F",
  teal:       "#1A9B9D",
  tealBright: "#32DAD8",
  lime:       "#A6B813",
  ink:        "#0B2545",
  mute:       "#7592B0",
  tintTeal:   "#DDF0EE",
  hair:       "rgba(0, 29, 68, 0.10)",
  hairSoft:   "rgba(0, 29, 68, 0.06)",
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
];

const featuredEvents = [
  { id: "pk1", venue: "packys", title: "South58 @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP · 954-657-8423", date: "Fri, May 1", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-01" },
  { id: "pk2", venue: "packys", title: "Havoc 305 @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Sat, May 2", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-02"  },
  { id: "pk3", venue: "packys", title: "Gus Rios @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Wed, May 6", time: "5:30 – 8:30 PM", price: "Free · Kitchen open late · Free parking", emoji: "🎤", note: "Solo performer", link: "https://www.packyslhp.com", color: "#0096C7", category: ["nightlife"], endDate: "2026-05-06"  },
  { id: "pk4", venue: "packys", title: "How Original @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Fri, May 8", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-08"  },
  { id: "pk5", venue: "packys", title: "Nobody's Fault @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Sat, May 9", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-09"  },
  { id: "pk6", venue: "packys", title: "Jonny Edwards @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Wed, May 13", time: "5:30 – 8:30 PM", price: "Free · Kitchen open late · Free parking", emoji: "🎤", note: "Solo performer", link: "https://www.packyslhp.com", color: "#0096C7", category: ["nightlife"], endDate: "2026-05-13"  },
  { id: "pk7", venue: "packys", title: "Nigh Horizon @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Fri, May 15", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-15"  },
  { id: "pk8", venue: "packys", title: "Bounce @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Sat, May 16", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-16"  },
  { id: "pk9", venue: "packys", title: "Jerry Leeman @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Wed, May 20", time: "5:30 – 8:30 PM", price: "Free · Kitchen open late · Free parking", emoji: "🎤", note: "Solo performer", link: "https://www.packyslhp.com", color: "#0096C7", category: ["nightlife"], endDate: "2026-05-20"  },
  { id: "pk10", venue: "packys", title: "Thought Monkey @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Fri, May 22", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-22"  },
  { id: "pk11", venue: "packys", title: "The Bango Bangos @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Sat, May 23", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-23"  },
  { id: "pk12", venue: "packys", title: "Cairo O'Toole @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Wed, May 27", time: "5:30 – 8:30 PM", price: "Free · Kitchen open late · Free parking", emoji: "🎤", note: "Solo performer", link: "https://www.packyslhp.com", color: "#0096C7", category: ["nightlife"], endDate: "2026-05-27"  },
  { id: "pk13", venue: "packys", title: "Sippin' Fire @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Fri, May 29", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-29"  },
  { id: "pk14", venue: "packys", title: "Sailor Ripley @ Packy's", org: "Packy's Sports Pub · 4480 N Federal Hwy, LHP", date: "Sat, May 30", time: "8:00 PM – 12:00 AM", price: "Free · Kitchen open late · Free parking", emoji: "🎸", note: null, link: "https://www.packyslhp.com", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-30"  },
  { id: "f2", venue: "nautidawg", title: "Mark Zaden @ The Nauti Dawg ⚓", org: "The Nauti Dawg Marina Cafe · Mark Zaden & The Weedline Band", date: "Every Friday & Sunday", time: "5:30 – 9:30 PM", price: "Tickets at nautidawg.com", emoji: "⚓", note: "At the new Nauti Bar right at B Dock", link: "https://nautidawg.com", color: "#00B4A6", category: ["nightlife"] },
  { id: "p1", venue: "papas", title: "Marcus Amaya @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Fri, May 1", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-01"  },
  { id: "p2", venue: "papas", title: "Dan Abbott @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sat, May 2", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-02"  },
  { id: "p3", venue: "papas", title: "Mojo Ike @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sun, May 3", time: "1–4 PM", price: "Free", emoji: "🎵", note: "Sunday afternoon music", link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-03"  },
  { id: "p4", venue: "papas", title: "Pierre @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Fri, May 8", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-08"  },
  { id: "p5", venue: "papas", title: "Justin Enco @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sat, May 9", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-09"  },
  { id: "p6", venue: "papas", title: "Marina Laurendi @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sun, May 10", time: "1–4 PM", price: "Free", emoji: "🎵", note: "Sunday afternoon music", link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-10"  },
  { id: "p7", venue: "papas", title: "Pierre @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Fri, May 15", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-15"  },
  { id: "p8", venue: "papas", title: "Justin Enco @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sat, May 16", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-16"  },
  { id: "p9", venue: "papas", title: "Mojo Ike @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sun, May 17", time: "1–4 PM", price: "Free", emoji: "🎵", note: "Sunday afternoon music", link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-17"  },
  { id: "p10", venue: "papas", title: "Pierre @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Fri, May 22", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-22"  },
  { id: "p11", venue: "papas", title: "Jonathan James @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sat, May 23", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-23"  },
  { id: "p12", venue: "papas", title: "Xavier on Steel Drums @ Papa's Raw Bar 🥁", org: "Papa's Raw Bar", date: "Sun, May 24", time: "1–4 PM", price: "Free", emoji: "🥁", note: "Steel drum vibes — very coastal!", link: null, color: "#00B4A6", category: ["nightlife"], endDate: "2026-05-24"  },
  { id: "p13", venue: "papas", title: "Eric Xarles @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Fri, May 29", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-29"  },
  { id: "p14", venue: "papas", title: "Dan Abbott @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sat, May 30", time: "7–10 PM", price: "Free", emoji: "🎵", note: null, link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-30"  },
  { id: "p15", venue: "papas", title: "Justin Enco @ Papa's Raw Bar", org: "Papa's Raw Bar", date: "Sun, May 31", time: "1–4 PM", price: "Free", emoji: "🎵", note: "Sunday afternoon music", link: null, color: "#52B788", category: ["nightlife"], endDate: "2026-05-31"  },
  { id: "g1", venue: "galuppis", title: "The Long Run — Eagles Tribute 🦅", org: "Galuppi's · Pompano Beach", date: "Fri, May 1", time: "Evening", price: "RSVP", emoji: "🎸", note: "Tribute to The Eagles", link: "https://www.galuppis.com/event/the-long-run-2/", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-01"  },
  { id: "g2", venue: "galuppis", title: "Private Stock — Rock Star Tribute", org: "Galuppi's · Pompano Beach", date: "Sat, May 2", time: "Evening", price: "RSVP", emoji: "🎶", note: "The Ultimate Rock Star Tribute Show", link: "https://www.galuppis.com/event/private-stock-3/", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-02"  },
  { id: "g3", venue: "galuppis", title: "The Brass Evolution — FREE 🎺", org: "Galuppi's · Pompano Beach", date: "Sun, May 3", time: "Evening", price: "FREE", emoji: "🎺", note: "Horn bands from the 70s & 80s", link: "https://www.galuppis.com/event/the-brass-evolution-25/", color: "#00B4A6", category: ["nightlife"], endDate: "2026-05-03"  },
  { id: "g4", venue: "galuppis", title: "Hot Legs — Tina Turner Tribute", org: "Galuppi's · Pompano Beach", date: "Tue, May 5", time: "Evening", price: "$49.95/person", emoji: "🎤", note: "3-course dinner +$29.95", link: "https://www.galuppis.com/event/high-tide/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-05-05"  },
  { id: "g5", venue: "galuppis", title: "High Tide — Yacht Rock Night 🛥️", org: "Galuppi's · Pompano Beach", date: "Wed, May 6", time: "Evening", price: "$49.95/person", emoji: "🛥️", note: "Classics from the 70s & 80s · 3-course dinner +$29.95", link: "https://www.galuppis.com/event/high-tide-presents-yacht-rock-3/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-05-06"  },
  { id: "g6", venue: "galuppis", title: "The 807 Band — FREE 🎸", org: "Galuppi's · Pompano Beach", date: "Thu, May 7", time: "Evening", price: "FREE", emoji: "🎸", note: "Rock classic dance music", link: "https://www.galuppis.com/event/the-807-band-12/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-07"  },
  { id: "g7", venue: "galuppis", title: "Hot Brass — Chicago & EWF Tribute 🎺", org: "Galuppi's · Pompano Beach", date: "Fri, May 8", time: "Evening", price: "RSVP", emoji: "🎺", note: "Tribute to Chicago and Earth, Wind & Fire", link: "https://www.galuppis.com/event/hot-brass-4/", color: "#00B4A6", category: ["nightlife", "seniors"], endDate: "2026-05-08"  },
  { id: "g8", venue: "galuppis", title: "True Rumours — Fleetwood Mac Tribute 🎤", org: "Galuppi's · Pompano Beach", date: "Sat, May 9", time: "Evening", price: "RSVP", emoji: "🎤", note: "Fleetwood Mac tribute + Stevie Nicks Look-Alike Contest!", link: "https://www.galuppis.com/event/true-rumours-7/", color: "#48CAE4", category: ["nightlife"], endDate: "2026-05-09"  },
  { id: "g9", venue: "galuppis", title: "Mother's Day Brunch & Dinner Buffet 🌸", org: "Galuppi's · Pompano Beach", date: "Sun, May 10", time: "Brunch & Dinner", price: "$50 deposit", emoji: "🌸", note: "Special Mother's Day celebration", link: "https://www.galuppis.com/event/mothers-day-brunch-dinner-buffet/", color: "#48CAE4", category: ["nightlife", "families", "seniors"], endDate: "2026-05-10"  },
  { id: "g10", venue: "galuppis", title: "Miz' Behavin' — FREE 🎵", org: "Galuppi's · Pompano Beach", date: "Sun, May 10", time: "Evening", price: "FREE", emoji: "🎵", note: "Rock, Country, Pop & Blues", link: "https://www.galuppis.com/event/miz-behavin/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-10"  },
  { id: "g11", venue: "galuppis", title: "Mixtape FM — 80s Night 📼", org: "Galuppi's · Pompano Beach", date: "Fri, May 15", time: "Evening", price: "RSVP", emoji: "📼", note: "80s Rock & Pop Cover Bands", link: "https://www.galuppis.com/event/mixtape-fm/", color: "#0096C7", category: ["nightlife"], endDate: "2026-05-15"  },
  { id: "g12", venue: "galuppis", title: "The Bango Bango's — FREE 🎸", org: "Galuppi's · Pompano Beach", date: "Sun, May 17", time: "Evening", price: "FREE", emoji: "🎸", note: "Rock Hits from the 60's to Today", link: "https://www.galuppis.com/event/the-bango-bangos-10/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-17" },
  { id: "g13", venue: "galuppis", title: "Dueling Pianos 🎹", org: "Galuppi's · Pompano Beach", date: "Wed, May 20", time: "Evening", price: "$30/person · 3-course dinner +$29.95", emoji: "🎹", note: "Laughs, music & crowd requests", link: "https://www.galuppis.com/event/dueling-pianos-9/", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-20" },
  { id: "g14", venue: "galuppis", title: "Marvels of Motown 🎺", org: "Galuppi's · Pompano Beach", date: "Thu, May 21", time: "Evening", price: "$49.95/person · 3-course dinner +$29.95", emoji: "🎺", note: "11-piece horn band", link: "https://www.galuppis.com/event/marvels-of-motown-5/", color: "#00B4A6", category: ["nightlife", "seniors"], endDate: "2026-05-21" },
  { id: "g15", venue: "galuppis", title: "AlgoRhythm — FREE 🎸", org: "Galuppi's · Pompano Beach", date: "Thu, May 21", time: "Evening", price: "FREE", emoji: "🎸", note: "Classic & modern rock", link: "https://www.galuppis.com/event/algorhythm-3/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-21" },
  { id: "g16", venue: "galuppis", title: "Start Me Up — Rolling Stones Tribute 🎤", org: "Galuppi's · Pompano Beach", date: "Fri, May 22", time: "Evening", price: "RSVP", emoji: "🎤", note: "Tribute to The Rolling Stones", link: "https://www.galuppis.com/event/start-me-up-4/", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-22" },
  { id: "g17", venue: "galuppis", title: "Legacy of the South 🎸", org: "Galuppi's · Pompano Beach", date: "Fri, May 22", time: "Evening", price: "$49.95/person · 3-course dinner +$29.95", emoji: "🎸", note: "Tribute to Allman Brothers, Eagles, Lynyrd Skynyrd & Doobie Brothers", link: "https://www.galuppis.com/event/legacy-of-the-south-3/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-05-22" },
  { id: "g18", venue: "galuppis", title: "Smokin' Renegade — Boston & Styx Tribute 🎸", org: "Galuppi's · Pompano Beach", date: "Sat, May 23", time: "Evening", price: "RSVP", emoji: "🎸", note: "Tributes to Boston & Styx", link: "https://www.galuppis.com/event/smokin-renegade-2/", color: "#0077B6", category: ["nightlife", "seniors"], endDate: "2026-05-23" },
  { id: "g19", venue: "galuppis", title: "Friday at Five Band — FREE 🎸", org: "Galuppi's · Pompano Beach", date: "Sun, May 24", time: "Evening", price: "FREE", emoji: "🎸", note: "Rock hits from the 70s to today", link: "https://www.galuppis.com/event/friday-at-five-band-9/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-24" },
  { id: "g20", venue: "galuppis", title: "Sounds of Chicago 🎺", org: "Galuppi's · Pompano Beach", date: "Thu, May 28", time: "Evening", price: "$49.95/person · 3-course dinner +$29.95", emoji: "🎺", note: "Hits from Blood, Sweat & Tears & Chicago", link: "https://www.galuppis.com/event/sounds-of-chicago-8/", color: "#00B4A6", category: ["nightlife", "seniors"], endDate: "2026-05-28" },
  { id: "g21", venue: "galuppis", title: "The MTVJ's — FREE 📼", org: "Galuppi's · Pompano Beach", date: "Thu, May 28", time: "Evening", price: "FREE", emoji: "📼", note: "Hits of the MTV 80's era", link: "https://www.galuppis.com/event/the-mtvjs-12/", color: "#52B788", category: ["nightlife"], endDate: "2026-05-28" },
  { id: "g22", venue: "galuppis", title: "The Original Studio-54 Band ✨", org: "Galuppi's · Pompano Beach", date: "Fri, May 29", time: "Evening", price: "RSVP", emoji: "✨", note: "Hits from Earth, Wind & Fire, Chic, Donna Summer & more", link: "https://www.galuppis.com/event/the-original-studio-54-band-28/", color: "#48CAE4", category: ["nightlife", "seniors"], endDate: "2026-05-29" },
  { id: "g23", venue: "galuppis", title: "Jaded w/ Shake It Up — Aerosmith Tribute 🎸", org: "Galuppi's · Pompano Beach", date: "Sat, May 30", time: "Evening", price: "RSVP", emoji: "🎸", note: "Tribute to Aerosmith", link: "https://www.galuppis.com/event/jaded-w-shake-it-up-2/", color: "#0077B6", category: ["nightlife"], endDate: "2026-05-30" },
  { id: "g24", venue: "galuppis", title: "Jukebox Gypsies w/ Forever Young — FREE 🎵", org: "Galuppi's · Pompano Beach", date: "Sun, May 31", time: "Evening", price: "FREE", emoji: "🎵", note: "Hits from the 60's, 70's & 80's", link: "https://www.galuppis.com/event/jukebox-gypsies-w-forever-young-7/", color: "#52B788", category: ["nightlife", "seniors"], endDate: "2026-05-31" },
  { id: "cove1", venue: "cove", title: "Reggae Sundays — Live Music", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Sunday", time: "1:00 PM", price: "Free", emoji: "🎵", note: "Reggae vibes every Sunday afternoon", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife"] },
  { id: "cove2", venue: "cove", title: "Industry Reset — ITB Mondays", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Monday", time: "2:00 PM", price: "Specials for industry workers", emoji: "🍺", note: "Industry workers welcome — reset your week at the Cove", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife"] },
  { id: "cove3", venue: "cove", title: "Trivia Night", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Tuesday", time: "7:00 PM", price: "Free", emoji: "🎯", note: "Weekly trivia every Tuesday night", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "social"] },
  { id: "cove4", venue: "cove", title: "On Wednesdays We Drink Wine", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Wednesday", time: "6:00 PM", price: "Wine specials", emoji: "🍷", note: "Weekly wine night every Wednesday", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife"] },
  { id: "cove5", venue: "cove", title: "Boots & Brews Line Dancing", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Thursday", time: "7:00 PM", price: "Free", emoji: "🥾", note: "Line dancing every Thursday — all levels welcome!", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "social"] },
  { id: "cove6", venue: "cove", title: "First Responder Fridays — BOGO Beer", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Friday", time: "12:00 PM", price: "BOGO Beer for first responders", emoji: "🚒", note: "BOGO beer all day for first responders — thank you for your service!", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "community"] },
  { id: "cove7", venue: "cove", title: "Brews & Tunes — Live Music", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Every Fri & Sat", time: "6:00 PM", price: "Free", emoji: "🎶", note: "Live music every Friday and Saturday evening", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife"] },
  { id: "cove8", venue: "cove", title: "Derby Day at Cove Brewery", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Sat, May 2", time: "2:00 PM", price: "Free", emoji: "🐎", note: "Watch the Kentucky Derby with cold craft beer", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "community"], endDate: "2026-05-02"  },
  { id: "cove9", venue: "cove", title: "Cinco at the Cove — All Day Celebration", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Tue, May 5", time: "All Day", price: "Specials all day", emoji: "🎉", note: "Cinco de Mayo all day celebration", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "community"], endDate: "2026-05-05"  },
  { id: "cove10", venue: "cove", title: "Mother's Day Brunch & Blooms", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Sat, May 9", time: "12:00 PM", price: "See website", emoji: "🌸", note: "Special Mother's Day brunch with blooms — treat mom to something special!", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "families", "seniors"], endDate: "2026-05-09"  },
  { id: "cove11", venue: "cove", title: "Cove Brewery x Won-Tom's — 5 Course Dinner Pairing", org: "Cove Brewery · 1500 SE 3rd Ct, Deerfield Beach", date: "Wed, May 13", time: "6:30 PM", price: "Ticketed — see website", emoji: "🍽️", note: "5 course dinner paired with Cove beers in collaboration with Won-Tom's", link: "https://goo.gl/maps/Mpr4SUYa3r8KYwG88", color: "#52B788", category: ["nightlife", "seniors"], endDate: "2026-05-13"  },
  { id: "dm1", venue: "dangminds", title: "Leah Simmons @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, May 8", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎵", note: "Singer-songwriter & guitarist", link: "https://dangerousmindsbrewing.com/event/1935", color: "#52B788", category: ["nightlife"], endDate: "2026-05-08"  },
  { id: "dm2", venue: "dangminds", title: "Shannon Battle @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, May 9", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎵", note: "Mellow & eclectic mix of rock classics and originals", link: "https://dangerousmindsbrewing.com/event/1936", color: "#52B788", category: ["nightlife"], endDate: "2026-05-09"  },
  { id: "dm3", venue: "dangminds", title: "Travis Williamson @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, May 15", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎵", note: "Original songs & popular covers — one-man band", link: "https://dangerousmindsbrewing.com/event/1937", color: "#52B788", category: ["nightlife"], endDate: "2026-05-15"  },
  { id: "dm4", venue: "dangminds", title: "North End Rockers @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, May 16", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎸", note: "From Neil Diamond to Metallica — order their pizza, get a free sticker!", link: "https://dangerousmindsbrewing.com/event/1938", color: "#52B788", category: ["nightlife"], endDate: "2026-05-16"  },
  { id: "dm5", venue: "dangminds", title: "Rich Tench @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sun, May 17", time: "4:00 – 7:00 PM", price: "Free", emoji: "🎵", note: "Blues, rock & pop — loop pedal one-man band", link: "https://dangerousmindsbrewing.com/event/1939", color: "#52B788", category: ["nightlife"], endDate: "2026-05-17"  },
  { id: "dm6", venue: "dangminds", title: "Manny Estrella @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, May 22", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎵", note: "Fun variety music — pairs great with artisanal pizza!", link: "https://dangerousmindsbrewing.com/event/1940", color: "#52B788", category: ["nightlife"], endDate: "2026-05-22"  },
  { id: "dm7", venue: "dangminds", title: "Spare Change @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, May 23", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎸", note: "Classic rock & country favorites — 30 years on the South Florida scene", link: "https://dangerousmindsbrewing.com/event/1941", color: "#52B788", category: ["nightlife"], endDate: "2026-05-23"  },
  { id: "dm8", venue: "dangminds", title: "Rockin' Jake & Raiford Starke Duo @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Fri, May 29", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎸", note: "Blues, swamp funk & outlaw country — high energy!", link: "https://dangerousmindsbrewing.com/event/1962", color: "#52B788", category: ["nightlife"], endDate: "2026-05-29"  },
  { id: "dm9", venue: "dangminds", title: "Nightjar The Band @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sat, May 30", time: "7:00 – 10:00 PM", price: "Free", emoji: "🎸", note: "Classic rock, blues & modern hits — acoustic-electric duo", link: "https://dangerousmindsbrewing.com/event/1963", color: "#52B788", category: ["nightlife"], endDate: "2026-05-30"  },
  { id: "dm10", venue: "dangminds", title: "Tim Solo @ Dangerous Minds", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach", date: "Sun, May 31", time: "4:00 – 7:00 PM", price: "Free", emoji: "🎵", note: null, link: "https://dangerousmindsbrewing.com/event/1942", color: "#52B788", category: ["nightlife"], endDate: "2026-05-31"  },
];

const byteEvents = [
  { id: "b1", title: "Backgammon Night ♟️", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Friday", time: "6:00 – 9:00 PM", location: "Byte & Coffee, Lighthouse Point", price: "Free · Food & drinks available", color: "#48CAE4", tags: ["backgammon", "games", "weekly", "social"], note: "All skill levels welcome. Casual evening of backgammon, drinks & good vibes.", ages: null, link: "https://bytencoffee.com/events/" },
  { id: "b2", title: "Board Game Night 🎲", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Friday", time: "6:00 – 9:00 PM", location: "Byte & Coffee, Lighthouse Point", price: "Free · 10% off drinks while you play", color: "#48CAE4", tags: ["board-games", "games", "weekly", "social"], note: "Grab a seat, choose a game, enjoy 10% off drinks!", ages: null, link: "https://bytencoffee.com/events/" },
  { id: "b3", title: "Mahjong Night 🀄", org: "Byte & Coffee · 2424 N Federal Hwy, Lighthouse Point", category: ["social"], date: "Every Tuesday", time: "5:00 – 8:00 PM", location: "Byte & Coffee, Lighthouse Point", price: "Free · Some sets provided", color: "#48CAE4", tags: ["mahjong", "games", "weekly", "social"], note: "Relaxed, welcoming atmosphere. Sets provided — players welcome to bring their own.", ages: null, link: "https://bytencoffee.com/events/" },
];

// Auto-expiry helper: events with an endDate disappear the day after.
// Events without an endDate (recurring/evergreen) stay forever.
const isEventActive = (event) => {
  if (!event.endDate) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(event.endDate);
  end.setHours(0, 0, 0, 0);
  return end >= today;
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
  { id: "ch1", title: "Sunday Services — Coastal Community Church", org: "Coastal Community Church · 3901 NE 22nd Ave, Lighthouse Point", category: ["spirit"], date: "Every Sunday", time: "8:45 AM · 10:15 AM · 11:45 AM", location: "3901 NE 22nd Ave, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["church", "worship", "sunday", "kids-ministry", "weekly"], note: "Kids Ministry at all services · Special Space class for children with special needs at 11:45 AM · Next Steps class at 10:15 AM", ages: "All ages", link: null },
  { id: "ch2", title: "Sunday Mass — St. Paul the Apostle", org: "Saint Paul the Apostle Catholic Church · (954) 943-9154", category: ["spirit"], date: "Every Sunday", time: "7:30 AM · 9:00 AM · 11:30 AM · Sat Vigil 4:30 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "mass", "sunday", "weekly"], note: "Saturday Vigil Mass at 4:30 PM · Confessions: Saturdays 3:30–4:30 PM or by request", ages: "All ages", link: null },
  { id: "ch3", title: "Daily Mass — St. Paul the Apostle", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "Mon–Fri 7:30 AM & 11:00 AM · Saturday 11:00 AM", time: "7:30 AM & 11:00 AM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "mass", "daily", "weekday"], note: null, ages: null, link: null },
  { id: "ch4", title: "Adoration — St. Paul the Apostle 🕯️", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "First Friday of each month", time: "11:30 AM – 5:00 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All welcome", color: "#7B5EA7", tags: ["catholic", "adoration", "prayer", "first-friday"], note: "Includes prayer, benediction and exposition of the Blessed Sacrament.", ages: null, link: null },
  { id: "ch5", title: "Women's Rosary Cenacle 📿", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit", "seniors"], date: "Every Monday", time: "9:30 AM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All women welcome", color: "#7B5EA7", tags: ["catholic", "rosary", "women", "prayer", "weekly"], note: null, ages: "Women", link: null },
  { id: "ch6", title: "Men's Rosary Cenacle 📿", org: "Saint Paul the Apostle Catholic Church · Lighthouse Point", category: ["spirit"], date: "Every Wednesday", time: "7:00 PM", location: "2700 NE 36th St, Lighthouse Point, FL 33064", price: "Free · All men welcome", color: "#7B5EA7", tags: ["catholic", "rosary", "men", "prayer", "weekly"], note: null, ages: "Men", link: null },
  { id: "ch7", title: "Sunday Services — The Pink Church 🌸", org: "The Pink Church · 2331 NE 26th Ave, Pompano Beach, FL 33062", category: ["spirit"], date: "Every Sunday", time: "9:30 AM (Contemporary) · 11:00 AM (Traditional)", location: "2331 NE 26th Ave, Pompano Beach, FL 33062", price: "Free · All welcome", color: "#7B5EA7", tags: ["church", "worship", "sunday", "contemporary", "traditional", "weekly"], note: "Contemporary service at 9:30 AM · Traditional service at 11:00 AM", ages: "All ages", link: null },
  // LIBRARY
  { id: "lib1", title: "Family Story Time", org: "Lighthouse Point Library", category: ["library"], date: "Fri, May 1 & Fri, May 8", time: "10:30 – 11:30 AM", location: "Lighthouse Point Library, 2200 NE 38th St", price: "Free · Registration required", color: "#0096C7", tags: ["library", "kids", "storytime", "babies"], note: "Waitlist open — register with your LHP library card.", ages: "Babies 0–3 · Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-08" },
  { id: "lib2", title: "Wild About the Library! Grand Reopening 🎉", org: "Lighthouse Point Library", category: ["library", "families", "community"], date: "Sat, May 9", time: "10:00 AM – 12:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#52B788", tags: ["library", "free", "all-ages", "celebration"], note: "Ribbon cutting 10 AM · Wildlife presentations · Therapy dogs · Scavenger hunt · Tours. Carpool — parking limited.", ages: "All ages", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-09" },
  { id: "lib3", title: "Trinity School Field Trip", org: "Lighthouse Point Library", category: ["library"], date: "Mon, May 4", time: "10:30 AM – 12:30 PM", location: "Lighthouse Point Library", price: "Free", color: "#0096C7", tags: ["library", "school", "kids"], note: "Community Partners program", ages: "Youth", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-04" },
  { id: "lib4", title: "Family Makerspace", org: "Lighthouse Point Library", category: ["library", "families", "arts"], date: "Mon, May 4", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#48CAE4", tags: ["library", "makerspace", "kids", "STEM"], note: null, ages: "Youth 4–11 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-04" },
  { id: "lib5", title: "Knitting with Nancy & Janet", org: "Lighthouse Point Library", category: ["library", "seniors", "arts"], date: "Tue, May 5", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#0096C7", tags: ["library", "knitting", "crochet", "seniors"], note: "Bring Red Heart Super Saver Worsted Yarn, Size 8 Needles, Size G/H Crochet Hook if new.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-05" },
  { id: "lib6", title: "S.T.E.A.M Labs | Science of Birds 🐦", org: "Lighthouse Point Library", category: ["library", "families"], date: "Tue, May 5", time: "4:00 – 5:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#52B788", tags: ["library", "STEAM", "science", "kids"], note: null, ages: "Youth 4–6", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-05" },
  { id: "lib7", title: "Friends Zoom Book Club", org: "Lighthouse Point Library", category: ["library", "seniors", "social"], date: "Wed, May 6", time: "4:00 – 5:00 PM", location: "Via Zoom", price: "Free · Online registration required", color: "#0096C7", tags: ["library", "book-club", "zoom", "adults"], note: "Hosted 2nd Wednesday of the month. Supported by Friends of the Library & Barker Library Fund.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-06" },
  { id: "lib8", title: "ABCs of Investing 💰", org: "Lighthouse Point Library", category: ["library", "seniors", "community"], date: "Thu May 7 · Thu May 21 · Wed May 28", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#0077B6", tags: ["library", "finance", "investing", "adults"], note: null, ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-28" },
  { id: "lib9", title: "Broward County Agencies Visit", org: "Lighthouse Point Library", category: ["library", "community"], date: "Sun, May 18", time: "10:30 AM – 12:00 PM", location: "Lighthouse Point Library", price: "Free", color: "#023E8A", tags: ["library", "government", "community"], note: "Broward Property Appraiser & Supervisor of Elections available to assist residents.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-18" },
  { id: "lib10", title: "Read to a Therapy Dog 🐕", org: "Lighthouse Point Library", category: ["library", "families"], date: "Tue, May 19", time: "6:30 – 7:30 PM (3 sessions)", location: "Lighthouse Point Library", price: "Free · Waitlist open", color: "#52B788", tags: ["library", "therapy-dog", "kids", "reading"], note: "Three 15-min sessions: 6:30–6:45, 6:45–7:00, 7:15–7:30. Registration required.", ages: "Youth 4–17 · Families", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-19" },
  { id: "lib11", title: "Library Advisory Board Meeting", org: "Lighthouse Point Library", category: ["library", "community"], date: "Tue, May 19", time: "6:30 – 8:00 PM", location: "Lighthouse Point Library", price: "Free · Open to public", color: "#023E8A", tags: ["library", "civic", "community"], note: null, ages: null, link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-19" },
  { id: "lib12", title: "CDBG Zoom Book Club", org: "Lighthouse Point Library", category: ["library", "seniors"], date: "Wed, May 20", time: "4:00 – 5:00 PM", location: "Via Zoom", price: "Free · Registration required", color: "#48CAE4", tags: ["library", "book-club", "seniors", "CDBG"], note: "CDBG grant-funded program for LHP residents 62+.", ages: "CDBG Seniors 62+", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-20" },
  { id: "lib13", title: "Friends Bi-Monthly Mystery Book Club", org: "Lighthouse Point Library", category: ["library", "seniors", "social"], date: "Mon, May 26", time: "2:00 – 3:00 PM", location: "Lighthouse Point Library", price: "Free · Registration required", color: "#0096C7", tags: ["library", "book-club", "mystery", "adults"], note: "In-person. Supported by Friends of the Lighthouse Point Library.", ages: "Adults", link: "https://lighthousepointlib.librarycalendar.com/events/month", endDate: "2026-05-26" },
  { id: "lib14", title: "CDBG Arts & Crafts Summer Lottery", org: "Lighthouse Point Library", category: ["library", "seniors", "arts"], date: "Lottery open now – Fri, May 22", time: "Visit library for details", location: "Lighthouse Point Library", price: "Free (grant-funded)", color: "#48CAE4", tags: ["art", "seniors", "free", "watercolor", "CDBG"], note: "Watercolor, needle felting & alcohol inks. LHP resident 62+. Registration by lottery.", ages: "Ages 62+ · LHP Residents", link: "https://lighthousepointlibrary.com", endDate: "2026-05-22" },
  { id: "lib15", title: "Library Closed — Memorial Day Weekend", org: "Lighthouse Point Library", category: ["library", "community"], date: "Sat May 23 & Mon May 25", time: "All Day", location: "Lighthouse Point Library", price: null, color: "#888", tags: ["library", "closed", "memorial-day"], note: "Library closed for Memorial Day weekend.", ages: null, link: null, endDate: "2026-05-25" },
  // COMMUNITY
  { id: 1, title: "Alzheimer's Mobile Screening", org: "John Trudel Community Center", category: ["seniors", "community"], date: "Fri, May 1", time: "10:00 AM – 2:00 PM", location: "John Trudel Community Center", price: "Free · By Appointment", color: "#00B4A6", tags: ["health", "seniors", "free"], note: "By appointment", ages: null, link: null, endDate: "2026-05-01" },
  { id: 2, title: "OneBlood Mobile Blood Drive", org: "Dan Witt Park", category: ["community"], date: "Sat, May 16", time: "8:30 – 11:30 AM", location: "Dan Witt Park", price: "Free · Donors get $20 e-gift card + Sunshade + Wellness Check", color: "#0077B6", tags: ["community", "volunteer", "free"], note: "Appointments preferred, walk-ins welcome", ages: null, link: null, endDate: "2026-05-16" },
  { id: 3, title: "Farmers Market at Dan Witt Park", org: "City of Lighthouse Point", category: ["families", "community", "seniors"], date: "Sun, May 17", time: "9:00 AM – 12:30 PM", location: "Dan Witt Park", price: "Free", color: "#52B788", tags: ["food", "outdoor", "community", "free"], note: "Limited parking · No dogs in park", ages: null, link: null, endDate: "2026-05-17" },
  { id: 4, title: "Tip-A-Cop", org: "Bonefish Mac's Sports Grille", category: ["community", "families"], date: "Tue, May 19", time: "4:00 – 9:00 PM", location: "Bonefish Mac's Sports Grille", price: "Dine out & support Special Olympics", color: "#0096C7", tags: ["dining", "fundraiser", "community"], note: null, ages: null, link: null, endDate: "2026-05-19" },
  // FITNESS
  { id: 8, title: "Mat Yogalates (Weekly)", org: "John Trudel Community Center", category: ["fitness", "seniors"], date: "Tuesdays & Fridays", time: "9:00 – 10:00 AM", location: "John Trudel Community Center", price: "$10/class", color: "#52B788", tags: ["yoga", "pilates", "weekly"], note: null, ages: null, link: "https://lhp.recdesk.com" },
  { id: 9, title: "Chair Yoga (Weekly)", org: "John Trudel Community Center", category: ["fitness", "seniors"], date: "Wednesdays & Fridays", time: "10:30 – 11:30 AM", location: "John Trudel Community Center", price: "$10 res / $20 non-res", color: "#52B788", tags: ["yoga", "seniors", "weekly"], note: null, ages: null, link: "https://lhp.recdesk.com" },
  { id: 10, title: "Tai Chi for Arthritis", org: "John Trudel Community Center", category: ["fitness", "seniors"], date: "Tues & Thurs — thru May 14", time: "11:00 AM", location: "John Trudel Community Center", price: "Free", color: "#00B4A6", tags: ["tai-chi", "seniors", "free"], note: "6-week session", ages: "Ages 60+", link: "https://lhp.recdesk.com", endDate: "2026-05-14" },
  { id: 11, title: "Pickleball Clinics 🏓", org: "John Trudel Community Center · George Bulger, Professional Player & Certified Coach", category: ["fitness"], date: "Wednesdays", time: "6:00 – 7:00 PM", location: "John Trudel Community Center", price: "$15/clinic", color: "#52B788", tags: ["pickleball", "sports", "weekly", "all-levels"], note: "All levels welcome. Instruction by George Bulger, Professional Player & Certified Coach.", ages: null, link: "https://lhp.recdesk.com" },
  { id: 12, title: "Youth Pickleball Clinics 🏓", org: "Dan Witt Park · George Bulger, Professional Player & Coach · (954) 784-3439", category: ["fitness", "families"], date: "Mondays · May 11, May 18, Jun 1, Jun 8 (No class May 25)", time: "4-week session", location: "Dan Witt Park", price: "$40/class · $120 (4-week session) · Trial class available — call for details", color: "#0077B6", tags: ["kids", "pickleball", "sports", "youth", "drills", "coaching"], note: "Drills, skills, technique & game play. Instruction by George Bulger, Professional Player & Coach. Trial class available — call (954) 784-3439.", ages: "Ages 6–17", link: "https://lhp.recdesk.com" },
  { id: 29, title: "Summer Adult Kickball League", org: "LHP Recreation", category: ["fitness", "community"], date: "Registration opens May 11 · Jun 6 – Jul 23", time: "Thursday nights", location: "Lighthouse Point", price: "See flyer", color: "#52B788", tags: ["kickball", "adult", "league", "summer"], note: "Registration opens May 11 at 9 AM", ages: "Adults", link: "https://lhp.recdesk.com" },
  { id: 30, title: "Fall Coed Youth Soccer", org: "LHP Recreation", category: ["fitness", "families"], date: "Registration opens May 18 · Season starts August", time: "See schedule", location: "Lighthouse Point", price: "See lhp.recdesk.com", color: "#0077B6", tags: ["soccer", "kids", "fall", "registration"], note: "LHP residents first! Divisions: 6U, 8U, 10U, 13U", ages: "6U–13U", link: "https://lhp.recdesk.com" },
  { id: "sfbs1", title: "Wednesday Night Fever — Baseball Training ⚾", org: "South Florida Baseball School · Dan Witt Park", category: ["fitness", "families"], date: "Wednesdays · May 27, Jun 3, 10, 24, Jul 1, 8, 15, 22, 29", time: "6:00 – 9:00 PM", location: "Dan Witt Park, 4521 NE 22nd Ave", price: "$50/session", color: "#52B788", tags: ["baseball", "youth", "training", "weekly"], note: "Intense baseball-specific training. No session June 17.", ages: null, link: "https://www.sfbspro.com" },
  { id: 31, title: "LHP Tennis Center Summer Camp", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "families"], date: "Jun 8 – Aug 7", time: "Flexible day or weekly", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Call for pricing · (954) 946-7306", color: "#52B788", tags: ["tennis", "kids", "summer-camp"], note: null, ages: "Ages 5+", link: "https://lhp.recdesk.com" },
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
  { id: "tc_mem", title: "Memorial Day Round Robin & BBQ 🇺🇸", org: "LHP Tennis Center · 3500 NE 27th Ave · (954) 946-7306", category: ["fitness", "community", "social"], date: "Mon, May 25", time: "9:30 AM – 12:00 PM", location: "LHP Tennis Center, 3500 NE 27th Ave", price: "Members $20 · Non-members $30 · Includes food for players", color: "#0077B6", tags: ["tennis", "round-robin", "bbq", "memorial-day", "holiday", "special-event"], note: "Sign up on the Court Reserve app. Sponsored by Coldwell Banker Realty — Thomas Group.", ages: null, link: null, endDate: "2026-05-25" },
  // ARTS & KIDS
  { id: 13, title: "Baton Twirling Classes", org: "John Trudel Community Center", category: ["families"], date: "Mondays", time: "4:30–6:30 PM (varies by age)", location: "John Trudel Community Center", price: "$65/mo or $45 one-time", color: "#48CAE4", tags: ["kids", "performance", "weekly"], note: null, ages: "Ages 5–14", link: "https://lhp.recdesk.com" },
  { id: 14, title: "Robotics Class", org: "John Trudel Community Center", category: ["families"], date: "Thursdays — ends May 21", time: "4:00–6:00 PM", location: "John Trudel Community Center", price: "$270 res / $297 non-res", color: "#0077B6", tags: ["STEM", "robotics", "kids"], note: "Trial class available", ages: "K–4th grade", link: "https://lhp.recdesk.com", endDate: "2026-05-21" },
  { id: 15, title: "Miss Wendy's Wiggles & Giggles", org: "John Trudel Community Center", category: ["families"], date: "Wednesdays — 8-week session", time: "9:30 – 10:15 AM", location: "John Trudel Community Center", price: "$200 res / $240 non-res", color: "#0096C7", tags: ["toddlers", "movement", "play"], note: null, ages: "Crawlers – Age 3", link: "https://lhp.recdesk.com" },
  { id: 17, title: "artNest: Bubble Gum Machines", org: "John Trudel Community Center", category: ["arts", "families"], date: "Wed, May 6", time: "4:00 – 5:00 PM", location: "John Trudel Community Center", price: "$35", color: "#48CAE4", tags: ["art", "kids", "craft"], note: null, ages: "Ages 5+", link: "https://lhp.recdesk.com", endDate: "2026-05-06" },
  { id: 18, title: "Flower Power Floral Arranging", org: "John Trudel Community Center", category: ["arts", "seniors"], date: "Wed, May 6", time: "6:00 – 8:00 PM", location: "John Trudel Community Center", price: "$50", color: "#48CAE4", tags: ["floral", "art", "workshop"], note: null, ages: null, link: "https://lhp.recdesk.com", endDate: "2026-05-06" },
  { id: 19, title: "artNest: Fidget Making", org: "John Trudel Community Center", category: ["arts", "families"], date: "Wed, May 13", time: "4:00 – 5:00 PM", location: "John Trudel Community Center", price: "$35", color: "#48CAE4", tags: ["art", "kids", "craft"], note: null, ages: "Ages 5+", link: "https://lhp.recdesk.com", endDate: "2026-05-13" },
  { id: 20, title: "Custom Summer Doormat Workshop", org: "John Trudel Community Center", category: ["arts"], date: "Wed, May 13", time: "6:00 – 8:00 PM", location: "John Trudel Community Center", price: "$54", color: "#48CAE4", tags: ["craft", "workshop", "adults"], note: null, ages: null, link: "https://lhp.recdesk.com", endDate: "2026-05-13" },
  { id: 21, title: "Creative Writing Workshop", org: "John Trudel Community Center", category: ["arts", "seniors"], date: "Tue, May 19", time: "10:00 AM – 12:00 PM", location: "John Trudel Community Center", price: "Free", color: "#48CAE4", tags: ["writing", "workshop", "free"], note: null, ages: "Adults & Seniors", link: "https://lhp.recdesk.com", endDate: "2026-05-19" },
  { id: 22, title: "Sea Turtle & Manatee Talk 🐢", org: "John Trudel Community Center", category: ["families", "community"], date: "Wed, May 27", time: "1:00 – 2:00 PM", location: "John Trudel Community Center", price: "Free", color: "#52B788", tags: ["nature", "coastal", "educational", "free"], note: null, ages: "Ages 2–6", link: "https://lhp.recdesk.com", endDate: "2026-05-27" },
  { id: 23, title: "Pottery Class: Trinket Dishes", org: "John Trudel Community Center", category: ["arts", "families"], date: "Thu, May 28", time: "4:30 – 5:30 PM", location: "John Trudel Community Center", price: "$55", color: "#48CAE4", tags: ["pottery", "art", "hands-on"], note: null, ages: "Ages 7–11", link: "https://lhp.recdesk.com", endDate: "2026-05-28" },
  { id: 24, title: "artNest: Play Dough Worlds (Parent & Me)", org: "John Trudel Community Center", category: ["arts", "families"], date: "Wed, May 28", time: "10:00 – 11:00 AM", location: "John Trudel Community Center", price: "$35", color: "#48CAE4", tags: ["toddlers", "art", "parent-child"], note: null, ages: "Ages 1–5", link: "https://lhp.recdesk.com", endDate: "2026-05-28" },
  { id: 26, title: "Mahjong Instructional & Open Play", org: "John Trudel Community Center", category: ["seniors", "community", "social"], date: "Every Monday (no class May 25 — Memorial Day)", time: "6:00 – 8:00 PM", location: "John Trudel Community Center", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "weekly"], note: "Continues through summer. Building closed Memorial Day (May 25).", ages: null, link: "https://lhp.recdesk.com" },
  { id: 27, title: "Mahjong & More Open Play (Daytime)", org: "John Trudel Community Center", category: ["seniors", "community", "social"], date: "Thu, May 21", time: "2:00 – 4:00 PM", location: "John Trudel Community Center", price: "Free", color: "#00B4A6", tags: ["mahjong", "games", "free", "daytime"], note: "Final daytime session — programming pauses for summer camp prep.", ages: null, link: "https://lhp.recdesk.com", endDate: "2026-05-21" },
  { id: 32, title: "May City Commission Meetings", org: "City of Lighthouse Point — Fletcher Hall", category: ["community"], date: "Tue May 12 & Tue May 26", time: "6:30 PM", location: "Fletcher Hall, 2200 NE 38th St", price: "Free · Open to public", color: "#023E8A", tags: ["government", "civic", "public-meeting"], note: "Instructions posted on City website the Friday before", ages: null, link: "https://www.lighthousepointfl.gov", endDate: "2026-05-26" },
  { id: 34, title: "Community Meeting with Lt. Governor Jay Collins", org: "City of Lighthouse Point", category: ["community"], date: "Wed, May 13", time: "3:15 – 4:00 PM", location: "Lighthouse Point Fire Station 22, 2101 NE 36th St", price: "Free · Registration required", color: "#023E8A", tags: ["government", "civic", "public-meeting"], note: "Space is limited. Register at the link.", ages: null, link: "https://forms.gle/9mB6F3omK9bEWRg4A", endDate: "2026-05-13" },
  { id: 33, title: "Compost Pilot Program — Limited Spots!", org: "City of Lighthouse Point × Filthy Organics", category: ["community"], date: "Apply now — first come, first served", time: "Ongoing", location: "Citywide", price: "Free · First 50 residents", color: "#52B788", tags: ["sustainability", "composting", "free"], note: "5-gallon compost bucket + twice-weekly drop-off access", ages: null, link: "https://www.lighthousepointfl.gov/369/Composting" },
  // DANGEROUS MINDS BREWING
  { id: "dm_run", title: "Run to Hops 🏃", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["fitness", "social", "community"], date: "Every Tuesday", time: "6:30 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free · 15% off food & beer after", color: "#52B788", tags: ["running", "fitness", "social", "weekly", "beer"], note: "2 or 4 mile run with @team_fortlauderdale. All participants get 15% off food & craft beer!", ages: null, link: "https://dangerousmindsbrewing.com/event/1968" },
  { id: "dm_crok", title: "Crokinole Night 🟢", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social"], date: "Every Tuesday", time: "7:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free", color: "#48CAE4", tags: ["crokinole", "games", "social", "weekly", "free"], note: "Flick wooden discs, rack up points, knock opponents off the board. No experience needed — beginners always welcome!", ages: null, link: "https://dangerousmindsbrewing.com/event/1972" },
  { id: "dm_triv1", title: "Trivia Night 🎯", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["social"], date: "Thu, May 14 · Thu, May 21 · Thu, May 28", time: "7:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "Free · Prizes for top teams", color: "#48CAE4", tags: ["trivia", "games", "social", "free", "prizes"], note: "Free to play — top teams each night win prizes!", ages: null, link: "https://dangerousmindsbrewing.com/event/1965", endDate: "2026-05-28" },
  { id: "dm_din1", title: "Special Dinner: Hearty Vegetable Goulash 🍲", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["nightlife", "community"], date: "Wed, May 13", time: "6:00 – 9:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "$18 · Reservations required — call (954) 520-3000", color: "#0096C7", tags: ["dinner", "food", "special", "reservations"], note: "Hungarian-inspired tomato & paprika stew with beans & vegetables, served with spent grain bread. Add crispy pork cutlet for $5.", ages: null, link: "https://dangerousmindsbrewing.com/event/1978", endDate: "2026-05-13" },
  { id: "dm_din2", title: "Special Dinner: Buffalo Chicken Pizza Sandwich 🍗", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["nightlife", "community"], date: "Wed, May 20", time: "6:00 – 9:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "$16 · While supplies last", color: "#0096C7", tags: ["dinner", "food", "special"], note: "Crispy fried chicken, banana peppers & buffalo sauce with Gorgonzola & mozzarella stuffed in pizza dough. Served with celery & kettle chips.", ages: null, link: "https://dangerousmindsbrewing.com/event/1976", endDate: "2026-05-20" },
  { id: "dm_din3", title: "Special Dinner: Goan Fish Curry 🍛", org: "Dangerous Minds Brewing · 1901 N Federal Hwy, Pompano Beach · (954) 520-3000", category: ["nightlife", "community"], date: "Wed, May 27", time: "6:00 – 9:00 PM", location: "Dangerous Minds Brewing, Pompano Beach", price: "$24 · Reservations required — call (954) 520-3000", color: "#0096C7", tags: ["dinner", "food", "special", "reservations"], note: "Coastal Indian curry with Mahi Mahi, coconut cream & toasted spices. Served with basmati rice & garlic naan.", ages: null, link: "https://dangerousmindsbrewing.com/event/1977", endDate: "2026-05-27" },
  // GARAGE & YARD SALES
  { id: "sale2", title: "Garage Sale 🏷️", org: "1960 NE 31st Street, Lighthouse Point", category: ["sales"], date: "Sat, May 23", time: "10:00 AM – 1:00 PM", location: "1960 NE 31st Street, Lighthouse Point", price: "Prices marked on items", color: "#E07A1F", tags: ["garage-sale", "yard-sale", "deals", "lhp"], note: "Possibly multiple households. Come early for the best finds!", ages: null, link: null, endDate: "2026-05-23" },
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
  }).sort((a, b) => eventPriority(a) - eventPriority(b));

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
        <div style={styles.waveBg} />
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <img
              src="/lhplighthousemedium_1.png"
              alt="LHP lighthouse"
              style={styles.logoLighthouse}
            />
            <div style={styles.wordmarkBlock}>
              <div style={styles.wordmark}>
                <span style={styles.wordmarkLHP}>LHP</span>
                <span style={styles.wordmarkSocial}>SOCIAL</span>
              </div>
              <div style={styles.appSub}>Lighthouse Point, FL 33064</div>
              <div style={styles.appSub2}>Community Guide</div>
            </div>
          </div>
          <button onClick={() => setShowSaved(true)} style={styles.savedBadge}>♡ {savedEvents.length}</button>
        </div>
        <div style={styles.tagline}>Real events, programs &amp; news from your city</div>
      </div>

      {showInstallBanner && !installed && (
        <div style={styles.installBanner}>
          <div style={styles.installBannerLeft}>
            <div style={styles.installIcon}>
              <div style={styles.installIconBeam} />
              <img
                src="/lhplighthousemedium_1.png"
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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const newCat = activeCategory === cat.id ? null : cat.id;
                trackCategoryClick(newCat || "all");
                setActiveCategory(newCat);
                scrollToCategory(newCat);
              }}
              style={{ ...styles.categoryCard, background: activeCategory === cat.id ? cat.color : cat.bg, border: `2.5px solid ${activeCategory === cat.id ? cat.color : "transparent"}`, transform: activeCategory === cat.id ? "scale(1.04)" : "scale(1)", boxShadow: activeCategory === cat.id ? `0 6px 20px ${cat.color}40` : "0 2px 8px rgba(0,100,160,0.07)" }}>
              <div style={{ marginBottom: 6 }}>
                <CatIcon id={cat.id} color={activeCategory === cat.id ? "rgba(255,255,255,0.95)" : cat.color} size={26} />
              </div>
              <span style={{ ...styles.catLabel, color: activeCategory === cat.id ? "#fff" : cat.color }}>{cat.label}</span>
              <span style={{ ...styles.catDesc, color: activeCategory === cat.id ? "rgba(255,255,255,0.85)" : "#7a9aaa" }}>{cat.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tabBarWrap}>
        <div style={styles.tabBar}>
          {sections.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const newCat = tab.id === "all" ? null : tab.id;
                trackCategoryClick(tab.id);
                setActiveCategory(newCat);
                scrollToCategory(newCat);
              }}
              style={{ ...styles.tab, background: (tab.id === "all" ? activeCategory === null : activeCategory === tab.id) ? "#0077B6" : "#E8F4FD", color: (tab.id === "all" ? activeCategory === null : activeCategory === tab.id) ? "#fff" : "#0077B6", fontWeight: (tab.id === "all" ? activeCategory === null : activeCategory === tab.id) ? 800 : 600 }}>
              {tab.label}
            </button>
          ))}
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
                  style={{ ...styles.venueBtn, background: musicVenue === id ? "#0077B6" : "#E8F4FD", color: musicVenue === id ? "#fff" : "#0077B6", fontWeight: musicVenue === id ? 800 : 600 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {musicVenue === "papas" && <div style={styles.venueInfo}>🦞 <strong>Papa's Raw Bar</strong> — 4610 N Federal Hwy · Fri/Sat 7–10 PM · Sun 1–4 PM</div>}
          {musicVenue === "nautidawg" && <div style={styles.venueInfo}>⚓ <strong>The Nauti Dawg Marina Cafe</strong> — B Dock · Fri & Sun 5:30–9:30 PM</div>}
          {musicVenue === "packys" && <div style={styles.venueInfo}>🍺 <strong>Packy's Sports Pub</strong> — Lighthouse Point · Live music nights vary</div>}
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
              href="https://docs.google.com/forms/d/e/1FAIpQLSeznT4FeZSAhSIG6R9-0F22Iykx1NO1bGFBMt8d9fcXd5ekag/viewform?usp=publish-editor"
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
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeznT4FeZSAhSIG6R9-0F22Iykx1NO1bGFBMt8d9fcXd5ekag/viewform?usp=publish-editor" target="_blank" rel="noreferrer" style={styles.submitSaleBtn}>
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
        <a href="https://lhp.recdesk.com/Community/Home" target="_blank" rel="noreferrer" style={{ ...styles.footerBtn, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)" }}>Register at lhp.recdesk.com →</a>
        <div style={styles.footerDivider} />
        <div style={styles.footerText2}>Own a local business? List your events & deals.</div>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeznT4FeZSAhSIG6R9-0F22Iykx1NO1bGFBMt8d9fcXd5ekag/viewform?usp=publish-editor" target="_blank" rel="noreferrer" style={{ ...styles.footerBtn2, display: "block", textDecoration: "none", textAlign: "center" }}>+ Submit an Event or Special</a>
        <div style={styles.footerDivider} />
        <div style={styles.footerDisclaimer}>
          LHP Social is an independent community platform and is not affiliated with or operated by the City of Lighthouse Point.
        </div>
        <div style={styles.footerLinkRow}>
          <button onClick={() => setShowAbout(true)} style={styles.privacyLink}>About</button>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
          <button onClick={() => setShowPrivacy(true)} style={styles.privacyLink}>Privacy Policy</button>
        </div>
        <div style={styles.footerCopyright}>© 2026 lhpsocial.com</div>
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
                  {[...visibleFeaturedEvents, ...allEvents].filter(e => savedEvents.includes(e.id)).map(ev => (
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
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeznT4FeZSAhSIG6R9-0F22Iykx1NO1bGFBMt8d9fcXd5ekag/viewform?usp=publish-editor" target="_blank" rel="noreferrer" style={{ ...styles.ctaBtn, background: "#0077B6", display: "inline-block", marginBottom: 12 }}>+ Submit an Event →</a>
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
                <img src="/lhplighthousemedium_1.png" alt="" style={styles.installSheetIconLighthouse} />
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
  root: { fontFamily: "'Nunito', 'Segoe UI', sans-serif", background: "#F0F8FF", minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 48 },
  header: { background: `linear-gradient(160deg, #001324 0%, ${LHP4.navy} 55%, ${LHP4.navySoft} 100%)`, padding: "28px 20px 28px", color: "#fff", position: "relative", overflow: "hidden" },
  waveBg: { position: "absolute", bottom: -10, left: 0, right: 0, height: 40, background: "rgba(255,255,255,0.06)", borderRadius: "50% 50% 0 0 / 30px 30px 0 0" },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, position: "relative" },
  logoRow: { display: "flex", alignItems: "center", gap: 11 },
  logoLighthouse: { height: 52, width: "auto", display: "block", filter: "brightness(0) invert(1)", flexShrink: 0 },
  wordmarkBlock: { display: "flex", flexDirection: "column" },
  wordmark: { fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: -0.6, lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", marginBottom: 4 },
  wordmarkLHP: { color: "#fff" },
  wordmarkSocial: { color: LHP4.tealBright, marginLeft: 5 },
  appSub: { fontSize: 11, opacity: 0.85, color: "#ADE8F4", lineHeight: 1.3 },
  appSub2: { fontSize: 11, opacity: 0.75, color: "#ADE8F4", lineHeight: 1.3 },
  savedBadge: { background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" },
  tagline: { fontSize: 13, color: "rgba(255,255,255,0.88)", fontWeight: 600, position: "relative" },
  searchWrap: { margin: "16px 16px 0", background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", padding: "10px 14px", boxShadow: "0 2px 10px rgba(0,80,140,0.08)", gap: 8 },
  searchIcon: { fontSize: 16 },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 14, color: "#023E8A", fontFamily: "inherit", background: "transparent" },
  clearBtn: { background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14, padding: 0 },
  searchResultNote: { margin: "6px 16px 0", fontSize: 12, color: "#0096C7", fontWeight: 700 },
  section: { padding: "20px 16px 0" },
  sectionLabel: { fontWeight: 800, fontSize: 16, color: "#023E8A", marginBottom: 12, letterSpacing: -0.3 },
  categoryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  categoryCard: { display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "14px", borderRadius: 16, cursor: "pointer", transition: "all 0.18s ease", textAlign: "left", gap: 3 },
  catEmoji: { fontSize: 26, marginBottom: 4 },
  catLabel: { fontWeight: 800, fontSize: 13, lineHeight: 1.2 },
  catDesc: { fontSize: 11, fontWeight: 500 },
  tabBarWrap: { overflowX: "auto", padding: "16px 16px 0", scrollbarWidth: "none" },
  tabBar: { display: "flex", gap: 8, width: "max-content" },
  tab: { border: "none", borderRadius: 20, padding: "7px 16px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" },
  registerBanner: { margin: "14px 16px 0", background: "#E0F4FB", borderRadius: 12, padding: "10px 14px" },
  registerText: { fontSize: 12, color: "#023E8A", fontWeight: 700, display: "block", marginBottom: 5 },
  registerLinks: { display: "flex", gap: 16 },
  registerLink: { fontSize: 12, color: "#0096C7", fontWeight: 800, textDecoration: "none" },
  disclaimerBanner: { margin: "8px 16px 0", padding: "6px 12px" },
  disclaimerText: { fontSize: 10, color: "#9aabb5", fontWeight: 500, lineHeight: 1.4, display: "block", textAlign: "center", fontStyle: "italic" },
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
  featuredLabel: { fontSize: 11, fontWeight: 900, color: "#0077B6", letterSpacing: 1.5, textTransform: "uppercase" },
  venueToggle: { display: "flex", gap: 5, flexWrap: "wrap" },
  venueBtn: { border: "none", borderRadius: 12, padding: "4px 10px", fontSize: 11, cursor: "pointer", transition: "all 0.15s" },
  venueInfo: { background: "#E8F4FD", borderRadius: 10, padding: "8px 12px", fontSize: 11, color: "#023E8A", fontWeight: 600, marginBottom: 10 },
  musicList: { display: "flex", flexDirection: "column", gap: 8 },
  musicDateHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 8px", paddingBottom: 6, borderBottom: "1.5px solid #cce4f0" },
  musicDateBadge: { fontSize: 12, fontWeight: 900, color: "#023E8A", letterSpacing: 0.3 },
  musicDateCount: { fontSize: 10, fontWeight: 700, color: "#7aabb8", background: "#E0F4FB", padding: "2px 8px", borderRadius: 10 },
  musicCard: { background: "#fff", borderRadius: 14, padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 2px 10px rgba(0,80,140,0.08)" },
  musicLeft: { display: "flex", gap: 10, alignItems: "flex-start", flex: 1 },
  musicEmoji: { fontSize: 22, flexShrink: 0, marginTop: 2 },
  musicTitle: { fontWeight: 800, fontSize: 13, color: "#023E8A", lineHeight: 1.3, marginBottom: 2 },
  musicOrg: { fontSize: 11, color: "#7aabb8", fontWeight: 600, marginBottom: 4 },
  musicMeta: { display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: "#4a7a8a", fontWeight: 600, marginBottom: 3 },
  musicNote: { fontSize: 11, color: "#7aabb8", fontStyle: "italic", marginBottom: 4 },
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
  eventCount: { fontSize: 12, color: "#7aabb8", fontWeight: 700, background: "#ddf0f7", padding: "3px 10px", borderRadius: 10 },
  eventList: { display: "flex", flexDirection: "column", gap: 12 },
  emptyState: { textAlign: "center", color: "#aaa", fontSize: 14, padding: "32px 0" },
  salesEmptyState: { textAlign: "center", padding: "32px 20px", background: "#FEF3E7", borderRadius: 16, border: "2px dashed #E07A1F40" },
  salesEmptyEmoji: { fontSize: 36, marginBottom: 10 },
  salesEmptyTitle: { fontWeight: 800, fontSize: 15, color: "#E07A1F", marginBottom: 6 },
  salesEmptySub: { fontSize: 12, color: "#a06030", marginBottom: 16, lineHeight: 1.5 },
  salesEmptyBtn: { display: "inline-block", background: "#E07A1F", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 2px 8px rgba(224,122,31,0.25)" },
  eventCard: { background: "#fff", borderRadius: 16, overflow: "hidden", display: "flex", boxShadow: "0 2px 14px rgba(0,80,140,0.09)" },
  eventAccent: { width: 5, flexShrink: 0 },
  eventBody: { padding: "14px", flex: 1 },
  eventTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  eventTitle: { fontWeight: 800, fontSize: 15, color: "#023E8A", lineHeight: 1.3, flex: 1 },
  saveBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1, flexShrink: 0 },
  eventOrg: { fontSize: 12, color: "#7aabb8", fontWeight: 600, marginTop: 2, marginBottom: 8 },
  eventMeta: { display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: "#4a7a8a", fontWeight: 600, marginBottom: 8 },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 },
  ageBadge: { borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 },
  priceBadge: { borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 },
  noteBadge: { fontSize: 11, color: "#7aabb8", fontStyle: "italic", marginBottom: 8 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 },
  tag: { background: "#E8F4FD", color: "#0096C7", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "2px 7px" },
  ctaBtn: { display: "inline-block", color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", textDecoration: "none" },
  submitSaleBtn: { display: "block", background: "#E07A1F", color: "#fff", borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", textDecoration: "none", textAlign: "center", marginTop: 14, boxShadow: "0 2px 10px rgba(224,122,31,0.25)" },
  footer: { margin: "24px 16px 0", background: "linear-gradient(135deg, #023E8A 0%, #0096C7 100%)", borderRadius: 20, padding: "22px 20px", textAlign: "center" },
  footerIcon: { fontSize: 28, marginBottom: 6 },
  footerText: { color: "#fff", fontSize: 15, fontWeight: 800, marginBottom: 4 },
  footerSub: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 12 },
  footerBtn: { display: "block", background: "linear-gradient(135deg, #00B4A6, #52B788)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%", textDecoration: "none", boxSizing: "border-box", marginBottom: 4 },
  footerDivider: { height: 1, background: "rgba(255,255,255,0.15)", margin: "14px 0" },
  footerText2: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 10, marginTop: 4 },
  footerBtn2: { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "10px 24px", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%" },
  footerDisclaimer: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500, lineHeight: 1.5, marginTop: 4, padding: "0 4px" },
  privacyLink: { background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline", marginTop: 8, padding: 0 },
  footerCopyright: { color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 6 },
  footerLinkRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 10 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 14px", borderBottom: "1px solid #E8F4FD" },
  modalTitle: { fontWeight: 900, fontSize: 16, color: "#023E8A" },
  modalClose: { background: "none", border: "none", fontSize: 18, color: "#aaa", cursor: "pointer", padding: 4 },
  modalBody: { overflowY: "auto", padding: "16px 20px 32px" },
  modalSection: { fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 12 },
  modalDivider: { height: 1, background: "#E8F4FD", margin: "14px 0" },
  modalDisclaimer: { fontSize: 12, color: "#7aabb8", fontStyle: "italic", lineHeight: 1.6, marginBottom: 10 },
  modalContact: { fontSize: 12, color: "#555", marginTop: 8 },
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
  installSheetHero: { display: "flex", alignItems: "center", gap: 14, padding: "4px 4px 0" },
  installSheetIcon: { width: 64, height: 64, borderRadius: 14, background: `linear-gradient(160deg, ${LHP4.navySoft} 0%, ${LHP4.navy} 55%, #00132A 100%)`, display: "grid", placeItems: "center", flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset, 0 4px 12px rgba(0, 29, 68, 0.30)" },
  installSheetIconBeam: { position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: `radial-gradient(80% 100% at 50% 100%, ${LHP4.teal}55 0%, transparent 70%)` },
  installSheetIconLighthouse: { height: 40, width: "auto", position: "relative", zIndex: 2, filter: "brightness(0) invert(1)", opacity: 0.96 },
  installSheetTitle: { fontSize: 18, fontWeight: 800, letterSpacing: -0.3, color: LHP4.navy, lineHeight: 1.15 },
  installSheetSub: { fontSize: 12.5, color: LHP4.mute, marginTop: 3, lineHeight: 1.35 },
  installSheetDivider: { height: 1, background: LHP4.hairSoft, margin: "18px 0 6px" },
  installStepRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 4px" },
  installStepNum: { width: 26, height: 26, borderRadius: 999, background: LHP4.tintTeal, color: LHP4.teal, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 },
  installStepTitle: { fontSize: 15, fontWeight: 700, color: LHP4.navy, lineHeight: 1.25 },
  installStepSub: { fontSize: 12.5, color: LHP4.mute, marginTop: 2, lineHeight: 1.35 },
  installStepHair: { height: 1, background: "rgba(0, 29, 68, 0.04)", marginLeft: 40 },
  installStepGlyph: { width: 38, height: 38, borderRadius: 10, background: "#EEF2F7", display: "grid", placeItems: "center", flexShrink: 0 },
  installStepGlyphWide: { minWidth: 160, height: 38, borderRadius: 10, background: "#F2F2F7", display: "flex", alignItems: "center", padding: "0 10px", gap: 8, flexShrink: 0 },
  installStepAddBtn: { height: 34, padding: "0 16px", borderRadius: 999, background: "#0A84FF", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 2px 6px rgba(10,132,255,0.35)", flexShrink: 0 },
  installTipStrip: { marginTop: 16, background: LHP4.tintTeal, color: LHP4.teal, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600 },
  installSheetSig: { marginTop: 18, textAlign: "center", fontSize: 11, fontStyle: "italic", color: LHP4.mute, opacity: 0.85, letterSpacing: 0.1 },
};

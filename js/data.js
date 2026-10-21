/* ===== Data Store (JSON-style objects) =====
   Project requirement: data JSON/TXT mein rakhna. Yahan data JS objects ki form mein hai
   taake file:// par bhi bina server chale. */

const TECH_DATA = [
  { icon: "⚙️", title: "Mechanical Movement", cat: "Movements", desc: "Hand-wound springs and gears power the watch with no battery. A true craftsman's masterpiece." },
  { icon: "🔄", title: "Automatic (Self-Winding)", cat: "Movements", desc: "A rotor winds the mainspring using your wrist motion, so the watch keeps running while worn." },
  { icon: "🔋", title: "Quartz Movement", cat: "Movements", desc: "A vibrating quartz crystal keeps highly accurate time with minimal maintenance." },
  { icon: "☀️", title: "Eco-Drive (Solar)", cat: "Power", desc: "Light-powered cells charge the watch from any light source, so it never needs a battery change." },
  { icon: "💎", title: "Sapphire Crystal", cat: "Materials", desc: "Scratch-resistant glass, second only to diamond in hardness. Keeps the dial clear for years." },
  { icon: "💧", title: "Water Resistance", cat: "Materials", desc: "Sealed cases and gaskets protect from splashes up to deep-diving depths (30m to 300m+)." },
  { icon: "❤️", title: "Heart-Rate & Health Sensors", cat: "Smart", desc: "Optical sensors track heart rate, sleep, steps and workouts throughout the day." },
  { icon: "📍", title: "GPS & Navigation", cat: "Smart", desc: "Built-in GPS records routes and distance for runs, hikes and rides without a phone." },
  { icon: "💳", title: "NFC Contactless Pay", cat: "Smart", desc: "Tap your wrist to pay securely and receive notifications from your phone." }
];

/* Images folder structure: images/<category-folder>/<file>. Nayi image add karne ke liye
   file sahi folder mein rakho aur yahan ek line add karo. */
const GALLERY_DATA = [
 { src: "images/vintage/brass-watch-1.jpg", title: "Vintage Classic Brass", cat: "Vintage" },
  { src: "images/vintage/Vintage Heritage Steel 2.jpg", title: "Vintage Heritage Steel", cat: "Vintage" },
  { src: "images/vintage/Vintage Rose Champagne 2.jpg", title: "Vintage Rose Champagne", cat: "Vintage" },
  { src: "images/vintage/racing-ivory-4.jpg", title: "Vintage Racing Ivory", cat: "Vintage" },
  { src: "images/vintage/Vintage Antique Bronze 5.jpg", title: "Vintage Antique Bronze", cat: "Vintage" },
  { src: "images/vintage/Vintage Ivory Steel 6.jpg", title: "Vintage Ivory Steel", cat: "Vintage" },
  { src: "images/vintage/Vintage Black Heritage 7.jpg", title: "Vintage Black Heritage", cat: "Vintage" },
  { src: "images/vintage/Vintage Green Field 8.jpg", title: "Vintage Green Field", cat: "Vintage" },
  { src: "images/vintage/Vintage Gold Pocket 9.jpg", title: "Vintage Gold Pocket", cat: "Vintage" },
  { src: "images/vintage/Vintage Silver Chronograph 10.jpg", title: "Vintage Silver Chronograph", cat: "Vintage" },
  { src: "images/vintage/Vintage Rose Dress 11.jpg", title: "Vintage Rose Dress", cat: "Vintage" },
  { src: "images/vintage/Vintage Navy Classic 12.jpg", title: "Vintage Navy Classic", cat: "Vintage" },

  { src: "images/luxury/Luxury Royal Gold 1.jpg", title: "Luxury Royal Gold", cat: "Luxury" },
  { src: "images/luxury/Luxury Ocean Blue 2.jpg", title: "Luxury Ocean Blue", cat: "Luxury" },
  { src: "images/luxury/Luxury Burgundy Rose 3.jpg", title: "Luxury Burgundy Rose", cat: "Luxury" },
  { src: "images/luxury/Luxury Chronograph White 4.jpg", title: "Luxury Chronograph White", cat: "Luxury" },
  { src: "images/luxury/Luxury Platinum White 5.jpg", title: "Luxury Platinum White", cat: "Luxury" },
  { src: "images/luxury/black gold 6.jpg", title: "Luxury Black Gold", cat: "Luxury" },
  { src: "images/luxury/Luxury Emerald 7.jpg", title: "Luxury Emerald", cat: "Luxury" },
  { src: "images/luxury/Luxury Rose Pearl 8.jpg", title: "Luxury Rose Pearl", cat: "Luxury" },
  { src: "images/luxury/Luxury Midnight Chrono 9.jpg", title: "Luxury Midnight Chrono", cat: "Luxury" },
  { src: "images/luxury/Luxury Two-Tone Silver 10.jpg", title: "Luxury Two-Tone Silver", cat: "Luxury" },
  { src: "images/luxury/Luxury Royal Purple 11.jpg", title: "Luxury Royal Purple", cat: "Luxury" },
  { src: "images/luxury/Luxury Carbon Black 12.jpg", title: "Luxury Carbon Black", cat: "Luxury" },

  { src: "images/smart-watches/ocean-blue-9.jpg", title: "Smart Watch Ocean Blue", cat: "Smart Watches" },
  { src: "images/smart-watches/forest-green-10.jpg", title: "Smart Watch Forest Green", cat: "Smart Watches" },
  { src: "images/smart-watches/sunset-orange-11.jpg", title: "Smart Watch Sunset Orange", cat: "Smart Watches" },
  { src: "images/smart-watches/rose-fit-12.jpg", title: "Smart Watch Rose Fit", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Midnight Black 5.jpg", title: "Smart Watch Midnight Black", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Silver Sport 6.jpg", title: "Smart Watch Silver Sport", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Gold Edition 7.jpg", title: "Smart Watch Gold Edition", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Purple Pulse 8.jpg", title: "Smart Watch Purple Pulse", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Red Runner 9.jpg", title: "Smart Watch Red Runner", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Teal Active 10.jpg", title: "Smart Watch Teal Active", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Stone Grey 11.jpg", title: "Smart Watch Stone Grey", cat: "Smart Watches" },
  { src: "images/smart-watches/Smart Watch Rose Gold Lite 12.jpg", title: "Smart Watch Rose Gold Lite", cat: "Smart Watches" },

  //  { src: "images/pilot/classic-black-13.jpg", title: "Pilot Classic Black", cat: "Pilot" },
  //  { src: "images/pilot/field-green-14.jpg", title: "Pilot Field Green", cat: "Pilot" },
  //  { src: "images/pilot/navigator-blue-15.jpg", title: "Pilot Navigator Blue", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-01.jpg", title: "Pilot Aviator Brown", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-02.jpg", title: "Pilot Desert Tan", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-03.jpg", title: "Pilot Stealth Black", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-04.jpg", title: "Pilot Sky Blue", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-05.jpg", title: "Pilot Olive Drab", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-06.jpg", title: "Pilot White Dial", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-07.jpg", title: "Pilot Chrono Red", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-08.jpg", title: "Pilot Gold Navigator", cat: "Pilot" },
  //  { src: "images/pilot/pilot-extra-09.jpg", title: "Pilot Grey Titanium", cat: "Pilot" },

];

const SUPPORT_DATA = [
  { icon: "🔧", title: "Watch Repair", text: "Expert repair for mechanical, quartz and smart watches.",
    intro: "Our in-house workshop repairs and services mechanical, quartz and smart watches, handled by certified technicians.",
    points: ["Free inspection and a clear quote before any work starts", "Battery, strap, glass and crown replacement in 1 to 2 days", "Full servicing of mechanical watches in 2 to 4 weeks", "Track your repair live with the Repair Status Tracker below"],
    cta: "Request a repair", href: "#supportForm" },
  { icon: "🛡️", title: "Warranty", text: "Hassle-free warranty claims on all new watches.",
    intro: "Every new Alberto watch is covered by a 2-year warranty against manufacturing defects.",
    points: ["Covers movement, electronics and manufacturing faults", "Bring the watch with your receipt or warranty card to any store", "Accidental damage, water damage and strap wear are not covered", "We inspect first, then repair or replace the watch"],
    cta: "Start a warranty claim", href: "#supportForm" },
  { icon: "💰", title: "Appraisal", text: "Get a fair valuation of your luxury timepiece.",
    intro: "Get an honest, expert valuation of your watch for insurance, resale or inheritance.",
    points: ["Inspection of case, movement, dial and condition", "Written valuation certificate on request", "Bring the original box and papers for a better valuation", "Free verbal estimate at our store during opening hours"],
    cta: "Book an appraisal", href: "#supportForm" },
  { icon: "📧", title: "Email Support", text: "support@albertowatches.com (reply within 24 hours)",
    intro: "Prefer to write to us? Our support team replies to every email personally.",
    points: ["Email: support@albertowatches.com", "We reply within 24 hours on working days", "Mention your ticket ID or watch name for a faster answer", "Urgent? Call +92 21 3498 7654, Mon to Sat, 10 AM to 7 PM"],
    cta: "Send an email", href: "mailto:support@albertowatches.com" }
];

const FAQ_DATA = [
  { q: "How long does a watch repair take?", a: "Simple repairs like battery or strap changes take 1 to 2 days. Full servicing of mechanical watches can take 2 to 4 weeks." },
  { q: "Do you offer warranty on new watches?", a: "Yes. All new watches come with the manufacturer's warranty, and we help you with the claim process." },
  { q: "Can I get my vintage watch appraised?", a: "Absolutely. Bring your watch to the store or send photos by email, and our experts will give you an estimate." },
  { q: "Is my watch water resistant forever?", a: "No. Seals wear out over time, so we recommend a water-resistance test every 1 to 2 years." },
  { q: "Which brands do you carry?", a: "Michael Kors, Rolex, Citizen Eco-Drive, Bulova and many more." }
];

/* Store info: open/closed status is calculated in the STORE's own timezone.
   hours: index 0 = Sunday ... 6 = Saturday; [openHour, closeHour] in 24h, null = closed all day. */
const STORE = {
  name: "Alberto Watch Company",
  city: "Karachi",
  lat: 24.9056, lon: 67.0822,      // default coordinates for weather if visitor denies location
  timeZone: "Asia/Karachi",
  hours: [null, [10, 19], [10, 19], [10, 19], [10, 19], [10, 19], [10, 19]]
};

/* Repair tickets (demo data). stage: 0 Received, 1 Diagnosis, 2 In Repair, 3 Quality Check, 4 Ready for Pickup */
const REPAIR_STAGES = ["Received", "Diagnosis", "In Repair", "Quality Check", "Ready for Pickup"];
const REPAIR_DATA = [
  { id: "ALB-1001", customer: "Ahmed Khan",  watch: "Rolex Datejust (Automatic service)", stage: 2, eta: "3 working days" },
  { id: "ALB-1002", customer: "Sara Ali",    watch: "Citizen Eco-Drive (Battery cell)",  stage: 4, eta: "Ready now" },
  { id: "ALB-1003", customer: "Bilal Ahmed", watch: "Vintage Bulova (Crystal replacement)", stage: 0, eta: "7 working days" },
  { id: "ALB-1004", customer: "Hina Raza",   watch: "Michael Kors Smart (Screen repair)", stage: 3, eta: "1 working day" }
];

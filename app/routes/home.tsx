import { Form, useActionData } from "react-router";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import type { Route } from "./+types/home";

const classes = [
  { name: "Flow", tag: "MOVE WITH EASE", description: "A thoughtful vinyasa practice to build heat, find space, and leave feeling a little more like yourself.", detail: "ALL LEVELS · 50 MIN", tone: "sage", mark: "01" },
  { name: "Sculpt", tag: "BUILD YOUR BASE", description: "Low-impact strength with light weights and intentional sequences. Small movements, lasting energy.", detail: "ALL LEVELS · 45 MIN", tone: "clay", mark: "02" },
  { name: "Mat Pilates", tag: "LENGTHEN + STRENGTHEN", description: "Core-led, precise, and made to meet you where you are. Expect a steady burn and a clear head.", detail: "ALL LEVELS · 50 MIN", tone: "butter", mark: "03" },
  { name: "Restore", tag: "MAKE ROOM TO REST", description: "Slow stretches, soft props, and longer holds to help your body reset after a full week.", detail: "ALL LEVELS · 60 MIN", tone: "rose", mark: "04" },
];
const sessions = [
  { day: "MON", time: "7:00 AM", name: "Flow" }, { day: "MON", time: "6:00 PM", name: "Sculpt" },
  { day: "TUE", time: "7:30 AM", name: "Mat Pilates" }, { day: "TUE", time: "6:15 PM", name: "Restore" },
  { day: "WED", time: "7:00 AM", name: "Sculpt" }, { day: "WED", time: "6:00 PM", name: "Flow" },
  { day: "THU", time: "7:30 AM", name: "Mat Pilates" }, { day: "THU", time: "6:15 PM", name: "Sculpt" },
  { day: "FRI", time: "7:00 AM", name: "Flow" }, { day: "SAT", time: "9:00 AM", name: "Restore" },
  { day: "SAT", time: "10:15 AM", name: "Mat Pilates" },
];
function bookingStore(context: Route.ActionArgs["context"]) {
  const namespace = context.cloudflare.env.BOOKINGS;
  return namespace.get(namespace.idFromName("juniper-bookings"));
}
export async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const sessionValue = String(form.get("session") ?? "");
  const session = sessions.find((item) => item.day + " · " + item.time + " · " + item.name === sessionValue);
  if (name.length < 2 || name.length > 100) return { ok: false, error: "Please enter your name (2–100 characters)." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!session) return { ok: false, error: "Choose a class time from the schedule." };
  await bookingStore(context).create({ name, email, className: session.name, sessionTime: session.day + " · " + session.time });
  return { ok: true, error: "" };
}
export function meta() {
  return [
    { title: "Juniper Movement Club — Find your rhythm" },
    { name: "description", content: "Small-group movement for feeling good in your body. Find your next class at Juniper Movement Club." },
  ];
}
function Brand() {
  return <a className="brand" href="#top" aria-label="Juniper Movement Club home"><span className="brand-symbol">j.</span><span className="brand-name">JUNIPER<br />MOVEMENT CLUB</span></a>;
}
export default function Home() {
  const result = useActionData<typeof action>();
  return (
    <main id="top">
      <header className="site-header"><div className="header-inner"><Brand /><nav className="main-nav" aria-label="Main navigation"><a href="#classes">The classes</a><a href="#schedule">Schedule</a><a href="#studio">Our studio</a></nav><a className="nav-book" href="#book">Book a class <ArrowUpRight size={15} /></a><a className="mobile-menu" href="#book">BOOK <ArrowUpRight size={14} /></a></div></header>
      <section className="hero"><div className="hero-image" role="img" aria-label="Sunlit, calm movement studio" /><div className="hero-shade" /><div className="hero-content wrap"><p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> YOUR NEIGHBORHOOD MOVEMENT STUDIO</p><h1>Find your<br /><em>own rhythm.</em></h1><p className="hero-copy">A little stronger. A little softer.<br />Always more you.</p><a className="button button-light" href="#schedule">Explore the schedule <ArrowDown size={15} /></a><div className="hero-bottom"><span>MOVE WELL, FEEL MORE</span><span>EST. FOR EVERY BODY</span></div></div><div className="hero-stamp"><span>GOOD<br />THINGS<br />TAKE<br />MOVEMENT</span><span className="stamp-star">✳</span></div></section>
      <section className="intro-section wrap" id="studio"><p className="eyebrow"><span className="eyebrow-line" /> A STUDIO TO COME BACK TO</p><div className="intro-grid"><h2>Movement that<br />meets you <em>here.</em></h2><div className="intro-copy"><p>We're a small, feel-good studio built around a simple idea: movement should make more room in your life, not take it over.</p><p>Come as you are. We'll take it from there.</p><a className="text-link" href="#classes">A little about our classes <ArrowRight size={15} /></a></div></div></section>
      <section className="classes-section" id="classes"><div className="wrap"><div className="section-head"><div><p className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FEEL-GOOD</p><h2>Good movement.<br /><em>Good mood.</em></h2></div><p className="section-note">Different days call for different things.<br />There's a class for all of them.</p></div><div className="class-grid">{classes.map((item) => <article className={"class-card " + item.tone} key={item.name}><div className="class-card-top"><span>{item.mark}</span><span>{item.tag}</span></div><div className="class-orbit" aria-hidden="true"><i /><i /><i /></div><div className="class-card-bottom"><h3>{item.name}</h3><p>{item.description}</p><span>{item.detail}</span></div></article>)}</div></div></section>
      <section className="schedule-section wrap" id="schedule"><div className="section-head schedule-head"><div><p className="eyebrow"><span className="eyebrow-line" /> THE WEEK, AT A GLANCE</p><h2>Make a little<br /><em>you-time.</em></h2></div><p className="section-note">Your mat's waiting. Choose a time<br />that feels good and save your spot.</p></div><div className="schedule-shell"><div className="schedule-labels"><span>DAY</span><span>TIME</span><span>CLASS</span><span>GUIDED BY</span><span /></div>{sessions.map((session, index) => <div className="schedule-row" key={session.day + "-" + session.time}><span className="schedule-day">{session.day}</span><span className="schedule-time">{session.time}</span><span className="schedule-name">{session.name}<small>{session.name === "Restore" ? "60 min" : session.name === "Sculpt" ? "45 min" : "50 min"}</small></span><span className="schedule-teacher">STUDIO TEAM</span><a href="#book" className="schedule-book" aria-label={"Book " + session.name + " on " + session.day + " at " + session.time}>BOOK <ArrowUpRight size={14} /></a></div>)}</div><p className="schedule-footnote">Starter timetable — update class times to match your studio. All classes are beginner-friendly; mats and props are ready for you.</p></section>
      <section className="booking-section" id="book"><div className="booking-deco" aria-hidden="true">✳</div><div className="wrap booking-grid"><div className="booking-copy"><p className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT GOOD THING</p><h2>Save your<br /><em>spot.</em></h2><p>One small step, and we'll see you on the mat. The studio will follow up using the email you provide.</p><div className="booking-detail"><span>01</span><p><strong>Pick your class</strong><br />Choose a day and a time that works for you.</p></div><div className="booking-detail"><span>02</span><p><strong>We'll be in touch</strong><br />Look out for a confirmation in your email.</p></div></div><div className="booking-form-card"><div className="form-card-heading"><span>FIRST CLASS OR YOUR FIFTIETH</span><span>✳</span></div><h3>Let's get you in.</h3>{result?.ok ? <div className="success-message" role="status"><span className="success-icon"><Check size={18} /></span><div><strong>You're on the list.</strong><p>Your spot request is saved. The studio will follow up using your email.</p></div></div> : <Form method="post" className="booking-form"><label htmlFor="name">Your name</label><input id="name" name="name" type="text" autoComplete="name" placeholder="Name you go by" minLength={2} maxLength={100} required /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required /><label htmlFor="session">Choose your class</label><select id="session" name="session" defaultValue="" required><option value="" disabled>Select a class time</option>{sessions.map((session) => { const value = session.day + " · " + session.time + " · " + session.name; return <option key={value} value={value}>{session.day} · {session.time} — {session.name}</option>; })}</select>{result?.error && <p className="form-error" role="alert">{result.error}</p>}<button className="button button-dark" type="submit">Reserve my spot <ArrowRight size={16} /></button><p className="form-privacy">Your details are only used to manage this booking.</p></Form>}</div></div></section>
      <section className="closing-band"><p>MAKE SPACE FOR YOU</p><span>✳</span><p>SEE YOU ON THE MAT</p></section>
      <footer className="site-footer"><div className="wrap footer-top"><Brand /><div className="footer-address"><span>COME FIND US</span><p>YOUR NEIGHBORHOOD<br />YOUR KIND OF PLACE</p></div><div className="footer-hours"><span>DROP IN</span><p>WEEKDAY MORNINGS + EVENINGS<br />WEEKEND CLASSES TOO</p></div><a className="footer-up" href="#top" aria-label="Back to top">↑</a></div><div className="wrap footer-bottom"><span>© JUNIPER MOVEMENT CLUB</span><span>MOVE WELL, FEEL MORE.</span><span>SEE YOU ON THE MAT.</span></div></footer>
    </main>
  );
}

import { Form, redirect, useActionData, useLoaderData } from "react-router";
import type { Route } from "./+types/admin";

// High-entropy owner passphrase verifier. Never store the raw access key in this public source.
const ADMIN_PASSWORD_HASH = "c97532d7ff67fbbf8996e659aaacb8596b3ebb916aa3596793b1eadb49630484";
const COOKIE_NAME = "juniper_owner";
const encoder = new TextEncoder();
function bookingStore(context: Route.LoaderArgs["context"]) {
  const namespace = context.cloudflare.env.BOOKINGS;
  return namespace.get(namespace.idFromName("juniper-bookings"));
}
async function matchesPassword(candidate: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(candidate));
  const actual = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (actual.length !== ADMIN_PASSWORD_HASH.length) return false;
  let mismatch = 0;
  for (let i = 0; i < actual.length; i++) mismatch |= actual.charCodeAt(i) ^ ADMIN_PASSWORD_HASH.charCodeAt(i);
  return mismatch === 0;
}
async function isOwner(request: Request) {
  const cookie = request.headers.get("Cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(COOKIE_NAME + "="));
  if (!cookie) return false;
  try { return await matchesPassword(decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1))); } catch { return false; }
}
export async function loader({ request, context }: Route.LoaderArgs) {
  if (!(await isOwner(request))) return { authenticated: false as const, bookings: [] };
  return { authenticated: true as const, bookings: await bookingStore(context).list() };
}
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  if (String(form.get("intent")) === "logout") return redirect("/studio-admin", { headers: { "Set-Cookie": COOKIE_NAME + "=; HttpOnly; Secure; SameSite=Strict; Path=/studio-admin; Max-Age=0" } });
  const password = String(form.get("password") ?? "");
  if (!(await matchesPassword(password))) return { error: "That access key didn't match. Please try again." };
  return redirect("/studio-admin", { headers: { "Set-Cookie": COOKIE_NAME + "=" + encodeURIComponent(password) + "; HttpOnly; Secure; SameSite=Strict; Path=/studio-admin; Max-Age=1209600" } });
}
export function meta() { return [{ title: "Owner dashboard · Juniper" }, { name: "robots", content: "noindex, nofollow" }]; }
export default function Admin() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  if (!data.authenticated) return <main className="admin-page"><div className="admin-login"><a className="admin-brand" href="/">j. <span>JUNIPER MOVEMENT CLUB</span></a><p className="admin-kicker">OWNER ACCESS</p><h1>Welcome<br />back.</h1><p className="admin-intro">Sign in to see who's joining us on the mat.</p><Form method="post" className="admin-form"><label htmlFor="password">Access key</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button type="submit">Open dashboard <span>→</span></button>{result?.error && <p className="form-error" role="alert">{result.error}</p>}</Form><a className="admin-home" href="/">← Back to the studio</a></div></main>;
  return <main className="admin-page"><div className="admin-dashboard"><div className="admin-top"><a className="admin-brand" href="/">j. <span>JUNIPER MOVEMENT CLUB</span></a><Form method="post"><input type="hidden" name="intent" value="logout" /><button className="logout-button" type="submit">Sign out</button></Form></div><p className="admin-kicker">PRIVATE OWNER VIEW</p><div className="admin-title-row"><div><h1>Booking<br />roster.</h1><p className="admin-intro">A quiet look at who's coming to move.</p></div><div className="booking-count"><strong>{data.bookings.length.toString().padStart(2, "0")}</strong><span>RESERVATIONS</span></div></div><section className="roster-card"><div className="roster-heading"><h2>Everyone's in</h2><span>{data.bookings.length} {data.bookings.length === 1 ? "BOOKING" : "BOOKINGS"}</span></div>{data.bookings.length === 0 ? <div className="roster-empty">No bookings yet. When someone saves a spot, they'll show up here.</div> : <div className="roster-table-wrap"><table className="roster-table"><thead><tr><th>NAME</th><th>EMAIL</th><th>CLASS</th><th>SESSION</th><th>BOOKED</th></tr></thead><tbody>{data.bookings.map((booking) => <tr key={booking.id}><td>{booking.name}</td><td><a href={"mailto:" + booking.email}>{booking.email}</a></td><td>{booking.className}</td><td>{booking.sessionTime}</td><td>{booking.createdAt}</td></tr>)}</tbody></table></div>}</section><a className="admin-home" href="/">← Back to the studio</a></div></main>;
}

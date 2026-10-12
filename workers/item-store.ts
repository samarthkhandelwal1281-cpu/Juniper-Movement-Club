import { DurableObject } from "cloudflare:workers";

interface BookingStoreEnv {}
export interface Booking extends Record<string, SqlStorageValue> {
  id: number;
  name: string;
  email: string;
  className: string;
  sessionTime: string;
  createdAt: string;
}

export class BookingStore extends DurableObject<BookingStoreEnv> {
  constructor(ctx: DurableObjectState, env: BookingStoreEnv) {
    super(ctx, env);
    this.ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, class_name TEXT NOT NULL, session_time TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  }
  list(): Booking[] {
    return this.ctx.storage.sql.exec<Booking>("SELECT id, name, email, class_name AS className, session_time AS sessionTime, created_at AS createdAt FROM bookings ORDER BY id DESC").toArray();
  }
  create(input: Pick<Booking, "name" | "email" | "className" | "sessionTime">): Booking {
    return this.ctx.storage.sql.exec<Booking>("INSERT INTO bookings (name, email, class_name, session_time) VALUES (?, ?, ?, ?) RETURNING id, name, email, class_name AS className, session_time AS sessionTime, created_at AS createdAt", input.name, input.email, input.className, input.sessionTime).one();
  }
}

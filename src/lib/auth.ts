import crypto from "crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, userProfiles, userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";

// ─── Password Hashing Utilities ───
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === testHash;
}

// ─── NextAuth Options ───
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        anonymous: { label: "Anonymous", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.anonymous === "true") {
            // Create a new anonymous user in the database
            const [newUser] = await db.insert(users).values({
              isAnonymous: true,
              authProvider: "anonymous",
            }).returning();

            if (!newUser) throw new Error("Failed to create anonymous user");

            // Initialize default profile
            await db.insert(userProfiles).values({
              userId: newUser.id,
              accuracyScore: 55,
              totalCo2ReducedKg: "0.00",
              forestTreeCount: 0,
            });

            // Initialize default preferences
            await db.insert(userPreferences).values({
              userId: newUser.id,
              theme: "light",
              notificationFrequency: "weekly",
            });

            return {
              id: newUser.id,
              email: null,
              isAnonymous: true,
            };
          }

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Lookup user by email
          const userList = await db.select().from(users).where(eq(users.email, credentials.email));
          const user = userList[0];

          // Auto-registration if user does not exist (Hackathon friendly)
          if (!user) {
            const passwordHash = hashPassword(credentials.password);
            const [newUser] = await db.insert(users).values({
              email: credentials.email,
              passwordHash,
              isAnonymous: false,
              authProvider: "email",
            }).returning();

            if (!newUser) return null;

            await db.insert(userProfiles).values({
              userId: newUser.id,
              accuracyScore: 55,
              totalCo2ReducedKg: "0.00",
              forestTreeCount: 0,
            });

            await db.insert(userPreferences).values({
              userId: newUser.id,
              theme: "light",
              notificationFrequency: "weekly",
            });

            return {
              id: newUser.id,
              email: newUser.email,
              isAnonymous: false,
            };
          }

          if (!user.passwordHash) {
            // User exists but has no password (e.g. OAuth user trying credentials)
            return null;
          }

          // Verify password
          const isValid = verifyPassword(credentials.password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            isAnonymous: user.isAnonymous ?? false,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isAnonymous = (user as any).isAnonymous ?? false;
      }
      if (trigger === "update" && session) {
        token.isAnonymous = session.isAnonymous;
        token.email = session.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).isAnonymous = token.isAnonymous as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-placeholder-for-hackathon-12345",
};

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_HOME, SESSION_COOKIE } from "@/lib/auth/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/auth";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function setDemoSession(input: {
  email: string;
  displayName: string;
  role: UserRole;
  trade?: string;
}) {
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({
      id: crypto.randomUUID(),
      email: input.email,
      displayName: input.displayName,
      role: input.role,
      trade: input.trade,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
}

export async function signInAction(role: UserRole, formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    redirect(`${APP_HOME[role]}/login?error=missing`);
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      redirect(`${APP_HOME[role]}/login?error=invalid`);
    }

    const userRole = data.user.user_metadata?.role;
    if (userRole && userRole !== role) {
      await supabase.auth.signOut();
      redirect(`${APP_HOME[role]}/login?error=role`);
    }

    redirect(APP_HOME[role]);
  }

  await setDemoSession({
    email,
    displayName: email.split("@")[0] ?? "Member",
    role,
  });
  redirect(APP_HOME[role]);
}

export async function signUpAction(role: UserRole, formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const displayName = readString(formData, "displayName") || email.split("@")[0];
  const trade = readString(formData, "trade") || undefined;

  if (!email || !password || (role === "professional" && !trade)) {
    redirect(`${APP_HOME[role]}/signup?error=missing`);
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          display_name: displayName,
          trade,
        },
      },
    });

    if (error) {
      redirect(`${APP_HOME[role]}/signup?error=invalid`);
    }

    redirect(APP_HOME[role]);
  }

  await setDemoSession({ email, displayName, role, trade });
  redirect(APP_HOME[role]);
}

export async function registerProfessionalAction(formData: FormData) {
  const accountType = readString(formData, "accountType");
  const businessName = readString(formData, "businessName");
  const displayName = readString(formData, "displayName");
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const phone = readString(formData, "phone");
  const city = readString(formData, "city");
  const address = readString(formData, "address");
  const radius = readString(formData, "radius");
  const categories = readString(formData, "categories");
  const yearsExperience = readString(formData, "yearsExperience");
  const description = readString(formData, "description");
  const trade = categories.split(",")[0]?.trim();

  const missingCore =
    !displayName ||
    !email ||
    !password ||
    !phone ||
    !city ||
    !address ||
    !radius ||
    !categories ||
    !yearsExperience ||
    !description ||
    (accountType !== "individual" && accountType !== "company") ||
    (accountType === "company" && !businessName);

  if (missingCore) {
    redirect("/pro/signup?error=missing");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "professional",
          display_name: displayName,
          trade,
          account_type: accountType,
          business_name: businessName,
          phone,
          city,
          address,
          radius,
          categories,
          years_experience: yearsExperience,
          bio: description,
        },
      },
    });

    if (error) {
      redirect("/pro/signup?error=invalid");
    }

    redirect(APP_HOME.professional);
  }

  await setDemoSession({
    email,
    displayName: accountType === "company" && businessName ? businessName : displayName,
    role: "professional",
    trade,
  });
  redirect(APP_HOME.professional);
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}

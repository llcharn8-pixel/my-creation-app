import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, skip the auth refresh and pass through.
  // Without this guard createServerClient throws "Your project's URL and Key
  // are required", crashing the edge middleware on every route (500
  // MIDDLEWARE_INVOCATION_FAILED).
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  try {
    let response = supabaseResponse;
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Refresh session so it doesn't expire while user is active
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password";
    // The recovery session is established client-side (Supabase's default
    // reset-password email puts the tokens in the URL fragment, which never
    // reaches this middleware), so this page must always be reachable and
    // must never be bounced away even if a stale session cookie exists.
    const isResetPasswordPage = pathname === "/reset-password";
    const isApiRoute = pathname.startsWith("/api/");

    if (!user && !isAuthPage && !isResetPasswordPage && !isApiRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    if (user && isAuthPage) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }

    return response;
  } catch {
    // Never let an auth hiccup crash the entire edge middleware
    return supabaseResponse;
  }
}

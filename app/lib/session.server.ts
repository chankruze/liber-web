import { createCookieSessionStorage, redirect } from "@remix-run/node";

if (!process.env.SESSION_SECRET)
  throw new Error("SESSION_SECRET must be set in environment.");

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "___session__liber",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [String(process.env.SESSION_SECRET)],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserAccessToken(
  request: Request
): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get(ACCESS_TOKEN_KEY);
}

export async function getUserRefreshToken(
  request: Request
): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get(REFRESH_TOKEN_KEY);
}

type CreateUserSessionProps = {
  request: Request;
  accessToken: string;
  refreshToken: string;
  remember: boolean;
  redirectTo: string;
};

export async function createUserSession({
  request,
  accessToken,
  refreshToken,
  remember,
  redirectTo,
}: CreateUserSessionProps) {
  const session = await getSession(request);

  // set access and refresh token
  session.set(ACCESS_TOKEN_KEY, accessToken);
  session.set(REFRESH_TOKEN_KEY, refreshToken);

  // redirect to dashboard/profile
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

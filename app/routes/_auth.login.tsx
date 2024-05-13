import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import axios, { isAxiosError } from "axios";
import { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { SITE_TITLE } from "~/consts";
import { decodeToken } from "~/lib/jwt.server";
import { safeRedirect } from "~/lib/safe-redirect.server";
import { createUserSession, getUserAccessToken } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - Login` },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: `Login to your account.` },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: to check if the user still exists in db
  const accessToken = await getUserAccessToken(request);

  if (accessToken) {
    const { handle } = decodeToken(accessToken as string) as JwtPayload;
    if (handle) return redirect(`/${handle}`);
  }

  return null;
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    if (actionData && !actionData.ok) {
      toast.error(actionData.message);
    }
  }, [actionData]);

  return (
    <main className="flex flex-col items-center h-full">
      <div className="flex flex-1 w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
        {/* left */}
        <div className="relative flex max-w-[675px] flex-1 flex-col items-center">
          <div className="flex w-full max-w-md flex-col m-auto">
            <Form method="post">
              <h1 className="text-[32px] leading-10 font-bold">
                Log in to your Liber.
              </h1>
              <p className="text-paragraph mt-4 text-stone-500">
                Good to have you back!
              </p>
              <div className="mt-10 space-y-4">
                {/* email */}
                <div className="bg-stone-100 rounded-md p-3 flex items-center justify-center">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    spellCheck={false}
                    autoComplete="email"
                    className="flex-1 bg-transparent focus:outline-none px-1"
                    required
                  />
                </div>
                {/* password */}
                <div className="bg-stone-100 rounded-md p-3 flex items-center justify-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 bg-transparent focus:outline-none px-1"
                    required
                  />
                  {showPassword ? (
                    <EyeOpenIcon onClick={togglePasswordVisibility} />
                  ) : (
                    <EyeClosedIcon onClick={togglePasswordVisibility} />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox name="remember" id="remember" />
                  <Label htmlFor="remember">Remember me for a week</Label>
                </div>
                <div className="h-14 sm:h-12">
                  <Button
                    size="lg"
                    className="w-full"
                    type="submit"
                    name="__action"
                    value="login"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </Form>
            <Link
              className="typography-text mt-8 text-stone-500 hover:underline"
              to="/register"
            >
              or register
            </Link>
          </div>
        </div>
        {/* right */}
        <div className="hidden bg-green-50 flex-1 items-center justify-center transition-all duration-1000 lg:flex"></div>
      </div>
    </main>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const __action = formData.get("__action");

  switch (__action) {
    case "login": {
      const email = formData.get("email");
      const password = formData.get("password");
      const remember = formData.get("remember") === "on";

      try {
        const { data } = await axios.post(`${process.env.API_URL}/auth/login`, {
          email,
          password,
        });

        const { accessToken, refreshToken } = data;

        const { handle } = decodeToken(accessToken) as JwtPayload;

        const redirectTo = safeRedirect(`/${handle}`);

        // create session and save the details
        return createUserSession({
          request,
          accessToken,
          refreshToken,
          remember,
          redirectTo,
        });
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response) {
            return json(
              { ok: false, ...e.response.data },
              { status: e.response.status }
            );
          }

          return json(
            { ok: false, code: e.code, messsage: e.message },
            { status: Number(e.code) }
          );
        }

        return json(
          { ok: false, message: "Something went wrong." },
          { status: 500 }
        );
      }
    }

    default: {
      return json({ ok: false, message: "Unknown action" }, { status: 500 });
    }
  }
};

// References:
// (1) https://stackoverflow.com/a/51768316/8460768
// (2) https://github.com/axios/axios#interceptors

import {
  ArrowLeftIcon,
  CheckCircledIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useSubmit } from "@remix-run/react";
import axios, { isAxiosError } from "axios";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - Register` },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: `Register now to get started.` },
  ];
};

export default function RegisterPage() {
  const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const debouncedSubmit = _.debounce((handle) => {
    if (handle) {
      submit(
        { handle, __action: "check-handle-availability" },
        { method: "post" }
      );
    }
  }, 3000);

  useEffect(() => {
    debouncedSubmit(handle);

    return () => debouncedSubmit.cancel();
  }, [handle]);

  useEffect(() => {
    if (actionData) {
      if (actionData.statusCode === 409) {
        toast.error(`${actionData?.message}. Try again with another email id.`);
      }
    }
  }, [actionData]);

  const handleNextStep = () => {
    if (actionData?.isAvailable) {
      setStep((prev) => prev + 1);
    }
  };

  const transformUsername = (e: ChangeEvent<HTMLInputElement>) => {
    let username = e.target.value;
    // remove special characters
    username = username.replace(/[^a-zA-Z0-9 -]/g, "");
    // replace the whitespaces in between with hyphens
    username = username.replace(" ", "-");
    // update the state
    setHandle(username);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <main className="flex flex-col items-center h-full">
      <div className="flex flex-1 w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
        {/* left */}
        <div className="relative flex max-w-[675px] flex-1 flex-col items-center">
          {step === 1 ? (
            <div className="flex w-full max-w-md flex-col m-auto">
              <Form method="post">
                <h1 className="text-[32px] leading-10 font-bold">
                  First, claim your username.
                </h1>
                <p className="text-paragraph mt-4 text-stone-500">
                  The creative ones are still available!
                </p>
                <div className="bg-stone-100 rounded-md p-3 mt-10 flex items-center justify-center">
                  <div className="h-full text-muted-foreground">liber.com/</div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="your-name"
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 bg-transparent focus:outline-none px-1"
                    onChange={transformUsername}
                    value={handle}
                    required
                  />
                  {actionData?.isAvailable ? (
                    <CheckCircledIcon className="text-green-500 h-4 w-4" />
                  ) : null}
                </div>
                <input
                  hidden
                  name="__action"
                  value="check-username-availability"
                  readOnly
                />
              </Form>
              <div className="h-14 sm:h-12 mt-4">
                {actionData?.isAvailable ? (
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={actionData ? !actionData.isAvailable : true}
                    onClick={handleNextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <div className="text-red-500 text-sm">
                    {actionData?.message}
                  </div>
                )}
              </div>
              <Link
                className="typography-text mt-8 text-stone-500 hover:underline"
                to="/login"
              >
                or log in
              </Link>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex w-full max-w-md flex-col m-auto">
              <Form method="post">
                <ArrowLeftIcon />
                <p className="mt-2 line-clamp-1">
                  liber.com/{handle} is yours!
                </p>
                <h1 className="text-[32px] leading-10 font-bold">
                  Now, create your account.
                </h1>
                <div className="mt-10 space-y-4">
                  {/* name */}
                  <div className="bg-stone-100 rounded-md p-3 flex items-center justify-center">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      spellCheck={false}
                      autoComplete="name"
                      className="flex-1 bg-transparent focus:outline-none px-1"
                      required
                    />
                  </div>
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
                  <input hidden name="handle" value={handle} readOnly />
                  <div className="h-14 sm:h-12">
                    <Button
                      size="lg"
                      className="w-full"
                      type="submit"
                      name="__action"
                      value="register"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </Form>
              <Link
                className="typography-text mt-8 text-stone-500 hover:underline"
                to="/login"
              >
                or log in
              </Link>
            </div>
          ) : null}
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
    case "check-handle-availability": {
      const handle = formData.get("handle");

      try {
        const { data } = await axios.get(
          `${process.env.API_URL}/handles/${handle}`
        );

        if (data.isAvailable)
          return json({
            isAvailable: true,
            message: "This username is available.",
          });

        return json({
          isAvailable: false,
          message: "This username is already taken.",
        });
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response) {
            return json({ ok: false, ...e.response.data });
          }

          return json({ ok: false, code: e.code, messsage: e.message });
        }

        return json({
          isAvailable: false,
          message: "Something went wrong.",
        });
      }
    }

    case "register": {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const handle = formData.get("handle");

      try {
        const { data } = await axios.post(
          `${process.env.API_URL}/auth/register`,
          {
            name,
            email,
            password,
            handle,
          }
        );

        if (data.ok) return redirect(`/${handle}`);

        return json({
          ok: false,
          message: "Unable to register",
        });
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response) {
            return json({ ok: false, ...e.response.data });
          }

          return json({ ok: false, code: e.code, messsage: e.message });
        }

        return json({
          ok: false,
          message: "Something went wrong.",
        });
      }
    }

    default: {
      throw new Response("Unknown action", {
        status: 500,
      });
    }
  }
};

// References:
// (1) https://stackoverflow.com/a/51768316/8460768
// (2) https://github.com/axios/axios#interceptors

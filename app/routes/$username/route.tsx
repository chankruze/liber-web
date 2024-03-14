import { TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import axios from "axios";
import { JwtPayload } from "jsonwebtoken";
import { useRef } from "react";
import { uploadImageToCloudinary } from "~/lib/cloudinary.server";
import { decodeToken } from "~/lib/jwt.server";
import { getUserAccessToken } from "~/lib/session.server";
import { navData } from "./nav-data";
import { NavItem } from "./nav-item";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { username } = params;

  const { data } = await axios.get(
    `${process.env.API_URL}/handles/${username}/details`
  );

  if (!data) {
    return json(
      {
        message: "User does not exist.",
        handle: username,
        name: "",
        bio: "",
        avatar: "",
        isOwner: false,
      },
      { status: 404 }
    );
  }

  // check if the user is authenticated or guest
  const accessToken = await getUserAccessToken(request);

  // authenticated user
  if (accessToken) {
    const { handle, name } = decodeToken(accessToken as string) as JwtPayload;
    // check if the user is self
    if (handle === username && name === data.name) {
      return json({
        handle: username,
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
        isOwner: true,
      });
    }

    return json({
      handle: username,
      name: data.name,
      bio: data.bio,
      avatar: data.avatar,
      isOwner: false,
    });
  }

  return json({
    handle: username,
    name: data.name,
    bio: data.bio,
    avatar: data.avatar,
    isOwner: false,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.name ? data.name : data?.handle },
    { name: "og:title", content: data?.name ? data.name : data?.handle },
    { name: "description", content: data?.bio },
    {
      tagName: "link",
      rel: "shortcut icon",
      href: data?.avatar,
    },
  ];
};

export default function UserProfilePage() {
  const { name, avatar, bio, isOwner } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const avatarFormRef = useRef<HTMLFormElement>(null);

  const openImagePicker = () => {
    if (avatarFormRef.current) avatarFormRef.current["avatar"].click();
  };

  const submitAvatar = () => {
    if (avatarFormRef.current)
      submit(avatarFormRef.current, {
        method: "POST",
        encType: "multipart/form-data",
      });
  };

  const deleteAvatar = () => {
    submit(
      { __action: "delete-avatar" },
      { method: "POST", encType: "multipart/form-data" }
    );
  };

  return (
    <main className="w-full h-full">
      <div className="w-full min-h-full space-y-4 xl:space-y-0 p-6 xl:p-16 justify-center xl:justify-start xl:items-stretch xl:flex xl:flex-row max-w-[1728px] mx-auto xl:gap-6">
        {/* left */}
        <div className="flex-1">
          {/* profile picture */}
          {avatar ? (
            <div className="relative size-28 md:size-36 xl:size-44 group/avatar">
              <div className="rounded-full size-full bg-slate-100 aspect-square overflow-hidden relative">
                <img
                  className="h-full w-full object-cover"
                  src={avatar}
                  alt={`${name}'s avatar`}
                />
              </div>
              <button
                className="absolute bottom-0 right-0 bg-red-500 text-white shadow-lg p-2 rounded-full invisible group-hover/avatar:visible"
                onClick={deleteAvatar}
              >
                <TrashIcon className="size-6" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-full border-2 border-dashed size-28 md:size-36 xl:size-44 bg-slate-50 hover:bg-slate-100 aspect-square overflow-hidden cursor-pointer"
              onClick={openImagePicker}
              role="presentation"
            >
              <div className="text-slate-400 space-y-2">
                <UploadIcon className="m-auto size-6 md:size-8 xl:size-10 text-slate-300" />
                <p className="text-sm md:text-base font-medium text-slate-500">
                  Add Avatar
                </p>
              </div>
              <Form ref={avatarFormRef}>
                <input
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={submitAvatar}
                  hidden
                />
                <input name="__action" value="add-avatar" hidden readOnly />
              </Form>
            </div>
          )}
          {/* name, bio */}
          <div className="mt-8">
            <div className="py-1 px-3 text-xs uppercase bg-primary text-primary-foreground rounded inline-block">
              {isOwner ? "Me" : "Guest"}
            </div>
            {/* name */}
            <div className="text-[32px] font-bold leading-[120%] tracking-[-1px] xl:text-[44px] xl:tracking-[-2px]">
              <div>{name}</div>
            </div>
            {/* bio */}
            <div className="mt-3 text-[#565656] xl:mt-3 xl:text-xl">
              {bio ? <p>{bio}</p> : null}
              {isOwner && !bio ? <p>Add your bio!</p> : null}
            </div>
          </div>
        </div>
        {/* right */}
        <div className="xl:w-[820px] xl:flex-none">
          <Outlet />
        </div>
        {/* navigation bar */}
        <div className="fixed flex bottom-5 left-1/2 -translate-x-1/2 justify-center items-center shadow-md bg-white border rounded-2xl gap-2 p-3">
          {navData.map((d, idx) => (
            <NavItem key={`${idx}-${d.to}`} to={d.to} icon={d.icon} />
          ))}
        </div>
      </div>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "avatar") {
        return undefined;
      }
      const uploadedImage = await uploadImageToCloudinary(data);
      return uploadedImage?.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const __action = formData.get("__action");

  switch (__action) {
    case "add-avatar": {
      const avatar = formData.get("avatar");
      const accessToken = await getUserAccessToken(request);
      const { sub } = decodeToken(accessToken as string) as JwtPayload;

      const { data } = await axios.patch(
        `${process.env.API_URL}/users/${sub}`,
        { avatar },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return json({ ok: true, data });
    }

    case "delete-avatar": {
      const accessToken = await getUserAccessToken(request);
      const { sub } = decodeToken(accessToken as string) as JwtPayload;

      const { data } = await axios.patch(
        `${process.env.API_URL}/users/${sub}`,
        { avatar: "" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return json({ ok: true, data });
    }
  }

  return json({});
}

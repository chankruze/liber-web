import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { JwtPayload } from "jsonwebtoken";
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

  return (
    <main className="w-full h-full">
      <div className="w-full min-h-full space-y-4 xl:space-y-0 p-6 xl:p-16 justify-center xl:justify-start xl:items-stretch xl:flex xl:flex-row max-w-[1728px] mx-auto xl:gap-6">
        {/* left */}
        <div className="flex-1">
          {/* profile picture */}
          <div className="rounded-full size-28 xl:size-44 bg-gray-100 aspect-square overflow-hidden">
            <img className="h-full w-full object-cover" src={avatar} alt="" />
          </div>
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

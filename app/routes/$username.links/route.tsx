import { Link2Icon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { AddFolderCard } from "./add-folder-card";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // TODO: get the user id from JWT token stored in session storage
  const id = "65a4f008f5599db423841902";

  try {
    const { data } = await axios.get(`${process.env.API_URL}/links/u/${id}`);
    return json({ links: data });
  } catch (e) {
    console.error(e);
    return json({ links: [] });
  }
};

export default function LinksPage() {
  const { links } = useLoaderData<typeof loader>();

  const isOwner = true;

  if (links.length) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
        {links.map((f) => (
          <Link to={f.url} target="_blank" rel="noreferrer" key={f._id}>
            <div className="flex items-center gap-3 shadow border py-3 px-4 rounded-2xl">
              <div className="p-2 rounded-lg bg-yellow-200 inline-block">
                <Link2Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium line-clamp-1">{f.label}</div>
                <div className="text-stone-400 text-xs line-clamp-1">
                  {f.url}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {isOwner ? <AddFolderCard /> : null}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 xl:gap-6 justify-center items-center ">
      <div>
        <img
          src="/assets/images/svgs/blank-canvas.svg"
          alt="Add notes"
          className="size-36 xl:size-80"
        />
      </div>
      <div className="text-red-500">
        {isOwner ? "You" : "This user"} have not added any links yet.
      </div>
      <Button size="lg">
        <span>Add a link</span>
      </Button>
      {/* {isOwner ? <AddFolderCard /> : null} */}
    </div>
  );
}

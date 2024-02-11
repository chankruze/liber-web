import { CardStackIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { AddFolderCard } from "./add-folder-card";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // TODO: get the user id from JWT token stored in session storage
  const id = "65a4f008f5599db423841902";

  try {
    const { data } = await axios.get(`${process.env.API_URL}/folders/u/${id}`);
    return json({ folders: data });
  } catch (e) {
    console.error(e);
    return json({ folders: [] });
  }
};

export default function FoldersPage() {
  const { folders } = useLoaderData<typeof loader>();

  const isOwner = true;

  if (folders.length) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
        {folders.map((f: any) => (
          <div
            key={f._id}
            className="flex items-center justify-between gap-3 w-full border shadow p-4 rounded-2xl"
          >
            <div>
              <CardStackIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 font-medium line-clamp-1">{f.name}</div>
            <div>
              <DotsVerticalIcon className="w-4 h-4" />
            </div>
          </div>
        ))}
        {isOwner ? <AddFolderCard /> : null}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 xl:gap-6 justify-center items-center ">
      <div>
        <img
          src="/assets/images/svgs/add-notes.svg"
          alt="Add notes"
          className="size-36 xl:size-80"
        />
      </div>
      <div className="text-red-500">
        {isOwner ? "You" : "This user"} have not added any folders yet.
      </div>
      <Button size="lg">
        <span>Create a folder</span>
      </Button>
      {/* {isOwner ? <AddFolderCard /> : null} */}
    </div>
  );
}

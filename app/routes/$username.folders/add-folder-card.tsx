import { PlusIcon } from "@radix-ui/react-icons";

export const AddFolderCard = () => {
  return (
    <div className="flex items-center justify-center gap-3 w-full border border-stone-200 border-dashed p-4 rounded-2xl group cursor-pointer">
      <PlusIcon className="w-5 h-5 text-yellow-500 group-hover:scale-125 duration-150 ease-in-out transition-all group-hover:animate-pulse" />
      <div>New Folder</div>
    </div>
  );
};

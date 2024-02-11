import { PlusIcon } from "@radix-ui/react-icons";

export const AddFolderCard = () => {
  return (
    <div className="flex items-center gap-3 border p-3 rounded-2xl border-stone-200 border-dashed justify-center group cursor-pointer">
      <PlusIcon className="w-5 h-5 text-yellow-400 group-hover:scale-125 duration-150 ease-in-out transition-all group-hover:animate-pulse" />
      <div>New Link</div>
    </div>
  );
};

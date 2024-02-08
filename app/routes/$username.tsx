import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: params.username }, // TODO: use name
    { name: "og:title", content: params.username },
    { name: "description", content: `Profile page of ${params.username}` }, // TODO: use bio
    {
      tagName: "link",
      rel: "shortcut icon",
      href: "https://lh3.googleusercontent.com/a/ACg8ocJF9cz1f1B_TxCH-88YElamm_oaXW9qNXvRGxz0a6-kduM=s512-c",
    },
  ];
};

export default function UserProfilePage() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full py-0 p-6 pt-12 pb-0 xl:p-16 justify-center xl:justify-start items-center xl:items-stretch flex flex-col xl:flex-row max-w-[1728px] mx-auto">
        <div className="flex-1">
          <div className="rounded-full size-28 xl:size-44 bg-gray-100 aspect-square overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/a/ACg8ocJF9cz1f1B_TxCH-88YElamm_oaXW9qNXvRGxz0a6-kduM=s512-c"
              alt=""
            />
          </div>
          {/* name, bio */}
          <div className="mt-8">
            {/* name */}
            <div className="text-[32px] font-bold leading-[120%] tracking-[-1px] xl:text-[44px] xl:tracking-[-2px]">
              <div>Chandan Kumar Mandal</div>
            </div>

            {/* bio */}
            <div className="mt-3 text-[#565656] xl:mt-3 xl:text-xl">
              <p>I am a hero ;</p>
            </div>
          </div>
        </div>
        <div className="flex-1 xl:w-[820px] xl:flex-none">
          <div className="h-16 bg-red-100 flex items-center">
            <div className="h-full flex justify-center items-center bg-gradient-to-b from-white to-yellow-100 p-6 border-b-2 border-yellow-600">
              Links
            </div>
            <div className="h-full flex justify-center items-center bg-gradient-to-b from-white to-yellow-100 p-6 border-b-2 border-yellow-600">
              Folders
            </div>
          </div>
          <div className="grid p-6 grid-cols-2 xl:grid-cols-4  gap-6 ">
            {[...Array(6)].map((_, _idx) => (
              <div key={_idx} className="size-44">
                <div className="shadow-xl p-6 h-full w-full flex justify-center items-center rounded-3xl">
                  {_idx}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

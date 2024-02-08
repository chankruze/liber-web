import { ArchiveIcon } from "@radix-ui/react-icons";
import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { TopBanner } from "./top-banner";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - ${SITE_DESCRIPTION}` },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function HomeLayout() {
  return (
    <main>
      <TopBanner />
      <section id="hero" className="space-y-16 min-h-screen p-[5vw]">
        <div className="flex items-center flex-col gap-8">
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-purple-500">
              <ArchiveIcon className="h-16 w-16 text-white" />
            </div>
            <p className="text-center text-2xl font-semibold">Liber</p>
          </div>
          <p className="text-[37px] leading-[48px] lg:text-[60px] lg:leading-[72px]  text-center text-primary lg:space-y-4 font-roboto font-bold">
            Manage all Your Links.
            <br /> At One Place.
          </p>
          <p className="text-gray-500 text-center text-lg lg:text-xl">
            Your personal drive to store, organize and share all your important
            links.
          </p>
        </div>
        <div className="flex items-center capitalize flex-col gap-4">
          <Link
            to="/register"
            className="flex justify-center items-center min-w-[300px] py-5 px-6 bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-200 rounded-2xl text-lg font-semibold"
          >
            Create your Liber
          </Link>
          <Link
            to="/login"
            className="text-[#747474] font-roboto underline font-medium"
          >
            Log in
          </Link>
        </div>
      </section>
      <div></div>
      <div></div>
    </main>
  );
}

import { redirect, type MetaFunction } from "@remix-run/node";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - ${SITE_DESCRIPTION}` },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async () => {
  return redirect("/home");
};

export default function Index() {
  return <main></main>;
}

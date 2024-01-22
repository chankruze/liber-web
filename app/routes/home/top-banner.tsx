import { ArrowRightIcon } from "@radix-ui/react-icons";

export const TopBanner = () => {
  return (
    <a
      href="/new-chapter"
      className="flex justify-center items-center hover:bg-primary/80 transition-all duration-200 p-4 gap-1 bg-primary text-primary-foreground"
    >
      <span>Big news! Linktree accquired Liber</span>
      <ArrowRightIcon className="h-5 w-5" />
    </a>
  );
};

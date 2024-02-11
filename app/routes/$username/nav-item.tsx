import { IconProps } from "@radix-ui/react-icons/dist/types";
import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

export type NavItemProps = {
  to: string;
  label?: string;
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
};

export const NavItem = ({ to, label, icon: Icon }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn("py-2 px-3 rounded-lg", {
          "bg-stone-950 text-white": isActive,
          "hover:bg-stone-100": !isActive,
          "flex items-center justify-center gap-1": Icon && label,
        })
      }
    >
      {Icon ? <Icon className="w-4 h-4" /> : null}
      {label && label ? <span>{label}</span> : null}
    </NavLink>
  );
};

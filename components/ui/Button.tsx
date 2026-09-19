import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Arrow, type ArrowDirection } from "@/components/ui/Arrow";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-lift",
  secondary:
    "border border-line-strong bg-card text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-card",
  ghost: "text-ink-2 hover:bg-paper-2 hover:text-ink",
};

// Each arrow nudges in the direction it points
const arrowHover: Record<ArrowDirection, string> = {
  right: "group-hover:translate-x-0.5",
  down: "group-hover:translate-y-0.5",
  "up-right": "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
};

type BaseProps = {
  variant?: Variant;
  arrow?: ArrowDirection;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    keyof BaseProps | "href"
  >;

type NativeButtonProps = BaseProps & { href?: never } & Omit<
    ComponentPropsWithoutRef<"button">,
    keyof BaseProps
  >;

function classesFor(variant: Variant = "primary", className?: string) {
  return cn(
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium whitespace-nowrap transition duration-500 ease-out-expo active:scale-[0.98]",
    variantClasses[variant],
    className,
  );
}

function Inner({ arrow, children }: Pick<BaseProps, "arrow" | "children">) {
  return (
    <>
      {children}
      {arrow && (
        <Arrow
          direction={arrow}
          className={cn("transition duration-500 ease-out-expo", arrowHover[arrow])}
        />
      )}
    </>
  );
}

/**
 * Pass `href` to render a link (internal pages use Next's <Link>,
 * external and mailto links open normally). Omit it for a <button>.
 */
export function Button(props: ButtonLinkProps | NativeButtonProps) {
  if (typeof props.href === "string") {
    const { variant, arrow, className, children, href, ...anchorProps } = props;
    const inner = <Inner arrow={arrow}>{children}</Inner>;

    if (/^(https?:|mailto:|tel:)/.test(href)) {
      const newTab = href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};
      return (
        <a href={href} className={classesFor(variant, className)} {...newTab} {...anchorProps}>
          {inner}
        </a>
      );
    }

    return (
      <Link href={href} className={classesFor(variant, className)} {...anchorProps}>
        {inner}
      </Link>
    );
  }

  const { variant, arrow, className, children, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={classesFor(variant, className)} {...buttonProps}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

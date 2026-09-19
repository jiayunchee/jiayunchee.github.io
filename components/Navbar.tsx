"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { Container } from "@/components/ui/Container";
import { navLinks, site } from "@/data/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;
const sectionIds = navLinks.map((link) => link.id);
const ease = [0.16, 1, 0.3, 1] as const;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

type Pill = { left: number; width: number; instant: boolean };

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Becomes compact once the visitor scrolls a little
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );

  // The menu remembers the page it was opened on, so navigating closes it
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const menuOpen = menuOpenedOn === pathname;

  const [pill, setPill] = useState<Pill | null>(null);
  const active = useActiveSection(isHome ? sectionIds : []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  // While the mobile menu is open: lock page scroll, hide the page from
  // keyboard focus, and close on Escape or when the screen gets wider.
  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const main = document.getElementById("main");
    root.style.overflow = "hidden";
    if (main) main.inert = true;
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpenedOn(null);
      menuButtonRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = () => {
      if (desktop.matches) setMenuOpenedOn(null);
    };

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      root.style.overflow = "";
      if (main) main.inert = false;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [menuOpen]);

  // On the homepage, glide to the section instead of reloading the route
  const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const wasMenuOpen = menuOpen;
    setMenuOpenedOn(null);
    if (!isHome) return; // Next.js navigates to "/#id" for us

    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    const scroll = () => section.scrollIntoView({ block: "start" });
    if (wasMenuOpen) requestAnimationFrame(scroll);
    else scroll();
    window.history.replaceState(null, "", `#${id}`);
  };

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpenedOn(null);
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0 });
    window.history.replaceState(null, "", "/");
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-expo",
          scrolled && !menuOpen
            ? "border-line/80 bg-paper/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between transition-[height] duration-500 ease-out-expo",
            scrolled ? "h-14" : "h-20",
          )}
        >
          <Link
            href="/"
            onClick={goHome}
            aria-label={`${site.firstName}, home`}
            className="group -ml-1 flex items-center gap-2.5 rounded-full p-1"
          >
            <EightBall />
            <span className="text-[0.8125rem] font-semibold tracking-[0.16em] text-ink">
              {site.wordmark}
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="relative isolate -mr-3.5 flex items-center" onMouseLeave={() => setPill(null)}>
              <motion.span
                aria-hidden
                className="absolute inset-y-0 left-0 -z-10 rounded-full bg-paper-2"
                initial={false}
                animate={pill ? { x: pill.left, width: pill.width, opacity: 1 } : { opacity: 0 }}
                transition={
                  pill?.instant
                    ? { duration: 0, opacity: { duration: 0.2 } }
                    : { type: "spring", bounce: 0.15, duration: 0.45 }
                }
              />
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <Link
                      href={`/#${link.id}`}
                      onClick={(event) => goToSection(event, link.id)}
                      onMouseEnter={(event) => {
                        const { offsetLeft, offsetWidth } = event.currentTarget;
                        setPill((prev) => ({
                          left: offsetLeft,
                          width: offsetWidth,
                          instant: prev === null,
                        }));
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                        isActive ? "text-ink" : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-dot"
                          aria-hidden
                          className="absolute inset-x-0 bottom-0.5 mx-auto size-1 rounded-full bg-accent"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpenedOn(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-paper-2 md:hidden"
          >
            <span aria-hidden className="relative block size-5">
              <span className={cn(menuLine, menuOpen ? "rotate-45" : "-translate-y-[3.5px]")} />
              <span className={cn(menuLine, menuOpen ? "-rotate-45" : "translate-y-[3.5px]")} />
            </span>
          </button>
        </Container>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper pt-24 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <Container className="flex flex-1 flex-col">
              <nav aria-label="Mobile">
                <ul className="border-t border-line">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.id}
                      className="border-b border-line"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease, delay: 0.06 + i * 0.045 }}
                    >
                      <Link
                        ref={i === 0 ? firstMobileLinkRef : undefined}
                        href={`/#${link.id}`}
                        onClick={(event) => goToSection(event, link.id)}
                        className="group flex items-baseline justify-between py-4 font-serif text-[2.25rem] leading-none text-ink"
                      >
                        {link.label}
                        <span className="eyebrow transition-colors group-hover:text-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="mt-auto flex flex-col gap-2 pt-10 text-ink-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <p className="eyebrow mb-1">Say hello</p>
                <a href={`mailto:${site.email}`} className="link-underline w-fit">
                  {site.email}
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline w-fit"
                >
                  LinkedIn
                </a>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const menuLine =
  "absolute inset-x-0 top-1/2 -mt-[0.75px] h-[1.5px] rounded-full bg-ink transition duration-500 ease-out-expo";

/** Tiny 8-ball logo mark that rolls when you hover the name */
function EightBall() {
  return (
    <span
      aria-hidden
      className="relative size-[1.125rem] rounded-full bg-ink transition-transform duration-700 ease-out-expo group-hover:rotate-[360deg]"
    >
      <span className="absolute top-[3px] right-[3px] size-[7px] rounded-full bg-paper" />
    </span>
  );
}

import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type PolaroidProps = {
  /** Image path in /public, e.g. "/images/me.jpg". Leave empty for a placeholder. */
  src?: string | null;
  alt: string;
  /** Handwritten caption under the photo */
  caption?: string;
  /** Resting tilt in degrees; it straightens when hovered */
  tilt?: number;
  /** Note shown inside the empty frame until there's a photo */
  placeholder?: string;
  /** Tells the browser how wide the photo shows, so it downloads the right size */
  sizes?: string;
  className?: string;
};

/** A taped-down instant photo, like a page from a scrapbook. */
export function Polaroid({
  src,
  alt,
  caption,
  tilt = 0,
  placeholder = "photo coming soon",
  sizes = "(min-width: 1024px) 24rem, 80vw",
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cn(
        "relative rotate-(--tilt) rounded-md bg-card p-3 pb-4 shadow-lift ring-1 ring-line transition duration-700 ease-out-expo hover:-translate-y-1 hover:rotate-0",
        className,
      )}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      {/* A strip of washi tape holding it to the page */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-[2px] bg-ball-1/35"
      />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper-2">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        ) : (
          <div role="img" aria-label={alt} className="grid size-full place-items-center bg-dots">
            <div className="flex flex-col items-center gap-2 text-muted">
              <CameraIcon />
              <span className="font-hand text-xl">{placeholder}</span>
            </div>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center font-hand text-[1.375rem] leading-tight text-ink-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CameraIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-7">
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-1.8A1 1 0 0 1 9.5 4.8h5a1 1 0 0 1 .8.4L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.8" r="3.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

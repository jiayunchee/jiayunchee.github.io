"use client";

import { useRef, useState } from "react";
import { PlayIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * The promo video in a portrait frame. It shows a still until someone presses
 * play, so nothing downloads (or makes noise) unless they ask for it.
 */
export function KayaVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    setStarted(true);
    void video.current?.play();
  };

  return (
    <div
      className={cn(
        "relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-ink shadow-lift ring-1 ring-line",
        className,
      )}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        aria-label="Project Kaya promo video"
        className="size-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Play the Project Kaya promo video (51 seconds, with sound)"
          className="group absolute inset-0 flex items-end justify-center pb-6"
        >
          <span className="flex items-center gap-2 rounded-full bg-card/95 px-4 py-2.5 text-sm font-medium text-ink shadow-lift backdrop-blur-sm transition duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
            <PlayIcon className="size-4" />
            Watch the promo
            <span className="font-mono text-xs text-muted">0:51</span>
          </span>
        </button>
      )}
    </div>
  );
}

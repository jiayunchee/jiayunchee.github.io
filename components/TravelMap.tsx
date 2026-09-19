"use client";

import { geoEqualEarth, geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import type { FeatureCollection, Geometry } from "geojson";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { feature, merge, mesh } from "topojson-client";
import type {
  GeometryCollection,
  MultiPolygon as TopoMultiPolygon,
  Polygon as TopoPolygon,
  Topology,
} from "topojson-specification";
import { Arrow } from "@/components/ui/Arrow";
import { Modal } from "@/components/ui/Modal";
import { Polaroid } from "@/components/ui/Polaroid";
import { Tag } from "@/components/ui/Tag";
import { countries, home, places, visitedCountries, type CountryName } from "@/data/travel";
import { cn } from "@/lib/utils";

type World = Topology<{
  countries: GeometryCollection<{ name: string }>;
  land: GeometryCollection;
}>;
type Point = [number, number];
type Marker = { key: string; indices: number[]; x: number; y: number };

const MAP_URL = "/maps/countries-50m.json";
const ANTARCTICA = "010";
const PIN_SIZE = 16; // on-screen size of a pin including its ring (px)
const BUBBLE_SIZE = 40; // on-screen size of a numbered bubble including its ring (px)
const MAX_ZOOM = 20;

const countryByMapId = new Map(
  (Object.keys(countries) as CountryName[]).map((name) => [countries[name].mapId, name]),
);
const placesIn = (name: CountryName) =>
  places.flatMap((place, i) => (place.country === name ? [i] : []));

/** A gentle upward curve between two points, like a flight path */
function flightPath([x1, y1]: Point, [x2, y2]: Point) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 2) return null;
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = Math.min(dist * 0.25, 160);
  return `M${x1},${y1} Q${(x1 + x2) / 2 + nx * bend},${(y1 + y2) / 2 + ny * bend} ${x2},${y2}`;
}

export function TravelMap() {
  const reduceMotion = useReducedMotion();
  const hatchId = `hatch-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const titleId = useId();
  const container = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const behaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  // Download the map data only when the map is about to scroll into view
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetch(MAP_URL)
          .then((response) => {
            if (!response.ok) throw new Error(`Map data: ${response.status}`);
            return response.json();
          })
          .then((data: World) => {
            if (!cancelled) setWorld(data);
          })
          .catch(() => {
            if (!cancelled) setFailed(true);
          });
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // Redraw at the right size whenever the map's box changes
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSize((prev) =>
        prev?.width === width && prev?.height === height ? prev : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Turn the raw map data into shapes (once)
  const shapes = useMemo(() => {
    if (!world) return null;
    const geometries = world.objects.countries.geometries;
    const land = merge(
      world,
      geometries.filter((g) => g.id !== ANTARCTICA) as (TopoPolygon | TopoMultiPolygon)[],
    );
    const all = feature(world, world.objects.countries) as FeatureCollection<Geometry>;
    const visited = all.features.filter((f) => countryByMapId.has(String(f.id)));
    const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
    return { land, visited, borders };
  }, [world]);

  // Project the shapes and places onto the current map size
  const geo = useMemo(() => {
    if (!shapes || !size || size.width === 0) return null;
    const { width, height } = size;
    const pad = Math.max(8, width * 0.015);
    const projection = geoEqualEarth()
      .rotate([-10, 0])
      .fitExtent(
        [
          [pad, pad],
          [width - pad, height - pad],
        ],
        shapes.land,
      );
    const path = geoPath(projection);
    const project = ({ lat, lng }: { lat: number; lng: number }) =>
      (projection([lng, lat]) ?? [0, 0]) as Point;
    return {
      width,
      height,
      land: path(shapes.land) ?? "",
      borders: path(shapes.borders) ?? "",
      visited: shapes.visited.map((f) => ({ id: String(f.id), d: path(f) ?? "" })),
      points: places.map((place) => project(place.coordinates)),
      home: project(home.coordinates),
    };
  }, [shapes, size]);

  // Pan & zoom. Plain scrolling keeps scrolling the page: zooming needs ⌘/Ctrl + scroll
  // (or a trackpad pinch), and on touch screens two fingers.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !geo) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_ZOOM])
      .extent([
        [0, 0],
        [geo.width, geo.height],
      ])
      .translateExtent([
        [0, 0],
        [geo.width, geo.height],
      ])
      .filter((event: Event) => {
        if (event.type === "wheel") {
          const wheel = event as WheelEvent;
          return wheel.ctrlKey || wheel.metaKey;
        }
        if (event.type === "touchstart") return (event as TouchEvent).touches.length > 1;
        return (event as MouseEvent).button === 0;
      })
      // A trackpad pinch sends many tiny steps, a mouse wheel a few big ones:
      // cap each step so ⌘/Ctrl + wheel zooms gently instead of jumping
      .wheelDelta((event: WheelEvent) => {
        const unit = event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002;
        const delta = -event.deltaY * unit * (event.ctrlKey ? 10 : 1);
        return Math.max(-0.5, Math.min(0.5, delta));
      })
      // Hover cards belong to the old view, so clear them as soon as the map moves
      .on("start", () => {
        setHovered(null);
        setHoveredCluster(null);
      })
      .on("zoom", (event: { transform: ZoomTransform }) => setTransform(event.transform));
    behaviorRef.current = behavior;
    const selection = select(svg);
    selection.call(behavior).call(behavior.transform, zoomIdentity);
    return () => {
      selection.interrupt();
      selection.on(".zoom", null);
    };
  }, [geo]);

  const animateTo = (target: ZoomTransform) => {
    const svg = svgRef.current;
    const behavior = behaviorRef.current;
    if (!svg || !behavior) return;
    select(svg)
      .transition()
      .duration(reduceMotion ? 0 : 900)
      .call(behavior.transform, target);
  };

  const zoomBy = (factor: number) => {
    const svg = svgRef.current;
    const behavior = behaviorRef.current;
    if (!svg || !behavior) return;
    select(svg)
      .transition()
      .duration(reduceMotion ? 0 : 450)
      .call(behavior.scaleBy, factor);
  };

  // Zoom so that all of these places fit comfortably on screen
  const fit = (indices: number[], maxScale: number) => {
    if (!geo || indices.length === 0) return;
    const xs = indices.map((i) => geo.points[i][0]);
    const ys = indices.map((i) => geo.points[i][1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pad = Math.min(geo.width, geo.height) * 0.2;
    const k = Math.max(
      1,
      Math.min(
        maxScale,
        (geo.width - 2 * pad) / Math.max(x1 - x0, 1),
        (geo.height - 2 * pad) / Math.max(y1 - y0, 1),
      ),
    );
    animateTo(
      zoomIdentity
        .translate(geo.width / 2 - (k * (x0 + x1)) / 2, geo.height / 2 - (k * (y0 + y1)) / 2)
        .scale(k),
    );
  };

  const showCountry = (name: CountryName) => {
    fit(placesIn(name), 6);
    container.current?.scrollIntoView({ block: "nearest" });
  };

  // Where each pin sits on screen right now. Any markers that would touch
  // merge into a numbered bubble, repeatedly, until nothing overlaps.
  const markers = useMemo<Marker[]>(() => {
    if (!geo) return [];
    const result: Marker[] = geo.points.map(([px, py], i) => ({
      key: "",
      indices: [i],
      x: transform.applyX(px),
      y: transform.applyY(py),
    }));
    const footprint = (m: Marker) => (m.indices.length > 1 ? BUBBLE_SIZE : PIN_SIZE);
    let merging = true;
    while (merging) {
      merging = false;
      for (let a = 0; a < result.length && !merging; a++) {
        for (let b = a + 1; b < result.length && !merging; b++) {
          const A = result[a];
          const B = result[b];
          if (Math.hypot(A.x - B.x, A.y - B.y) >= (footprint(A) + footprint(B)) / 2 + 2) continue;
          const total = A.indices.length + B.indices.length;
          A.x = (A.x * A.indices.length + B.x * B.indices.length) / total;
          A.y = (A.y * A.indices.length + B.y * B.indices.length) / total;
          A.indices.push(...B.indices);
          result.splice(b, 1);
          merging = true;
        }
      }
    }
    return result
      .filter((m) => m.x > -24 && m.x < geo.width + 24 && m.y > -24 && m.y < geo.height + 24)
      .map((m) => ({ ...m, key: [...m.indices].sort((x, y) => x - y).join("-") }));
  }, [geo, transform]);

  const homeAt: Point | null = geo
    ? [transform.applyX(geo.home[0]), transform.applyY(geo.home[1])]
    : null;
  const active =
    hovered !== null
      ? markers.find((m) => m.indices.includes(hovered))
      : markers.find((m) => m.key === hoveredCluster);
  const activeIndices = active ? (hovered !== null ? [hovered] : active.indices) : [];
  const activeCountries = new Set(activeIndices.map((i) => countries[places[i].country].mapId));
  const arc = active && homeAt ? flightPath(homeAt, [active.x, active.y]) : null;
  const zoomed = transform.k > 1.01;
  const place = selected !== null ? places[selected] : null;

  const step = (by: number) =>
    setSelected((current) =>
      current === null ? current : (current + by + places.length) % places.length,
    );

  return (
    <div>
      <div
        ref={container}
        role="region"
        aria-label="Map of places I’ve been"
        className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-card bg-dots shadow-card sm:aspect-[2/1]"
      >
        {geo ? (
          <svg
            ref={svgRef}
            width={geo.width}
            height={geo.height}
            aria-hidden
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <defs>
              <pattern
                id={hatchId}
                width={6}
                height={6}
                patternUnits="userSpaceOnUse"
                patternTransform={`rotate(45) scale(${1 / transform.k})`}
              >
                <line x1={0} y1={0} x2={0} y2={6} stroke="var(--color-accent)" strokeWidth={1.1} strokeOpacity={0.4} />
              </pattern>
            </defs>

            <g transform={transform.toString()}>
              <path
                d={geo.land}
                className="fill-paper-2"
                stroke="var(--color-line-strong)"
                strokeWidth={0.7}
                vectorEffect="non-scaling-stroke"
              />
              {/* Some countries have more than one shape (e.g. Australia and its islands) */}
              {geo.visited.map((country, i) => (
                <g
                  key={`${country.id}-${i}`}
                  className="cursor-pointer"
                  onClick={() => {
                    const name = countryByMapId.get(country.id);
                    if (name) showCountry(name);
                  }}
                >
                  <path
                    d={country.d}
                    className={cn(
                      "transition-[fill] duration-300",
                      activeCountries.has(country.id) ? "fill-accent/25" : "fill-accent-soft",
                    )}
                  />
                  <path d={country.d} fill={`url(#${hatchId})`} />
                </g>
              ))}
              <path
                d={geo.borders}
                fill="none"
                stroke="var(--color-line-strong)"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {arc && active && (
              <path
                key={`${active.key}-${hovered ?? ""}`}
                d={arc}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                className="animate-draw"
                style={{ animationDuration: "0.9s" }}
              />
            )}
          </svg>
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="font-hand text-2xl text-muted">
              {failed ? "The map didn’t load, but the list below still works." : "unfolding the map…"}
            </p>
          </div>
        )}

        {geo && (
          <div className="pointer-events-none absolute inset-0">
            {/* Home base */}
            {homeAt && (
              <div aria-hidden className="absolute" style={{ left: homeAt[0], top: homeAt[1] }}>
                <span className="absolute -top-2 -left-2 size-4 animate-ping-soft rounded-full bg-ink/30" />
                <span className="absolute -top-2 -left-2 size-4 rounded-full border-2 border-ink bg-card/70" />
                <span className="absolute top-0.5 right-3 font-hand text-lg leading-none text-ink">
                  home
                </span>
              </div>
            )}

            {markers.map((marker) => {
              if (marker.indices.length === 1) {
                const i = marker.indices[0];
                return (
                  <button
                    key={marker.key}
                    type="button"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(i)}
                    aria-label={`${places[i].city}, ${places[i].country}. Open the story`}
                    className="pointer-events-auto absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                    style={{ left: marker.x, top: marker.y }}
                  >
                    <span
                      className={cn(
                        "size-3 rounded-full ring-2 ring-card shadow-[0_2px_6px_rgb(22_21_19/0.35)] transition duration-300 ease-out-expo",
                        hovered === i ? "scale-[1.6] bg-ink" : "bg-accent",
                      )}
                    />
                  </button>
                );
              }
              const names = marker.indices.map((i) => places[i].city).join(", ");
              return (
                <button
                  key={marker.key}
                  type="button"
                  onMouseEnter={() => setHoveredCluster(marker.key)}
                  onMouseLeave={() => setHoveredCluster(null)}
                  onFocus={() => setHoveredCluster(marker.key)}
                  onBlur={() => setHoveredCluster(null)}
                  onClick={() => {
                    setHoveredCluster(null);
                    fit(marker.indices, 12);
                  }}
                  aria-label={`${marker.indices.length} places: ${names}. Zoom in`}
                  className={cn(
                    "pointer-events-auto absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-xs font-medium text-paper ring-4 ring-card/70 shadow-lift transition duration-300 ease-out-expo hover:scale-110",
                    active?.key === marker.key ? "scale-110 bg-ink" : "bg-accent",
                  )}
                  style={{ left: marker.x, top: marker.y }}
                >
                  {marker.indices.length}
                </button>
              );
            })}

            {/* Hover card */}
            <AnimatePresence>
              {active && (
                <motion.div
                  key={`${active.key}-${hovered ?? "all"}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute z-10 w-max max-w-[15rem] rounded-xl border border-line bg-card px-3.5 py-3 shadow-lift"
                  style={{
                    left: geo.width < 300 ? geo.width / 2 : Math.min(Math.max(active.x, 125), geo.width - 125),
                    top: active.y,
                    translate: active.y < 120 ? "-50% 20px" : "-50% calc(-100% - 20px)",
                  }}
                >
                  {activeIndices.length === 1 ? (
                    <PlaceSummary index={activeIndices[0]} />
                  ) : (
                    <>
                      <p className="eyebrow">{activeIndices.length} places</p>
                      <p className="mt-1.5 text-sm leading-snug text-ink">
                        {activeIndices.map((i) => places[i].city).join(" · ")}
                      </p>
                      <p className="mt-2 text-xs text-muted">Click to zoom in</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {geo && (
          <>
            <AnimatePresence>
              {zoomed && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  onClick={() => animateTo(zoomIdentity)}
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-card/90 px-3 py-1.5 text-sm text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-card"
                >
                  <Arrow direction="left" />
                  World view
                </motion.button>
              )}
            </AnimatePresence>

            <div className="absolute top-3 right-3 flex flex-col overflow-hidden rounded-xl border border-line bg-card/90 shadow-card backdrop-blur-sm">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => zoomBy(1.8)}
                className="grid size-9 place-items-center text-lg text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => zoomBy(1 / 1.8)}
                className="grid size-9 place-items-center border-t border-line text-lg text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                −
              </button>
            </div>

            {/* How-to hint, only until the visitor has zoomed in */}
            {!zoomed && (
              <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-card/85 px-2.5 py-1 font-mono text-[0.6875rem] text-muted backdrop-blur-sm">
                <span className="pointer-coarse:hidden">drag to explore · ⌘/ctrl + scroll to zoom</span>
                <span className="hidden pointer-coarse:inline">pinch with two fingers to zoom</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Every place, grouped by country. Hover a city to find it on the map. */}
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
        {visitedCountries.map((name) => (
          <div key={name}>
            <button
              type="button"
              onClick={() => showCountry(name)}
              className="group flex items-center gap-2 text-left"
            >
              <span aria-hidden className="text-base">
                {countries[name].flag}
              </span>
              <span className="eyebrow transition-colors group-hover:text-ink">{name}</span>
              <span className="font-mono text-[0.6875rem] text-muted">{placesIn(name).length}</span>
            </button>
            <ul className="mt-2.5 space-y-1">
              {placesIn(name).map((i) => (
                <li key={places[i].city}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "text-left text-[0.9375rem] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-line-strong",
                      hovered === i ? "text-ink decoration-line-strong" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {places[i].city}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The story card */}
      <Modal open={place !== null} onClose={() => setSelected(null)} labelledBy={titleId}>
        {place && selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="grid gap-7 p-5 sm:grid-cols-[14rem_1fr] sm:gap-9 sm:p-8"
          >
            <Polaroid
              src={place.image}
              alt={`A photo from ${place.city}`}
              caption={place.city}
              placeholder="photo coming soon"
              tilt={-2}
              sizes="(min-width: 640px) 14rem, 80vw"
              className="mx-auto w-full max-w-[14rem] sm:mt-3"
            />

            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-4">
                <p className="eyebrow pt-2">
                  <span aria-hidden className="mr-1.5 text-sm">
                    {countries[place.country].flag}
                  </span>
                  {place.country}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <h3 id={titleId} className="mt-2 font-serif text-title">
                {place.city}
              </h3>

              {(place.tag || place.date) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {place.tag && <Tag dot="bg-accent">{place.tag}</Tag>}
                  {place.date && <Tag>{place.date}</Tag>}
                </div>
              )}

              <div className="mt-5 text-lead text-ink-2">
                {place.description ? (
                  <p>{place.description}</p>
                ) : (
                  <p className="text-muted italic">
                    The story from this one is still being written. Check back soon.
                  </p>
                )}
              </div>

              <nav
                aria-label="More places"
                className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5 sm:mt-auto"
              >
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="group inline-flex min-w-0 items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  <Arrow direction="left" className="transition duration-500 ease-out-expo group-hover:-translate-x-0.5" />
                  <span className="truncate">
                    {places[(selected - 1 + places.length) % places.length].city}
                  </span>
                </button>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {selected + 1} / {places.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="group inline-flex min-w-0 items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  <span className="truncate">{places[(selected + 1) % places.length].city}</span>
                  <Arrow className="transition duration-500 ease-out-expo group-hover:translate-x-0.5" />
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}

/** The little card that appears when you hover a place */
function PlaceSummary({ index }: { index: number }) {
  const place = places[index];
  const details = [place.date, place.tag].filter(Boolean).join(" · ");
  return (
    <>
      <p className="eyebrow">
        <span aria-hidden className="mr-1.5 text-sm">
          {countries[place.country].flag}
        </span>
        {place.country}
      </p>
      <p className="mt-1 font-serif text-2xl leading-tight text-ink">{place.city}</p>
      {details && <p className="mt-1 font-mono text-xs text-ink-2">{details}</p>}
      <p className="mt-2 text-xs text-muted pointer-coarse:hidden">Click to open the story →</p>
    </>
  );
}

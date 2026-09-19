import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Footer() {
  // The year updates every time the site is rebuilt
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-heading text-ink">{site.name}</p>
          <p className="mt-1 font-mono text-[0.8125rem] text-muted">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="link-underline text-ink-2 hover:text-ink">
                Email
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-ink-2 hover:text-ink"
              >
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a href="#main" className="link-underline text-ink-2 hover:text-ink">
                Back to top ↑
              </a>
            </li>
          </ul>
          <p className="font-mono text-xs text-muted">
            © {year} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}

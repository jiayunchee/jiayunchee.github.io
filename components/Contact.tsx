"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";

export function Contact() {
  return (
    <Section id="contact" className="border-t border-line">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow flex items-center justify-center gap-3">
              <span className="text-ink">06</span>
              <span aria-hidden className="h-px w-6 bg-line-strong" />
              Contact
            </p>
            <h2 className="mt-5 font-serif text-display">Let’s talk.</h2>
            <p className="mt-5 text-lead text-ink-2">I’m always up for a conversation.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href={`mailto:${site.email}`} arrow="right">
                Email me
              </Button>
              <Button href={site.linkedin} variant="secondary" arrow="up-right">
                LinkedIn
              </Button>
            </div>
            <CopyEmail />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Shows the address, and copies it with one click for people without a mail app */
function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <p className="mt-6 text-sm text-muted">
      or copy it:{" "}
      <button
        type="button"
        onClick={copy}
        className="font-mono text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
      >
        {site.email}
      </button>
      <span aria-live="polite" className="ml-2 inline-block w-14 text-left font-hand text-lg text-accent">
        {copied ? "copied!" : ""}
      </span>
    </p>
  );
}

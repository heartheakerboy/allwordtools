import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { legalHead } from "@/lib/legal-seo";
import { openCookieSettings } from "@/lib/cookie-consent";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    legalHead({
      title: "Cookie Policy",
      description:
        "What cookies AllWordTools uses, why we use them, how long they last, and how you can manage or disable them.",
      path: "/cookie-policy",
      crumb: "Cookie Policy",
    }),
  component: CookiePolicyPage,
});

export function CookiePolicyPage() {
  return (
    <PageLayout
      crumb="Cookie Policy"
      title="Cookie Policy"
      intro="Last updated July 2026. This page explains how we use cookies and the choices you have."
    >
      <Prose>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the
          site work, remember your preferences and, where you allow it, measure traffic and show
          relevant ads. You can change your choices anytime via{" "}
          <button
            type="button"
            onClick={openCookieSettings}
            className="font-medium text-honey hover:underline"
          >
            Cookie Settings
          </button>
          .
        </p>

        <h2>Essential Cookies</h2>
        <p>
          Always active. Required for core functionality such as security, load balancing and
          remembering your cookie choice. The site cannot function properly without them, so they do
          not require consent.
        </p>

        <h2>Analytics Cookies</h2>
        <p>
          Help us understand how visitors use the Service — which tools are popular and where we can
          improve. These may be set by Google Analytics or a similar provider and only run with your
          consent.
        </p>

        <h2>Advertising Cookies</h2>
        <p>
          Used to deliver relevant advertising (for example via Google AdSense) and to measure ad
          performance and frequency. These run only if advertising is enabled and you have
          consented.
        </p>

        <h2>Preference Cookies</h2>
        <p>
          Remember choices you make, such as your light or dark theme, so the site behaves the way
          you like on future visits.
        </p>

        <h2>Functional Cookies</h2>
        <p>
          Enable enhanced features and a richer experience, such as remembering recently used tools
          or form inputs to save you time.
        </p>

        <h2>Third-Party Cookies</h2>
        <p>
          Some cookies are set by third-party services we use (analytics, advertising and certain
          tool providers). These are governed by the respective third party's own privacy and cookie
          policies.
        </p>

        <h2>Cookie Duration</h2>
        <ul>
          <li>
            <strong>Session cookies</strong> are temporary and deleted when you close your browser.
          </li>
          <li>
            <strong>Persistent cookies</strong> remain for a set period (typically from a few days
            up to 24 months) or until you delete them.
          </li>
        </ul>

        <h2>Managing Cookies</h2>
        <p>
          You can accept or decline non-essential cookies from our banner on your first visit and
          change your choice at any time through{" "}
          <button
            type="button"
            onClick={openCookieSettings}
            className="font-medium text-honey hover:underline"
          >
            Cookie Settings
          </button>
          .
        </p>

        <h2>How to Disable Cookies in Your Browser</h2>
        <p>
          Most browsers let you block or delete cookies in their settings. Note that disabling
          essential cookies may prevent parts of the site from working. Browser guides:
        </p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-us/HT201265"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>

        <h2>More Information</h2>
        <p>
          For details on how we handle data, see our <Link to="/privacy">Privacy Policy</Link>.
          Questions? Visit our <Link to="/contact">contact page</Link>.
        </p>
      </Prose>
    </PageLayout>
  );
}

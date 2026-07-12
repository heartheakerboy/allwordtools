import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { legalHead } from "@/lib/legal-seo";
import { openCookieSettings } from "@/lib/cookie-consent";

const EMAIL = "privacy@allwordtools.com";

export const Route = createFileRoute("/privacy")({
  head: () =>
    legalHead({
      title: "Privacy Policy",
      description:
        "How AllWordTools collects, uses and protects your data. Most tools run in your browser and no account is required.",
      path: "/privacy",
      crumb: "Privacy Policy",
    }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <PageLayout
      crumb="Privacy Policy"
      title="Privacy Policy"
      intro="Last updated July 2026. This policy explains what we collect, why, and the choices you have."
    >
      <Prose>
        <h2>Introduction</h2>
        <p>
          AllWordTools.com ("we", "us", "our") operates a free, informational and educational
          platform of word games, dictionary tools, grammar helpers, AI writing tools and random
          generators. We respect your privacy and this policy describes how we handle information
          when you visit our website (the "Service"). By using the Service you agree to this policy.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We aim to collect as little as possible. Depending on how you use the Service, this may
          include:
        </p>
        <ul>
          <li>Anonymous, aggregated usage analytics (pages viewed, tools used, general region).</li>
          <li>
            Text you voluntarily enter into a tool, only for the duration needed to return a result.
          </li>
          <li>
            Information you send us directly, such as your email and message when you contact us.
          </li>
          <li>
            Technical data described under Log Files, Device Information and Browser Information
            below.
          </li>
        </ul>

        <h2>Information We Do NOT Collect</h2>
        <ul>
          <li>We do not require you to create an account to use most tools.</li>
          <li>We do not knowingly collect sensitive personal data.</li>
          <li>We do not sell your personal information to third parties.</li>
          <li>
            We do not store the text you type into tools longer than needed to produce a result.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use cookies and similar technologies to run the site, remember your preferences and,
          where permitted, to measure traffic and show ads. You control non-essential cookies at any
          time — see our <Link to="/cookie-policy">Cookie Policy</Link> or{" "}
          <button
            type="button"
            onClick={openCookieSettings}
            className="font-medium text-honey hover:underline"
          >
            open Cookie Settings
          </button>
          .
        </p>

        <h2>Google AdSense</h2>
        <p>
          We may display advertising through Google AdSense in the future. Google and its partners
          may use cookies to serve ads based on your prior visits to this and other websites. You
          can opt out of personalised advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Google Analytics</h2>
        <p>
          We may use Google Analytics or a similar tool to understand how the Service is used. These
          tools collect anonymised information such as pages visited and approximate location. You
          can opt out using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Some tools rely on third-party services (for example dictionary and word-data providers)
          to return results. These providers process only the input needed for that request under
          their own privacy policies.
        </p>

        <h2>AI Services</h2>
        <p>
          Some tools use artificial intelligence to generate content. When you use an AI tool, the
          text you submit is sent to an AI processing provider solely to generate your result. Do
          not submit confidential or personal information into AI tools. Generated content may be
          inaccurate and should be reviewed before use.
        </p>

        <h2>Affiliate Links</h2>
        <p>
          In the future we may include affiliate links. If you click one and make a purchase, we may
          earn a commission at no extra cost to you. Affiliate partners may set their own cookies
          once you leave our site.
        </p>

        <h2>Log Files</h2>
        <p>
          Like most websites, our hosting provider may record standard log data such as IP address,
          browser type, referring pages, and timestamps. This helps with security and diagnostics
          and is not used to personally identify you.
        </p>

        <h2>Device &amp; Browser Information</h2>
        <p>
          We may receive general device and browser details (such as device type, operating system,
          screen size and language) to make the site responsive and to fix problems. This
          information is not combined to identify you personally.
        </p>

        <h2>Advertising Cookies</h2>
        <p>
          If advertising is enabled and you consent, advertising cookies may be used to show
          relevant ads and limit how often you see the same ad. You can decline these in Cookie
          Settings.
        </p>

        <h2>Data Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect information. However,
          no method of transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          The Service is not directed to children under 13 (or the age required by your local law)
          and we do not knowingly collect their personal data. If you believe a child has provided
          us information, please contact us and we will remove it.
        </p>

        <h2>Your Rights &amp; Choices</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete or restrict
          the processing of your personal data, and to object to certain processing. To exercise
          these rights, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>GDPR (European Users)</h2>
        <p>
          If you are in the European Economic Area or UK, we process personal data on the lawful
          bases of consent (for analytics and advertising cookies) and legitimate interests (for
          security and improving the Service). You may withdraw consent at any time via Cookie
          Settings and lodge a complaint with your local supervisory authority.
        </p>

        <h2>CCPA (California Users)</h2>
        <p>
          California residents have the right to know what personal information is collected, to
          request deletion, and to opt out of the "sale" of personal information. We do not sell
          personal information. To make a request, contact us at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>Cookie Choices &amp; Opt-Out</h2>
        <p>
          You can accept or decline non-essential cookies from our banner, change them anytime
          through{" "}
          <button
            type="button"
            onClick={openCookieSettings}
            className="font-medium text-honey hover:underline"
          >
            Cookie Settings
          </button>
          , and manage cookies in your browser. See our{" "}
          <Link to="/cookie-policy">Cookie Policy</Link> for details.
        </p>

        <h2>External Links</h2>
        <p>
          The Service may link to external websites we do not control. We are not responsible for
          their content or privacy practices; please review their policies before providing
          information.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be reflected by
          an updated "Last updated" date. Continued use of the Service means you accept the current
          version.
        </p>

        <h2>Contact Information</h2>
        <p>
          Questions about this policy? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or use our{" "}
          <Link to="/contact">contact page</Link>.
        </p>
      </Prose>
    </PageLayout>
  );
}

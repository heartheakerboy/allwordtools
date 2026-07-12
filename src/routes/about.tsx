import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { legalHead } from "@/lib/legal-seo";
import { totalToolCount } from "@/data/tools";

export const Route = createFileRoute("/about")({
  head: () =>
    legalHead({
      title: "About",
      description:
        "AllWordTools brings hundreds of free word game solvers and English language tools together in one fast, beautifully organised place.",
      path: "/about",
      crumb: "About",
    }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <PageLayout
      crumb="About"
      title="About AllWordTools"
      intro="Free, fast and friendly word tools for players, learners and writers."
    >
      <Prose>
        <p>
          AllWordTools.com is home to {totalToolCount}+ free word game solvers and English language
          tools. From unscrambling letters and beating Wordle to building vocabulary and polishing
          your writing, everything lives in one clean, well-organised place — no downloads and no
          sign-ups required.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to make language playful and learning effortless. We believe great tools
          should be instant, accurate and a pleasure to use, so anyone can find the right word,
          settle a friendly dispute or improve their writing in seconds.
        </p>

        <h2>Our Vision</h2>
        <p>
          We're building the most helpful, best-organised word toolkit on the web — a single home
          for every word-related task, accessible to everyone, everywhere, for free.
        </p>

        <h2>Why We Built This Platform</h2>
        <p>
          Word tools were scattered across dozens of cluttered, ad-heavy sites. We wanted one fast,
          beautiful destination where each tool is easy to find, works instantly and respects your
          time and attention.
        </p>

        <h2>What Makes Us Different</h2>
        <ul>
          <li>Clean, distraction-free design that loads fast on any device.</li>
          <li>Complete, ranked results in a fraction of a second.</li>
          <li>Thoughtful organisation into clear categories with strong internal linking.</li>
          <li>Privacy-friendly by default — most tools run right in your browser.</li>
        </ul>

        <h2>Our Tools</h2>
        <p>
          Explore word game solvers, dictionary tools, grammar helpers, random generators, AI
          writing tools and educational resources. Browse the full library on the{" "}
          <Link to="/tools">All Tools</Link> page, or try our{" "}
          <Link to="/category/$category" params={{ category: "ai-tools" }}>
            AI Tools
          </Link>{" "}
          to generate sentences, stories, poems and more.
        </p>

        <h2>Educational Mission</h2>
        <p>
          Beyond games, we help students, teachers and lifelong learners. Our{" "}
          <Link to="/learn">Learning Hub</Link> offers quizzes and guides to grow vocabulary,
          spelling and writing skills.
        </p>

        <h2>Future Roadmap</h2>
        <p>
          We're continually adding new tools, richer AI features and more learning content. Our goal
          is to scale to hundreds of tools while keeping the experience fast and clutter-free.
        </p>

        <h2>Our Commitment to Privacy</h2>
        <p>
          Privacy is a priority. You don't need an account, and we keep data collection to a
          minimum. Read our <Link to="/privacy">Privacy Policy</Link> to learn more.
        </p>

        <h2>Our Commitment to Quality</h2>
        <p>
          We test our tools for accuracy and speed and welcome your feedback to make them even
          better. Quality and reliability guide everything we build.
        </p>

        <h2>Contact Information</h2>
        <p>
          Have an idea or feedback? Visit our <Link to="/contact">contact page</Link> — we'd love to
          hear from you.
        </p>
      </Prose>
    </PageLayout>
  );
}

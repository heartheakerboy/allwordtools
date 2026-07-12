import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Bug, Lightbulb, Briefcase, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/site/PageLayout";
import { legalHead } from "@/lib/legal-seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMAIL = "hello@allwordtools.com";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  topic: z.string().min(1, "Please choose a topic"),
  message: z
    .string()
    .trim()
    .min(10, "Please enter at least 10 characters")
    .max(2000, "Message is too long"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

export const Route = createFileRoute("/contact")({
  head: () =>
    legalHead({
      title: "Contact",
      description:
        "Get in touch with the AllWordTools team. Send feedback, report a bug, suggest a tool or make a privacy request.",
      path: "/contact",
      crumb: "Contact",
    }),
  component: ContactPage,
});

export function ContactPage() {
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      topic,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { name, email, topic: t, message } = result.data;
    const subject = encodeURIComponent(`[${t}] Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    // Open the user's email client with a prefilled message.
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Thanks! Your email draft is ready to send.");
    form.reset();
    setTopic("");
    setSubmitting(false);
  }

  return (
    <PageLayout
      crumb="Contact"
      title="Contact us"
      intro="We'd love to hear from you — feedback, bug reports, suggestions and business enquiries are all welcome."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Contact form">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              maxLength={100}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="Your name"
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger
                id="topic"
                aria-invalid={!!errors.topic}
                aria-describedby={errors.topic ? "topic-error" : undefined}
              >
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General enquiry</SelectItem>
                <SelectItem value="Business">Business enquiry</SelectItem>
                <SelectItem value="Bug report">Bug report</SelectItem>
                <SelectItem value="Suggestion">Suggestion</SelectItem>
                <SelectItem value="Privacy request">Privacy request</SelectItem>
              </SelectContent>
            </Select>
            {errors.topic && (
              <p id="topic-error" className="text-sm text-destructive">
                {errors.topic}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              maxLength={2000}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              placeholder="How can we help?"
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Send message
          </Button>
          <p className="text-sm text-muted-foreground">
            Prefer email? Write to{" "}
            <a href={`mailto:${EMAIL}`} className="font-medium text-honey hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </form>

        {/* Contact options */}
        <aside className="space-y-4">
          <ContactCard
            icon={<Briefcase className="h-5 w-5" />}
            title="Business inquiries"
            desc="Partnerships, advertising and collaborations."
          />
          <ContactCard
            icon={<Bug className="h-5 w-5" />}
            title="Bug reports"
            desc="Something not working? Tell us what happened."
          />
          <ContactCard
            icon={<Lightbulb className="h-5 w-5" />}
            title="Suggestions"
            desc="Ideas for new tools or improvements."
          />
          <ContactCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Privacy requests"
            desc={
              <>
                Access or delete your data — see our{" "}
                <Link to="/privacy" className="font-medium text-honey hover:underline">
                  Privacy Policy
                </Link>
                .
              </>
            }
          />
        </aside>
      </div>
    </PageLayout>
  );
}

function ContactCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-honey">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

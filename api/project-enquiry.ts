type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  socket?: { remoteAddress?: string };
};
type Response = {
  status(code: number): Response;
  json(value: unknown): void;
  setHeader(name: string, value: string): void;
};

const submissions = new Map<string, number[]>();
const limit = 5;
const interval = 15 * 60 * 1000;
const maxLength = 6000;
const productionOrigin = "https://veeintellixm3web.vercel.app";

function text(value: unknown, max = 1200) {
  if (typeof value !== "string") return "";
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return (code < 32 && code !== 9 && code !== 10) || code === 127
      ? ""
      : character;
  })
    .join("")
    .trim()
    .slice(0, max);
}

function headerText(value: unknown, max = 120) {
  return text(value, max).replace(/[\t\r\n]+/g, " ");
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ error: "Use POST to send a project enquiry." });
  const origin = req.headers.origin;
  const deploymentOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  if (
    typeof origin === "string" &&
    origin !== productionOrigin &&
    origin !== deploymentOrigin &&
    !origin.startsWith("http://localhost:")
  ) {
    return res
      .status(403)
      .json({ error: "This enquiry could not be accepted." });
  }
  const now = Date.now();
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string"
      ? forwarded.split(",")[0]
      : req.socket?.remoteAddress) || "unknown";
  const recent = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < interval,
  );
  if (recent.length >= limit)
    return res.status(429).json({
      error:
        "Too many enquiries were sent from this connection. Please try again later.",
    });

  const body =
    req.body && typeof req.body === "object"
      ? (req.body as Record<string, unknown>)
      : {};
  if (text(body.companyWebsite, 300))
    return res.status(200).json({ accepted: true });
  const name = headerText(body.name, 120);
  const email = text(body.email, 254);
  const phone = text(body.phone, 40);
  const isContact = body.type === "contact";
  const category = headerText(body.category, 80) || (isContact ? "General enquiry" : "");
  const description = text(isContact ? body.message : body.description, maxLength);
  const brief = text(body.brief, maxLength) || (isContact ? description : "");
  const notes = text(body.notes, 1500);
  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !category ||
    description.length < 15 ||
    !brief
  ) {
    return res.status(400).json({
      error:
        "Please provide a name, valid email, project category and a project description of at least 15 characters.",
    });
  }
  if (JSON.stringify(body).length > 25000)
    return res.status(413).json({
      error:
        "This enquiry is too large. Shorten the project description and try again.",
    });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL || "veerambaufx@gmail.com";
  if (!apiKey || !from)
    return res.status(503).json({
      error:
        "Email delivery is not configured yet. Your brief remains available; you can continue by WhatsApp.",
    });

  const reference = `VI-${now.toString(36).toUpperCase()}`;
  recent.push(now);
  submissions.set(ip, recent);
  const submittedAt = new Date(now).toISOString();
  const content = [
    `Enquiry reference: ${reference}`,
    `Submitted: ${submittedAt}`,
    `Customer name: ${name}`,
    `Customer email: ${email}`,
    `Telephone: ${phone || "Not provided"}`,
    `Project category: ${category}`,
    `Project description: ${description}`,
    `Selected features: ${
      Array.isArray(body.selectedFeatures)
        ? body.selectedFeatures
            .map((item) => text(item, 100))
            .slice(0, 30)
            .join(", ")
        : "Not provided"
    }`,
    `Design: ${text(body.design, 80)}`,
    `Complexity: ${text(body.complexity, 40)}`,
    `Delivery preference: ${text(body.urgency, 80)} (subject to feasibility)`,
    `Existing systems/integrations: ${text(body.existing, 1200) || "Not specified"}`,
    `Indicative range: ${text(JSON.stringify(body.estimate), 100)} ${text(body.currency, 10)}`,
    `Assumptions/exclusions: ${text(body.brief, maxLength).split("Assumptions:")[1] || "Indicative only; final scope and quote require discussion. Third-party costs may be separate."}`,
    `Maintenance preference: ${text(body.maintenance, 80)}`,
    `Budget preference: ${text(body.budget, 80) || "Not specified"}`,
    `Additional notes: ${notes || "None"}`,
    "",
    "Complete project brief:",
    brief,
    "",
    `Reply to the customer at ${email}.`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New Project Enquiry — ${category} — ${reference}`,
        text: content,
      }),
    });
    if (!response.ok) {
      console.error(
        "Project enquiry email provider returned status",
        response.status,
      );
      return res.status(502).json({
        error:
          "Email delivery failed. Your brief is still available; please use WhatsApp or try again.",
      });
    }
    return res.status(200).json({ accepted: true, reference });
  } catch {
    return res.status(502).json({
      error:
        "Email delivery failed. Your brief is still available; please use WhatsApp or try again.",
    });
  }
}

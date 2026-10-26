import { afterEach, describe, expect, it, vi } from "vitest";
import projectEnquiry from "../../api/project-enquiry";

function makeRequest(overrides: Record<string, unknown> = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://veeintellixm3web.vercel.app",
      "x-forwarded-for": `192.0.2.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: {
      name: "Test Customer",
      email: "customer@example.com",
      phone: "+36701112222",
      category: "Business website",
      description: "A responsive service website with a booking form.",
      selectedFeatures: ["Responsive design", "Booking"],
      design: "custom",
      complexity: "standard",
      urgency: "flexible",
      existing: "Calendar API",
      maintenance: "considering",
      estimate: { min: 10000, max: 24000 },
      currency: "ZAR",
      brief:
        "Project enquiry\nAssumptions: indicative range only.\nExclusions: hosting and tax.",
      ...overrides,
    },
    socket: { remoteAddress: "192.0.2.1" },
  };
}

function makeResponse() {
  return {
    code: 200,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    status(code: number) {
      this.code = code;
      return this;
    },
    json(value: unknown) {
      this.body = value;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
  };
}

describe("server-side project enquiry", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends the full validated brief through the email provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "VeeIntellix <enquiries@example.com>");
    const fetchMock = vi.fn(
      async (_url: unknown, _options: { body?: string }) =>
        new Response(JSON.stringify({ id: "mail-id" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const response = makeResponse();

    await projectEnquiry(makeRequest() as never, response as never);

    expect(response.code).toBe(200);
    expect(response.body).toMatchObject({ accepted: true });
    const mail = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(mail.to).toEqual(["veerambaufx@gmail.com"]);
    expect(mail.reply_to).toBe("customer@example.com");
    expect(mail.subject).toMatch(/Business website/);
    expect(mail.text).toContain(
      "A responsive service website with a booking form.",
    );
    expect(mail.text).toContain("Responsive design, Booking");
    expect(mail.text).toContain("Exclusions: hosting and tax.");
  });

  it("rejects invalid customer email before contacting the provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "VeeIntellix <enquiries@example.com>");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = makeResponse();

    await projectEnquiry(
      makeRequest({ email: "invalid" }) as never,
      response as never,
    );

    expect(response.code).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the endpoint unavailable until server email credentials are set", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "");
    const response = makeResponse();

    await projectEnquiry(makeRequest() as never, response as never);

    expect(response.code).toBe(503);
    expect(response.body).toMatchObject({
      error: expect.stringContaining("not configured"),
    });
  });

  it("does not report success when the email provider fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "VeeIntellix <enquiries@example.com>");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 503 })),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = makeResponse();

    await projectEnquiry(makeRequest() as never, response as never);

    expect(response.code).toBe(502);
    expect(response.body).toMatchObject({
      error: expect.stringContaining("delivery failed"),
    });
  });
});

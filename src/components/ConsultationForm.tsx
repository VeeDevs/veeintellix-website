import { useState } from "react";
import { Send, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ConsultationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", service: "", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("quotes").insert({
        project_description: form.description || `Consultation request for ${form.service}`,
        client_name: form.name,
        client_email: form.email,
        client_phone: form.phone,
        client_company: form.company,
        status: "consultation_request",
      });
      if (error) throw error;
      toast.success("Consultation request submitted! We'll be in touch soon.");
      setForm({ name: "", email: "", company: "", phone: "", service: "", description: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation" className="py-24 relative">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_10%,hsla(164,86%,43%,0.15),transparent_32%),radial-gradient(circle_at_80%_80%,hsla(196,92%,56%,0.16),transparent_30%)]" />
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">
            Book <span className="gradient-text">Consultation</span>
          </h2>
          <p className="text-muted-foreground">Tell us what you need and we will send a scoped plan with costs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-xl border border-border bg-card/85 shadow-[0_16px_45px_hsla(210,45%,7%,0.42)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone/WhatsApp *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="+27..."
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Service Interest</label>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select a service</option>
              <option value="software">Custom Software Development</option>
              <option value="web">Website Development/Revamp</option>
              <option value="mobile">Mobile App Development</option>
              <option value="automation">Automation Solutions</option>
              <option value="hosting">Cloud Hosting</option>
              <option value="consulting">IT Consulting</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Project Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
            <Send className="w-4 h-4" />
          </button>
          <a
            href="https://wa.me/27000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-success hover:underline"
          >
            <Phone className="w-4 h-4" />
            Prefer WhatsApp? Chat with us directly
          </a>
          <p className="text-xs text-center text-muted-foreground">
            After submitting, we respond within one business day.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ConsultationForm;

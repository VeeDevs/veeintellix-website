import { useState, useRef } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, Send, Loader2, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Step = "describe" | "analysis" | "features" | "preview" | "quote";

interface AnalysisResult {
  keyFeatures: string[];
  projectClassification: string;
  standardDescription: string;
  modernDescription: string;
  standardFeatures: string[];
  modernFeatures: string[];
  suggestedAdditionalFeatures: { name: string; description: string; tier: string }[];
}

interface PreviewResult {
  standardHtml: string;
  modernHtml: string;
}

const QuoteBuilder = () => {
  const [step, setStep] = useState<Step>("describe");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("Business Website");
  const [industry, setIndustry] = useState("Technology");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [previewMode, setPreviewMode] = useState<"standard" | "modern" | "compare">("compare");
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", company: "" });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const splitRef = useRef<HTMLDivElement>(null);
  const [splitPos, setSplitPos] = useState(50);

  const handleAnalyze = async () => {
    if (!description.trim()) { toast.error("Please describe your project"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("quote-ai", {
        body: { action: "analyze", projectDescription: description, projectType, industry },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      setStep("analysis");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("quote-ai", {
        body: { action: "generate-preview", projectDescription: description, projectType, industry },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setPreview(data);
      setStep("preview");
    } catch (e: any) {
      toast.error(e.message || "Preview generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async () => {
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      toast.error("Please fill in your contact details");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("quotes").insert({
        project_description: description,
        project_type: analysis?.projectClassification || "standard",
        key_features: analysis?.keyFeatures || [],
        additional_features: selectedFeatures,
        standard_analysis: analysis?.standardDescription,
        modern_analysis: analysis?.modernDescription,
        standard_preview_html: preview?.standardHtml,
        modern_preview_html: preview?.modernHtml,
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_company: clientInfo.company,
        status: "submitted",
      });
      if (error) throw error;
      setQuoteSubmitted(true);
      toast.success("Quote request submitted! We'll prepare your detailed quotation.");
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (name: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleSplitDrag = (e: React.MouseEvent) => {
    if (!splitRef.current) return;
    const rect = splitRef.current.getBoundingClientRect();
    const onMove = (ev: MouseEvent) => {
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.max(10, Math.min(90, pct)));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const steps: { key: Step; label: string }[] = [
    { key: "describe", label: "Describe" },
    { key: "analysis", label: "Analysis" },
    { key: "features", label: "Features" },
    { key: "preview", label: "Preview" },
    { key: "quote", label: "Get Quote" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-bold mb-3">
            AI <span className="gradient-text">Quote Builder</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Describe your project and our AI will analyze, classify, and generate visual previews for Standard and Modern tiers.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-12 max-w-xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < currentIdx ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i <= currentIdx ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Describe */}
        {step === "describe" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="p-8 rounded-xl border border-border bg-card space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Describe Your Project *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="e.g., I need an e-commerce website for a fashion brand with product catalog, shopping cart, user accounts, and payment processing..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                  >
                    <option>Business Website</option>
                    <option>E-commerce</option>
                    <option>Portfolio</option>
                    <option>Landing Page</option>
                    <option>Dashboard</option>
                    <option>Mobile App</option>
                    <option>Web Application</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                  >
                    <option>Technology</option>
                    <option>Fashion & Retail</option>
                    <option>Food & Restaurant</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Real Estate</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? "Analyzing..." : "Analyze My Project"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Analysis */}
        {step === "analysis" && analysis && (
          <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-lg font-semibold mb-3 text-foreground">Key Features Identified</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {analysis.keyFeatures.map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{f}</span>
                ))}
              </div>

              <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{
                background: analysis.projectClassification === "modern" ? "var(--gradient-primary)" : undefined,
                backgroundColor: analysis.projectClassification !== "modern" ? "hsl(var(--muted))" : undefined,
                color: analysis.projectClassification === "modern" ? "white" : undefined,
              }}>
                Classification: {analysis.projectClassification === "modern" ? "🚀 Modern" : "📋 Standard"}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-lg border border-border bg-muted/50">
                  <h4 className="font-heading font-semibold text-foreground mb-2">📋 Standard Version</h4>
                  <p className="text-sm text-muted-foreground mb-3">{analysis.standardDescription}</p>
                  <ul className="space-y-1">
                    {analysis.standardFeatures.map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-lg border border-primary/30 bg-primary/5">
                  <h4 className="font-heading font-semibold text-foreground mb-2">🚀 Modern Version</h4>
                  <p className="text-sm text-muted-foreground mb-3">{analysis.modernDescription}</p>
                  <ul className="space-y-1">
                    {analysis.modernFeatures.map((f) => (
                      <li key={f} className="text-sm text-primary flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("describe")} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("features")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient-primary)" }}
              >
                Select Additional Features <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Features */}
        {step === "features" && analysis && (
          <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-lg font-semibold mb-4 text-foreground">Select Additional Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {analysis.suggestedAdditionalFeatures.map((f) => {
                  const selected = selectedFeatures.includes(f.name);
                  return (
                    <button
                      key={f.name}
                      onClick={() => toggleFeature(f.name)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted/30 hover:border-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{f.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          f.tier === "modern" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>{f.tier}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                      {selected && <Check className="w-4 h-4 text-primary mt-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("analysis")} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                {loading ? "Generating Preview..." : "Generate Visual Preview"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === "preview" && preview && (
          <div className="animate-fade-in space-y-6">
            {/* View Toggle */}
            <div className="flex items-center justify-center gap-2">
              {(["standard", "modern", "compare"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    previewMode === mode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "compare" ? "⇔ Compare" : mode === "standard" ? "📋 Standard" : "🚀 Modern"}
                </button>
              ))}
            </div>

            {/* Preview Area */}
            <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: "600px" }}>
              {previewMode === "compare" ? (
                <div ref={splitRef} className="relative w-full h-full">
                  <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${splitPos}%`, borderRight: "3px solid hsl(var(--primary))" }}>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold z-10">STANDARD</div>
                    <iframe srcDoc={preview.standardHtml} className="w-full h-full border-none" title="Standard Preview" sandbox="allow-same-origin" />
                  </div>
                  <div className="absolute top-0 right-0 h-full overflow-hidden" style={{ width: `${100 - splitPos}%` }}>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold z-10">MODERN</div>
                    <iframe srcDoc={preview.modernHtml} className="w-full h-full border-none" title="Modern Preview" sandbox="allow-same-origin" />
                  </div>
                  <div
                    className="absolute top-0 h-full w-10 cursor-ew-resize z-20 flex items-center justify-center"
                    style={{ left: `${splitPos}%`, transform: "translateX(-50%)" }}
                    onMouseDown={handleSplitDrag}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-foreground shadow-lg text-primary-foreground text-xs">⇔</div>
                  </div>
                </div>
              ) : (
                <iframe
                  srcDoc={previewMode === "standard" ? preview.standardHtml : preview.modernHtml}
                  className="w-full h-full border-none"
                  title={`${previewMode} Preview`}
                  sandbox="allow-same-origin"
                />
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              ⚠️ This preview demonstrates the visual difference between Standard and Modern tiers. Actual implementation may vary.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep("features")} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("quote")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient-primary)" }}
              >
                Request Full Quotation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Quote */}
        {step === "quote" && !quoteSubmitted && (
          <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
            <div className="p-8 rounded-xl border border-border bg-card space-y-5">
              <h3 className="font-heading text-lg font-semibold text-foreground">Your Contact Details</h3>
              <p className="text-sm text-muted-foreground">We'll prepare a detailed quotation and send it to you.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Phone/WhatsApp *</label>
                  <input
                    type="tel"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                    placeholder="+27..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Company</label>
                  <input
                    type="text"
                    value={clientInfo.company}
                    onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                    placeholder="Company name"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                <h4 className="font-heading text-sm font-semibold text-foreground">Quote Summary</h4>
                <p className="text-xs text-muted-foreground"><strong>Type:</strong> {projectType} ({industry})</p>
                <p className="text-xs text-muted-foreground"><strong>Classification:</strong> {analysis?.projectClassification === "modern" ? "🚀 Modern" : "📋 Standard"}</p>
                <p className="text-xs text-muted-foreground"><strong>Key Features:</strong> {analysis?.keyFeatures.join(", ")}</p>
                {selectedFeatures.length > 0 && (
                  <p className="text-xs text-muted-foreground"><strong>Additional:</strong> {selectedFeatures.join(", ")}</p>
                )}
              </div>

              <button
                onClick={handleSubmitQuote}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? "Submitting..." : "Submit Quote Request"}
              </button>
            </div>

            <button onClick={() => setStep("preview")} className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Preview
            </button>
          </div>
        )}

        {/* Success */}
        {quoteSubmitted && (
          <div className="max-w-lg mx-auto text-center animate-fade-in">
            <div className="p-10 rounded-xl border border-border bg-card">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Quote Request Submitted!</h3>
              <p className="text-muted-foreground mb-6">Our team will review your project and prepare a detailed quotation within 24 hours.</p>
              <p className="text-xs text-muted-foreground">⚠️ All quotations are valid for 15 days from issuance.</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuoteBuilder;

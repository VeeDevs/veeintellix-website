import { useMemo, useRef, useState } from "react";
import { Calculator, FileText, Save, Loader2, Download, Copy, ClipboardPaste } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const PROJECT_TYPES = [
  { value: "landing_page", label: "Landing Page", base: 4500 },
  { value: "business_website", label: "Business Website", base: 8500 },
  { value: "ecommerce", label: "E-commerce Store", base: 15000 },
  { value: "dashboard", label: "Dashboard / Portal", base: 18000 },
  { value: "web_application", label: "Web Application", base: 25000 },
  { value: "mobile_app", label: "Mobile Application", base: 35000 },
  { value: "enterprise_system", label: "Enterprise System", base: 55000 },
];

const COMPLEXITY_LEVELS = [
  { value: "basic", label: "Basic", multiplier: 1, description: "Simple layout, minimal features" },
  { value: "standard", label: "Standard", multiplier: 1.3, description: "Moderate features, standard integrations" },
  { value: "advanced", label: "Advanced", multiplier: 1.7, description: "Complex logic, multiple integrations" },
  { value: "enterprise", label: "Enterprise", multiplier: 2.4, description: "Full-scale, mission-critical system" },
];

const COMPANY_SIZES = [
  { value: "startup", label: "Startup / Individual", multiplier: 1 },
  { value: "small", label: "Small Business (1-10)", multiplier: 1.1 },
  { value: "medium", label: "Medium Business (11-50)", multiplier: 1.25 },
  { value: "corporate", label: "Corporate (51-200)", multiplier: 1.5 },
  { value: "enterprise", label: "Enterprise (200+)", multiplier: 1.8 },
];

const QuoteCalculator = ({ onQuoteSaved }: { onQuoteSaved?: () => void }) => {
  // Client info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [description, setDescription] = useState("");

  // Project params
  const [projectType, setProjectType] = useState("web_application");
  const [complexity, setComplexity] = useState("standard");
  const [companySize, setCompanySize] = useState("small");
  const [pages, setPages] = useState(8);
  const [integrations, setIntegrations] = useState(2);
  const [customFeatures, setCustomFeatures] = useState(3);
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  const [includeStandard, setIncludeStandard] = useState(true);
  const [includeModern, setIncludeModern] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const typeObj = PROJECT_TYPES.find((t) => t.value === projectType)!;
  const complexityObj = COMPLEXITY_LEVELS.find((c) => c.value === complexity)!;
  const companyObj = COMPANY_SIZES.find((c) => c.value === companySize)!;

  const breakdown = useMemo(() => {
    const base = typeObj.base;
    const complexityCost = base * (complexityObj.multiplier - 1);
    const companyCost = base * (companyObj.multiplier - 1);
    const pageCost = Math.max(0, pages - 5) * 480;
    const integrationCost = integrations * 1200;
    const featureCost = customFeatures * 1500;

    // Rush fee
    const rushMultiplier = timelineWeeks <= 2 ? 1.5 : timelineWeeks <= 4 ? 1.3 : timelineWeeks <= 6 ? 1.15 : 1;
    const rushLabel =
      timelineWeeks <= 2 ? "Urgent (+50%)" : timelineWeeks <= 4 ? "Fast-track (+30%)" : timelineWeeks <= 6 ? "Accelerated (+15%)" : "Standard";

    const subtotalBeforeRush = base + complexityCost + companyCost + pageCost + integrationCost + featureCost;
    const rushAdjustment = subtotalBeforeRush * (rushMultiplier - 1);
    const subtotal = subtotalBeforeRush + rushAdjustment;
    const contingency = subtotal * 0.1;

    // Standard tier = base calculation
    const standardTotal = subtotal + contingency;
    // Modern tier = +35% for modern stack, premium design, animations
    const modernPremium = subtotal * 0.35;
    const modernTotal = subtotal + modernPremium + contingency;

    // Monthly maintenance
    const stdMonthlyCore = Math.max(800, standardTotal * 0.025);
    const stdMonthlyGrowth = Math.max(1500, standardTotal * 0.04);
    const stdMonthlyScale = Math.max(2500, standardTotal * 0.06);

    const modMonthlyCore = Math.max(1200, modernTotal * 0.03);
    const modMonthlyGrowth = Math.max(2200, modernTotal * 0.05);
    const modMonthlyScale = Math.max(3500, modernTotal * 0.07);

    // Valid for 15 days
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 15);

    return {
      base,
      complexityCost,
      companyCost,
      pageCost,
      integrationCost,
      featureCost,
      rushAdjustment,
      rushLabel,
      rushMultiplier,
      contingency,
      standardTotal,
      modernPremium,
      modernTotal,
      stdMonthlyCore,
      stdMonthlyGrowth,
      stdMonthlyScale,
      modMonthlyCore,
      modMonthlyGrowth,
      modMonthlyScale,
      validUntil,
    };
  }, [typeObj, complexityObj, companyObj, pages, integrations, customFeatures, timelineWeeks]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Try to parse lines: Name, Email, Phone, Company
      const lines = text.split("\n").map((l) => l.trim());
      if (lines[0]) setClientName(lines[0]);
      if (lines[1]) setClientEmail(lines[1]);
      if (lines[2]) setClientPhone(lines[2]);
      if (lines[3]) setClientCompany(lines[3]);
      if (lines[4]) setDescription(lines.slice(4).join("\n"));
      toast.success("Client details pasted");
    } catch {
      toast.error("Unable to read clipboard");
    }
  };

  const copyDescription = () => {
    const text = `Quote for ${clientName || "Client"} – ${typeObj.label}\n${description}\n\nStandard: ${currency.format(breakdown.standardTotal)} | Modern: ${currency.format(breakdown.modernTotal)}\nValid until: ${breakdown.validUntil.toLocaleDateString("en-ZA")}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const saveToDatabase = async () => {
    if (!description.trim()) {
      toast.error("Please enter a project description");
      return;
    }
    setSaving(true);

    const standardAnalysis = `Project: ${typeObj.label} | Complexity: ${complexityObj.label} | Company: ${companyObj.label}\n${pages} pages | ${integrations} integrations | ${customFeatures} custom modules | ${timelineWeeks} weeks (${breakdown.rushLabel})\nStandard Total: ${currency.format(breakdown.standardTotal)}\nMaintenance: ${currency.format(breakdown.stdMonthlyCore)}-${currency.format(breakdown.stdMonthlyScale)}/mo`;

    const modernAnalysis = `Project: ${typeObj.label} | Complexity: ${complexityObj.label} | Company: ${companyObj.label}\n${pages} pages | ${integrations} integrations | ${customFeatures} custom modules | ${timelineWeeks} weeks (${breakdown.rushLabel})\nModern Total: ${currency.format(breakdown.modernTotal)} (includes 35% modern premium)\nMaintenance: ${currency.format(breakdown.modMonthlyCore)}-${currency.format(breakdown.modMonthlyScale)}/mo`;

    const { error } = await supabase.from("quotes").insert({
      client_name: clientName || null,
      client_email: clientEmail || null,
      client_phone: clientPhone || null,
      client_company: clientCompany || null,
      project_description: description,
      project_type: projectType,
      status: "draft",
      standard_analysis: includeStandard ? standardAnalysis : null,
      modern_analysis: includeModern ? modernAnalysis : null,
      key_features: [
        `${pages} pages/screens`,
        `${integrations} integrations`,
        `${customFeatures} custom modules`,
        `${complexityObj.label} complexity`,
        `${companyObj.label}`,
        `${timelineWeeks}-week timeline (${breakdown.rushLabel})`,
        includeStandard ? `Standard: ${currency.format(breakdown.standardTotal)}` : null,
        includeModern ? `Modern: ${currency.format(breakdown.modernTotal)}` : null,
      ].filter(Boolean),
    });

    if (error) toast.error("Failed to save quote");
    else {
      toast.success("Quote saved to database");
      onQuoteSaved?.();
    }
    setSaving(false);
  };

  const exportPdf = async () => {
    if (!quoteRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#1a1a2e",
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= 277;

      while (heightLeft > 0) {
        pdf.addPage();
        position = 10;
        pdf.addImage(imgData, "PNG", 10, position - (imgHeight - heightLeft), imgWidth, imgHeight);
        heightLeft -= 277;
      }

      const fileName = clientName
        ? `quote-${clientName.replace(/\s+/g, "-").toLowerCase()}.pdf`
        : "quote.pdf";
      pdf.save(fileName);
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="glass rounded-xl border border-border p-5 md:p-6 mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Professional Quote Calculator</h2>
        </div>
        <button onClick={pasteFromClipboard} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
          <ClipboardPaste className="w-3.5 h-3.5" /> Quick Paste
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Generate a professional pricing estimate in ZAR. Paste client details (Name, Email, Phone, Company, Description – one per line).
      </p>

      {/* Client Info */}
      <fieldset className="border border-border/50 rounded-lg p-4 mb-4">
        <legend className="text-xs font-medium text-muted-foreground px-2">Client Information</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Client full name" />
          <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Email address" type="email" />
          <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Phone number" />
          <input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Company / Organisation" />
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm mt-3 min-h-[70px]" placeholder="Project description & requirements..." />
      </fieldset>

      {/* Project Specifications */}
      <fieldset className="border border-border/50 rounded-lg p-4 mb-4">
        <legend className="text-xs font-medium text-muted-foreground px-2">Project Specifications</legend>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Project Type</label>
            <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
              {PROJECT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label} – from {currency.format(t.base)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Complexity Level</label>
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
              {COMPLEXITY_LEVELS.map((c) => (
                <option key={c.value} value={c.value}>{c.label} – {c.description}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Company Size</label>
            <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
              {COMPANY_SIZES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pages / Screens</label>
            <input type="number" min={1} value={pages} onChange={(e) => setPages(Number(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Integrations</label>
            <input type="number" min={0} value={integrations} onChange={(e) => setIntegrations(Number(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Custom Modules</label>
            <input type="number" min={0} value={customFeatures} onChange={(e) => setCustomFeatures(Number(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Timeline (weeks)</label>
            <input type="number" min={1} value={timelineWeeks} onChange={(e) => setTimelineWeeks(Number(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
          </div>
        </div>

        {/* Tier toggles */}
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={includeStandard} onChange={(e) => setIncludeStandard(e.target.checked)} className="rounded border-border" />
            Standard Tier
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={includeModern} onChange={(e) => setIncludeModern(e.target.checked)} className="rounded border-border" />
            Modern Tier (+35%)
          </label>
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Generate Quote
        </button>
        {submitted && (
          <>
            <button onClick={saveToDatabase} disabled={saving || !description.trim()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={exportPdf} disabled={exporting} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export PDF
            </button>
            <button onClick={copyDescription} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-foreground text-sm hover:opacity-90 transition-opacity">
              <Copy className="w-4 h-4" /> Copy Summary
            </button>
          </>
        )}
      </div>

      {/* Generated Quote */}
      {submitted && (
        <div ref={quoteRef} className="mt-6 space-y-4 text-sm">
          {/* Header */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-base text-primary">VeeIntellix M3 IT Solutions</h3>
                <p className="text-xs text-muted-foreground">Professional Project Quotation</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Date: {new Date().toLocaleDateString("en-ZA")}</p>
                <p>Valid until: {breakdown.validUntil.toLocaleDateString("en-ZA")}</p>
                <p className="text-[10px]">Quote valid for 15 days</p>
              </div>
            </div>
            {clientName && (
              <div className="mt-3 pt-3 border-t border-primary/10 grid sm:grid-cols-2 gap-1 text-xs">
                <p><span className="text-muted-foreground">Client:</span> {clientName}</p>
                {clientCompany && <p><span className="text-muted-foreground">Company:</span> {clientCompany}</p>}
                {clientEmail && <p><span className="text-muted-foreground">Email:</span> {clientEmail}</p>}
                {clientPhone && <p><span className="text-muted-foreground">Phone:</span> {clientPhone}</p>}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <div className="flex items-center gap-2 font-medium mb-3">
              <FileText className="w-4 h-4 text-primary" /> Project Specifications
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <p className="flex justify-between"><span className="text-muted-foreground">Project Type</span><span>{typeObj.label}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Complexity</span><span>{complexityObj.label} – {complexityObj.description}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Company Size</span><span>{companyObj.label}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Timeline</span><span>{timelineWeeks} weeks ({breakdown.rushLabel})</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Pages / Screens</span><span>{pages}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">3rd-party Integrations</span><span>{integrations}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Custom Modules</span><span>{customFeatures}</span></p>
            </div>
            {description && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Project Description:</p>
                <p className="text-xs whitespace-pre-wrap">{description}</p>
              </div>
            )}
          </div>

          {/* Cost Breakdown Grid */}
          <div className={`grid ${includeStandard && includeModern ? "lg:grid-cols-2" : ""} gap-4`}>
            {/* Standard Tier */}
            {includeStandard && (
              <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-1.5">
                <h4 className="font-medium text-sm mb-2">📋 Standard Tier</h4>
                <p className="flex justify-between text-xs"><span>Base project cost</span><span>{currency.format(breakdown.base)}</span></p>
                <p className="flex justify-between text-xs"><span>Complexity adjustment ({complexityObj.label})</span><span>{currency.format(breakdown.complexityCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Company scale ({companyObj.label})</span><span>{currency.format(breakdown.companyCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Additional pages ({Math.max(0, pages - 5)} × R480)</span><span>{currency.format(breakdown.pageCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Integrations ({integrations} × R1,200)</span><span>{currency.format(breakdown.integrationCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Custom modules ({customFeatures} × R1,500)</span><span>{currency.format(breakdown.featureCost)}</span></p>
                {breakdown.rushAdjustment > 0 && (
                  <p className="flex justify-between text-xs text-destructive"><span>Timeline adjustment ({breakdown.rushLabel})</span><span>+{currency.format(breakdown.rushAdjustment)}</span></p>
                )}
                <p className="flex justify-between text-xs"><span>Contingency (10%)</span><span>{currency.format(breakdown.contingency)}</span></p>
                <div className="border-t border-border pt-2 mt-2">
                  <p className="flex justify-between font-semibold text-sm"><span>Standard Total</span><span className="text-primary">{currency.format(breakdown.standardTotal)}</span></p>
                </div>
                <div className="border-t border-border pt-2 mt-2 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Monthly Maintenance:</p>
                  <p className="flex justify-between text-xs"><span>Core Care</span><span>{currency.format(breakdown.stdMonthlyCore)}/mo</span></p>
                  <p className="flex justify-between text-xs"><span>Growth Care</span><span>{currency.format(breakdown.stdMonthlyGrowth)}/mo</span></p>
                  <p className="flex justify-between text-xs"><span>Scale Care</span><span>{currency.format(breakdown.stdMonthlyScale)}/mo</span></p>
                </div>
              </div>
            )}

            {/* Modern Tier */}
            {includeModern && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-1.5">
                <h4 className="font-medium text-sm mb-2">✨ Modern Tier <span className="text-xs text-muted-foreground">(Premium design, animations, modern stack)</span></h4>
                <p className="flex justify-between text-xs"><span>Base project cost</span><span>{currency.format(breakdown.base)}</span></p>
                <p className="flex justify-between text-xs"><span>Complexity adjustment ({complexityObj.label})</span><span>{currency.format(breakdown.complexityCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Company scale ({companyObj.label})</span><span>{currency.format(breakdown.companyCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Additional pages ({Math.max(0, pages - 5)} × R480)</span><span>{currency.format(breakdown.pageCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Integrations ({integrations} × R1,200)</span><span>{currency.format(breakdown.integrationCost)}</span></p>
                <p className="flex justify-between text-xs"><span>Custom modules ({customFeatures} × R1,500)</span><span>{currency.format(breakdown.featureCost)}</span></p>
                {breakdown.rushAdjustment > 0 && (
                  <p className="flex justify-between text-xs text-destructive"><span>Timeline adjustment ({breakdown.rushLabel})</span><span>+{currency.format(breakdown.rushAdjustment)}</span></p>
                )}
                <p className="flex justify-between text-xs text-primary"><span>Modern premium (+35%)</span><span>+{currency.format(breakdown.modernPremium)}</span></p>
                <p className="flex justify-between text-xs"><span>Contingency (10%)</span><span>{currency.format(breakdown.contingency)}</span></p>
                <div className="border-t border-primary/20 pt-2 mt-2">
                  <p className="flex justify-between font-semibold text-sm"><span>Modern Total</span><span className="text-primary">{currency.format(breakdown.modernTotal)}</span></p>
                </div>
                <div className="border-t border-primary/20 pt-2 mt-2 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Monthly Maintenance:</p>
                  <p className="flex justify-between text-xs"><span>Core Care</span><span>{currency.format(breakdown.modMonthlyCore)}/mo</span></p>
                  <p className="flex justify-between text-xs"><span>Growth Care</span><span>{currency.format(breakdown.modMonthlyGrowth)}/mo</span></p>
                  <p className="flex justify-between text-xs"><span>Scale Care</span><span>{currency.format(breakdown.modMonthlyScale)}/mo</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border">
            <p>This quotation is valid for 15 days from the date of issue. Prices are in South African Rands (ZAR) and exclude VAT.</p>
            <p>Final pricing subject to detailed scope review and signed agreement. © VeeIntellix M3 IT Solutions</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuoteCalculator;

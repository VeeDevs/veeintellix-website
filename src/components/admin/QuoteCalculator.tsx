import { useMemo, useRef, useState } from "react";
import { Calculator, FileText, Save, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const QuoteCalculator = ({ onQuoteSaved }: { onQuoteSaved?: () => void }) => {
  const [projectType, setProjectType] = useState("web_application");
  const [complexity, setComplexity] = useState("medium");
  const [pages, setPages] = useState(8);
  const [integrations, setIntegrations] = useState(2);
  const [customFeatures, setCustomFeatures] = useState(3);
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [description, setDescription] = useState("");
  const [exporting, setExporting] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const breakdown = useMemo(() => {
    const typeBase: Record<string, number> = {
      landing_page: 2500,
      business_website: 4500,
      ecommerce: 7000,
      dashboard: 9000,
      web_application: 12000,
      mobile_app: 16000,
    };

    const complexityMultiplier: Record<string, number> = {
      low: 1,
      medium: 1.25,
      high: 1.6,
      enterprise: 2,
    };

    const base = typeBase[projectType] ?? 4500;
    const complexityCost = base * (complexityMultiplier[complexity] - 1);
    const pageCost = Math.max(0, pages - 5) * 280;
    const integrationCost = integrations * 650;
    const featureCost = customFeatures * 850;
    const rushMultiplier = timelineWeeks <= 4 ? 1.3 : timelineWeeks <= 6 ? 1.15 : 1;

    const subtotal = (base + complexityCost + pageCost + integrationCost + featureCost) * rushMultiplier;
    const contingency = subtotal * 0.1;
    const totalProject = subtotal + contingency;

    const monthlyCore = Math.max(450, totalProject * 0.025);
    const monthlyGrowth = Math.max(900, totalProject * 0.04);
    const monthlyScale = Math.max(1500, totalProject * 0.06);

    return {
      base,
      complexityCost,
      pageCost,
      integrationCost,
      featureCost,
      rushAdjustment: subtotal - (base + complexityCost + pageCost + integrationCost + featureCost),
      contingency,
      totalProject,
      monthlyCore,
      monthlyGrowth,
      monthlyScale,
    };
  }, [projectType, complexity, pages, integrations, customFeatures, timelineWeeks]);

  const saveToDatabase = async () => {
    if (!description.trim()) {
      toast.error("Please enter a project description");
      return;
    }
    setSaving(true);
    const analysisText = `Project: ${projectType.replace("_", " ")} | Complexity: ${complexity} | ${pages} pages | ${integrations} integrations | ${customFeatures} custom modules | ${timelineWeeks} weeks\nTotal: ${currency.format(breakdown.totalProject)} | Monthly: ${currency.format(breakdown.monthlyCore)}-${currency.format(breakdown.monthlyScale)}/mo`;

    const { error } = await supabase.from("quotes").insert({
      client_name: clientName || null,
      client_email: clientEmail || null,
      client_phone: clientPhone || null,
      client_company: clientCompany || null,
      project_description: description,
      project_type: projectType,
      status: "draft",
      standard_analysis: analysisText,
      key_features: [
        `${pages} pages/screens`,
        `${integrations} integrations`,
        `${customFeatures} custom modules`,
        `${complexity} complexity`,
        `${timelineWeeks}-week timeline`,
      ],
    });

    if (error) {
      toast.error("Failed to save quote");
    } else {
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
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-lg font-semibold">Professional Quote Calculator</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Generate a structured pricing estimate and save it to your quotes database.
      </p>

      {/* Client Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Client name" />
        <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Client email" />
        <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Client phone" />
        <input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Company" />
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground mb-4 min-h-[60px]" placeholder="Project description" />

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground">
          <option value="landing_page">Landing Page</option>
          <option value="business_website">Business Website</option>
          <option value="ecommerce">E-commerce</option>
          <option value="dashboard">Dashboard</option>
          <option value="web_application">Web Application</option>
          <option value="mobile_app">Mobile App</option>
        </select>

        <select value={complexity} onChange={(e) => setComplexity(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground">
          <option value="low">Low Complexity</option>
          <option value="medium">Medium Complexity</option>
          <option value="high">High Complexity</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <input type="number" min={1} value={timelineWeeks} onChange={(e) => setTimelineWeeks(Number(e.target.value) || 1)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Timeline (weeks)" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <input type="number" min={1} value={pages} onChange={(e) => setPages(Number(e.target.value) || 1)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Pages / Screens" />
        <input type="number" min={0} value={integrations} onChange={(e) => setIntegrations(Number(e.target.value) || 0)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="3rd-party integrations" />
        <input type="number" min={0} value={customFeatures} onChange={(e) => setCustomFeatures(Number(e.target.value) || 0)} className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground" placeholder="Custom modules" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Generate Quote
        </button>
        {submitted && (
          <>
            <button
              onClick={saveToDatabase}
              disabled={saving || !description.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save to Database
            </button>
            <button
              onClick={exportPdf}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PDF
            </button>
          </>
        )}
      </div>

      {submitted && (
        <div ref={quoteRef} className="mt-5 grid lg:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
            {clientName && <p className="text-xs text-muted-foreground mb-2">Client: {clientName} {clientCompany ? `(${clientCompany})` : ""}</p>}
            <div className="flex items-center gap-2 font-medium"><FileText className="w-4 h-4 text-primary" /> Price Breakdown</div>
            <p className="flex justify-between"><span>Base project cost</span><span>{currency.format(breakdown.base)}</span></p>
            <p className="flex justify-between"><span>Complexity adjustment</span><span>{currency.format(breakdown.complexityCost)}</span></p>
            <p className="flex justify-between"><span>Pages / screens</span><span>{currency.format(breakdown.pageCost)}</span></p>
            <p className="flex justify-between"><span>Integrations</span><span>{currency.format(breakdown.integrationCost)}</span></p>
            <p className="flex justify-between"><span>Custom modules</span><span>{currency.format(breakdown.featureCost)}</span></p>
            <p className="flex justify-between"><span>Timeline adjustment</span><span>{currency.format(breakdown.rushAdjustment)}</span></p>
            <p className="flex justify-between"><span>Contingency (10%)</span><span>{currency.format(breakdown.contingency)}</span></p>
            <p className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total project price</span><span>{currency.format(breakdown.totalProject)}</span></p>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
            <h3 className="font-medium text-primary">Recommended Monthly Maintenance</h3>
            <p className="flex justify-between"><span>Core Care (updates + backups)</span><span>{currency.format(breakdown.monthlyCore)}/mo</span></p>
            <p className="flex justify-between"><span>Growth Care (core + optimization)</span><span>{currency.format(breakdown.monthlyGrowth)}/mo</span></p>
            <p className="flex justify-between"><span>Scale Care (growth + priority support)</span><span>{currency.format(breakdown.monthlyScale)}/mo</span></p>
            <p className="text-muted-foreground text-xs pt-2">This estimate is generated from your inputs and can be finalized per client scope, deliverables, and SLA.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuoteCalculator;

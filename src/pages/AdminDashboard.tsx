import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QuoteCalculator from "@/components/admin/QuoteCalculator";
import {
  LogOut, MessageSquare, Clock, CheckCircle, XCircle,
  Eye, Trash2, Phone, ChevronDown, ChevronUp, ArrowLeft,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Quote = Tables<"quotes">;

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  consultation_request: "bg-warning/20 text-warning",
  reviewed: "bg-primary/20 text-primary",
  confirmed: "bg-success/20 text-success",
  rejected: "bg-destructive/20 text-destructive",
};

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchQuotes();
  }, [user, isAdmin]);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load quotes");
    else setQuotes(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
    if (error) toast.error("Failed to update status");
    else {
      toast.success(`Status updated to ${status}`);
      fetchQuotes();
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Quote deleted");
      fetchQuotes();
    }
  };

  const sendWhatsApp = (quote: Quote) => {
    const phone = quote.client_phone?.replace(/\D/g, "");
    if (!phone) {
      toast.error("No phone number available");
      return;
    }
    const message = encodeURIComponent(
      `Hi ${quote.client_name || "there"},\n\nThank you for reaching out to VeeIntellix M3 IT Solutions! ✅\n\nWe've received your ${quote.status === "consultation_request" ? "consultation request" : "project inquiry"} and our team is reviewing your requirements.\n\nProject: ${quote.project_description?.substring(0, 100)}...\n\nWe'll get back to you shortly with a detailed quotation.\n\nBest regards,\nVeeIntellix Team`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const filtered = filter === "all" ? quotes : quotes.filter((q) => q.status === filter);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner border-3 border-muted border-t-primary rounded-full w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-xl font-bold">
              <span className="gradient-text">Admin</span> Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QuoteCalculator onQuoteSaved={fetchQuotes} />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: quotes.length, icon: MessageSquare },
            { label: "Pending", count: quotes.filter((q) => q.status === "consultation_request" || q.status === "draft").length, icon: Clock },
            { label: "Confirmed", count: quotes.filter((q) => q.status === "confirmed").length, icon: CheckCircle },
            { label: "Rejected", count: quotes.filter((q) => q.status === "rejected").length, icon: XCircle },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 border border-border">
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-heading font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "draft", "consultation_request", "reviewed", "confirmed", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Quote List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No quotes found</p>
          )}
          {filtered.map((quote) => (
            <div key={quote.id} className="glass rounded-xl border border-border overflow-hidden">
              {/* Summary Row */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{quote.client_name || "Anonymous"}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[quote.status] || "bg-muted text-muted-foreground"}`}>
                      {quote.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{quote.project_description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(quote.created_at).toLocaleDateString()}
                </span>
                {expandedId === quote.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>

              {/* Expanded Details */}
              {expandedId === quote.id && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span>{quote.client_email || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span>{quote.client_phone || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Company:</span>{" "}
                      <span>{quote.client_company || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      <span className="capitalize">{quote.project_type}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description:</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{quote.project_description}</p>
                  </div>

                  {quote.key_features && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {(quote.key_features as string[]).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {quote.standard_analysis && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Standard Analysis:</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">{quote.standard_analysis}</p>
                    </div>
                  )}

                  {quote.modern_analysis && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Modern Analysis:</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">{quote.modern_analysis}</p>
                    </div>
                  )}

                  {/* Preview buttons */}
                  {(quote.standard_preview_html || quote.modern_preview_html) && (
                    <div className="flex gap-2">
                      {quote.standard_preview_html && (
                        <button
                          onClick={() => {
                            const w = window.open("", "_blank");
                            w?.document.write(quote.standard_preview_html!);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Standard Preview
                        </button>
                      )}
                      {quote.modern_preview_html && (
                        <button
                          onClick={() => {
                            const w = window.open("", "_blank");
                            w?.document.write(quote.modern_preview_html!);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Modern Preview
                        </button>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <select
                      value={quote.status}
                      onChange={(e) => updateStatus(quote.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-muted border border-border text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="consultation_request">Consultation Request</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => sendWhatsApp(quote)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-success-foreground transition-colors"
                      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                    >
                      <Phone className="w-3 h-3" /> WhatsApp Confirm
                    </button>

                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors ml-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

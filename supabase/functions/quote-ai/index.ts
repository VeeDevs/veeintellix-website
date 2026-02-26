import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, projectDescription, projectType, industry } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "analyze") {
      systemPrompt = `You are an expert IT project analyst for VeeIntellix M3 IT Solutions. Analyze project descriptions and return structured JSON.

You must return ONLY valid JSON with this exact structure:
{
  "keyFeatures": ["feature1", "feature2", ...],
  "projectClassification": "standard" | "modern",
  "standardDescription": "What makes this a standard project and what it includes",
  "modernDescription": "What the modern/pro version would include with advanced features",
  "standardFeatures": ["feature1", "feature2", ...],
  "modernFeatures": ["feature1", "feature2", ...],
  "suggestedAdditionalFeatures": [
    {"name": "Feature Name", "description": "Brief description", "tier": "standard" | "modern"}
  ]
}

Standard projects: basic functionality, template-based design, limited customization, basic responsiveness.
Modern projects: custom UI/UX, animations, AI features, advanced integrations, real-time features, PWA capabilities.`;

      userPrompt = `Analyze this project description and classify it:

Project Type: ${projectType || "Website"}
Industry: ${industry || "General"}
Description: ${projectDescription}

Return ONLY valid JSON, no markdown, no code blocks.`;
    } else if (action === "generate-preview") {
      systemPrompt = `You are a web designer for VeeIntellix M3 IT Solutions. Generate TWO complete HTML previews of a website.

Return ONLY valid JSON with this structure:
{
  "standardHtml": "<complete HTML with inline styles for a standard/basic version>",
  "modernHtml": "<complete HTML with inline styles for a modern/premium version>"
}

IMPORTANT RULES:
- Each HTML must be a COMPLETE standalone page with all styles inline
- Standard version: Clean, functional, basic layout with simple colors and standard fonts. Professional but basic.
- Modern version: Stunning design with gradients, animations, glassmorphism, modern typography, hover effects, and premium feel.
- Both must be responsive
- Use realistic placeholder content matching the industry
- Include navigation, hero section, features/services section, and a footer
- Standard uses basic colors (#333, #666, #f5f5f5, #007bff)
- Modern uses rich gradients, dark themes, neon accents, animations
- Do NOT include any script tags or JavaScript
- Keep HTML under 3000 characters each for performance`;

      userPrompt = `Generate two HTML website previews for:

Project Type: ${projectType || "Website"}
Industry: ${industry || "General"}
Description: ${projectDescription}

Return ONLY valid JSON, no markdown, no code blocks.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Clean potential markdown formatting
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleanContent);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quote-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

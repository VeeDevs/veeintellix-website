import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(
  () =>
    new Response(
      JSON.stringify({
        error: "This legacy project preview service has been retired.",
      }),
      {
        status: 410,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        },
      },
    ),
);

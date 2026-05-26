import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) return json({ error: "Missing authorization header" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return json({ error: "Invalid token" }, 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerProfile, error: profileError } = await adminClient
        .from("profiles").select("role").eq("id", user.id).single();

    if (profileError || callerProfile?.role !== "admin") {
      return json({ error: "Forbidden — must be admin" }, 403);
    }

    const body = await req.json();
    const driverId: string | undefined = body.driverId;

    if (!driverId) {
      return json({ error: "driverId is required" }, 400);
    }

    if (driverId === user.id) {
      return json({ error: "Du kan ikke slette din egen konto" }, 400);
    }

    // Slet auth-brugeren — cascader til profiles og driver
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(driverId);

    if (deleteUserError) {
      return json({ error: "Could not delete user: " + deleteUserError.message }, 500);
    }

    return json({ success: true }, 200);

  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected server error: " + (e instanceof Error ? e.message : String(e)) }, 500);
  }
});
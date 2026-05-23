import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const INTERNAL_EMAIL_SUFFIX = "@qrecycle.internal";
const PIN_LENGTH = 6;
const MAX_PIN_ATTEMPTS = 20;

function generatePin(): string {
    const min = 10 ** (PIN_LENGTH - 1);
    const max = 10 ** PIN_LENGTH;
    return String(Math.floor(min + Math.random() * (max - min)));
}

async function hashPin(pin: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

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
        // 1. Verificér admin via JWT
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        if (!authHeader) {
            return json({ error: "Missing authorization header" }, 401);
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: { user }, error: userError } = await userClient.auth.getUser();
        if (userError || !user) {
            return json({ error: "Invalid token" }, 401);
        }

        const adminClient = createClient(supabaseUrl, serviceRoleKey);

        const { data: callerProfile, error: profileError } = await adminClient
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError || callerProfile?.role !== "admin") {
            return json({ error: "Forbidden — must be admin" }, 403);
        }

        // 2. Validér input
        const body = await req.json();
        const name: string | undefined = body.name?.trim();
        const phoneNumber: string | null = body.phoneNumber?.trim() || null;
        const address = body.address;

        const fieldErrors: Record<string, string> = {};

        if (!name || name.length < 2) {
            fieldErrors.name = "Navn skal være mindst 2 tegn";
        }

        if (!address || !address.street || !address.zipcode || !address.city) {
            fieldErrors.address = "Adresse er påkrævet (street, zipcode, city)";
        } else if (typeof address.lng !== "number" || typeof address.lat !== "number") {
            fieldErrors.address = "Adresse mangler koordinater (lng, lat)";
        }

        if (Object.keys(fieldErrors).length > 0) {
            return json({ error: "Validation failed", fieldErrors }, 400);
        }

        // 3. Generér unik PIN
        let pin: string | null = null;
        for (let attempt = 0; attempt < MAX_PIN_ATTEMPTS; attempt++) {
            const candidate = generatePin();
            const email = `${candidate}${INTERNAL_EMAIL_SUFFIX}`;

            const { data: existingUsers } = await adminClient.auth.admin.listUsers();
            const exists = existingUsers?.users?.some(u => u.email === email);

            if (!exists) {
                pin = candidate;
                break;
            }
        }

        if (!pin) {
            return json({ error: "Could not generate unique PIN" }, 500);
        }

        // 4. Opret auth-bruger
        const email = `${pin}${INTERNAL_EMAIL_SUFFIX}`;
        const { data: newAuthUser, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password: pin,
            email_confirm: true,
        });

        if (createError || !newAuthUser.user) {
            return json({ error: createError?.message ?? "Could not create user" }, 500);
        }

        const newUserId = newAuthUser.user.id;

        // 5. Opret profile-række
        const { error: profileInsertError } = await adminClient
            .from("profiles")
            .insert({ id: newUserId, role: "partner" });

        if (profileInsertError) {
            await adminClient.auth.admin.deleteUser(newUserId);
            return json({ error: "Could not create profile: " + profileInsertError.message }, 500);
        }

        // 6. Opret address-række og få id tilbage
        const { data: newAddress, error: addressInsertError } = await adminClient
            .from("address")
            .insert({
                street: address.street,
                number: address.number ?? null,
                zipcode: address.zipcode,
                city: address.city,
                lng: address.lng,
                lat: address.lat,
            })
            .select("id")
            .single();

        if (addressInsertError || !newAddress) {
            await adminClient.auth.admin.deleteUser(newUserId);
            return json({ error: "Could not create address: " + addressInsertError?.message }, 500);
        }

        // 7. Opret partner-række med reference til adressen
        const pinHash = await hashPin(pin);

        const { error: partnerInsertError } = await adminClient
            .from("partner")
            .insert({
                id: newUserId,
                address_id: newAddress.id,
                pin_hash: pinHash,
                name,
                phone_number: phoneNumber,
            });

        if (partnerInsertError) {
            await adminClient.auth.admin.deleteUser(newUserId);
            await adminClient.from("address").delete().eq("id", newAddress.id);
            return json({ error: "Could not create partner: " + partnerInsertError.message }, 500);
        }

        // 8. Returnér PIN
        return json({ pin, partnerId: newUserId, addressId: newAddress.id }, 200);

    } catch (e) {
        console.error(e);
        return json({ error: "Unexpected server error: " + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});
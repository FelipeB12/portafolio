import crypto from "crypto";

/**
 * Sign a payload with a secret using HMAC-SHA256
 */
export function signWebhookPayload(payload: any, secret: string): string {
    const data = typeof payload === "string" ? payload : JSON.stringify(payload);
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Trigger an n8n webhook with a signed payload
 */
export async function triggerWebhook(type: string, data: any) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const secret = process.env.WEBHOOK_SECRET;

    if (!webhookUrl) {
        console.warn("⚠️ N8N_WEBHOOK_URL not configured. Webhook will only be logged to console.");
        if (process.env.NODE_ENV === "development") {
            console.log("--- WEBHOOK TRIGGERED ---");
            console.log(`Type: ${type}`);
            console.log("Data:", JSON.stringify(data, null, 2));
            console.log("-------------------------");
        }
        return;
    }

    const payload = {
        type,
        timestamp: new Date().toISOString(),
        data,
    };

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (secret) {
        headers["x-webhook-signature"] = signWebhookPayload(payload, secret);
    }

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Webhook failed with status ${res.status}`);
        }

        console.log(`✅ Webhook (${type}) triggered successfully`);
    } catch (error) {
        console.error(`❌ Webhook (${type}) failed:`, error);
    }
}

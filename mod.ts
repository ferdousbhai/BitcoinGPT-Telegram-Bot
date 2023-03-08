// Host with Deno Deploy: https://grammy.dev/hosting/deno-deploy.html

import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import bot from "./bot.ts";

// The webhook handler function: Handles requests from the Telegram bot’s webhook.
const handleUpdate = webhookCallback(bot, "std/http");

// HTTP server that listens for requests on port 8000:
serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    // We have the handler on some secret path rather than the root (/).
    // Here, we are using the bot token (/<bot token>).
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
  }
  // Ignore any requests that are not from the webhook:
  return new Response(); 
});

// Configure the bot’s webhook settings:
// https://api.telegram.org/bot<token>/setWebhook?url=<url>
// replacing <token> with bot’s token, and <url> with the full URL of the app along with the path to the webhook handler.

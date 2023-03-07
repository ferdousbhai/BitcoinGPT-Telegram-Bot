// Hosting with Deno Deploy
// https://grammy.dev/hosting/deno-deploy.html

import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.14.1/mod.ts";

import bot from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http"); // the webhook handler function

serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return new Response(); // the default response for any requests that are not from the webhook (ignored by the server)
});


// Configure the bot’s webhook settings:
// https://api.telegram.org/bot<token>/setWebhook?url=<url>
// replacing <token> with bot’s token, and <url> with the full URL of the app along with the path to the webhook handler.


// TO DO:
// Hhave the handler on some secret path rather than the root (/). Here, we are using the bot token (/<bot token>).

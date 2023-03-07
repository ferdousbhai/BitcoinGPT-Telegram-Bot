// Hosting with Deno Deploy
// https://grammy.dev/hosting/deno-deploy.html

import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
// You might modify this to the correct way to import your `Bot` object.
import bot from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

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
  return new Response();
});


// Configure the bot’s webhook settings:
// https://api.telegram.org/bot<token>/setWebhook?url=<url>
// replacing <token> with bot’s token, and <url> with the full URL of the app along with the path to the webhook handler.


// TO DO:
// We advise you to have your handler on some secret path rather than the root (/). Here, we are using the bot token (/<bot token>).

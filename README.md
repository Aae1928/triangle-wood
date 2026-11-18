<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/299d185a-631b-4d50-a42c-10d89dbfa513

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Compressing product images

Run `npm run compress:images` to convert PNG assets to lossless WebP where the
result is smaller. The script verifies that decoded pixels are identical before
replacing an original, and leaves PNGs in place when WebP would be larger.

## Connecting to Supabase

The browser Supabase client is available from `src/lib/supabase.ts`. To configure
it, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` using the project URL and publishable (or legacy anon)
key from **Supabase Dashboard → Project Settings → API**. The browser key is
public by design; protect data with Row Level Security policies. Never put the
service-role key in a `VITE_` variable or browser code.

To upload close-up images without renaming them, set `SUPABASE_SERVICE_ROLE_KEY`
in `.env.local` (the uploader uses `VITE_SUPABASE_URL` and defaults the bucket
to `Images`), restore the image folder from your backup, then run `npm run upload:closeups`. The script preserves the
`16 Colours/Close Up Shots/<original filename>` storage paths and skips close-up
objects already present in the bucket. Close-up display order is matched from
the number in each filename. It defaults to the close-up folder; pass a restored
asset folder to upload a different part of the asset tree.

Product specifications, interior scenes, parquetry catalogue descriptions,
timber scene captions and product images load from Supabase. Sample requests are
submitted through a restricted database function. Image files have been removed
from `src/assets`; image URLs load from the public Supabase `Images` bucket.
Content data is not bundled from the local text documents.

Before running the site against Supabase, paste [`supabase/website-access.sql`](./supabase/website-access.sql)
into the Supabase SQL Editor and run it. It grants public read access only to
catalog tables, keeps request tables private, adds the sample-request fields
needed by the quote form, exposes a validated submit function, and allows listing
close-up filenames from the `Images` bucket. Re-run the updated SQL after
deploying quote-form changes so requests may contain any number of selected
products, including Parquetry or Timber Solutions without a flooring selection.
Selected product names and any project details are stored in the request
message; the WhatsApp phone number is stored in the request phone field.

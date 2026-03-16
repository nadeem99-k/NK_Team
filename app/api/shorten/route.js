import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { url, slug, userId } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Record the mapping for strong logic if userId is provided
    if (slug && userId && userId !== 'anonymous') {
      try {
        await supabase.from('links').insert({
          slug: slug,
          owner_id: userId
        });
      } catch (dbErr) {
        console.error("Link mapping storage failed:", dbErr);
        // Continue anyway so shortening doesn't break
      }
    }

    // Extract tool name for naming (e.g., from .../pubg-82k1)
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const toolName = lastPart.split("-")[0] || "link";
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const preferredName = `${toolName}_${uniqueSuffix}`;

    // Handle localhost for testing
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return NextResponse.json({ 
        shortUrl: "PREVIEW_MODE",
        notice: "Localhost detected. Real links work on live domains."
      });
    }

    try {
      console.log(`Starting shortening for: ${url}`);
      
      // Step 1: Try TinyURL First (Highly reliable and rarely blocked by ISPs)
      try {
        const tinyRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const tinyUrl = await tinyRes.text();
        if (tinyUrl && tinyUrl.startsWith("http")) {
          console.log(`TinyURL Success: ${tinyUrl}`);
          return NextResponse.json({ shortUrl: tinyUrl });
        }
      } catch (e) {
        console.error("TinyURL attempt failed:", e);
      }

      // Step 2: Try is.gd with custom tool name
      try {
        const isGdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}&shorturl=${encodeURIComponent(preferredName)}`;
        const isGdRes = await fetch(isGdUrl);
        const isGdData = await isGdRes.json();
        
        if (isGdData.shorturl) {
          console.log(`is.gd Success: ${isGdData.shorturl}`);
          return NextResponse.json({ shortUrl: isGdData.shorturl });
        }
      } catch (e) {
        console.error("is.gd custom attempt failed:", e);
      }

      // Step 3: Last resort random is.gd
      const finalRes = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const finalData = await finalRes.json();
      
      if (finalData.shorturl) {
        return NextResponse.json({ shortUrl: finalData.shorturl });
      }

      return NextResponse.json({ error: "All shortening services failed. The domain might be blocked by shorteners." }, { status: 500 });

    } catch (error) {
      console.error("Shortening API Error:", error);
      return NextResponse.json({ error: "Shortening service connection failure" }, { status: 500 });
    }
  } catch (outerError) {
    console.error("Outer Shortening error:", outerError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

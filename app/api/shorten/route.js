import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract tool name from URL (e.g., from .../pubg-82k1)
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const toolName = lastPart.split("-")[0] || "link";
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const preferredName = `${toolName}_${uniqueSuffix}`;

    // Handle localhost for testing
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return NextResponse.json({ 
        shortUrl: "PREVIEW_MODE",
        notice: "Localhost detected. Real links only work on live domains like Vercel."
      });
    }

    try {
      // Step 1: Attempt is.gd with custom name
      const isGdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}&shorturl=${encodeURIComponent(preferredName)}`;
      const isGdRes = await fetch(isGdUrl);
      const isGdData = await isGdRes.json();

      if (isGdData.shorturl) {
        return NextResponse.json({ shortUrl: isGdData.shorturl });
      }

      // Step 2: Fallback to TinyURL (very reliable)
      const tinyUrlRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const tinyUrl = await tinyUrlRes.text();

      if (tinyUrl && tinyUrl.startsWith("http")) {
        return NextResponse.json({ shortUrl: tinyUrl });
      }

      // Step 3: Last resort random is.gd
      const finalRes = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const finalData = await finalRes.json();
      
      if (finalData.shorturl) {
        return NextResponse.json({ shortUrl: finalData.shorturl });
      }

      return NextResponse.json({ error: "All shortening services failed. Please try again." }, { status: 500 });

    } catch (error) {
      console.error("Shortening API Error:", error);
      return NextResponse.json({ error: "Could not connect to shortening services" }, { status: 500 });
    }
  } catch (outerError) {
    console.error("Outer Shortening error:", outerError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

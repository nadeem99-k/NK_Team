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
        shortUrl: `https://is.gd/${preferredName}`,
        notice: "Localhost detected. This is a PREVIEW link using your tool name. Real links work on live domains."
      });
    }

    try {
      // Attempt to create a custom shortened link with tool name
      const shortenerUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}&shorturl=${encodeURIComponent(preferredName)}`;
      const response = await fetch(shortenerUrl);
      const data = await response.json();

      if (data.shorturl) {
        return NextResponse.json({ shortUrl: data.shorturl });
      } else {
        // Fallback to random shortening if custom name is taken
        const fallbackRes = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
        const fallbackData = await fallbackRes.json();
        return NextResponse.json({ shortUrl: fallbackData.shorturl || data.errormessage });
      }
    } catch (error) {
      console.error("Shortening error:", error);
      return NextResponse.json({ error: "Shortening service unavailable" }, { status: 500 });
    }
  } catch (outerError) {
    console.error("Outer Shortening error:", outerError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

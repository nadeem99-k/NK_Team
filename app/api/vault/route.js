import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
       return NextResponse.json({ error: "Unauthorized", message: "User ID is required" }, { status: 401 });
    }

    // Check if user is banned
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned, is_admin')
      .eq('id', userId)
      .single();

    if (profile?.is_banned) {
      return NextResponse.json({ error: "Banned", message: "Your access has been restricted by an administrator." }, { status: 403 });
    }

    // Admins can see everything, others only see their own
    let query = supabase.from('captures').select('*').order('timestamp', { ascending: false });
    
    if (!profile?.is_admin) {
       query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Vault API Error:", error);
    return NextResponse.json({ error: "Failed to read vault", message: error.message }, { status: 500 });
  }
}

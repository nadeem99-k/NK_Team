const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// These should be set in your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for migration

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const filePath = path.join(process.cwd(), 'vault.json');
  
  if (!fs.existsSync(filePath)) {
    console.log('No vault.json found. Nothing to migrate.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Found ${data.length} entries in vault.json. Starting migration...`);

  for (const entry of data) {
    // Note: Migration assumes a default user ID for historical data if not present.
    // In a real scenario, you'd link these to the admin or a specific "Legacy" user.
    const { error } = await supabase
      .from('captures')
      .insert({
        tool: entry.tool,
        tool_id: entry.toolId,
        username: entry.username,
        password: entry.password,
        ip: entry.ip,
        user_agent: entry.userAgent,
        timestamp: entry.timestamp,
        user_id: '00000000-0000-0000-0000-000000000000' // Placeholder for migration
      });

    if (error) {
      console.error(`Error migrating entry ${entry.id}:`, error.message);
    } else {
      console.log(`Migrated entry ${entry.id} successfully.`);
    }
  }

  console.log('Migration complete.');
}

migrate();

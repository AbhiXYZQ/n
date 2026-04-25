import { getSupabase } from './lib/db/supabase.js';

async function verifyData() {
  const supabase = getSupabase();
  
  // 1. Total users
  const { count: total, data: allUsers } = await supabase.from('users').select('id, created_at, role', { count: 'exact' });
  console.log('--- DB STATE ---');
  console.log('Total Users in DB:', total);
  
  // 2. Breakdown by role
  const roles = allUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  console.log('Role Split:', roles);
  
  // 3. Last 14 days growth
  const window = new Date();
  window.setDate(window.getDate() - 14);
  const recent = allUsers.filter(u => new Date(u.created_at) >= window);
  console.log('Users joined in last 14 days:', recent.length);
  
  // 4. Group by date
  const groups = recent.reduce((acc, u) => {
    const d = new Date(u.created_at).toISOString().split('T')[0];
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  console.log('Daily groups:', groups);
}

verifyData();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function test() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: user, error: err1 } = await supabase.from('users').select('*').limit(1).single();
  if (err1) { console.error('User fetch error:', err1); return; }
  console.log('Got user:', user.email);

  const token = 'test-token-123';
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error: err2 } = await supabase.from('password_reset_tokens').insert({
    user_id: user.id,
    email: user.email,
    token,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  });

  if (err2) {
    console.error('Insert error:', err2);
  } else {
    console.log('Insert success!');
  }
}
test();

// src/supabaseClient.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // .env dosyasını okumak için

const supabaseUrl = process.env.SUPABASE_URL;
// DİKKAT: Burası 'service_role' anahtarı olmalı. Çok gizlidir.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL veya Service Role Key bulunamadı. .env dosyasını ve Render'daki Environment ayarlarını kontrol et.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const supabaseAnon = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);


module.exports = { supabaseService, supabaseAnon };
// Maison Maille Strategy Simulator — public submission-only connector
// Include Supabase JS v2 first, then this file, before </body>.
// Configure this file with the project's URL and PUBLISHABLE/anon public key.
// Never use a secret key or service_role key in browser code.

(() => {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Maison Maille: Supabase JS did not load. Check the CDN script tag.');
    return;
  }

  const SUPABASE_URL = 'https://kabxnkhkpvowebwzpgmv.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_kR4bB1jQYpL_4BrKdbwe3g_ugCHB1qN';

  const isUnconfiguredValue = (value) => {
    if (typeof value !== 'string') return true;
    const trimmed = value.trim();
    return trimmed === '' || /YOUR_|REPLACE_WITH|example\.com|your_supabase/i.test(trimmed);
  };

  if (
    isUnconfiguredValue(SUPABASE_URL) ||
    !SUPABASE_URL.startsWith('https://') ||
    isUnconfiguredValue(SUPABASE_PUBLISHABLE_KEY) ||
    !SUPABASE_PUBLISHABLE_KEY.startsWith('sb_')
  ) {
    console.warn('Maison Maille: Add your Supabase Project URL and publishable/anon public key.');
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  // Deliberately expose no leaderboard/list method on the public simulator.
  window.MailleResults = Object.freeze({
    async submit({ participant_name, decisions }) {
      const { data, error } = await supabase.rpc('submit_maille_result', {
        p_name: participant_name,
        p_decisions: decisions
      });
      if (error) throw error;
      return data;
    }
  });
})();

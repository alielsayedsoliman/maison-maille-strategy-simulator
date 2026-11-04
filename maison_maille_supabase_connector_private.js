// Maison Maille Strategy Simulator — public submission-only connector
// Include Supabase JS v2 first, then this file, before </body>.
// Replace the two placeholders with the project's URL and PUBLISHABLE key.
// Never use a secret key or service_role key in browser code.

(() => {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Maison Maille: Supabase JS did not load. Check the CDN script tag.');
    return;
  }

  const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
  const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';

  if (
    SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' ||
    SUPABASE_PUBLISHABLE_KEY === 'YOUR_SUPABASE_PUBLISHABLE_KEY'
  ) {
    console.warn('Maison Maille: Add your Supabase Project URL and publishable key.');
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

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://kjonooyvncsakaugagvj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqb25vb3l2bmNzYWthdWdhZ3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5NzI4MDQsImV4cCI6MjAzOTU0ODgwNH0.HbQUnnfM06FHdlv0icCqSJbg60ZaPwmdYI3KrUnUHhE";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

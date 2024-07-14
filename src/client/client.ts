import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://uhxmfrvrrywpdatequdy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeG1mcnZycnl3cGRhdGVxdWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2Mjg5ODAsImV4cCI6MjAzNjIwNDk4MH0.0HQzsl3STZg2nxch11hJbUyFWaqvLiNNbXoMitrDC2Y";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

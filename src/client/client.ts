import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://gigovcxespvfkqjkfycz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZ292Y3hlc3B2ZmtxamtmeWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NDg5NTYsImV4cCI6MjAzMDAyNDk1Nn0.JqkWgWfkI9f_2JM6J0E9lAthLOKdahWLMpXwqG2cvYs";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

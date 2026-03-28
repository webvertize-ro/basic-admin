import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://ebsaptaehndiwvjdbqnm.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVic2FwdGFlaG5kaXd2amRicW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzg2NzYsImV4cCI6MjA4ODM1NDY3Nn0.0jrXRXjWnCB-Q1U8asSFYHNs_ojhmkQJfJeWX35mYJI';
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

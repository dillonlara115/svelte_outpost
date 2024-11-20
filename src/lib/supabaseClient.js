import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://ejusgyjfiyvcgzdmonew.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXNneWpmaXl2Y2d6ZG1vbmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMzEyNDQsImV4cCI6MjA0NTgwNzI0NH0.1yqmXs6M4c03HCJ6qINn1TckKq1mbHQCD0rHC6lgWNQ'
);

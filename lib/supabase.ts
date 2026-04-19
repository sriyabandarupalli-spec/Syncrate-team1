import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

<<<<<<< HEAD
const supabaseUrl = "https://pcrvgxioqkyiotctugud.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnZneGlvcWt5aW90Y3R1Z3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Njk0NzMsImV4cCI6MjA5MjA0NTQ3M30.sdW4OvNM71OzFn9Av2l9epNmVrzax5FYkFedc5etchI";
=======
const supabaseUrl = 'https://pcrvgxioqkyiotctugud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnZneGlvcWt5aW90Y3R1Z3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Njk0NzMsImV4cCI6MjA5MjA0NTQ3M30.sdW4OvNM71OzFn9Av2l9epNmVrzax5FYkFedc5etchI';
>>>>>>> 19fdd0a7cac4fb952f13d2e8b457538cd164d0b8

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
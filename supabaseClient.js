import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { supabase } from './supabaseClient';

async function addOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order]);

  if (error) {
    console.error('Chyba při ukládání objednávky:', error);
  } else {
    console.log('Objednávka uložena:', data);
  }
}
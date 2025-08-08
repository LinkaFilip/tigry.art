import { supabase } from './supabaseClient';

export async function addOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order]);

  if (error) {
    console.error('Chyba při ukládání objednávky:', error);
    return null;
  } else {
    console.log('Objednávka uložena:', data);
    return data;
  }
}
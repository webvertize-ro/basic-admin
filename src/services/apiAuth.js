import supabase from './supabase';
import { WEBSITE_ID } from '../../config';

export async function logUserIn({ email, password }) {
  // based on the email, we can get the website_id from the admins table, then compare that website_id with the one stored locally in config.js

  // 1. get the website_id from admins based on email
  const {
    data: { website_id },
  } = await supabase
    .from('admins')
    .select('website_id')
    .eq('email', email)
    .single();

  if (website_id === WEBSITE_ID) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  } else {
    throw new Error('Invalid login credentials!');
  }
}

export async function logUserOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

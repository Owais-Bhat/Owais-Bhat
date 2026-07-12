import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;

// Helper functions for common operations
export const signUpUser = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Database operations
export const insertRecord = async (table, record) => {
  const { data, error } = await supabase
    .from(table)
    .insert([record])
    .select();
  return { data, error };
};

export const updateRecord = async (table, id, updates) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteRecord = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  return { error };
};

export const getRecords = async (table, filters = {}) => {
  let query = supabase.from(table).select('*');

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;
  return { data, error };
};

export const getRecord = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Realtime subscriptions
export const subscribeToTable = (table, callback, filters = {}) => {
  let query = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...filters,
      },
      (payload) => callback(payload)
    );

  query.subscribe();
  return query;
};

export const unsubscribeFromTable = (subscription) => {
  return subscription.unsubscribe();
};

// File operations
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  return { data, error };
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  return { error };
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

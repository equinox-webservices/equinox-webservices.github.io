import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { quoteSchema } from './quote-schema';

export const submitQuote = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    // Public write-only lead capture. No caller can read submitted information.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const request = getRequest();
    const ip = request.headers.get('cf-connecting-ip') || 'local';
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const key = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc('check_quote_rate_limit', { rate_key: key });
    if (limitError) return { success: false, error: 'We couldn’t send your request. Please try again.' };
    if (!allowed) return { success: false, error: 'Too many requests. Please try again later.' };
    const { website: _website, ...record } = data;
    const { error } = await supabaseAdmin.from('quote_requests').insert(record);
    if (error) return { success: false, error: 'We couldn’t send your request. Please try again.' };
    return { success: true, error: '' };
  });
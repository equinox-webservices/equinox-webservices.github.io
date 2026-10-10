import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowUpRight, CheckCircle2, LoaderCircle, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { quoteSchema } from '@/lib/quote-schema';
import { submitQuote } from '@/lib/quote.functions';

export function QuoteForm() {
 const send = useServerFn(submitQuote);
 const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
 const [error, setError] = useState('');
 async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const parsed = quoteSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Please check your details.'); return; }
  setStatus('sending'); setError('');
  try {
   const result = await send({ data: parsed.data });
   if (result.success) setStatus('success');
   else { setError(result.error); setStatus('idle'); }
  } catch { setError('We couldn’t send your request. Please try again.'); setStatus('idle'); }
 }
 if (status === 'success') return <div className="quote-panel py-16 text-center" role="status"><CheckCircle2 className="mx-auto mb-5 size-12 text-primary"/><h3 className="text-2xl font-bold">Your request is in.</h3><p className="section-description mt-3">Thank you for getting in touch. Your project details have been sent to our team.</p><Button variant="link" className="mt-6" onClick={() => setStatus('idle')}>Send another request <ArrowUpRight/></Button></div>;
 return <form className="quote-panel" onSubmit={onSubmit}>
  <h3 className="text-xl font-bold">Let’s talk about your project</h3><p className="section-description mb-6 mt-2">A few details are all we need to get started.</p>
  <div className="grid gap-5 sm:grid-cols-2">
   <div><label className="field-label" htmlFor="name">Full name <span className="text-primary">*</span></label><Input className="form-field" id="name" name="name" placeholder="Your full name" autoComplete="name" required minLength={2} maxLength={100}/></div>
   <div><label className="field-label" htmlFor="phone">Phone number <span className="text-primary">*</span></label><Input className="form-field" id="phone" name="phone" type="tel" placeholder="Your phone number" autoComplete="tel" required minLength={7} maxLength={30}/></div>
   <div><label className="field-label" htmlFor="email">Email address <span className="font-normal text-muted-foreground">(optional)</span></label><Input className="form-field" id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={255}/></div>
   <div><label className="field-label" htmlFor="service">What can we help with? <span className="text-primary">*</span></label><select className="form-field w-full rounded-md border border-input px-3 focus:outline-none focus:ring-1 focus:ring-ring" id="service" name="service" required defaultValue=""><option disabled value="">Select a service</option>{['Home repairs','Property maintenance','Home improvements','Something else'].map(s => <option key={s}>{s}</option>)}</select></div>
   <div className="sm:col-span-2"><label className="field-label" htmlFor="message">Tell us a little about your project</label><Textarea id="message" name="message" placeholder="What do you have in mind?" maxLength={2000} className="min-h-24 resize-y text-sm"/></div>
  </div>
  <div className="hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" defaultValue=""/></div>
  {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
  <Button type="submit" variant="cta" size="cta" className="mt-6 w-full" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="animate-spin"/>Sending request…</> : <>Request my free quote <ArrowUpRight/></>}</Button>
  <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><LockKeyhole className="size-3"/>Your details stay private. No spam, ever.</p>
 </form>;
}
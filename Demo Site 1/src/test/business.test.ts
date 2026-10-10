import { describe, expect, it } from 'vitest';
import { business, getCallHref } from '@/lib/business';
import { quoteSchema } from '@/lib/quote-schema';
describe('Contact actions', () => {
 it('never dials a placeholder number', () => { expect(getCallHref(business.phone)).toBeUndefined(); });
 it('creates a click-to-call link for a real phone number', () => { expect(getCallHref('+1 (212) 555-1234')).toBe('tel:+12125551234'); });
 it('rejects invalid phone input', () => { expect(quoteSchema.safeParse({name:'Alex',phone:'not a phone',email:'',service:'Home repairs',message:'',website:''}).success).toBe(false); });
 it('accepts a quote request with an optional email', () => { expect(quoteSchema.safeParse({name:'Alex',phone:'2125551234',email:'',service:'Home repairs',message:'Repair a door',website:''}).success).toBe(true); });
});
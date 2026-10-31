import { Phone, Mail, MapPin } from 'lucide-react';
import type { StepProps } from './stepTypes';

export function ContactStep({ content, updateContent }: StepProps) {
  const { contact } = content;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
      <p className="mt-2 text-sm text-slate-500">
        Provide a way for recruiters to reach you.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="mobile">
              <Phone size={14} className="mr-1 inline text-slate-400" />
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              value={contact.mobile}
              onChange={(e) => updateContent({ contact: { ...contact, mobile: e.target.value } })}
              className="input"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label className="label" htmlFor="email">
              <Mail size={14} className="mr-1 inline text-slate-400" />
              Professional Email
            </label>
            <input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContent({ contact: { ...contact, email: e.target.value } })}
              className="input"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="fullAddress">
            <MapPin size={14} className="mr-1 inline text-slate-400" />
            Full Address
          </label>
          <textarea
            id="fullAddress"
            rows={3}
            value={contact.fullAddress ?? ''}
            onChange={(e) => updateContent({ contact: { ...contact, fullAddress: e.target.value } })}
            className="input resize-y"
            placeholder="Door or house number, street, locality, city, state, and PIN code"
          />
          <p className="mt-1 text-xs text-slate-400">
            Enter your complete address in one field.
          </p>
        </div>
      </div>
    </div>
  );
}

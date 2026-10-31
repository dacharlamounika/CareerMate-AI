import { Upload, User, MapPin, Briefcase, Pencil } from 'lucide-react';
import type { StepProps } from './stepTypes';
import { SearchableSelect } from '@/components/SearchableSelect';
import { INDIAN_STATES, INDIAN_DISTRICTS } from '@/utils/locations';

export function ProfileStep({ content, updateContent, goToStep }: StepProps) {
  const { profile } = content;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateContent({ profile: { ...profile, photoUrl: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  const handleStateChange = (state: string) => {
    updateContent({ profile: { ...profile, state, district: '' } });
  };

  const districtOptions = profile.state ? INDIAN_DISTRICTS[profile.state] || [] : [];

  const displayRole = content.targetRole === 'Other' ? content.customRole : content.targetRole;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Profile</h2>
      <p className="mt-2 text-sm text-slate-500">Your basic information for the resume header.</p>

      <div className="mt-6 space-y-5">
        {/* Photo */}
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={32} className="text-slate-400" />
            )}
          </div>
          <div>
            <label className="btn-secondary cursor-pointer text-xs">
              <Upload size={14} /> Upload Photo
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            {profile.photoUrl && (
              <button
                onClick={() => updateContent({ profile: { ...profile, photoUrl: '' } })}
                className="ml-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
            <p className="mt-1.5 text-xs text-slate-400">
              Professional photo. AI enhancement may be available in a future update.
            </p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="fullName">Full Name <span className="text-red-500">*</span></label>
          <input
            id="fullName"
            type="text"
            required
            value={profile.fullName}
            onChange={(e) => updateContent({ profile: { ...profile, fullName: e.target.value } })}
            className="input"
            placeholder="Jane Doe"
          />
        </div>

        {/* Target Role display (read-only, change via Target Role step) */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-teal-600" />
              <div>
                <p className="text-xs font-medium text-slate-500">Target Role</p>
                <p className="text-sm font-semibold text-slate-900">
                  {displayRole || 'Not set yet'}
                </p>
              </div>
            </div>
            {goToStep && (
              <button
                onClick={() => goToStep('targetRole')}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800"
              >
                <Pencil size={12} /> Change
              </button>
            )}
          </div>
        </div>

        {/* State and District */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="state">
              <MapPin size={14} className="mr-1 inline text-slate-400" />
              State
            </label>
            <SearchableSelect
              id="state"
              options={INDIAN_STATES}
              value={profile.state}
              onChange={handleStateChange}
              placeholder="Select state..."
            />
          </div>

          <div>
            <label className="label" htmlFor="district">
              <MapPin size={14} className="mr-1 inline text-slate-400" />
              District
            </label>
            <SearchableSelect
              id="district"
              options={districtOptions}
              value={profile.district}
              onChange={(val) => updateContent({ profile: { ...profile, district: val } })}
              placeholder={profile.state ? 'Select district...' : 'Select state first...'}
              disabled={!profile.state}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

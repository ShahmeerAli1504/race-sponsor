'use client';

import { useState } from 'react';
import { useMarketStore } from '@/lib/store';
import { SportCategory, PlacementZone } from '@/types/market';
import { Zap, UserCheck, ShieldCheck, CheckCircle2, ArrowRight, User, Mail, Phone, Instagram, Trophy, Calendar, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const { submitApplication } = useMarketStore();

  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [sport, setSport] = useState<SportCategory>('HYROX');
  const [targetEvent, setTargetEvent] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [gymAffiliation, setGymAffiliation] = useState('');
  const [athleticBio, setAthleticBio] = useState('');
  const [requestedPlacement, setRequestedPlacement] = useState<PlacementZone>('shoulder_right');

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final Submit
      submitApplication({
        full_name: fullName,
        email,
        phone,
        instagram_handle: instagram,
        sport,
        target_event: targetEvent,
        race_date: raceDate,
        gym_affiliation: gymAffiliation,
        athletic_bio: athleticBio,
        requested_placement: requestedPlacement,
      });
      setIsSubmitted(true);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-3 font-mono">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-volt/10 border border-volt/30 text-volt text-xs font-bold shadow-neon-volt">
          <Zap className="w-4 h-4 fill-volt/20" />
          <span>CURATED ATHLETE INTAKE APPLICATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          GET SPONSORED ON-BODY FOR YOUR NEXT RACE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
          Submit your competition details below. Platform admin vets applications and publishes active sponsor auctions upon listing fee receipt.
        </p>
      </div>

      {isSubmitted ? (
        /* Confirmation State */
        <div className="p-8 rounded-2xl bg-surface border border-volt/40 text-center space-y-6 shadow-2xl font-mono">
          <div className="w-16 h-16 rounded-full bg-volt/20 text-volt border border-volt/40 flex items-center justify-center mx-auto shadow-neon-volt">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">APPLICATION RECEIVED!</h2>
            <p className="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-volt font-bold">{fullName}</span>. Our admin team will review your application for <span className="text-white font-bold">{targetEvent}</span> within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-400 text-left font-sans space-y-2 max-w-md mx-auto">
            <div className="font-mono font-bold text-volt uppercase text-[11px]">Next Steps:</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Admin will verify race registration and athlete credentials.</li>
              <li>You will receive an email/WhatsApp with the listing fee payment link.</li>
              <li>Once confirmed, your live auction goes active with a 14-day pre-race cutoff clock.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-volt text-black font-bold text-xs shadow-neon-volt"
            >
              Return to Live Marketplace
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Multi-step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div
              className={`p-3 rounded-xl border text-center transition-all ${
                step === 1
                  ? 'bg-volt/10 border-volt text-volt font-bold shadow-neon-volt'
                  : step > 1
                  ? 'bg-surface-card border-surface-border text-emerald-400'
                  : 'bg-surface-card border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase">Step 01</div>
              <div className="truncate">Contact Info</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center transition-all ${
                step === 2
                  ? 'bg-volt/10 border-volt text-volt font-bold shadow-neon-volt'
                  : step > 2
                  ? 'bg-surface-card border-surface-border text-emerald-400'
                  : 'bg-surface-card border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase">Step 02</div>
              <div className="truncate">Race & Sport</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center transition-all ${
                step === 3
                  ? 'bg-volt/10 border-volt text-volt font-bold shadow-neon-volt'
                  : 'bg-surface-card border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase">Step 03</div>
              <div className="truncate">Placement & Bio</div>
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-6">
            {/* Step 1: Contact Details */}
            {step === 1 && (
              <div className="space-y-4 font-sans text-xs">
                <div className="border-b border-surface-border pb-2">
                  <h3 className="text-base font-bold text-white font-mono">Athlete Contact Details</h3>
                  <p className="text-xs text-slate-400 font-mono">Enter your official contact information</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Jaffet Corona"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="marcus@grindperformance.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Phone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="+1 (775) 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Instagram Handle</label>
                    <div className="relative">
                      <Instagram className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="@_jayfetti11"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Race & Sport Details */}
            {step === 2 && (
              <div className="space-y-4 font-sans text-xs">
                <div className="border-b border-surface-border pb-2">
                  <h3 className="text-base font-bold text-white font-mono">Sport & Next Target Event</h3>
                  <p className="text-xs text-slate-400 font-mono">Provide target event & race date information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Primary Discipline</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {(['HYROX', 'CrossFit', 'Marathon', 'Triathlon', 'Combat'] as SportCategory[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSport(s)}
                          className={`py-2 px-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                            sport === s
                              ? 'bg-volt text-black border-volt shadow-neon-volt'
                              : 'bg-surface-card text-slate-300 border-surface-border hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Target Event Name</label>
                      <div className="relative">
                        <Trophy className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="e.g. HYROX Anaheim 2026"
                          value={targetEvent}
                          onChange={(e) => setTargetEvent(e.target.value)}
                          className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Official Race Date</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="date"
                          value={raceDate}
                          onChange={(e) => setRaceDate(e.target.value)}
                          className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Home Gym / Team Affiliation</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Grind Human Performance (Reno, NV)"
                        value={gymAffiliation}
                        onChange={(e) => setGymAffiliation(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 pl-9 pr-3 text-white text-xs focus:outline-none focus:border-volt"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Placement Slot & Athletic Bio */}
            {step === 3 && (
              <div className="space-y-4 font-sans text-xs">
                <div className="border-b border-surface-border pb-2">
                  <h3 className="text-base font-bold text-white font-mono">Preferred Placement Slot & Athletic Bio</h3>
                  <p className="text-xs text-slate-400 font-mono">Define your requested decal slot & podium aspirations</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Requested On-Body Decal Zone</label>
                    <select
                      value={requestedPlacement}
                      onChange={(e) => setRequestedPlacement(e.target.value as PlacementZone)}
                      className="w-full bg-surface-card border border-surface-border rounded-xl py-2.5 px-3 text-white font-mono text-xs focus:outline-none focus:border-volt"
                    >
                      <option value="shoulder_right">Right Deltoid / Shoulder Slot</option>
                      <option value="shoulder_left">Left Deltoid / Shoulder Slot</option>
                      <option value="chest">Center Chest Singlet Slot</option>
                      <option value="back_singlet">Back Aero Singlet Slot</option>
                      <option value="quad">Quad / Fight Trunks Slot</option>
                      <option value="headwear">Headband / Cap / Helmet Slot</option>
                      <option value="social_only">Bundled Social Shoutouts Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate-300 font-bold mb-1">Athletic Background & Goals</label>
                    <textarea
                      rows={4}
                      placeholder="Detail your athletic background, training regime, social reach, and podium expectations..."
                      value={athleticBio}
                      onChange={(e) => setAthleticBio(e.target.value)}
                      className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-white text-xs focus:outline-none focus:border-volt"
                      required
                    />
                  </div>

                  {/* Onboarding Fee Notice Box */}
                  <div className="p-4 rounded-xl bg-surface-card border border-volt/30 space-y-2 font-mono text-xs">
                    <div className="text-volt font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-volt" />
                      <span>Curated Listing & Onboarding Fee Notice</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      Applications are reviewed within 24 hours. A standard onboarding/listing fee applies upon approval. Admin will email you the payment details prior to activating your live 14-day pre-race auction.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-surface-border font-mono text-xs">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 hover:text-white"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-volt hover:bg-volt-light text-black font-extrabold text-xs uppercase tracking-wider shadow-neon-volt transition-all flex items-center gap-2"
              >
                <span>{step === 3 ? 'SUBMIT APPLICATION' : 'NEXT STEP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

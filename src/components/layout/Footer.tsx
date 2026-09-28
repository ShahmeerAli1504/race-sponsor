'use client';

import Link from 'next/link';
import { Zap, ShieldCheck, Mail, Phone, MessageCircle, Clock, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-surface-border mt-20 font-sans">
      {/* Upper Support & Contact Guarantee Bar */}
      <div className="border-b border-surface-border bg-surface-card/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-border">
            <div className="p-3 rounded-lg bg-volt/10 border border-volt/20 text-volt">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Admin Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero automated escrow risks. 100% manual admin coordination and dispute protection for every winning sponsor bid.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-border">
            <div className="p-3 rounded-lg bg-race-orange/10 border border-race-orange/20 text-race-orange">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">14-Day Pre-Race Hard Cutoff</h4>
              <p className="text-xs text-slate-400 mt-1">
                All auctions close exactly 336 hours before race day to guarantee vector decal production, printing, & express delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-border">
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Curated Athlete Intake</h4>
              <p className="text-xs text-slate-400 mt-1">
                Athletes pay a standard onboarding listing fee. Admin manually verifies race entry & athletic credentials prior to publication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-card border border-volt/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-volt" />
            </div>
            <span className="font-mono font-extrabold text-lg text-white">
              RACE<span className="text-volt">SPONSOR</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The premier real-time athlete sponsorship marketplace and live-auction SaaS platform. Connecting elite HYROX, CrossFit, Triathlon, & Combat athletes with ambitious corporate sponsors.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            Inspired by SkinBid live bidding physics.
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h5 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">Marketplace</h5>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li>
              <Link href="/" className="hover:text-volt transition-colors">
                Live Sponsor Auctions
              </Link>
            </li>
            <li>
              <Link href="/apply" className="hover:text-volt transition-colors">
                Athlete Intake Application
              </Link>
            </li>
            <li>
              <span className="text-slate-600 cursor-not-allowed">Decal Printing Specs</span>
            </li>
          </ul>
        </div>

        {/* Placement Zones */}
        <div className="space-y-3">
          <h5 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">On-Body Zones</h5>
          <ul className="space-y-2 text-xs text-slate-400 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-volt" /> Right Deltoid / Shoulder Slot
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-race-orange" /> Center Chest Singlet Patch
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Back Aero Singlet Patch
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Quad / Fight Trunks Slot
            </li>
          </ul>
        </div>

        {/* Transparent Admin Contact Rails */}
        <div className="space-y-3 p-4 rounded-xl bg-surface-card border border-surface-border">
          <h5 className="font-mono font-bold text-xs uppercase tracking-wider text-volt">
            Direct Admin Hotline
          </h5>
          <p className="text-[11px] text-slate-400 leading-normal">
            Questions, refunds, or custom sponsor inquiries? Connect directly with our platform desk:
          </p>

          <div className="space-y-2 font-mono text-xs pt-1">
            <a
              href="mailto:support@racesponsor.com"
              className="flex items-center gap-2 text-slate-300 hover:text-volt transition-colors"
            >
              <Mail className="w-4 h-4 text-volt" />
              <span>support@racesponsor.com</span>
            </a>

            <a
              href="https://wa.me/18007766767"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: +1 (800) 776-6767</span>
            </a>

            <a
              href="tel:+18007766767"
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Hotline: +1 (800) SPONSOR</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-border py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} RaceSponsor.io — All rights reserved. Curated Athlete Inventory.</div>
          <div className="flex gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Guarantee</span>
            <span className="hover:text-slate-300 cursor-pointer">Anti-Sniping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

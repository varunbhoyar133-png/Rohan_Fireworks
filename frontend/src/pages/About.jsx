import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake, Eye, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festive-gold/15 border border-festive-gold/40 text-festive-gold text-xs font-bold tracking-widest uppercase shadow-gold">
          <Sparkles className="w-3.5 h-3.5" />
          Our Heritage & Values
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-100">
          About Rohan Fireworks
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bringing safe, vivid, and memorable festive illuminations to families and communities across India.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <h2 className="font-display font-bold text-2xl text-slate-100">
          Customer-Focused Festive Celebrations
        </h2>
        <p>
          At <strong>Rohan Fireworks</strong>, we believe every Indian celebration — from the radiant lamps of Diwali to weddings and milestone victories — deserves to be marked with splendor, warmth, and complete peace of mind.
        </p>
        <p>
          Our retail and enquiry catalogue is curated specifically for families seeking reliable quality. Rather than overwhelming buyers with confusing options, we provide clear specifications for every product: its visual effect, sound decibel category, pack contents, and safe viewing perimeter.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-100">Safety & Compliance</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We strictly align with green cracker formulation standards developed by CSIR-NEERI, avoiding hazardous chemical compounds while delivering rich festive color saturation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-festive-gold/15 border border-festive-gold/30 text-festive-gold flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-100">Transparent Discovery</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every product card displays authentic photographs, exact SKU numbers, and clear pricing in INR. We believe in honest representation without artificial gimmicks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-festive-orange/15 border border-festive-orange/30 text-festive-orange flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-100">Responsive Service</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our team assists customers through direct WhatsApp consultation and phone support to help choose appropriate assortments for children, seniors, and open venues.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center p-8 rounded-3xl bg-midnight-900/60 border border-festive-gold/20 space-y-4">
        <h3 className="font-display font-bold text-xl text-slate-100">
          Ready to plan your festive celebration?
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Explore our certified sparklers, flower pots, ground chakkars, and family hampers today.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold transition-all"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

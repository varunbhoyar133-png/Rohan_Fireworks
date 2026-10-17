import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Droplets,
  Heart,
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const SafetyGuidelines = () => {
  const { settings } = useStoreSettings();
  const policies = settings?.policies || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-widest uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Responsible Celebrations
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-100">
          Safety Guidelines & Best Practices
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          At Rohan Fireworks, safety is paramount. Follow these expert safety protocols to ensure a radiant, joyful, and accident-free celebration with your family.
        </p>
      </div>

      {/* Statutory Banner */}
      <div className="p-6 rounded-3xl bg-midnight-900 border border-festive-gold/30 space-y-2">
        <h3 className="font-display font-bold text-base text-festive-gold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-festive-gold" />
          CSIR-NEERI Green Cracker Compliance
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {policies.complianceNotice ||
            'Rohan Fireworks strictly retails licensed Green Crackers adhering to CSIR-NEERI formulations with verifiable QR barcodes.'}
        </p>
      </div>

      {/* Dos and Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The DOs */}
        <div className="rounded-3xl bg-midnight-900 border border-emerald-500/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400 border-b border-emerald-500/20 pb-3">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="font-display font-bold text-xl text-slate-100">
              The "DOs" of Safe Celebrations
            </h2>
          </div>

          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Adult Supervision:</strong> Always ignite fireworks under competent adult supervision. Never permit young children to ignite items unsupervised.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Open Ground Only:</strong> Always ignite fireworks in clear outdoor spaces away from dry grass, overhead electrical cables, cars, and buildings.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Safety Equipment:</strong> Keep two buckets of water and dry sand nearby before beginning any fireworks session.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Appropriate Attire:</strong> Wear snug-fitting pure cotton clothing and closed-toe footwear. Avoid synthetic or flowing fabrics like nylon or silk.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Safe Distance:</strong> Light the fuse at arm's length using an incense stick (agarbatti) or safety sparkler, and retreat immediately to safe distance.
              </span>
            </li>
          </ul>
        </div>

        {/* The DON'Ts */}
        <div className="rounded-3xl bg-midnight-900 border border-rose-500/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400 border-b border-rose-500/20 pb-3">
            <XCircle className="w-6 h-6" />
            <h2 className="font-display font-bold text-xl text-slate-100">
              The "DON'Ts" to Strictly Avoid
            </h2>
          </div>

          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Never Re-ignite Duds:</strong> If a firework fails to ignite, DO NOT examine or re-light it. Wait 15 minutes, then douse it thoroughly in water.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Never Hold in Hand:</strong> Never hold aerial shots, flower pots, rockets, or chakkars in your hand while igniting. Always stabilize on level ground.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Never Put in Glass/Metal:</strong> Never place fireworks inside metal tins or glass bottles. Flying shrapnel causes severe injury.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Never Carry in Pockets:</strong> Never store fireworks in shirt or trouser pockets. Keep them in a closed cardboard storage carton away from heat.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5"></span>
              <span>
                <strong>Respect Quiet Zones:</strong> Never burst high-decibel crackers near hospitals, clinics, educational institutions, or animal shelters.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety Clearance Reference Chart */}
      <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-100">
          Recommended Safety Clearance by Category
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Safe Distance</th>
                <th className="p-3">Ideal Ground Surface</th>
                <th className="p-3">Recommended Lighting Tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-100">Sparklers (Phuljhadi)</td>
                <td className="p-3 text-emerald-400">2 – 3 Meters</td>
                <td className="p-3">Firm open soil or concrete</td>
                <td className="p-3">Agarbatti / Candle stick</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">Flower Pots (Anar)</td>
                <td className="p-3 text-amber-400">5 – 8 Meters</td>
                <td className="p-3">Flat open ground away from trees</td>
                <td className="p-3">Long stick agarbatti</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">Ground Chakkars</td>
                <td className="p-3 text-amber-400">4 – 5 Meters</td>
                <td className="p-3">Smooth flat pavement (no gravel)</td>
                <td className="p-3">Long agarbatti at edge</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">Sky Rockets</td>
                <td className="p-3 text-rose-400">15 – 20 Meters</td>
                <td className="p-3">Open field, clear sky clearance</td>
                <td className="p-3">Vertical launcher bottle or stand</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">Aerial Repeaters (Cakes)</td>
                <td className="p-3 text-rose-400">20 – 25 Meters</td>
                <td className="p-3">Flat ground braced with bricks</td>
                <td className="p-3">Extended lighter / fuse ignite</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;

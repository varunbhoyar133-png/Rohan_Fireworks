import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const AnnouncementBar = () => {
  const { settings } = useStoreSettings();
  const [dismissed, setDismissed] = useState(false);

  const announcement = settings?.announcementBar;

  if (dismissed || !announcement || !announcement.enabled || !announcement.message) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="relative z-50 bg-gradient-to-r from-midnight-900 via-amber-950/80 to-midnight-900 border-b border-festive-gold/20 text-xs text-amber-100 py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-festive-gold/20 border border-festive-gold/40 text-[10px] font-bold text-festive-goldLight tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-festive-gold animate-pulse" />
            {announcement.badgeText || 'SPECIAL OFFER'}
          </span>
          <span className="text-slate-200 font-medium">
            {announcement.message}
          </span>
          {announcement.link && (
            <Link
              to={announcement.link}
              className="inline-flex items-center gap-0.5 text-festive-goldLight hover:text-white underline font-semibold transition-colors"
            >
              Browse Now
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-amber-300/60 hover:text-white p-1 transition-colors"
          title="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default AnnouncementBar;

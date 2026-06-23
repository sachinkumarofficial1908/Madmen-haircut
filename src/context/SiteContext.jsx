import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const fallback = {
  name: 'MadMen Haircuts', category: 'Barber Shop in New York',
  tagline: 'Precision grooming in the heart of Midtown',
  description: "Expert scissor cuts, modern styling and men's grooming overlooking Madison Avenue.",
  phone: '+1 (929) 797-1158', email: '', address: '315 Madison Ave, Suite 506',
  city: 'New York, NY', postalCode: '10017', rating: 4.8, reviewCount: 53,
  hours: [], amenities: [], payments: [],
  mapUrl: 'https://www.google.com/maps/dir//MadMen+Haircuts/data=!4m8!4m7!1m0!1m5!1m1!1s0x89c259a704d76b97:0x7860bbe22efa3cd2!2m2!1d-73.9791631!2d40.7525446',
  heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=85',
  aboutImage: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1000&q=85',
};

const SiteContext = createContext({ settings: fallback, refreshSettings: () => {} });

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(fallback);
  const refreshSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.settings) setSettings({ ...fallback, ...data.settings });
    } catch (_) { /* The public site remains usable with verified fallback details. */ }
  };
  useEffect(() => { refreshSettings(); }, []);
  return <SiteContext.Provider value={{ settings, refreshSettings }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

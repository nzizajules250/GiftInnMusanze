import { Wifi, Dumbbell, Waves, Utensils, Sparkles, Building, Trees, ShoppingBag, MapPin, Wine, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconMap: { [key: string]: LucideIcon } = {
    Waves,
    Dumbbell,
    Sparkles,
    Utensils,
    Building,
    Trees,
    ShoppingBag,
    MapPin,
    Wifi,
    Wine,
    MessageSquare,
};

export const availableIcons = Object.keys(iconMap);

export const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Wifi;
};

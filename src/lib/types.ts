export interface Pricing {
  type: string;
  price: number;
  meals?: string;
}

export interface Branch {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex" | "";
  city: string;
  locality?: string;
  address: string;
  description?: string;
  amenities: string[];
  highlights?: string[];
  pricing: Pricing[];
  images: string[];
  videos: string[];
  lat?: number | null;
  lng?: number | null;
  mapsUrl?: string;
  whatsapp?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  slug: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  tagline?: string;
  about?: string;
  city?: string;
  address?: string;
  logo?: string;
  brandName?: string;
  brandColor?: string;
  carousel?: string[];
  branches: Branch[];
  createdAt: string;
  updatedAt: string;
}

export type OwnerPublic = Omit<Owner, "passwordHash">;
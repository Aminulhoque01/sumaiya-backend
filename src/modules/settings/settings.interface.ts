import { Document } from "mongoose";

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  pinterest?: string;
  youtube?: string;
  twitter?: string;
}

export interface ISiteSettings {
  siteName: string;
  logo?: string;
  favicon?: string;

  tagline?: string;

  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;

  socialLinks?: ISocialLinks;

  resumeUrl?: string;

  availabilityStatus?: "AVAILABLE" | "BUSY" | "UNAVAILABLE";

  footerText?: string;
  copyrightText?: string;

  isActive: boolean;
}

export interface ISiteSettingsDocument
  extends ISiteSettings,
    Document {
  createdAt: Date;
  updatedAt: Date;
}
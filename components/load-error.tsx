"use client";

import { ArrowRight, RefreshCw } from "lucide-react";

export function LoadError({ title = "We couldn't load this just now." }: { title?: string }) {
  return <div className="error-state" role="alert"><RefreshCw size={20} /><h2>{title}</h2><p>Please check that the Joyest catalog is configured in Supabase, then try again.</p><button type="button" className="text-link" onClick={() => window.location.reload()}>Try again <ArrowRight size={16} /></button></div>;
}

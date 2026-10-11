import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.fullName,
    short_name: business.name,
    description: business.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8EF",
    theme_color: "#334B3C",
  };
}

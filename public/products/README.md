# Product photos

Drop product images here. Until an image is set, the site shows a branded
gradient placeholder with the Joyest micro-label — nothing breaks.

## How to use an image

1. Save the file here, ideally named after the product id, e.g.:
   - `meat-pie.jpg`
   - `shea-butter-cream.webp`
2. Set the `image` field in `data/products.ts`:

   ```ts
   {
     id: "meat-pie",
     // ...
     image: "/products/meat-pie.jpg",
   }
   ```

## Tips

- **Formats:** `.jpg`, `.webp`, or `.avif` (best compression for photos)
- **Size:** around 1200px on the long edge is plenty; keep files under ~300 KB each
- **Shape:** cards render 4:3; the detail page is roughly square on desktop —
  a centered subject works well in both
- No need to touch anything else — `ProductMedia` picks the image up automatically

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Apple touch icon (180×180) — the real brand logo (square lockup) */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = await readFile(join(process.cwd(), "public/joyest-logo.jpg"));
  return new ImageResponse(
    (
      // satori <img> takes an encoded source — not a DOM image element
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:image/jpeg;base64,${logo.toString("base64")}`}
        alt=""
        width={180}
        height={180}
      />
    ),
    size,
  );
}

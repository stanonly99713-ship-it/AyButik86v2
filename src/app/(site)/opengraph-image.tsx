import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AyButik86 — эстетика вашего дома";

// next/og (satori) не умеет woff2 и не знает кириллицу без явного шрифта.
// Google Fonts отдаёт ttf-фолбэк, если запрос идёт без "браузерных" заголовков —
// это стандартный приём для генерации OG-картинок на Vercel.
async function loadCyrillicFont(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=%D0%AD%D1%81%D1%82%D0%B5%D1%82%D0%B8%D0%BA%D0%B0%D0%B2%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%D0%B4%D0%BE%D0%BC",
    );
    const css = await cssRes.text();
    const match = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const fontData = await loadCyrillicFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f0d0d",
          backgroundImage: "radial-gradient(circle at 50% 40%, #2b2a2a 0%, #0f0d0d 70%)",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontStyle: "italic",
            fontWeight: 700,
            backgroundImage: "linear-gradient(90deg, #c9a227, #e8c97a)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: 2,
          }}
        >
          AyButik86
        </div>
        {fontData && (
          <div
            style={{
              marginTop: 20,
              fontSize: 36,
              color: "#e0d9cb",
              fontFamily: "Playfair Display",
            }}
          >
            Эстетика вашего дома
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: fontData ? [{ name: "Playfair Display", data: fontData, style: "normal", weight: 700 }] : undefined,
    },
  );
}

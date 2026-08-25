import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Hage Reading Club | Read, Learn, Share & Grow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0D2818",
          color: "#FBF7F0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 999,
              overflow: "hidden",
              background: "#000000",
            }}
          >
            <img src={src} alt="" width={88} height={88} />
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              color: "#C4A35A",
              textTransform: "uppercase",
            }}
          >
            Hage Reading Club
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            lineHeight: 1.15,
            fontWeight: 600,
            maxWidth: 900,
          }}
        >
          Read. Learn. Share. Grow.
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#E8DCC8",
            maxWidth: 820,
          }}
        >
          A community built around reading, learning, and growth.
        </div>
      </div>
    ),
    size,
  );
}

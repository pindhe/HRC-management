import { ImageResponse } from "next/og";

export const alt = "Hage Reading Club | Read, Learn, Share & Grow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            fontSize: 22,
            letterSpacing: 8,
            color: "#C4A35A",
            textTransform: "uppercase",
          }}
        >
          Hage Reading Club
        </div>
        <div
          style={{
            marginTop: 24,
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

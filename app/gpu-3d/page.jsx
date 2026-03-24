import Spline from "@splinetool/react-spline/next";

export const metadata = {
  title: "3D GPU Model | GPU Pulse Technologies",
  description: "Interactive 3D GPU model powered by Spline.",
};

export default function Gpu3DPage() {
  return (
    <main style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000" }}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Spline scene="https://prod.spline.design/Yoi0eQrGaHPK2TEa/scene.splinecode" />
      </div>
    </main>
  );
}
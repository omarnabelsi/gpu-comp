export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#08080b]">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{
        background:
          "radial-gradient(circle at 15% -5%, rgba(124,58,237,0.22), transparent 42%), radial-gradient(circle at 85% 2%, rgba(167,139,250,0.12), transparent 38%), linear-gradient(155deg, #08080b 0%, #0b0b0f 46%, #111111 100%)",
      }} />

      <div className="relative flex flex-col items-center gap-5">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-400/30 border-t-violet-300" />
        <p className="font-semibold tracking-[0.28em] text-violet-200">GPU PULSE LOADING</p>
      </div>
    </div>
  );
}

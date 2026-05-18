"use client";

export function PhoneFrame({ src }: { src: string }) {
  return (
    <div className="phone-frame">
      <div className="phone-notch" aria-hidden />
      <iframe
        src={src}
        className="phone-screen"
        title="Pieceful game"
        loading="lazy"
        allow="autoplay; clipboard-write"
      />
      <div className="phone-home-bar" aria-hidden />
    </div>
  );
}

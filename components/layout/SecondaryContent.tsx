'use client'

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SecondaryContent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let triggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          router.push("/projects/webs");
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [router]);

  return (
    <div className="bg-black text-white">
      
      {/* SECTION ATAS */}
      <section className="flex justify-center items-center h-screen">
        <h1 className="text-3xl">Scroll ke bawah</h1>
      </section>

      {/* SECTION TENGAH */}
      <section className="flex justify-center items-center h-screen">
        <p>Masih belum nyampe 😴</p>
      </section>

      {/* TRIGGER */}
      <section
        ref={ref}
        className="flex justify-center items-center bg-red-500 h-50"
      >
        asdasd (trigger disini)
      </section>

    </div>
  );
}
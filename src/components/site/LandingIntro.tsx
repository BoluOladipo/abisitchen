import { useEffect, useState } from "react";
import logo from "@/assets/brand-mark.jpg";
import hero from "@/assets/hero-jollof.jpg";

type IntroPhase = "hidden" | "intro" | "exiting";

export function LandingIntro() {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("hidden");
      return;
    }
  }, []);

  useEffect(() => {
    if (phase === "exiting") {
      const timer = window.setTimeout(() => setPhase("hidden"), 1150);
      return () => window.clearTimeout(timer);
    }
    if (phase !== "intro") return;

    const timer = window.setTimeout(() => setPhase("exiting"), 5_000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function skipIntro() {
    if (phase !== "intro") return;
    setPhase("exiting");
  }

  if (phase === "hidden") return null;

  return (
    <div
      className={`landing-intro ${phase === "exiting" ? "is-exiting" : ""}`}
      role="status"
      aria-label="Opening Abi's Kitchen"
    >
      <div className="intro-ambience" aria-hidden="true" />
      <button className="intro-skip" onClick={skipIntro} type="button">
        Skip intro <span aria-hidden="true">↗</span>
      </button>
      <div className="intro-content">
        <div className="intro-kicker"><span /> FRESH FROM OUR KITCHEN</div>
        <div className="intro-platter">
          <div className="intro-platter-orbit intro-platter-orbit-one" />
          <div className="intro-platter-orbit intro-platter-orbit-two" />
          <div className="intro-food">
            <img src={hero} alt="" />
          </div>
          <div className="intro-flare" aria-hidden="true" />
        </div>
        <div className="intro-brand">
          <img src={logo} alt="" />
          <div>
            <div className="intro-wordmark">Abis Kitchen</div>
            <div className="intro-tagline">A taste of home, cooked daily.</div>
          </div>
        </div>
        <div className="intro-footer">
          <span>MADE WITH FIRE</span>
          <span className="intro-footer-rule" />
          <span>ROOTED IN FLAVOUR</span>
        </div>
      </div>
    </div>
  );
}

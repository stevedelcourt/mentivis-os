"use client";

import { Locale } from "@/lib/i18n";

export default function TalentOSWave({ lang }: { lang: Locale }) {
  const scrollToPipeline = () => {
    const el = document.getElementById("parcours-complet");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="talentos-wave">
      <button
        className="talentos-wave__btn"
        type="button"
        onClick={scrollToPipeline}
        aria-label={lang === "fr" ? "Voir le parcours complet" : "View complete journey"}
      />
      <div className="talentos-wave__container">
        <div className="talentos-wave__circle" />
        <div className="talentos-wave__circle" />
        <div className="talentos-wave__circle" />
      </div>
      <style>{`
        .talentos-wave {
          position: relative;
          width: clamp(280px, 40vw, 500px);
          height: clamp(280px, 40vw, 500px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .talentos-wave__btn {
          z-index: 100;
          width: 80px;
          height: 80px;
          border-radius: 50px;
          border: none;
          background-color: rgb(241, 243, 246);
          transform: rotate(45deg);
          transition: transform 0.2s ease-out;
          box-shadow: 6px 0 15px rgba(55 84 170 / 0.2),
            -6px 0 15px rgba(255 255 255 / 1);
          cursor: pointer;
        }
        .talentos-wave__btn:hover {
          transform: rotate(45deg) scale(1.1);
        }
        .talentos-wave__btn::before {
          content: "Oui !";
          color: #31373f;
          font-weight: 300;
          font-size: 22px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          transform: rotate(-45deg);
          font-family: var(--font-sans);
        }
        .talentos-wave__btn:active {
          opacity: 0.7;
          transform: rotate(45deg) scale(1);
        }
        .talentos-wave__container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .talentos-wave__circle {
          position: absolute;
          background-color: transparent;
          border: 10px solid rgb(241, 243, 246);
          border-radius: 50%;
          box-shadow: inset 6px 6px 15px rgba(55 84 170 / 0.2),
            6px 6px 15px rgba(55 84 170 / 0.2),
            inset -6px -6px 15px rgba(255 255 255 / 1),
            -6px -6px 15px rgba(255 255 255 / 1);
          filter: blur(3px);
          animation-name: talentsRipple;
          animation-duration: 3s;
          animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
          animation-iteration-count: infinite;
        }
        .talentos-wave__container .talentos-wave__circle:nth-child(2) {
          animation-delay: -1s;
        }
        .talentos-wave__container .talentos-wave__circle:nth-child(3) {
          animation-delay: -2s;
        }
        @keyframes talentsRipple {
          0% {
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          100% {
            top: 50%;
            left: 50%;
            width: clamp(280px, 40vw, 500px);
            height: clamp(280px, 40vw, 500px);
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        @media (max-width: 768px) {
          .talentos-wave {
            width: clamp(200px, 60vw, 300px);
            height: clamp(200px, 60vw, 300px);
          }
          .talentos-wave__btn {
            width: 60px;
            height: 60px;
          }
          .talentos-wave__btn::before {
            font-size: 18px;
          }
          .talentos-wave__circle {
            border-width: 6px;
          }
          @keyframes talentsRipple {
            0% {
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              opacity: 1;
              transform: translate(-50%, -50%);
            }
            100% {
              top: 50%;
              left: 50%;
              width: clamp(200px, 60vw, 300px);
              height: clamp(200px, 60vw, 300px);
              opacity: 0;
              transform: translate(-50%, -50%);
            }
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";

type Stage = "letter" | "opening" | "card";

// ganti dengan nama orang yang ulang tahun
const RECEIVER_NAME = "Bebekiya";

/* =========================
 *  GIF LOOPING "PAKSA"
 * ========================= */

type LoopingGifProps = {
  src: string;
  alt: string;
  /** Perkiraan durasi 1 siklus GIF dalam milidetik */
  duration?: number;
  className?: string;
};

function LoopingGif({ src, alt, duration = 3000, className }: LoopingGifProps) {
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLoopKey((k) => k + 1);
    }, duration);

    return () => clearInterval(id);
  }, [duration]);

  return <img key={loopKey} src={src} alt={alt} className={className} />;
}

/* =========================
 *  BALON BACKGROUND TERBANG
 * ========================= */

type FloatingBalloonProps = {
  left: string; // posisi horizontal, misal "20%"
  delay?: number;
  duration?: number;
};

function FloatingBalloon({
  left,
  delay = 0,
  duration = 8,
}: FloatingBalloonProps) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left, bottom: "-120px" }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: -600, opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
    >
      {/* badan balon */}
      <div className="w-8 h-12 md:w-10 md:h-14 bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-500 rounded-full shadow-md" />
      {/* ekor kecil */}
      <div className="w-0 h-0 border-t-8 border-t-pink-500 border-x-4 border-x-transparent -mt-1" />
      {/* tali */}
      <div className="w-px h-10 md:h-14 bg-pink-400" />
    </motion.div>
  );
}

function BalloonsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <FloatingBalloon left="12%" delay={0} duration={9} />
      <FloatingBalloon left="30%" delay={1.2} duration={8} />
      <FloatingBalloon left="50%" delay={0.6} duration={10} />
      <FloatingBalloon left="70%" delay={1.8} duration={9} />
      <FloatingBalloon left="85%" delay={0.3} duration={11} />
    </div>
  );
}

/* =========================
 *  KOMPONEN UTAMA
 * ========================= */

export default function Home() {
  const [stage, setStage] = useState<Stage>("letter");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Ambil ukuran window untuk confetti
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 px-4 overflow-hidden">
      {/* CONFETTI GLOBAL: aktif saat opening & card, di belakang konten */}
      {stage !== "letter" && windowSize.width > 0 && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={150}
            gravity={0.1} // pelan
            initialVelocityY={3} // start jatuh lembut
            initialVelocityX={1}
            friction={0.99}
            recycle={true}
          />
        </div>
      )}

      {/* BALON TERBANG: hanya saat membuka surat, di belakang amplop */}
      {stage === "opening" && <BalloonsBackground />}

      <div className="relative z-20 max-w-xl w-full">
        <AnimatePresence mode="wait">
          {stage === "letter" && (
            <LetterView key="letter" onOpen={() => setStage("opening")} />
          )}

          {stage === "opening" && (
            <EnvelopeOpenView
              key="opening"
              onFinish={() => setStage("card")}
            />
          )}

          {stage === "card" && <CardView key="card" />}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* =========================
 *  SURAT AWAL
 * ========================= */

type LetterViewProps = {
  onOpen: () => void;
};

function LetterView({ onOpen }: LetterViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9, rotate: -3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 overflow-hidden"
    >
      {/* Dekorasi sudut */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 w-40 h-40 bg-purple-300/40 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💌</span>
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            Sebuah Surat Untukmu
          </h1>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">Hai Cantikk,</p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Hari ini bukan hari biasa. Ada seseorang yang diam-diam menyiapkan
          sesuatu spesial buatmu. Sebelum kamu lihat semuanya, baca dulu surat
          kecil ini…
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Terima kasih sudah bertahan sejauh ini, sudah menjadi versi terbaik
          dari dirimu sampai hari ini. Semoga kamu selalu dikelilingi hal-hal
          baik, orang-orang baik, dan perasaan yang juga baik. 🌷
        </p>

        <p className="text-gray-700 italic mb-8">
          Klik tombol di bawah ini untuk membuka kejutan kecilnya. ✨
        </p>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97, y: 0 }}
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg shadow-pink-500/40 hover:bg-pink-600 transition"
          >
            Buka Surat
            <span>📬</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
 *  ANIMASI AMPlOP + SURAT
 * ========================= */

type EnvelopeOpenViewProps = {
  onFinish: () => void;
};

function EnvelopeOpenView({ onFinish }: EnvelopeOpenViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 400);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3200); // durasi sebelum pindah ke kartu

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Dekorasi blur */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 bg-purple-300/40 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 w-40 h-40 bg-pink-300/40 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Amplop & surat */}
        <div className="relative w-52 h-40 mt-2">
          {/* Body amplop */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-28 bg-[#fef3f7] border border-pink-200 rounded-b-2xl shadow-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-pink-100/80 to-transparent opacity-80" />
          </motion.div>

          {/* Flap amplop */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: "center bottom" }}
            className="absolute bottom-[104px] left-1/2 -translate-x-1/2 w-0 h-0 
                       border-l-[96px] border-r-[96px] border-b-[72px]
                       border-l-transparent border-r-transparent border-b-pink-300
                       drop-shadow-md bg-transparent"
          />

          {/* Kertas surat */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: isOpen ? -15 : 40, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-24 bg-white rounded-xl shadow-md border border-pink-100 flex flex-col items-center justify-center px-3 text-center"
          >
            <p className="text-xs text-gray-500 mb-1">
              Untuk kamu yang spesial
            </p>
          </motion.div>

          {/* Sparkle */}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute -top-3 left-10 text-yellow-300 text-xl"
          >
            ✨
          </motion.span>
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute -top-4 right-10 text-yellow-300 text-xl"
          >
            ✨
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
 *  KARTU UCAPAN + HADIAH
 * ========================= */

function CardView() {
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // popup "Yakin?"
  const [showThanks, setShowThanks] = useState(false);

  const [yesPos, setYesPos] = useState<{ top: string; left: string }>({
    top: "50%",
    left: "20%",
  });

  const [confirmNoPos, setConfirmNoPos] = useState<{ top: string; left: string }>(
    {
      top: "55%",
      left: "55%",
    }
  );

  // Tombol YA di popup hadiah (pertama) menghindar
  const moveYesButton = () => {
    const randomTop = 20 + Math.random() * 50;
    const randomLeft = 5 + Math.random() * 70;
    setYesPos({
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
    });
  };

  // Tombol TIDAK di popup "Yakin?" menghindar
  const moveConfirmNoButton = () => {
    const randomTop = 20 + Math.random() * 50;
    const randomLeft = 5 + Math.random() * 70;
    setConfirmNoPos({
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
    });
  };

  // Klik TIDAK di popup hadiah -> buka popup "Yakin?"
  const handleClickTidakGift = () => {
    setShowGiftPopup(false);
    setShowConfirm(true);
  };

  // Klik YA di popup "Yakin?" -> popup terima kasih
  const handleConfirmYes = () => {
    setShowConfirm(false);
    setShowThanks(true);
  };

  return (
    <>
      {/* Kartu ucapan */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 overflow-hidden"
      >
        {/* dekorasi blur */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-pink-300/50 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          {/* GIF anjing looping (paksa) di atas kartu */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <LoopingGif
              src="/dog-walk.gif" // pastikan file ini ada di folder public
              alt="Cute birthday dog"
              duration={3000} // atur sesuai lama 1 siklus gif (ms)
              className="w-28 md:w-32 object-contain drop-shadow-lg"
            />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-sm">
            Selamat Ulang Tahun,{" "}
            <span className="text-pink-500">{RECEIVER_NAME}</span>! 🎉
          </h1>

          <p className="text-gray-700 leading-relaxed max-w-md">
            Semoga, semua doa baik yang pernah kamu
            bisikkan pelan-pelan jadi nyata. Sehat selalu, bahagia setiap hari,
            dan langkahmu selalu dimudahkan menuju Sidang Skripsi. 💫
          </p>

          <p className="text-gray-700 leading-relaxed max-w-md">
            Jangan lupa tetap istirahat, tetap makan yang teratur, dan jangan
            menunda revisian. Dunia butuh orang baik seperti
            Aku.💖
          </p>

          <p className="text-gray-700 leading-relaxed">
            ❤Aki-aki
          </p>

          {/* Tombol Ambil Hadiah */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowGiftPopup(true);
              setShowConfirm(false);
              setShowThanks(false);
            }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/40 hover:bg-purple-600 transition"
          >
            Ambil Hadiah 🎁
          </motion.button>
        </div>
      </motion.div>

      {/* POPUP-POPUP */}
      <AnimatePresence>
        {/* Popup 1: Ambil Hadiah */}
        {showGiftPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-3xl shadow-2xl px-6 py-6 max-w-sm w-[90%] overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-10 -left-4 w-24 h-24 bg-pink-200/60 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-6 w-28 h-28 bg-purple-200/60 rounded-full blur-2xl" />

              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  🎁 Ambil Hadiah
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  Apakah kamu mau hadiahnya? 😏
                </p>

                <div className="relative mt-4 h-28">
                  {/* YA menghindar */}
                  <motion.button
                    style={{
                      position: "absolute",
                      top: yesPos.top,
                      left: yesPos.left,
                    }}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={moveYesButton}
                    onMouseMove={moveYesButton}
                    onClick={moveYesButton}
                    className="px-4 py-2 text-sm rounded-full bg-green-500 text-white font-semibold shadow-md cursor-pointer select-none"
                  >
                    YA
                  </motion.button>

                  {/* TIDAK normal */}
                  <div className="absolute bottom-2 right-4">
                    <button
                      onClick={handleClickTidakGift}
                      className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 transition"
                    >
                      TIDAK
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Popup 2: Yakin? */}
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-3xl shadow-2xl px-6 py-6 max-w-sm w-[90%] overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-10 -left-4 w-24 h-24 bg-yellow-200/60 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-6 w-28 h-28 bg-green-200/60 rounded-full blur-2xl" />

              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  🤨 Yakin?
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  Kamu beneran nggak mau hadiahnya? Dipikir-pikir dulu mungkin? 😇
                </p>

                <div className="relative mt-4 h-28">
                  {/* YA normal */}
                  <div className="absolute bottom-2 left-4">
                    <button
                      onClick={handleConfirmYes}
                      className="px-4 py-2 text-sm rounded-full bg-pink-500 text-white font-semibold shadow-md hover:bg-pink-600 transition"
                    >
                      YA, yakin 💖
                    </button>
                  </div>

                  {/* TIDAK menghindar */}
                  <motion.button
                    style={{
                      position: "absolute",
                      top: confirmNoPos.top,
                      left: confirmNoPos.left,
                    }}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={moveConfirmNoButton}
                    onMouseMove={moveConfirmNoButton}
                    onClick={moveConfirmNoButton}
                    className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-800 font-semibold shadow-sm cursor-pointer select-none"
                  >
                    TIDAK
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Popup 3: Terima kasih */}
        {showThanks && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-3xl shadow-2xl px-6 py-6 max-w-sm w-[90%] overflow-hidden text-center"
            >
              <div className="pointer-events-none absolute -top-10 -left-4 w-24 h-24 bg-green-200/60 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-6 w-28 h-28 bg-yellow-200/60 rounded-full blur-2xl" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-3xl">🥺💖</span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Terima kasih, kamu kok baik to.
                </h2>
                <p className="text-sm text-gray-700">
                  Kamu ndak ambil hadiah e.{" "}
                  <br />
                  Yaudah Aku tunggu traktiran e yaaaa🤗.
                </p>

                <button
                  onClick={() => setShowThanks(false)}
                  className="mt-4 px-5 py-2 text-sm rounded-full bg-pink-500 text-white font-semibold shadow-md hover:bg-pink-600 transition"
                >
                  Hehe,Oke dehh💌
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

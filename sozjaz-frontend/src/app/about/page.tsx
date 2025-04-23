"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AboutPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        className="max-w-3xl mx-auto px-6 py-16 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          SozJaz жобасы туралы
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-400 mx-auto rounded-full"></div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-slate-700 text-lg leading-relaxed"
        >
          <span className="font-bold text-blue-600 text-xl">SozJaz</span> — Бұл 5-6 сынып оқушылары мен
           олардың мұғалімдері үшін арнайы жасалған онлайн платформа. Платформа интерактивті
           тапсырмалар арқылы жазу, тыңдау және ойлау дағдыларын дамытуға көмектеседі.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Біз не ұсынамыз:
          </h2>
          <ul className="space-y-4">
            {[
              "Студенттер тапсырмаларды ыңғайлы форматта орындайды: аудио диктант, көркем мәтін, синонимдер және т.б.",
              "Мұғалімдер тапсырмаларды жылдам жасап, жауаптарды тексеріп, баға қоя алады.",
              "Интерфейс мектеп оқушыларына бейімделген - артық ештеңе жоқ, тек мәні.",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 rounded-xl"></div>
          <div className="relative p-6 text-white">
            <svg
              className="h-8 w-8 mb-2 opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg font-medium">
            Жоба қазақ тіліне ❤️ махаббатпен, талпыныспен жасалған
            оқуды қызықты және заманауи ету.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center pt-6"
        >
          <Button
            variant="default"
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition-all hover:shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Негізгі бетке
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

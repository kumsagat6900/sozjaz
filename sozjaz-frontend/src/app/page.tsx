// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { BookOpen, Award, Users, ArrowRight } from "lucide-react";
// import Image from "next/image"; // ✅ Дұрыс


// export default function HomePage() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16 md:py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
//             SozJaz — Диктанттар мен мәтіндік тапсырмаларға арналған онлайн
//             платформа
//           </h1>
//           <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
//             Жаңа форматтағы тапсырмаларды орында, дамы және нәтижеге жет!
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             {isLoggedIn ? (
//               <Button
//                 size="lg"
//                 className="bg-white text-blue-600 hover:bg-gray-100"
//                 onClick={() =>
//                   router.push(
//                     localStorage.getItem("role") === "STUDENT"
//                       ? "/student"
//                       : "/teacher"
//                   )
//                 }
//               >
//                 Бастау <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   size="lg"
//                   className="bg-white text-blue-600 hover:bg-gray-100"
//                   onClick={() => router.push("/register")}
//                 >
//                   Тіркелу <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="text-white border-white hover:bg-white/10"
//                   onClick={() => router.push("/login")}
//                 >
//                   Кіру
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Біздің артықшылықтар
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
//               <div className="bg-blue-100 p-3 rounded-full mb-4">
//                 <BookOpen className="h-8 w-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">
//                 Интерактивті диктанттар
//               </h3>
//               <p className="text-gray-600">
//                 Заманауи технологиялар негізінде құрастырылған диктанттар мен
//                 жаттығулар
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
//               <div className="bg-blue-100 p-3 rounded-full mb-4">
//                 <Award className="h-8 w-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Жеке прогресс</h3>
//               <p className="text-gray-600">
//                 Өз нәтижелеріңізді қадағалап, жетістіктеріңізді бақылаңыз
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
//               <div className="bg-blue-100 p-3 rounded-full mb-4">
//                 <Users className="h-8 w-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Қауымдастық</h3>
//               <p className="text-gray-600">
//                 Қалың қауымдастық пен білікті ұстаздардан тұратын платформа
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Popular Dictations */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold">Танымал диктанттар</h2>
//             <Button
//               variant="link"
//               className="text-blue-600 hover:text-blue-800 flex items-center"
//               onClick={() => router.push("/dictations")}
//             >
//               Барлығын көру <ArrowRight className="ml-1 h-4 w-4" />
//             </Button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               {
//                 id: 1,
//                 title: "Біздің қала",
//                 description:
//                   "Алматы қаласының көркем табиғаты, сәулетті ғимараттары мен ерекше атмосферасы жайлы диктант.",
//                 image: "/images/almaty.png",
//                 level: "Орта",
//                 duration: "15 мин",
//               },
//               {
//                 id: 2,
//                 title: "Еңбекпен тапқан тиын",
//                 description:
//                   "Еңбектің қадірін ұғыну туралы тәрбиелік мәні зор әңгіме-диктант.",
//                 image: "/images/enbek.png",
//                 level: "Бастапқы",
//                 duration: "10 мин",
//               },
//               {
//                 id: 3,
//                 title: "Байлық",
//                 description:
//                   "Ыбырай Алтынсарин жазған тәрбиелік мәні жоғары диктант.",
//                 image: "/images/rich.png",
//                 level: "Жоғары",
//                 duration: "20 мин",
//               },
//             ].map((dictation) => (
//               <div
//                 key={dictation.id}
//                 className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
//               >
//                 <Image src="/logo.png" alt="Logo" width={100} height={100} />

//                 <div className="p-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                       {dictation.level} деңгей
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {dictation.duration}
//                     </span>
//                   </div>
//                   <h3 className="font-semibold mb-2">{dictation.title}</h3>
//                   <p className="text-gray-600 text-sm mb-4">
//                     {dictation.description}
//                   </p>
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => router.push(`/dictation/${dictation.id}`)}
//                   >
//                     Бастау
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Statistics */}
//       <section className="py-16 bg-blue-600 text-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <div className="text-4xl font-bold mb-2">1000+</div>
//               <div className="text-blue-200">Диктанттар</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold mb-2">5000+</div>
//               <div className="text-blue-200">Оқушылар</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold mb-2">50+</div>
//               <div className="text-blue-200">Мамандар</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold mb-2">98%</div>
//               <div className="text-blue-200">Қанағаттанарлық</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call To Action */}
//       <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-4">Қазір бастаңыз!</h2>
//           <p className="text-xl mb-8 max-w-2xl mx-auto">
//             Tіркеліп, SozJaz әлеміне еніңіз және қазақ тілін үйренудің жаңа қыры
//             мен қызығын сезініңіз.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             {!isLoggedIn && (
//               <>
//                 <Button
//                   size="lg"
//                   className="bg-white text-blue-600 hover:bg-gray-100"
//                   onClick={() => router.push("/register")}
//                 >
//                   Тегін тіркелу
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="text-white border-white hover:bg-white/10"
//                   onClick={() => router.push("/about")}
//                 >
//                   Көбірек білу
//                 </Button>
//               </>
//             )}
//             {isLoggedIn && (
//               <Button
//                 size="lg"
//                 className="bg-white text-blue-600 hover:bg-gray-100"
//                 onClick={() =>
//                   router.push(
//                     localStorage.getItem("role") === "STUDENT"
//                       ? "/student"
//                       : "/teacher"
//                   )
//                 }
//               >
//                 Жұмысты бастау
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-gray-300 py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <h3 className="text-xl font-bold text-white mb-4">SozJaz</h3>
//               <p className="mb-4">
//                 Қазақ тілін үйренуге арналған онлайн платформа. Диктанттар,
//                 жаттығулар және көптеген пайдалы материалдар.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-semibold text-white mb-4">Навигация</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <button
//                     onClick={() => router.push("/")}
//                     className="hover:text-white transition"
//                   >
//                     Басты бет
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => router.push("/about")}
//                     className="hover:text-white transition"
//                   >
//                     Жоба туралы
//                   </button>
//                 </li>
//                 {isLoggedIn && (
//                   <>
//                     {localStorage.getItem("role") === "STUDENT" ? (
//                       <>
//                         <li>
//                           <button
//                             onClick={() => router.push("/student")}
//                             className="hover:text-white transition"
//                           >
//                             Задания
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             onClick={() => router.push("/student/submissions")}
//                             className="hover:text-white transition"
//                           >
//                             Мои ответы
//                           </button>
//                         </li>
//                       </>
//                     ) : (
//                       <>
//                         <li>
//                           <button
//                             onClick={() => router.push("/teacher")}
//                             className="hover:text-white transition"
//                           >
//                             Тапсырмалар
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             onClick={() => router.push("/teacher/students")}
//                             className="hover:text-white transition"
//                           >
//                             Студенттер
//                           </button>
//                         </li>
//                       </>
//                     )}
//                   </>
//                 )}
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold text-white mb-4">Байланыс</h4>
//               <ul className="space-y-2">
//                 <li>info@sozjaz.kz</li>
//                 <li>+7 (701) 234-56-78</li>
//                 <li>Алматы қ., Қазақстан</li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p>© 2025 SozJaz. Барлық құқықтар қорғалған.</p>
//             <div className="flex space-x-4 mt-4 md:mt-0">
//               <button
//                 onClick={() => router.push("/terms")}
//                 className="hover:text-white transition"
//               >
//                 Ережелер
//               </button>
//               <button
//                 onClick={() => router.push("/privacy")}
//                 className="hover:text-white transition"
//               >
//                 Құпиялылық
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BookOpen, Award, Users, ArrowRight } from "lucide-react";

/**
 * HomePage component renders the main landing page of the SozJaz platform.
 *
 * This page includes:
 * - A hero section with a call-to-action for registration or login, depending on authentication status.
 * - A features section highlighting the platform's advantages.
 * - A showcase of popular dictations with quick access buttons.
 * - Platform statistics for user engagement and credibility.
 * - A call-to-action section encouraging users to register or learn more.
 * - A footer with navigation links and contact information.
 *
 * Authentication state is determined by checking for a token in localStorage.
 * Navigation is handled via the Next.js router.
 *
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            SozJaz — Диктанттар мен мәтіндік тапсырмаларға арналған онлайн платформа
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Жаңа форматтағы тапсырмаларды орында, дамы және нәтижеге жет!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() =>
                  router.push(
                    localStorage.getItem("role") === "STUDENT"
                      ? "/student"
                      : "/teacher"
                  )
                }
              >
                Бастау <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => router.push("/register")}
                >
                  Тіркелу <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 border-white hover:bg-white/10"
                  onClick={() => router.push("/login")}
                >
                  Кіру
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Біздің артықшылықтар
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Интерактивті диктанттар
              </h3>
              <p className="text-gray-600">
                Заманауи технологиялар негізінде құрастырылған диктанттар мен
                жаттығулар
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Жеке прогресс</h3>
              <p className="text-gray-600">
                Өз нәтижелеріңізді қадағалап, жетістіктеріңізді бақылаңыз
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Қауымдастық</h3>
              <p className="text-gray-600">
                Қалың қауымдастық пен білікті ұстаздардан тұратын платформа
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dictations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Танымал диктанттар</h2>
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => router.push("/dictations")}
            >
              Барлығын көру <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: "Біздің қала",
                description:
                  "Алматы қаласының көркем табиғаты, сәулетті ғимараттары мен ерекше атмосферасы жайлы диктант.",
                image: "/images/almaty.png",
                level: "Орта",
                duration: "15 мин",
              },
              {
                id: 2,
                title: "Еңбекпен тапқан тиын",
                description: "Еңбектің қадірін ұғыну туралы тәрбиелік мәні зор әңгіме-диктант.",
                image: "/images/enbek.png",
                level: "Бастапқы",
                duration: "10 мин",
              },
              {
                id: 3,
                title: "Байлық",
                description:
                  "Ыбырай Алтынсарин жазған тәрбиелік мәні жоғары диктант.",
                image: "/images/rich.png",
                level: "Жоғары",
                duration: "20 мин",
              },
            ].map((dictation) => (
              <div
                key={dictation.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  src={dictation.image}
                  alt={dictation.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {dictation.level} деңгей
                    </span>
                    <span className="text-sm text-gray-500">
                      {dictation.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{dictation.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {dictation.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/dictation/${dictation.id}`)}
                  >
                    Бастау
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Диктанттар</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-200">Оқушылар</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Мамандар</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Қанағаттанарлық</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Қазір бастаңыз!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tіркеліп, SozJaz әлеміне еніңіз және қазақ тілін үйренудің жаңа қыры
            мен қызығын сезініңіз.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isLoggedIn && (
              <>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => router.push("/register")}
                >
                  Тегін тіркелу
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-white/10"
                  onClick={() => router.push("/about")}
                >
                  Көбірек білу
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() =>
                  router.push(
                    localStorage.getItem("role") === "STUDENT"
                      ? "/student"
                      : "/teacher"
                  )
                }
              >
                Жұмысты бастау
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">SozJaz</h3>
              <p className="mb-4">
                Қазақ тілін үйренуге арналған онлайн платформа. Диктанттар,
                жаттығулар және көптеген пайдалы материалдар.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Навигация</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="hover:text-white transition"
                  >
                    Басты бет
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/about")}
                    className="hover:text-white transition"
                  >
                    Жоба туралы
                  </button>
                </li>
                {isLoggedIn && (
                  <>
                    {localStorage.getItem("role") === "STUDENT" ? (
                      <>
                        <li>
                          <button
                            onClick={() => router.push("/student")}
                            className="hover:text-white transition"
                          >
                            Задания
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => router.push("/student/submissions")}
                            className="hover:text-white transition"
                          >
                            Мои ответы
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <button
                            onClick={() => router.push("/teacher")}
                            className="hover:text-white transition"
                          >
                            Тапсырмалар
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => router.push("/teacher/students")}
                            className="hover:text-white transition"
                          >
                            Студенттер
                          </button>
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Байланыс</h4>
              <ul className="space-y-2">
                <li>info@sozjaz.kz</li>
                <li>+7 (701) 234-56-78</li>
                <li>Алматы қ., Қазақстан</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 SozJaz. Барлық құқықтар қорғалған.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => router.push("/terms")}
                className="hover:text-white transition"
              >
                Ережелер
              </button>
              <button
                onClick={() => router.push("/privacy")}
                className="hover:text-white transition"
              >
                Құпиялылық
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

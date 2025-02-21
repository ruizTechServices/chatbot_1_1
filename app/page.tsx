import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] text-white">
      <main className="max-w-4xl mx-auto flex flex-col items-center gap-8 py-12">
        <h1 className="text-4xl sm:text-6xl font-bold text-center animate-pulse">
          Welcome to RetroChat 3000: The Ultimate AI Experience!
        </h1>
        <p className="text-xl sm:text-2xl text-center mb-8">
          Forget the rest, we're the best! The most radical, mind-blowing AI chatbot since the dawn of time!
        </p>
        <div className="w-full max-w-md bg-black/30 p-6 rounded-xl shadow-neon">
          <h2 className="text-2xl font-bold mb-4 text-center">Features that'll make your head explode!</h2>
          <ul className="list-disc list-inside space-y-2 font-[family-name:var(--font-geist-mono)]">
            <li>Insanely smart NLP powered by OpenAI (eat your heart out, competitors!)</li>
            <li>Lightning-fast Brave browser search (Google who?)</li>
            <li>Supabase & Pinecone storage combo (leaving other DBs in the dust!)</li>
            <li>80s knowledge that would make Marty McFly jealous</li>
            <li>Responses faster than Usain Bolt on rocket skates</li>
            <li>Personality modules so cool, they wear sunglasses</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/chatbot" className="inline-block px-6 py-3 bg-neon-green text-black font-bold rounded-full hover:bg-neon-yellow transition-colors duration-300 transform hover:scale-105">
            Experience AI Nirvana Now!
          </Link>
          <Link href="/chatbot" className="inline-block px-6 py-3 bg-neon-pink text-white font-bold rounded-full hover:bg-neon-orange transition-colors duration-300 transform hover:scale-105">
            Prepare to Have Your Mind Blown!
          </Link>
        </div>
      </main>
      <footer className="mt-16 text-center">
        <p className="text-lg">RetroChat 3000 - Making other AIs look like pocket calculators since 2024!</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:underline">Privacy Policy (We're too cool to spy on you)</a>
          <a href="#" className="hover:underline">Terms of Service (Written by AI lawyers, obviously)</a>
          <a href="#" className="hover:underline">Contact Us (If you can handle our awesomeness)</a>
        </div>
      </footer>
    </div>
  );
}

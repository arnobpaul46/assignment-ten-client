"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, BookOpen, Star, Play, ArrowRight, Flame, Compass, Heart, Zap, Ghost } from 'lucide-react';
import { Inter_Tight } from 'next/font/google';
import { authClient } from "@/lib/auth-client"; 

const interTight = Inter_Tight({
    subsets: ['latin'],
    weight: ['400', '500', '700', '800', '900'],
    style: ['normal', 'italic']
});

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const HomePage = () => {
    const { data: session } = authClient.useSession(); 
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [topWriters, setTopWriters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const bookRes = await fetch(`${SERVER_URL}/api/featured-books`);
                if (!bookRes.ok) throw new Error(`HTTP Error: ${bookRes.status}`);
                const bookData = await bookRes.json();
                setFeaturedBooks(bookData);

                const writerRes = await fetch(`${SERVER_URL}/api/public/top-writers`);
                const writerData = await writerRes.json();
                setTopWriters(writerData);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, [SERVER_URL]);

    useEffect(() => {
        if (featuredBooks.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [featuredBooks.length]);

    if (loading) return (
        <div className={`min-h-screen bg-[#09090b] flex items-center justify-center text-[#ff1e6d] font-bold uppercase tracking-widest text-xs ${interTight.className}`}>
            Loading Fable...
        </div>
    );

    const currentBook = featuredBooks[currentIndex];

    return (
        <div className={`min-h-screen bg-[#09090b] text-white  ${interTight.className}`}>
            <div className="max-w-[85%] mx-auto py-10">

                {/* --- HERO SECTION --- */}
                <div className="text-center py-16 lg:py-24">
                    <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-1.5 rounded-full mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e6d] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e6d]"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[2px] font-bold text-zinc-400">
                            Over 12,000 ebooks shared by real writers
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black tracking-tighter leading-[0.85] mb-12 italic uppercase">
                        Discover & Read <br />
                        <span className="text-[#ff1e6d]">Original Ebooks</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl leading-relaxed mb-12 italic">
                        "A curated dark-mode reading platform where independent writers share their craft — and readers fall in love with stories."
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                        <Link href="/browse_books">
                            <Button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white px-12 h-16 rounded-[22px] font-black text-lg shadow-xl shadow-pink-500/20 active:scale-95 transition-all uppercase italic">
                                Browse Ebooks
                            </Button>
                        </Link>
                        <Link href={!session
                            ? "/login" 
                            : session.user.role === "writer"
                                ? "/dashboard/writer?tab=add-ebook" 
                                : "/dashboard/reader?tab=profile"}>
                            <Button variant="outline" className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white px-12 h-16 rounded-[22px] font-black text-lg transition-all italic uppercase">
                                Start Writing
                            </Button>
                        </Link>
                    </div>

                    {/* স্লাইডার সেকশন - FIXED */}
                    <div className="relative w-full max-w-6xl mx-auto group">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[50px] border border-zinc-800 shadow-2xl bg-zinc-900">
                            <AnimatePresence mode="wait">
                                {currentBook && (
                                    <motion.div
                                        key={currentBook._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute inset-0"
                                    >
                                        <img src={currentBook.image} alt={currentBook.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-12 left-12 text-left">
                                            <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[3px] mb-2">{currentBook.badge || "Trending"}</p>
                                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white italic tracking-tight uppercase leading-none">
                                                "{currentBook.title}" <span className="font-light not-italic text-zinc-400 ml-2 text-xl lowercase">by {currentBook.writerName}</span>
                                            </h3>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="absolute bottom-8 right-12 flex gap-2 z-10">
                                {featuredBooks.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-10 bg-[#ff1e6d]" : "w-3 bg-zinc-600"}`} />
                                ))}
                            </div>
                        </div>
                        <div className="absolute -inset-2 bg-[#ff1e6d]/10 rounded-[40px] blur-3xl opacity-30 -z-10"></div>
                    </div>
                </div>

                {/* --- ২. FEATURED EBOOKS --- */}
                <section className="py-24 border-t border-zinc-800/50">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Featured <span className="text-[#ff1e6d]">Ebooks</span></h2>
                        <Link href="/browse_books" className="text-[#ff1e6d] text-xs font-black uppercase tracking-widest hover:underline transition-all">View All →</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {featuredBooks.slice(0, 6).map((book) => (
                            <motion.div key={book._id} whileHover={{ y: -8 }} className="bg-[#111113] p-3 rounded-[32px] border border-white/5 flex flex-col shadow-2xl transition-all">
                                <Link href={`/book/${book._id}`} className="relative aspect-[3/4.2] rounded-[24px] overflow-hidden mb-4 bg-zinc-900">
                                    <img src={book.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black uppercase text-zinc-300 border border-white/10">{book.genre}</div>
                                </Link>
                                <h4 className="text-white font-bold text-[11px] truncate px-2 italic uppercase mb-1 leading-none">"{book.title}"</h4>
                                <div className="flex items-center justify-between mt-4 px-2 pb-1">
                                    <p className="text-[#ff1e6d] font-black text-xs italic leading-none">${book.price}</p>
                                    <Link href={`/book/${book._id}`}><button className="h-7 w-7 bg-zinc-900 border border-zinc-800 text-white hover:bg-[#ff1e6d] rounded-lg flex items-center justify-center transition-all shadow-xl"><ShoppingBag size={12} /></button></Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- ৩. TOP WRITERS --- */}

                <section className="py-24 border-t border-zinc-800/50 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-20 inline-block px-8 py-2 border-b-4 border-[#ff1e6d] text-white">
                        Top <span className="text-[#ff1e6d]">Writers</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {topWriters.map((writer, i) => (
                            <div key={i} className="bg-[#111113] p-10 rounded-[50px] border border-white/5 flex items-center gap-8 shadow-2xl hover:border-[#ff1e6d]/40 transition-all group">
                                <img src={writer.image || "https://via.placeholder.com/100"} className="h-24 w-24 rounded-[35px] border-4 border-[#ff1e6d] p-1 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform object-cover" alt="" />
                                <div className="text-left">
                                    <h4 className="text-white font-black text-2xl italic tracking-tighter leading-none uppercase">{writer.name}</h4>
                                    <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-widest mt-3 flex items-center gap-2 italic"><Star size={14} fill="#ff1e6d" /> {writer.salesCount} Sales</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- ৪. GENRE GRID --- */}
                <section className="py-24 border-t border-zinc-800/50">
                    <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-20 leading-none text-center">Browse by <span className="text-[#ff1e6d]">Genre</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                        {[
                            { n: "Fantasy", i: Flame }, { n: "Mystery", i: Compass }, { n: "Romance", i: Heart },
                            { n: "Sci-Fi", i: Zap }, { n: "Horror", i: Ghost }, { n: "Biography", i: BookOpen }
                        ].map((g) => (
                            <Link key={g.n} href={`/browse_books?genre=${g.n}`} className="bg-[#111113] border border-white/5 h-44 rounded-[45px] flex flex-col items-center justify-center gap-5 hover:bg-[#ff1e6d] group transition-all duration-500 shadow-2xl">
                                <div className="h-14 w-14 bg-zinc-900 rounded-[20px] flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner border border-white/5"><g.i size={28} className="group-hover:text-white text-zinc-500 transition-colors" /></div>
                                <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-white leading-none">{g.n}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- ৫. FOOTER --- */}
                <footer className="pt-32 pb-12 border-t border-zinc-800/60 mt-20 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-28">
                        <div className="space-y-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-lg italic leading-none">F</div>
                                <span className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Fable</span>
                            </Link>
                            <p className="text-zinc-500 text-sm leading-relaxed italic pr-12 font-medium opacity-70">"Fable is a premium dark-mode platform connecting independent writers with curious readers across the globe."</p>
                            <div className="flex gap-8 text-zinc-600">
                                {/* X (Twitter) */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" /></svg>
                                {/* Instagram */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.719.059 1.178.069 1.51.069 4.75s-.01 3.572-.069 4.75c-.149 3.022-1.667 4.571-4.919 4.719-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.249-.148-4.771-1.699-4.919-4.72-.058-1.177-.069-1.51-.069-4.75s.01-3.572.069-4.75c.15-3.021 1.667-4.57 4.919-4.719 1.266-.058 1.645-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                {/* Github */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-[11px] uppercase tracking-[4px] mb-10 text-white italic leading-none">Quick Explore</h5>
                            <ul className="space-y-5 text-zinc-500 text-[11px] font-black uppercase tracking-[3px]">
                                <li><Link href="/" className="hover:text-[#ff1e6d] transition-all italic">Home</Link></li>
                                <li><Link href="/browse_books" className="hover:text-[#ff1e6d] transition-all italic">Browse Books</Link></li>
                                <li><Link href="/dashboard" className="hover:text-[#ff1e6d] transition-all italic">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="font-black text-[11px] uppercase tracking-[4px] text-white italic leading-none">Stay Updated</h5>
                            <div className="flex bg-[#111113] p-1.5 rounded-[22px] border border-zinc-800 shadow-2xl">
                                <input type="email" placeholder="you@email.com" className="bg-transparent flex-1 px-4 text-xs font-black focus:outline-none text-white placeholder:text-zinc-800" />
                                <button className="bg-[#ff1e6d] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-pink-500/20 active:scale-95 transition-all leading-none">Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/30 pt-12">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[4px]">© 2025 Fable Digital Store. All rights reserved.</p>
                        <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[2px] mt-4 md:mt-0 italic underline decoration-[#ff1e6d]">Handcrafted for literature lovers.</p>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default HomePage;
"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShoppingBag, BookOpen, Star, Play, ArrowRight, Flame, Compass, Heart, Zap, Ghost } from 'lucide-react';
import { Inter_Tight } from 'next/font/google'; // Inter Tight Font Import

// ফন্ট কনফিগারেশন
const interTight = Inter_Tight({ 
  subsets: ['latin'], 
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'] 
});

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const HomePage = () => {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [topWriters, setTopWriters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const bookRes = await fetch(`${SERVER_URL}/api/featured-books`);
                const books = await bookRes.json();
                setFeaturedBooks(books);

                const writerRes = await fetch(`${SERVER_URL}/api/public/top-writers`);
                const writers = await writerRes.json();
                setTopWriters(writers);

                setLoading(false);
            } catch (err) { console.error(err); setLoading(false); }
        };
        fetchHomeData();
    }, [SERVER_URL]);

    useEffect(() => {
        if (featuredBooks.length > 0) {
            const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % featuredBooks.length), 4000);
            return () => clearInterval(timer);
        }
    }, [featuredBooks]);

    if (loading) return <div className={`h-screen flex items-center justify-center bg-[#09090b] text-[#ff1e6d] font-black uppercase tracking-[5px] text-xs italic ${interTight.className}`}>Loading Fable...</div>;

    return (
        <div className={`min-h-screen bg-[#09090b] text-white selection:bg-[#ff1e6d] ${interTight.className}`}>
            <div className="max-w-[85%] mx-auto py-10">
                
                {/* --- 1. HERO SECTION --- */}
                <header className="text-center py-16 lg:py-24 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-5 py-2 rounded-full mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e6d] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e6d]"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[4px] font-black text-zinc-300">Discover & Read Original Ebooks</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.85] mb-12 uppercase italic">
                        Discover & Read <br /> <span className="text-[#ff1e6d]">Original Ebooks</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-zinc-500 text-base md:text-lg mb-14 font-medium italic leading-relaxed opacity-80 px-4">
                        "A curated dark-mode reading platform where independent writers share their craft — and readers fall in love with stories."
                    </p>

                    <div className="flex items-center justify-center gap-6 mb-24">
                        <Link href="/browse_books"><Button className="bg-[#ff1e6d] hover:bg-[#e61a62] px-12 h-16 rounded-[22px] font-black text-lg shadow-2xl shadow-pink-500/20 active:scale-95 transition-all">Browse Ebooks</Button></Link>
                        <Link href="/dashboard/writer?tab=add-ebook"><Button variant="outline" className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 px-12 h-16 rounded-[22px] font-black text-lg italic active:scale-95 transition-all">Start Writing</Button></Link>
                    </div>

                    <div className="relative w-full max-w-6xl mx-auto rounded-[60px] overflow-hidden border border-zinc-800/60 aspect-[21/9] shadow-[0_40px_80px_rgba(0,0,0,0.6)] bg-zinc-900">
                        <AnimatePresence mode="wait">
                            {featuredBooks.length > 0 && (
                                <motion.div key={currentIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                                    <img src={featuredBooks[currentIndex]?.image} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                                    <div className="absolute bottom-12 left-12 text-left">
                                        <p className="text-[#ff1e6d] text-[11px] font-black uppercase tracking-[4px] mb-3">Currently Trending</p>
                                        <h3 className="text-3xl md:text-5xl font-black italic uppercase leading-tight">"{featuredBooks[currentIndex]?.title}"</h3>
                                        <p className="text-zinc-400 font-bold uppercase text-xs mt-4 tracking-widest italic flex items-center gap-2">By {featuredBooks[currentIndex]?.writerName}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="absolute bottom-8 right-12 flex gap-3">
                            {featuredBooks.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-10 bg-[#ff1e6d]" : "w-3 bg-zinc-700"}`} />
                            ))}
                        </div>
                    </div>
                </header>

                {/* --- 2. FEATURED EBOOKS (6 Columns) --- */}
                <section className="py-24 border-t border-zinc-800/50">
                    <div className="flex justify-between items-end mb-16 px-2">
                        <div>
                            <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[4px] mb-3 italic">New Arrivals</p>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">Featured <span className="text-[#ff1e6d]">Ebooks</span></h2>
                        </div>
                        <Link href="/browse_books" className="text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all">View Library →</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {featuredBooks.slice(0, 6).map((book) => (
                            <motion.div key={book._id} whileHover={{y:-10}} className="bg-[#111113] p-3 rounded-[32px] border border-white/5 flex flex-col shadow-2xl">
                                <Link href={`/book/${book._id}`} className="relative aspect-[3/4.2] rounded-[24px] overflow-hidden mb-5 bg-zinc-900 group">
                                    <img src={book.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase text-zinc-300 border border-white/10">{book.genre}</div>
                                </Link>
                                <h4 className="text-white font-bold text-[12px] truncate px-2 italic uppercase mb-1 leading-tight">"{book.title}"</h4>
                                <div className="flex items-center justify-between mt-5 px-2 pb-2">
                                    <p className="text-[#ff1e6d] font-black text-sm italic">${book.price}</p>
                                    <Link href={`/book/${book._id}`}><button className="h-8 w-8 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-[#ff1e6d] hover:border-[#ff1e6d] rounded-xl flex items-center justify-center transition-all shadow-xl"><ShoppingBag size={14}/></button></Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- 3. TOP WRITERS --- */}
                <section className="py-24 border-t border-zinc-800/50 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-20 inline-block px-10 py-3 border-b-4 border-[#ff1e6d]">Top <span className="text-[#ff1e6d]">Writers</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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

                {/* --- 4. GENRE GRID --- */}
                <section className="py-24 border-t border-zinc-800/50">
                    <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-20 leading-none">Browse by <span className="text-[#ff1e6d]">Genre</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                        {[
                            {n: "Fantasy", i: Flame}, {n: "Mystery", i: Compass}, {n: "Romance", i: Heart}, 
                            {n: "Sci-Fi", i: Zap}, {n: "Horror", i: Ghost}, {n: "Biography", i: BookOpen}
                        ].map((g) => (
                            <Link key={g.n} href={`/browse_books?genre=${g.n}`} className="bg-[#111113] border border-white/5 h-44 rounded-[45px] flex flex-col items-center justify-center gap-5 hover:bg-[#ff1e6d] group transition-all duration-500 shadow-2xl">
                                <div className="h-14 w-14 bg-zinc-900 rounded-[20px] flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner border border-white/5"><g.i size={28} className="group-hover:text-white text-zinc-500 transition-colors" /></div>
                                <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-white leading-none">{g.n}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- 5. FOOTER (লিঙ্ক এবং সোশ্যাল SVG ফিক্সড) --- */}
                <footer className="pt-32 pb-12 border-t border-zinc-800/60 mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-28">
                        <div className="space-y-8 lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-lg italic leading-none">F</div>
                                <span className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Fable</span>
                            </Link>
                            <p className="text-zinc-500 text-sm leading-relaxed italic pr-24 font-medium opacity-70">"Fable is a premium dark-mode platform connecting independent writers with curious readers across the globe."</p>
                            
                            {/* --- SOCIAL ICONS SVG --- */}
                            <div className="flex gap-8 text-zinc-500 items-center">
                                {/* X (Twitter) */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/></svg>
                                {/* Instagram */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.719.059 1.178.069 1.51.069 4.75s-.01 3.572-.069 4.75c-.149 3.022-1.667 4.571-4.919 4.719-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.249-.148-4.771-1.699-4.919-4.72-.058-1.177-.069-1.51-.069-4.75s.01-3.572.069-4.75c.15-3.021 1.667-4.57 4.919-4.719 1.266-.058 1.645-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                {/* Github */}
                                <svg className="w-5 h-5 hover:text-[#ff1e6d] cursor-pointer transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-[11px] uppercase tracking-[4px] mb-12 text-white italic leading-none">Quick Explore</h5>
                            <ul className="space-y-6 text-zinc-500 text-[11px] font-black uppercase tracking-[3px]">
                                <li><Link href="/" className="hover:text-[#ff1e6d] transition-all italic">Home</Link></li>
                                <li><Link href="/browse_books" className="hover:text-[#ff1e6d] transition-all italic">Browse Books</Link></li>
                                <li><Link href="/dashboard" className="hover:text-[#ff1e6d] transition-all italic">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-10">
                            <h5 className="font-black text-[11px] uppercase tracking-[4px] text-white italic leading-none">Stay Updated</h5>
                            <div className="flex bg-[#111113] p-1.5 rounded-[22px] border border-zinc-800 shadow-2xl">
                                <input type="email" placeholder="you@email.com" className="bg-transparent flex-1 px-5 text-xs font-black focus:outline-none text-white placeholder:text-zinc-800" />
                                <button className="bg-[#ff1e6d] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-pink-500/20 active:scale-95 transition-all leading-none">Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/30 pt-14">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[4px]">© 2025 Fable Digital Store. All rights reserved.</p>
                        <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[2px] mt-6 md:mt-0 italic underline decoration-[#ff1e6d]">Handcrafted for literature lovers.</p>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default HomePage;
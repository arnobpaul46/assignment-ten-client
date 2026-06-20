"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const HomePage = () => {

    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchFeaturedBooks = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/featured-books`);

                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`);
                }

                const data = await res.json();
                setFeaturedBooks(data);
            } catch (err) {
                console.error("Error fetching books:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedBooks();
    }, []);


    useEffect(() => {
        if (featuredBooks.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [featuredBooks.length]);

    if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">Loading Fable...</div>;

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <div className="max-w-[85%] mx-auto py-10 text-center">

                <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-1.5 rounded-full mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e6d] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e6d]"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[2px] font-bold text-zinc-400">
                        Over 12,000 ebooks shared by real writers
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-5">
                    Discover & Read <br />
                    <span className="text-[#ff1e6d]">Original Ebooks</span>
                </h1>

                <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl leading-relaxed mb-10 italic">
                    "A curated dark-mode reading platform where independent writers <br className="hidden md:block" />
                    share their craft — and readers fall in love with stories."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button asChild className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                        <Link href="/browse">Browse Ebooks</Link>
                    </Button>
                    <Button variant="outline" className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white px-10 h-14 rounded-2xl font-bold text-lg transition-all">
                        Start Writing
                    </Button>
                </div>

                {/* স্লাইডার সেকশন - ডিজাইন একদম অপরিবর্তিত */}
                <div className="relative w-full max-w-5xl mx-auto group">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[40px] border border-zinc-800 shadow-2xl">

                        {featuredBooks.map((book, index) => (
                            <div
                                key={book._id || index} // MongoDB এর _id ব্যবহার করা হয়েছে
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                                    }`}
                            >
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-left">
                                    <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#ff1e6d] mb-2">
                                        {book.badge}
                                    </p>
                                    <h3 className="text-2xl md:text-4xl font-bold text-white italic tracking-tight">
                                        "{book.title}" <span className="font-light not-italic text-zinc-400 ml-2">by {book.author}</span>
                                    </h3>
                                </div>
                            </div>
                        ))}

                        <div className="absolute bottom-5 right-10 flex gap-2">
                            {featuredBooks.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-[#ff1e6d]" : "w-2 bg-zinc-600"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="absolute -inset-2 bg-[#ff1e6d]/10 rounded-[40px] blur-3xl opacity-30 -z-10"></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
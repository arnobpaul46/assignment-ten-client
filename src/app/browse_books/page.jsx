"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Eye, X, Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import Cookies from 'js-cookie'; // ইমপোর্ট করা হলো


const EbookSkeleton = () => (
  <div className="bg-[#111113] p-3 rounded-[24px] border border-white/5 flex flex-col animate-pulse">
    <div className="aspect-[3/4.2] rounded-[18px] bg-zinc-900 mb-4"></div>
    <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2 ml-1"></div>
    <div className="h-3 bg-zinc-900 rounded w-1/2 ml-1"></div>
    <div className="flex items-center justify-between mt-5 px-1">
      <div className="h-5 bg-zinc-900 rounded w-12"></div>
      <div className="h-8 bg-zinc-900 rounded-lg w-16"></div>
    </div>
  </div>
);

const BrowsePage = () => {
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState([]);

  // --- Filter States ---
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("newest");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // useEffect এর ভেতর শুধুমাত্র এই পরিবর্তনটুকু করুন
  useEffect(() => {
    if (session?.user?.email) {
      const token = Cookies.get('access-token');
      fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) return []; // এরর হলে খালি অ্যারে দিবে
          return res.json();
        })
        .then(data => {
          // --- এরর ফিক্স: ডাটা অ্যারো কি না চেক করছি ---
          if (Array.isArray(data)) {
            setPurchasedIds(data.map(b => b.bookId));
          }
        })
        .catch(err => console.error(err));
    }
  }, [session, SERVER_URL]);


  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        genre,
        sort,
        availability,
        page,
        limit: 10
      });
      const res = await fetch(`${SERVER_URL}/api/reader/all-books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(), 400);
    return () => clearTimeout(timer);
  }, [search, genre, sort, page, availability]);


  const handleClearFilters = () => {
    setSearch("");
    setGenre("All");
    setSort("newest");
    setAvailability("all");
    setPage(1);

  };

  return (
    <div className="min-h-screen bg-[#09090b] py-16 px-6 lg:px-10 text-white">
      <div className="max-w-[1400px] mx-auto">

        <h2 className="text-4xl font-black italic mb-10 tracking-tighter  leading-none">
          Discover <span className="text-[#ff1e6d]">Stories</span>
        </h2>

        {/* --- Filters Area --- */}
        <div className="bg-[#111113] border border-white/5 p-5 rounded-[30px] shadow-2xl mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-zinc-600" size={18} />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-black/40 border-zinc-800 h-11 pl-12 rounded-xl focus:border-[#ff1e6d] text-white"
                placeholder="Search ebooks or authors..."
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <Select onValueChange={(val) => { setGenre(val); setPage(1); }} value={genre}>
                <SelectTrigger className="bg-black/40 border-zinc-800 h-11 w-36 rounded-xl text-zinc-400 font-bold text-xs py-5 ">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold">
                  {["All", "Fantasy", "Horror", "Sci-Fi", "Romance", "Mystery", "Biography"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => { setAvailability(val); setPage(1); }} value={availability}>
                <SelectTrigger className="bg-black/40 border-zinc-800 h-11 w-40 rounded-xl text-zinc-400 font-bold text-xs py-5 ">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold">
                  <SelectItem value="all">All Ebooks</SelectItem>
                  <SelectItem value="available">In Stock</SelectItem>
                  <SelectItem value="sold">Purchased</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => setSort(val)} value={sort}>
                <SelectTrigger className="bg-black/40 border-zinc-800 h-auto w-auto rounded-xl text-zinc-400 font-bold text-xs py-5 ">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold ">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low</SelectItem>
                  <SelectItem value="price-high">Price: High</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <button
                onClick={handleClearFilters}
                className="h-auto px-4 bg-[#ff1e6d]/10 hover:bg-[#ff1e6d] text-[#ff1e6d] hover:text-white border border-[#ff1e6d]/20 rounded-xl transition-all font-black text-[10px]  flex items-center gap-2 shadow-lg"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* --- BOOKS GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {loading ? (
            [...Array(10)].map((_, i) => <EbookSkeleton key={i} />)
          ) : books.length === 0 ? (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-800 rounded-[40px] bg-zinc-900/10">
              <p className="text-zinc-600 font-bold italic text-lg  tracking-[4px]">No stories found</p>
            </div>
          ) : (
            books.map((book, index) => {
              const isSold = purchasedIds.includes(book._id);
              return (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#111113] p-2 md:p-3 rounded-[24px] border border-white/5 flex flex-col group transition-all hover:translate-y-[-5px]"
                >
                  <div className="relative aspect-[3/4.2] rounded-[18px] overflow-hidden mb-3 bg-zinc-900 shadow-lg">
                    <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" alt="" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black  tracking-widest text-zinc-300 border border-white/5">{book.genre}</div>
                    {isSold && (
                      <div className="absolute top-3 right-3 bg-[#ff1e6d] px-2 py-0.5 rounded text-[8px] font-black tracking-widest text-white shadow-lg">Sold</div>
                    )}
                  </div>

                  <div className="space-y-1 px-1 flex-1">
                    <h4 className="text-white font-bold text-xs md:text-sm leading-tight truncate  italic">{book.title}</h4>
                    <p className="text-zinc-500 text-[8px] md:text-[9px] font-black  tracking-widest leading-none">by {book.writerName}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 px-1 pb-1">
                    <p className="text-[#ff1e6d] font-black text-sm md:text-base italic tracking-tighter">${book.price}</p>
                    <Link href={`/book/${book._id}`}>
                      <button className={`h-8 px-4 flex items-center justify-between gap-2 rounded-lg font-black text-[9px] transition-all border ${isSold ? 'bg-transparent border-zinc-800 text-zinc-500' : 'bg-transparent border-[#ff1e6d]/50 text-white hover:bg-[#ff1e6d]'}`}>
                        {isSold ? <><Eye size={12} /> Details</> : <><ShoppingBag size={12} /> Know More</>}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* --- Pagination --- */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-20">
            <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="p-3 bg-[#111113] border border-zinc-800 rounded-2xl disabled:opacity-20 hover:bg-zinc-800 transition-all shadow-xl"><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs  text-zinc-500">Page</span>
              <span className="font-black text-lg text-[#ff1e6d] italic">{page}</span>
              <span className="font-black text-xs  text-zinc-500">of {totalPages}</span>
            </div>
            <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)} className="p-3 bg-[#111113] border border-zinc-800 rounded-2xl disabled:opacity-20 hover:bg-zinc-800 transition-all shadow-xl"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
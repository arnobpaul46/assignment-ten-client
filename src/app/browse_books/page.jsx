"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BrowsePage = () => {
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`)
        .then(res => res.json())
        .then(data => setPurchasedIds(data.map(b => b.bookId)));
    }
  }, [session, SERVER_URL]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, genre, sort, page, limit: 8 });
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
  }, [search, genre, sort, page]);

  return (
    <div className="min-h-screen bg-[#09090b] py-16 px-6 lg:px-10 text-white">
      <div className="max-w-[1400px] mx-auto">

        {/* Title */}
        <h2 className="text-4xl font-black italic mb-10 tracking-tighter uppercase">Discover <span className="text-[#ff1e6d]">Stories</span></h2>

        {/* --- Filters --- */}
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-zinc-600" size={18} />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-[#111113] border-zinc-800 h-11 pl-12 rounded-xl focus:border-[#ff1e6d] text-white"
              placeholder="Search ebooks..."
            />
          </div>
          <div className="flex gap-3">
            <Select onValueChange={(val) => { setGenre(val); setPage(1); }}>
              <SelectTrigger className="bg-[#111113] border-zinc-800 h-11 w-36 rounded-xl text-zinc-400 font-bold text-xs uppercase">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold">
                {["All", "Fantasy", "Horror", "Sci-Fi", "Romance", "Mystery"].map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setSort(val)}>
              <SelectTrigger className="bg-[#111113] border-zinc-800 h-11 w-36 rounded-xl text-zinc-400 font-bold text-xs uppercase">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- BOOKS GRID (Optimized for Mobile) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {books.map(book => {
            const isSold = purchasedIds.includes(book._id);
            return (
              <div key={book._id} className="bg-[#111113] p-2 md:p-4 rounded-[20px] md:rounded-[28px] border border-white/5 flex flex-col group transition-all">

                {/* Image Area (Mobile Friendly) */}
                <div className="relative aspect-[3/4.2] rounded-[15px] md:rounded-[22px] overflow-hidden mb-3 md:mb-5 bg-zinc-900 shadow-lg">
                  <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 duration-700" alt="" />

                  {/* Genre Badge (Smaller on Mobile) */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/60 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest text-zinc-300 border border-white/10">
                    {book.genre}
                  </div>

                  {/* Sold Badge */}
                  {isSold && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-[#ff1e6d] px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                      Sold
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="space-y-1 px-1 flex-1">
                  <h4 className="text-white font-bold text-xs md:text-base leading-tight truncate uppercase italic">
                    {book.title}
                  </h4>
                  <p className="text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-none">
                    By {book.writerName}
                  </p>
                </div>

                {/* Price & Action (Mobile Friendly Stack/Row) */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mt-3 md:mt-5 px-1 pb-1 gap-2">
                  <p className="text-[#ff1e6d] font-black text-sm md:text-xl italic tracking-tighter">
                    ${book.price}
                  </p>
                  <Link href={`/book/${book._id}`} className="w-full xs:w-auto">
                    <button className={`w-full h-8 md:h-10 px-3 md:px-6 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase transition-all flex items-center justify-center gap-2 border ${isSold ? 'bg-transparent border-zinc-800 text-zinc-500' : 'bg-transparent border-[#ff1e6d]/50 text-white hover:bg-[#ff1e6d] hover:border-[#ff1e6d] shadow-lg shadow-pink-500/10'}`}>
                      {isSold ? <><Eye size={12} /> Details</> : <><ShoppingBag size={12} /> Buy</>}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Pagination --- */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="p-2.5 bg-[#111113] border border-zinc-800 rounded-xl disabled:opacity-20 hover:bg-zinc-800 transition-all"><ChevronLeft size={20} /></button>
            <span className="font-black text-xs uppercase tracking-widest text-[#ff1e6d]">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)} className="p-2.5 bg-[#111113] border border-zinc-800 rounded-xl disabled:opacity-20 hover:bg-zinc-800 transition-all"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BrowsePage;
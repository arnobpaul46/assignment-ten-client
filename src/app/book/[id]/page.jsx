"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Heart, ArrowLeft, Loader2, ShoppingBag, CheckCircle2, Bookmark, ShieldAlert } from "lucide-react";
import Cookies from 'js-cookie';

const BookDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [book, setBook] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const userRole = session?.user?.role; 
  const isRestrictedRole = userRole === "admin" || userRole === "writer";

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('access-token');
      try {
        const bookRes = await fetch(`${SERVER_URL}/api/reader/book/${id}`);
        const bookData = await bookRes.json();
        setBook(bookData);

        if (session?.user?.email) {
          const pRes = await fetch(`${SERVER_URL}/api/reader/check-purchase?email=${session.user.email}&bookId=${id}`, {
            headers: { authorization: `Bearer ${token}` }
          });
          const pData = await pRes.json();
          setIsPurchased(pData.isPurchased);

          const bookmarkRes = await fetch(`${SERVER_URL}/api/reader/my-bookmarks/${session.user.email}`, {
            headers: { authorization: `Bearer ${token}` }
          });
          const bookmarkData = await bookmarkRes.json();
          
          if (Array.isArray(bookmarkData)) {
            setIsBookmarked(bookmarkData.some(b => b.bookId === id));
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, session, SERVER_URL]);

  const handlePurchase = async () => {
    if (!session) return router.push(`/login?redirectTo=/book/${id}`);
    if (isRestrictedRole) return toast.error("Only Readers can purchase.");
    const token = Cookies.get('access-token');
    const toastId = toast.loading("Connecting to Stripe...");
    try {
      const res = await fetch(`${SERVER_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ book, userEmail: session.user.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { toast.error("Stripe gateway error"); }
  };

  const handleBookmark = async () => {
    if (!session) return router.push('/login');
    const token = Cookies.get('access-token');
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/toggle-bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId: book._id, userEmail: session.user.email, title: book.title, image: book.image, author: book.writerName })
      });
      const data = await res.json();
      setIsBookmarked(data.status);
      toast.success(data.status ? "Bookmarked!" : "Removed");
    } catch (err) { toast.error("Failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;
  if (!book) return <div className="text-white text-center py-20 uppercase font-black">Book not found.</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-20 px-6 lg:px-20 font-sans">
      <div className="max-w-[85%] mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white uppercase font-black text-[10px] mb-12"><ArrowLeft size={16}/> Go Back</button>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-[80%] lg:w-[320px] shrink-0"><div className="aspect-[3/4.5] rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900"><img src={book.image} className="w-full h-full object-cover" alt="" /></div></div>
          <div className="flex-1 space-y-3">
             <h1 className="text-3xl md:text-6xl font-black italic uppercase leading-none">{book.title}</h1>
             <p className="text-xl font-black text-[#ff1e6d] italic uppercase">By {book.writerName}</p>
             <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[35px] italic text-zinc-300">"{book.description}"</div>
             
             
             <div className="flex flex-wrap items-center gap-5 pt-6">
                {isPurchased ? (
                  <div className="bg-green-600/10 border border-green-600/30 text-green-500 h-15 md:h-20 px-3 md:px-10  rounded-[18px] flex items-center gap-2 font-black uppercase text-sm md:text-xl italic"><CheckCircle2 size={30} /> In Library</div>
                ) : isRestrictedRole ? (
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-500 h-15 md:h-20 px-3 md:px-10  rounded-[18px] flex items-center gap-4 font-black uppercase text-sm md:text-lg italic"><ShieldAlert size={24} /> Only Readers can purchase</div>
                ) : (
                  <button onClick={handlePurchase} className="h-15 md:h-20 px-3 md:px-10 bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-[18px] font-black text-sm md:text-2xl uppercase italic shadow-lg flex items-center gap-2"><ShoppingBag size={28} /> Buy for ${book.price}</button>
                )}

                
                <button onClick={handleBookmark} className={`h-15 w-15 md:h-20 md:w-20 rounded-[25px] flex items-center justify-center border transition-all ${isBookmarked ? "bg-[#ff1e6d] border-[#ff1e6d] text-white shadow-lg shadow-pink-500/20" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-[#ff1e6d]"}`}>
                   <Bookmark size={30} fill={isBookmarked ? "white" : "none"} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookDetailsPage;
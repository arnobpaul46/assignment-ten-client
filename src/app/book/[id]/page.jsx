"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Heart, ArrowLeft, Loader2, ShoppingBag, CheckCircle2, Bookmark } from "lucide-react";

const BookDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [book, setBook] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false); // বুকমার্ক স্টেট
    const [loading, setLoading] = useState(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ১. বইয়ের ডাটা আনা
                const bookRes = await fetch(`${SERVER_URL}/api/reader/book/${id}`);
                const bookData = await bookRes.json();
                setBook(bookData);

                if (session?.user?.email) {
                    // ২. কেনা হয়েছে কি না চেক
                    const pRes = await fetch(`${SERVER_URL}/api/reader/check-purchase?email=${session.user.email}&bookId=${id}`);
                    const pData = await pRes.json();
                    setIsPurchased(pData.isPurchased);

                    // ৩. বুকমার্ক করা কি না চেক
                    const bookmarkRes = await fetch(`${SERVER_URL}/api/reader/my-bookmarks/${session.user.email}`);
                    const bookmarkData = await bookmarkRes.json();
                    const found = bookmarkData.some(b => b.bookId === id);
                    setIsBookmarked(found);
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchData();
    }, [id, session, SERVER_URL]);

    // handlePurchase
    const handlePurchase = async () => {
        if (!session) return router.push('/login');

        const toastId = toast.loading("Opening secure payment gateway...");

        try {
            const res = await fetch(`${SERVER_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book: book,
                    userEmail: session.user.email,
                    userName: session.user.name
                })
            });

            const data = await res.json();

            if (data.url) {
                
                window.location.href = data.url;
            } else {
                throw new Error("Payment session failed");
            }
        } catch (err) {
            toast.error("Could not initiate payment", { id: toastId });
        }
    };

    const handleBookmark = async () => {
        if (!session) return router.push('/login');
        try {
            const res = await fetch(`${SERVER_URL}/api/reader/toggle-bookmark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: book._id, userEmail: session.user.email,
                    title: book.title, image: book.image, author: book.writerName
                })
            });
            const data = await res.json();
            setIsBookmarked(data.status);
            toast.success(data.status ? "Bookmarked!" : "Removed Bookmark");
        } catch (err) { toast.error("Action failed"); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;
    if (!book) return <div className="text-white text-center py-20 bg-[#09090b] h-screen font-black italic uppercase">Book not found.</div>;

    return (
        <div className="min-h-screen bg-[#09090b] text-white py-20 px-6 lg:px-20 font-sans">
            <div className="max-w-[85%] mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white uppercase font-black text-[10px] tracking-[4px] mb-12 transition-all">
                    <ArrowLeft size={16} /> Go Back
                </button>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

                    {/* ইমেজ সাইজ কমানো হয়েছে (lg:w-[320px]) */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="aspect-[3/4.5] rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
                            <img src={book.image} className="w-full h-full object-cover" alt={book.title} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">{book.title}</h1>
                            <p className="text-2xl font-black text-[#ff1e6d] uppercase mt-4 italic tracking-widest">By {book.writerName}</p>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[35px] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff1e6d]"></div>
                            <p className="text-zinc-300 text-lg leading-relaxed italic">"{book.description}"</p>
                        </div>

                        {/* বাটন সেকশন */}
                        <div className="flex flex-wrap items-center gap-5 pt-6">
                            {isPurchased ? (
                                <div className="bg-green-600/10 border border-green-600/30 text-green-500 h-16 lg:h-20 px-10 rounded-[25px] flex items-center gap-4 font-black uppercase text-xl italic tracking-tighter shadow-lg">
                                    <CheckCircle2 size={30} /> In Your Library
                                </div>
                            ) : (
                                <button
                                    onClick={handlePurchase}
                                    className="h-16 lg:h-20 px-12 bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-[25px] font-black text-2xl uppercase italic shadow-[0_15px_40px_rgba(255,30,109,0.3)] transition-all active:scale-95 flex items-center gap-4"
                                >
                                    <ShoppingBag size={28} /> Buy for ${book.price}
                                </button>
                            )}

                            {/* বুকমার্ক বাটন (বুকমার্ক অপশন ফিরে এসেছে) */}
                            <button
                                onClick={handleBookmark}
                                className={`h-16 lg:h-20 w-16 lg:w-20 rounded-[25px] flex items-center justify-center border transition-all ${isBookmarked
                                    ? "bg-[#ff1e6d] border-[#ff1e6d] text-white shadow-[0_10px_20px_rgba(255,30,109,0.2)]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-[#ff1e6d] hover:border-[#ff1e6d]/40"
                                    }`}
                            >
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
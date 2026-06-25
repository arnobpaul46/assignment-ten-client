# 📚 Fable – Premium Ebook Sharing Platform

**Fable** is a sophisticated digital ecosystem designed for literature enthusiasts. It connects independent writers with curious readers in a sleek, high-contrast dark-themed environment. Built with the **MERN Stack**, Fable provides a secure, role-based experience for discovering, purchasing, and publishing original ebooks.

---

## 🌐 Project Links
- **Live Deployment:** [Your Vercel URL Here]
- **Client Repository:** [Your GitHub Client Link]
- **Server Repository:** [Your GitHub Server Link]

---

## ✨ Key Features

### 👤 Reader Experience
- **Slick Library:** Access all purchased ebooks instantly in a high-resolution gallery view.
- **Secure Payments:** Integrated with **Stripe** for a seamless and safe checkout experience.
- **Smart Wishlist:** Bookmark your favorite stories to read later, managed via a dedicated dashboard.
- **Dynamic Profile:** Real-time profile updates including display name and avatar synchronization.

### ✍️ Writer Studio
- **One-Time Verification:** A professional author verification system to unlock publishing rights.
- **Ebook Management:** Full CRUD (Create, Read, Update, Delete) operations for your creations.
- **Author Analytics:** Track your book sales, total earnings, and reader base through a clean ledger.
- **Visibility Control:** Instantly toggle book status between 'Published' and 'Unpublished'.

### 🛡️ Admin Control Panel
- **Global Moderation:** Full control over users and content. Ability to update roles or ban accounts.
- **Content Approval:** Review and manage every ebook submitted to the platform.
- **Visual Analytics:** Data visualization using **Recharts**, displaying revenue growth and genre distribution.
- **Transaction History:** A transparent, searchable record of all platform-wide transactions.

---

## 🛠️ Technological Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion (Staggered reveals & hover effects)
- **Auth:** BetterAuth (JWT based)
- **State Management:** React Hooks & URL SearchParams

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Native Driver)
- **Security:** JWT (JSON Web Tokens) & Bcrypt hashing

---

## 📦 NPM Packages Used

### Client Side
`next-themes`, `framer-motion`, `recharts`, `js-cookie`, `sonner`, `lucide-react`, `better-auth`, `clsx`, `tailwind-merge`

### Server Side
`stripe`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`, `mongodb`, `express`

---

## 🚀 Local Setup Instructions

 ##  **Clone the project:**
   bash
   git clone [your-repo-link]

## 1.Frontend Setup:
    cd fable-client
    npm install
    # Create a .env.local file and add:
    # NEXT_PUBLIC_SERVER_URL=http://localhost:5000
    # NEXT_PUBLIC_IMGBB_API_KEY=your_key
    npm run dev


## 2.Backend Setup:
    cd fable-server
    npm install
    # Create a .env file and add:
    # MONGODB_URI=your_mongodb_uri
    # STRIPE_SECRET_KEY=your_key
    # JWT_SECRET=your_secret
    node index.js 
    or
    npm run dev

## 📝 Testing Credentials (Admin)
    Email: admin@fable.com
    Password: Admin@123
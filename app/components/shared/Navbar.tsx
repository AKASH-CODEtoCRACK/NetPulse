// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Activity, Menu, X, ArrowRight , User} from "lucide-react";
// import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2 group z-50">
//           <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
//             <Activity className="text-cyan-400" size={20} />
//           </div>
//           <span className="text-xl font-bold text-white tracking-tight">
//             Net<span className="text-cyan-400">Pulse</span>
//           </span>
//         </Link>

//         {/* DESKTOP MENU */}
//         <div className="hidden md:flex items-center gap-8">
//           <NavLink href="/#features">Features</NavLink>
//           <NavLink href="/#pricing">Pricing</NavLink>
//           <NavLink href="/contact">Contact</NavLink>
//           <NavLink href="/install">Install</NavLink>
          
          
//           <div className="pl-6 border-l border-slate-800 ml-2">
            
           
// <SignedIn>
//   <Link 
//     href="/dashboard/profile"
//     className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full border border-slate-700 transition-all group"
//   >
//     <div className="bg-cyan-500/20 p-1 rounded-full">
//        <User size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
//     </div>
//     <span className="text-sm font-bold hidden md:inline">My Profile</span>
//   </Link>
// </SignedIn>


//             {/* 2. If Logged Out: Show THE NEW PREMIUM BUTTON */}
//             <SignedOut>
//               <Link 
//                 href="/sign-in" 
//                 className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
//               >
//                 <span>Access Console</span>
//                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                
//                 {/* Shine Effect */}
//                 <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40"></div>
//               </Link>
//             </SignedOut>

//           </div>
//         </div>

//         {/* MOBILE HAMBURGER (Same as before) */}
//         <button className="md:hidden text-slate-300 z-50" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         {/* MOBILE MENU */}
//         {isOpen && (
//           <div className="absolute top-0 left-0 w-full h-screen bg-[#0B1120] flex flex-col items-center justify-center gap-8 z-40 animate-in fade-in slide-in-from-top-10 duration-200">
//             <MobileLink href="/#features" onClick={() => setIsOpen(false)}>Features</MobileLink>
//             <MobileLink href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</MobileLink>
//             <MobileLink href="/contact" onClick={() => setIsOpen(false)}>Contact</MobileLink>
//             <MobileLink href="/install" onClick={() => setIsOpen(false)}>Installation</MobileLink>
            
//             <div className="mt-8 scale-125">
//                <SignedIn>
//                  <UserButton afterSignOutUrl="/" />
//                </SignedIn>
//                <SignedOut>
//                  <Link href="/sign-in" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
//                    Login Now
//                  </Link>
//                </SignedOut>
//             </div>
//           </div>
//         )}

//       </div>
//     </nav>
//   );
// }

// function NavLink({ href, children }: any) {
//   return (
//     <Link href={href} className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
//       {children}
//     </Link>
//   );
// }

// function MobileLink({ href, onClick, children }: any) {
//   return (
//     <Link href={href} onClick={onClick} className="text-2xl font-bold text-slate-300 hover:text-cyan-400">
//       {children}
//     </Link>
//   );
// }



// // "use client";

// // import Link from "next/link";
// // import { useState } from "react";
// // import { Activity, Menu, X } from "lucide-react";
// // import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// // export function Navbar() {
// //   const [isOpen, setIsOpen] = useState(false);

// //   return (
// //     <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
// //         {/* Logo */}
// //         <Link href="/" className="flex items-center gap-2 group z-50">
// //           <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
// //             <Activity className="text-cyan-400" size={20} />
// //           </div>
// //           <span className="text-xl font-bold text-white tracking-tight">
// //             Net<span className="text-cyan-400">Pulse</span>
// //           </span>
// //         </Link>

// //         {/* DESKTOP MENU (Hidden on Mobile) */}
// //         <div className="hidden md:flex items-center gap-8">
// //           <NavLink href="/#features">Features</NavLink>
// //           <NavLink href="/#pricing">Pricing</NavLink>
// //           <NavLink href="/contact">Contact</NavLink>
// //           <NavLink href="/install">Install</NavLink>
          
// //           <div className="pl-4 border-l border-slate-800">
// //             <SignedIn>
// //               <UserButton afterSignOutUrl="/" />
// //             </SignedIn>
// //             <SignedOut>
// //               <Link href="/sign-in" className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
// //                 Login / Sign Up
// //               </Link>
// //             </SignedOut>
// //           </div>
// //         </div>

// //         {/* MOBILE HAMBURGER BUTTON */}
// //         <button className="md:hidden text-slate-300 z-50" onClick={() => setIsOpen(!isOpen)}>
// //           {isOpen ? <X size={28} /> : <Menu size={28} />}
// //         </button>

// //         {/* MOBILE DROPDOWN MENU */}
// //         {isOpen && (
// //           <div className="absolute top-0 left-0 w-full h-screen bg-[#0B1120] flex flex-col items-center justify-center gap-8 z-40 animate-in fade-in slide-in-from-top-10 duration-200">
// //             <MobileLink href="/#features" onClick={() => setIsOpen(false)}>Features</MobileLink>
// //             <MobileLink href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</MobileLink>
// //             <MobileLink href="/contact" onClick={() => setIsOpen(false)}>Contact</MobileLink>
// //             <MobileLink href="/install" onClick={() => setIsOpen(false)}>Installation</MobileLink>
            
// //             <div className="mt-4 scale-125">
// //                <SignedIn>
// //                  <UserButton afterSignOutUrl="/" />
// //                </SignedIn>
// //                <SignedOut>
// //                  <Link href="/sign-in" className="bg-cyan-500 text-black px-8 py-3 rounded-full font-bold">
// //                    Login
// //                  </Link>
// //                </SignedOut>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </nav>
// //   );
// // }

// // function NavLink({ href, children }: any) {
// //   return (
// //     <Link href={href} className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
// //       {children}
// //     </Link>
// //   );
// // }

// // function MobileLink({ href, onClick, children }: any) {
// //   return (
// //     <Link href={href} onClick={onClick} className="text-2xl font-bold text-slate-300 hover:text-cyan-400">
// //       {children}
// //     </Link>
// //   );
// // }


"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Menu, X, ArrowRight, User, LayoutDashboard } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
            <Activity className="text-cyan-400" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Net<span className="text-cyan-400">Pulse</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {/* RESTRUCTURED LINKS */}
          <NavLink href="/about">About</NavLink>
          <NavLink href="/install">Install</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          
          <div className="pl-6 border-l border-slate-800 ml-2 flex items-center gap-4">
            
            {/* LOGGED IN STATE */}
            <SignedIn>
              {/* New Dashboard Link */}
              <Link href="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2">
                 <LayoutDashboard size={16} /> Dashboard
              </Link>
              
              {/* Profile Button */}
              <Link 
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full border border-slate-700 transition-all group"
              >
                <div className="bg-cyan-500/20 p-1 rounded-full">
                   <User size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-bold hidden lg:inline">My Profile</span>
              </Link>
            </SignedIn>

            {/* LOGGED OUT STATE */}
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
              >
                <span>Access Console</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40"></div>
              </Link>
            </SignedOut>

          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <button className="md:hidden text-slate-300 z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-[#0B1120] flex flex-col items-center justify-center gap-8 z-40 animate-in fade-in slide-in-from-top-10 duration-200">
            {/* RESTRUCTURED MOBILE LINKS */}
            <MobileLink href="/about" onClick={() => setIsOpen(false)}>About Us</MobileLink>
            <MobileLink href="/install" onClick={() => setIsOpen(false)}>Installation</MobileLink>
            <MobileLink href="/contact" onClick={() => setIsOpen(false)}>Contact</MobileLink>
            
            <div className="mt-8 scale-125 flex flex-col items-center gap-6">
               <SignedIn>
                 <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard /> Dashboard
                 </Link>
                 <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="bg-slate-800 px-6 py-3 rounded-full font-bold text-white flex items-center gap-2">
                    <User /> My Profile
                 </Link>
               </SignedIn>
               <SignedOut>
                 <Link href="/sign-in" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                   Login Now
                 </Link>
               </SignedOut>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

function NavLink({ href, children }: any) {
  return (
    <Link href={href} className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
      {children}
    </Link>
  );
}

function MobileLink({ href, onClick, children }: any) {
  return (
    <Link href={href} onClick={onClick} className="text-2xl font-bold text-slate-300 hover:text-cyan-400">
      {children}
    </Link>
  );
}
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { CyberLoader } from "../../components/shared/CyberLoader";

export default function Page() {
  return (
    // CHANGE 1: Added 'py-24' (Padding Vertical) to the main container
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] relative py-24">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Loader */}
        <ClerkLoading>
           <div className="scale-75">
             <CyberLoader text="INITIATING SIGNIN..." />
           </div>
        </ClerkLoading>

        {/* Form */}
        <ClerkLoaded>
          <SignIn 
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
              variables: {
                colorPrimary: "#06b6d4",
                colorBackground: "#1e293b",
                colorText: "white",
                colorTextSecondary: "#94a3b8",
                colorInputBackground: "#0f172a",
                colorInputText: "white",
                borderRadius: "1rem",
              },
              elements: {
                card: "bg-slate-900 border border-slate-700 shadow-2xl !bg-[#151e32]",
                headerTitle: "text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent",
                headerSubtitle: "text-slate-500",
                formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 border-0",
                formFieldInput: "bg-slate-950 border-slate-700 text-white focus:border-cyan-500",
                formFieldLabel: "text-slate-400",
                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                footer: "pb-4"
              }
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
}


// import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"; // <--- Import these
// import { CyberLoader } from "../../components/shared/CyberLoader"; // <--- Import your loader

// export default function Page() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0B1120] relative">
      
//       {/* Background Ambience */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>

//       <div className="relative z-10 flex flex-col items-center">
        
//         {/* 1. SHOW THIS WHILE CLERK IS LOADING */}
//         <ClerkLoading>
//           <div className="scale-75">
//             <CyberLoader text="SECURING CONNECTION..." />
//           </div>
//         </ClerkLoading>

//         {/* 2. SHOW THIS ONLY WHEN CLERK IS READY */}
//         <ClerkLoaded>
//           <SignIn 
//             appearance={{
//               layout: {
//                 socialButtonsPlacement: "bottom",
//                 socialButtonsVariant: "blockButton",
//               },
//               variables: {
//                 colorPrimary: "#06b6d4", 
//                 colorBackground: "#1e293b", 
//                 colorText: "white",
//                 colorInputBackground: "#0f172a",
//                 colorInputText: "white",
//                 borderRadius: "1rem",
//               },
//               elements: {
//                 card: "bg-slate-900 border border-slate-700 shadow-2xl !bg-[#151e32]", 
//                 headerTitle: "text-2xl font-bold text-white",
//                 headerSubtitle: "text-slate-400",
//                 formButtonPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black font-bold !shadow-none !border-0",
//                 formFieldInput: "bg-slate-950 border-slate-700 text-white focus:border-cyan-500",
//                 formFieldLabel: "text-slate-400",
//                 footerActionLink: "text-cyan-400 hover:text-cyan-300",
//                 footer: "pb-4"
//               }
//             }}
//           />
//         </ClerkLoaded>

//       </div>
//     </div>
//   );
// }
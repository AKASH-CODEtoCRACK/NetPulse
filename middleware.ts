import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define your Public Routes here
// These pages will be visible to everyone (Logged Out users)
const isPublicRoute = createRouteMatcher([
  '/',              // Landing Page
  '/install',   
  '/install.sh',     // Installation Guide
  '/contact', 
  '/about', 
  '/api/chat', 
  '/api/webhooks(.*)',    
  '/sign-in(.*)',   // Clerk Login Page
  '/sign-up(.*)' ,   // Clerk Signup Page
  '/api/agent/ingest',
  '/api/agent/security',
  
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route is NOT public, force the user to login
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
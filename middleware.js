import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("token: ", req.nextauth.token);

    // Check if the user is authenticated for cart and checkout routes
    if ((req.nextUrl.pathname.startsWith("/checkout") || req.nextUrl.pathname.startsWith("/cart")) && !req.nextauth.token) {
      return NextResponse.rewrite(
        new URL("/sign-in?message=Please sign in to continue", req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Update the matcher to only protect cart and checkout routes
export const config = {
  matcher: ["/checkout/:path*", "/cart/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface Payload {
  email: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "";

export default async function middleware(request: NextRequest) {
  console.log("COUCOU");
  const { cookies } = request;
  const token = cookies.get("token");

  return await checkToken(token?.value, request);
}

export async function verify(token: string): Promise<Payload> {
  const { payload } = await jwtVerify<Payload>(
    token,
    new TextEncoder().encode(SECRET_KEY)
  );
  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  if (!token) {
    //si il n'y a pas de token ET que je suis sur book/LIST_BOOKS

    if (request.nextUrl.pathname.startsWith("/books/list")) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("email");
      return response;
    }
    return NextResponse.next();
  }

  try {
    const payload = await verify(token);

    if (payload?.email) {
      const response = NextResponse.next();

      response.cookies.set("email", payload.email);
      return response;
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (err) {
    console.error("Verification failed", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// export const config = {
//   matcher: "/books/list/:path*",
// };
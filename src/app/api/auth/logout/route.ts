import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  
  const response = NextResponse.redirect(new URL("/login", baseUrl));
  
  response.cookies.delete("mzone_auth");
  
  return response;
}

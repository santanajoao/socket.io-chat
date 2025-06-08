import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieValues = await cookies();
  cookieValues.delete('accessToken');

  return new NextResponse(null, { status: 204 });
}

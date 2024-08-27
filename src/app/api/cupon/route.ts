import { getCuponByBenefit } from "@/services/cupon/cupon";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, resp: NextResponse) {
    const data = await req.json();
    const cuponInfo = await getCuponByBenefit(data.benefitId,data.userId,data.userEmail)
    return NextResponse.json(cuponInfo);
}
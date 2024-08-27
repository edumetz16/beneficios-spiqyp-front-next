import { getCompanies } from "@/services/companies/companies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,resp:NextResponse) {
    try {
        const body = await req.json();        
        const newContent = await getCompanies(body.limit, body.lastItem && {field: 'dateCreated', direction: 'desc', lastItem: body.lastItem});
        return NextResponse.json({ success: true, data: newContent });
    } catch (error) {
        
        return NextResponse.json({ success: false, error: 'could not get companies' });
    }
}
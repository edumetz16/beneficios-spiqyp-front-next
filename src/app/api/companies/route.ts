import { getCompanies } from "@/services/companies/companies";
import { OrderByDirection } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,resp:NextResponse) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const categories = searchParams.get('categories')?.split(',') || [];
        const sort: string[] = searchParams.get('sort')?.split(',') || [];
        const limit = searchParams.get('limit');
        const lastItem = searchParams.get('lastItem');
        const companies = await getCompanies(
            categories.map(category => ({operator: 'array-contains', value: `categories/${category}`, field: 'categories', isReference: true})),
            sort.map(order => ({field: order.split('|')[0], direction: order.split('|')[1] as OrderByDirection})),
            limit ? parseInt(limit) : undefined,
            lastItem ? lastItem : undefined);
        return NextResponse.json({ success: true, data: companies });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'could not get companies' });
    }
}
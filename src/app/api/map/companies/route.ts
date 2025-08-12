import { Company, getCompanies } from "@/services/companies/companies";
import { getLocations } from "@/services/locations/locations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const companiesResponse = await getCompanies(); // Get more companies for the map
    
    // Fetch locations for each company
    const companiesWithLocations = await Promise.all(
      companiesResponse.filter((company: Company) => company.locations.length > 0).map(async (company: Company) => {
        try {
          const locations = await getLocations(company.locations || []);
          return {
            id: company.id,
            name: company.name,
            companyImage: company.companyImage,
            companyLogo: company.companyLogo,
            locations: locations || [],
          };
        } catch (error) {
          console.error(`Error fetching locations for company ${company.id}:`, error);
          return {
            id: company.id,
            name: company.name,
            companyImage: company.companyImage,
            companyLogo: company.companyLogo,
            locations: [],
          };
        }
      })
    );

    // Filter out companies with no locations
    const companiesWithValidLocations = companiesWithLocations.filter(
      (company) => company.locations.length > 0
    );

    return NextResponse.json({
      success: true,
      companies: companiesWithValidLocations,
      total: companiesWithValidLocations.length,
      totalLocations: companiesWithValidLocations.reduce(
        (acc, company) => acc + company.locations.length,
        0
      ),
    });
  } catch (error) {
    console.error("Error fetching companies for map:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
} 
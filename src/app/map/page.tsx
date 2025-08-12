"use client";
import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Location {
  id: string;
  latitud: number;
  longitude: number;
  address?: string;
}

interface Company {
  id: string;
  name: string;
  companyImage?: string;
  companyLogo?: string;
  locations: Location[];
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [google, setGoogle] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, totalLocations: 0 });
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.");
      setLoading(false);
      return;
    }

    const initializeMap = async () => {
      try {
        console.log("Loading Google Maps...");
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places"]
        });

        const googleMaps = await loader.load();
        console.log("Google Maps loaded successfully");

        if (!mapRef.current) {
          console.error("Map container not available");
          setError("Map container not available");
          setLoading(false);
          return;
        }

        console.log("Initializing map...");
        const mapInstance = new googleMaps.maps.Map(mapRef.current, {
          center: { lat: -34.397, lng: -64.644 }, // Default center (Argentina)
          zoom: 5,
          mapTypeId: googleMaps.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        console.log("Map initialized successfully");
        setMap(mapInstance);
        setGoogle(googleMaps);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setError("Failed to load Google Maps. Please check your API key.");
        setLoading(false);
      }
    };

    const fetchCompaniesWithLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/map/companies");
        const data = await response.json();
        
        if (data.success) {
          console.log("Companies fetched:", data.companies.length);
          setCompanies(data.companies);
          setStats({
            total: data.total,
            totalLocations: data.totalLocations,
          });
        } else {
          console.error("Error fetching companies:", data.error);
          setError("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
    fetchCompaniesWithLocations();
  }, []);

  useEffect(() => {
    if (!map || !google || companies.length === 0) return;

    console.log("Adding markers for", companies, "companies");
    
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
    
    // Add markers for each company location
    companies.forEach((company) => {
      company.locations.forEach((location) => {
        try {
          console.log("Adding marker for", company.name);
          const marker = new google.maps.Marker({
            position: { lat: location.latitud, lng: location.longitude },
            map: map,
            title: company.name,
            icon: {
              url: company.companyLogo || "/img/icons/map-pin.svg",
              scaledSize: new google.maps.Size(32, 32),
            },
          });
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-4">
                <h3 class="font-bold text-lg">${company.name}</h3>
                ${location.address ? `<p class="text-sm text-gray-600">${location.address}</p>` : ""}
                <a href="/benefits/${company.id}" class="text-primary hover:underline">Ver beneficios</a>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        } catch (error) {
          console.error(`Error adding marker for company ${company.name}:`, error);
        }
      });
    });
  }, [map, google, companies]);

  if (error) {
    return (
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mapa de Beneficios</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mapa de Beneficios</h1>
      {loading && (
        <div className="flex justify-center items-center h-96">
          <div className="text-lg text-primary">Cargando mapa...</div>
        </div>
      )}
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${loading ? "hidden" : ""}`}>
        <div ref={mapRef} className="w-full h-96 md:h-[600px]" />
      </div>
      <div className="mt-6 text-sm text-gray-600">
        <p>Total de empresas: {stats.total}</p>
        <p>Total de ubicaciones: {stats.totalLocations}</p>
      </div>
    </main>
  );
} 
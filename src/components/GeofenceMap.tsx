import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Settings,
  Eye,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Search,
} from "lucide-react";
import { ControlState } from "../types";
import GPSTracker from "./GPSTracker";

declare const L: any;

interface GeofenceMapProps {
  radiusKm: number;
  onRadiusChange?: (newRadius: number) => void;
  controlState?: ControlState;
}

// Distance calculation using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export default function GeofenceMap({
  radiusKm = 10,
  onRadiusChange,
  controlState = "temp_on",
}: GeofenceMapProps) {
  const [localRadius, setLocalRadius] = useState(radiusKm);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    17.385, 78.4867,
  ]); // Default Hyderabad, Telangana
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [geolocationError, setGeolocationError] = useState("");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const circleInstanceRef = useRef<any>(null);
  const meMarkerInstanceRef = useRef<any>(null);
  const leadMarkersRef = useRef<any[]>([]);

  // Base customer/worker leads with relative offsets around center
  // These will get updated when map center moves to remain relevant!
  const [leads, setLeads] = useState([
    {
      id: 1,
      nameTe: "రాజు - ఎలక్ట్రీషియన్",
      nameEn: "Raju (Electrician)",
      dLat: 0.015,
      dLng: -0.02,
      phone: "9876543210",
    },
    {
      id: 2,
      nameTe: "సీత - పెయింటర్",
      nameEn: "Sita (Painter)",
      dLat: -0.045,
      dLng: 0.05,
      phone: "8765432109",
    },
    {
      id: 3,
      nameTe: "నాయుడు - మేస్త్రీ",
      nameEn: "Naidu (Mason)",
      dLat: 0.03,
      dLng: 0.025,
      phone: "7654321098",
    },
    {
      id: 4,
      nameTe: "రామ్ - ప్లంబర్",
      nameEn: "Ram (Plumber)",
      dLat: -0.01,
      dLng: -0.035,
      phone: "6543210987",
    },
    {
      id: 5,
      nameTe: "గోపి - కార్పెంటర్",
      nameEn: "Gopi (Carpenter)",
      dLat: 0.065,
      dLng: -0.01,
      phone: "9123456789",
    },
  ]);

  useEffect(() => {
    setLocalRadius(radiusKm);
  }, [radiusKm]);

  // Handle Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalRadius(val);
    if (onRadiusChange) {
      onRadiusChange(val);
    }
  };

  // 1. Initialize map when Leaflet is available in browser
  useEffect(() => {
    if (
      controlState === "temp_off" ||
      controlState === "perm_off" ||
      controlState === "soft_delete" ||
      controlState === "hard_delete"
    ) {
      return;
    }

    if (typeof L === "undefined") {
      const checkInterval = setInterval(() => {
        if (typeof L !== "undefined") {
          clearInterval(checkInterval);
          initLeaflet();
        }
      }, 300);
      return () => clearInterval(checkInterval);
    } else {
      initLeaflet();
    }

    function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // Prevent double init

      try {
        // Initialize Leaflet map on container
        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView(mapCenter, 12);

        // Standard OSM Tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Click on map to update active center location
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          setMapCenter([lat, lng]);
        });
      } catch (err) {
        console.error("Error initializing map:", err);
      }
    }

    // Cleanup Leaflet on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [controlState]);

  // 2. Update map view, geofence circle, and markers when mapCenter or localRadius changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || typeof L === "undefined")
      return;

    const map = mapInstanceRef.current;

    // Center map view on new coordinates smoothly
    map.panTo(mapCenter);

    // Update or Create Circle Geofence boundary
    if (circleInstanceRef.current) {
      circleInstanceRef.current.setLatLng(mapCenter);
      circleInstanceRef.current.setRadius(localRadius * 1000);
    } else {
      circleInstanceRef.current = L.circle(mapCenter, {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        weight: 2,
        dashArray: controlState === "perm_upgrade" ? undefined : "5, 5",
      }).addTo(map);
    }

    // Update or Create "ME" position marker using custom CSS divIcon
    const meIcon = L.divIcon({
      html: `<div class="relative flex items-center justify-center">
               <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-60"></span>
               <div class="relative rounded-full h-5.5 w-5.5 bg-[#2563eb] border-2 border-white flex items-center justify-center shadow-lg">
                 <div class="h-2 w-2 rounded-full bg-yellow-400"></div>
               </div>
             </div>`,
      className: "custom-me-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (meMarkerInstanceRef.current) {
      meMarkerInstanceRef.current.setLatLng(mapCenter);
    } else {
      meMarkerInstanceRef.current = L.marker(mapCenter, { icon: meIcon }).addTo(
        map,
      ).bindPopup(`<div class="font-sans text-xs">
                     <p class="font-extrabold text-[#2563eb]">నా ప్రస్తుత స్థానం / My Location</p>
                     <p class="text-[10px] text-gray-500 mt-1">lat: ${mapCenter[0].toFixed(4)}, lng: ${mapCenter[1].toFixed(4)}</p>
                   </div>`);
    }

    // Update/Remove existing Civil Worker Markers
    leadMarkersRef.current.forEach((m) => map.removeLayer(m));
    leadMarkersRef.current = [];

    // Draw leads on the map
    leads.forEach((lead) => {
      const leadLat = mapCenter[0] + lead.dLat;
      const leadLng = mapCenter[1] + lead.dLng;
      const distance = getDistance(
        mapCenter[0],
        mapCenter[1],
        leadLat,
        leadLng,
      );
      const isInside = distance <= localRadius;

      const workerIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 ${isInside ? '<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-60"></span>' : ""}
                 <div class="relative rounded-full h-7 w-7 ${
                   isInside
                     ? "bg-amber-500 border-2 border-white shadow-md text-amber-950 scale-110"
                     : "bg-slate-400 border border-white text-white opacity-70"
                 } flex items-center justify-center transition-all">
                   <span class="text-xs">👷</span>
                 </div>
               </div>`,
        className: "custom-worker-icon",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([leadLat, leadLng], { icon: workerIcon }).addTo(
        map,
      ).bindPopup(`<div class="font-sans text-xs space-y-1">
                     <p class="font-black text-gray-900">${lead.nameTe}</p>
                     <p class="text-[10px] text-gray-500">${lead.nameEn}</p>
                     <p class="font-semibold text-[10px] ${isInside ? "text-emerald-600" : "text-rose-500"}">
                       ${isInside ? "✔ పరిధిలో ఉన్నారు" : "❌ పరిధి వెలుపల"} (${distance.toFixed(1)} KM)
                     </p>
                     <a href="tel:${lead.phone}" class="block mt-1 text-center py-1 bg-[#2563eb] text-white text-[9px] font-bold rounded">
                       కాల్ చేయండి / Call
                     </a>
                   </div>`);

      leadMarkersRef.current.push(marker);
    });
  }, [mapLoaded, mapCenter, localRadius, leads, controlState]);

  // 3. Address place search using Nominatim OpenStreetMap API
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        // Update center coordinates
        setMapCenter([newLat, newLng]);
        setSearchError("");
      } else {
        setSearchError("ఏ స్థలం కనుగొనబడలేదు / No location found.");
      }
    } catch (err) {
      setSearchError("సర్వర్ నెట్‌వర్క్ ఎర్రర్ / Network error.");
    } finally {
      setSearchLoading(false);
    }
  };

  // 4. Geolocation - Locate User's actual device GPS position
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeolocationError("మీ బ్రౌజర్ GPS సపోర్ట్ చేయదు.");
      return;
    }

    setGeolocationLoading(true);
    setGeolocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setGeolocationLoading(false);
        setGeolocationError("");
      },
      (error) => {
        setGeolocationLoading(false);
        setGeolocationError("GPS అనుమతి తిరస్కరించబడింది.");
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  // Render Admin Suspended panel
  if (controlState === "temp_off" || controlState === "perm_off") {
    return (
      <div className="bg-gray-100 rounded-2xl h-80 flex flex-col items-center justify-center border border-gray-200 text-center p-6">
        <ShieldAlert className="w-14 h-14 text-amber-500 mb-3 animate-pulse" />
        <h4 className="text-gray-900 font-bold text-base">
          జియోఫెన్సింగ్ మ్యాప్ నిలిపివేయబడింది
        </h4>
        <p className="text-red-600 text-xs font-semibold">
          Geofencing Map Suspended
        </p>
        <p className="text-gray-500 text-xs mt-2 max-w-sm">
          ఈ ఫీచర్ అడ్మినిస్ట్రేటర్ ద్వారా ప్రస్తుతం నిలిపివేయబడింది. దయచేసి
          అడ్మిన్ బోర్డు లో ఆన్ చేయండి.
        </p>
      </div>
    );
  }

  // Soft delete check
  if (controlState === "soft_delete" || controlState === "hard_delete") {
    return (
      <div className="bg-gray-50 rounded-2xl h-12 flex items-center justify-center border border-dashed border-gray-200 text-xs text-gray-400">
        [మ్యాప్ ఫీచర్ తొలగించబడింది / Map Feature Soft-Deleted]
      </div>
    );
  }

  const isUpgraded = controlState === "perm_upgrade";

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col ${
        isUpgraded ? "ring-2 ring-[#FFC000]" : ""
      }`}
    >
      {/* Title Header bar */}
      <div className="bg-[#2563eb] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#FFC000] animate-bounce" />
          <div>
            <h4 className="font-bold text-sm">
              లైవ్ రియల్ మ్యాప్ (Real Live Map)
            </h4>
            <p className="text-[10px] text-gray-300">
              OpenStreetMap Interactive • {localRadius} KM Radius
            </p>
          </div>
        </div>
        {isUpgraded && (
          <span className="bg-[#FFC000] text-[#2563eb] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>RADAR ACTIVE</span>
          </span>
        )}
      </div>

      {/* Real-time OpenStreetMap Address Search Form */}
      <div className="p-3 bg-slate-50 border-b border-gray-100 flex flex-col gap-2">
        <form onSubmit={handleSearch} className="flex gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="స్థలాన్ని వెతకండి (ఉదా: Hyderabad, Telangana)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#001040] disabled:bg-gray-400 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            {searchLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              "వెతకండి (Search)"
            )}
          </button>
        </form>

        {searchError && (
          <p className="text-[10px] text-rose-500 font-semibold px-1">
            {searchError}
          </p>
        )}

        {/* GPS Locate buttons and Tracker Info */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={geolocationLoading}
              className="px-2.5 py-1 text-[10px] font-black text-[#2563eb] bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>
                {geolocationLoading
                  ? "జిపిఎస్ వెతుకుతోంది..."
                  : "📍 నా లైవ్ లొకేషన్ పట్టుకో (Locate Me)"}
              </span>
            </button>

            <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
              <span className="font-bold text-[#2563eb]">GPS:</span>
              Lat: {mapCenter[0].toFixed(4)}, Lng: {mapCenter[1].toFixed(4)}
            </span>
          </div>

          {/* Inline GPS Tracker Summary */}
          <div className="bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] text-gray-700">
                ట్రాకర్ / Tracker:
              </span>
              <span className={`w-2 h-2 rounded-full bg-emerald-500`}></span>
              <span className="text-[10px] text-gray-500">Active</span>
            </div>
            <div className="flex gap-2 text-[9px] font-mono">
              <span>{mapCenter[0].toFixed(3)}</span>,
              <span>{mapCenter[1].toFixed(3)}</span>
            </div>
          </div>
        </div>
        {geolocationError && (
          <p className="text-[10px] text-amber-600 font-semibold px-1">
            {geolocationError}
          </p>
        )}
      </div>

      {/* Real Leaflet Map Container div */}
      <div className="relative bg-[#f1f5f9] h-72 border-b border-gray-100 overflow-hidden">
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Legend Overlay Info Panel */}
        <div
          className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-gray-100 text-[9px] space-y-1 shadow-md"
          style={{ zIndex: 2 }}
        >
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/25 border border-blue-500 block"></span>
            <span>
              పరిధి వలయం / Active Geofence boundary ({localRadius} KM)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
            <span>పరిధిలోని వర్కర్ / Lead in Active Zone</span>
          </div>
          <p className="text-[8px] text-gray-400 leading-tight pt-1 border-t border-gray-100">
            * మ్యాప్‌లో ఎక్కడైనా క్లిక్ చేసి కేంద్రాన్ని మార్చవచ్చు
          </p>
        </div>
      </div>

      {/* Dynamic List of Leads showing inside/outside status */}
      <div className="p-3 bg-white border-b border-gray-100">
        <h5 className="font-extrabold text-xs text-gray-800 mb-2">
          సమీపంలోని వర్కర్లు (Nearby Service Workers)
        </h5>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {leads.map((lead) => {
            const leadLat = mapCenter[0] + lead.dLat;
            const leadLng = mapCenter[1] + lead.dLng;
            const dist = getDistance(
              mapCenter[0],
              mapCenter[1],
              leadLat,
              leadLng,
            );
            const insideFence = dist <= localRadius;

            return (
              <div
                key={lead.id}
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([leadLat, leadLng], 14);
                  }
                }}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition hover:bg-slate-50 ${
                  insideFence
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div>
                  <div className="font-bold text-gray-800 flex items-center gap-1">
                    <span>👷 {lead.nameTe}</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      ({lead.nameEn})
                    </span>
                  </div>
                  <div className="text-[9px] text-gray-400">
                    దూరం: {dist.toFixed(1)} కి.మీ.
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      insideFence
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {insideFence ? "✔ పరిధిలో" : "❌ బయట"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radius Controller Slider */}
      <div className="p-4 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-[#2563eb]">
              కిలోమీటర్ల పరిధిని పెంచండి / Adjust Geofence Radius:
            </span>
            <span className="text-sm font-black text-[#2563eb] font-mono bg-[#FFC000]/30 px-2 py-0.5 rounded">
              {localRadius} KM
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            value={localRadius}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
          />
        </div>
      </div>
    </div>
  );
}

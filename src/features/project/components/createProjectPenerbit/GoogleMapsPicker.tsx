import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import TextField from "@/app/components/inputFormPemodalPerusahaan/component/TextField";
import SectionPoint from "@/app/components/inputFormPemodalPerusahaan/component/SectionPoint";

interface MapsResult {
  lat: number;
  lng: number;
  url: string;
  address: string;
  components: Record<string, string | undefined>;
}

interface GoogleMapPickerProps {
  className?: string;
  onAddressChange?: (data: MapsResult | null) => void;
  cacheMap?: MapsResult | null;
  errorText?: string;
}

export const FALLBACK_CENTER = {
  lat: -6.175312344584103,
  lng: 106.82708384360767,
}; // monas

const libraries: Libraries = ["places"];

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  className,
  onAddressChange,
  cacheMap,
  errorText,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBvdQKriOVtxZaWeJulj2y8AA6yG2dQgs4",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral>(FALLBACK_CENTER);
  const [location, setLocation] = useState<MapsResult | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  //* init service ketika map ready
  useEffect(() => {
    if (map && google) {
      serviceRef.current = new google.maps.places.AutocompleteService();
      placesServiceRef.current = new google.maps.places.PlacesService(map);
    }
  }, [map]);

  //* read cache map
  useEffect(() => {
    if (cacheMap) {
      const coords = { lat: cacheMap.lat, lng: cacheMap.lng };
      map?.panTo(coords);
      setMarkerPosition(coords);
      setLocation(cacheMap);
      setInputValue(cacheMap.address);
    }
  }, [cacheMap, map]);

  //* reverse geocode untuk drag marker
  const fetchAddress = useCallback(
    (lat: number, lng: number) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formatted = results[0].formatted_address;

          const components: Record<string, string | undefined> = {};
          results[0].address_components.forEach((comp) => {
            if (comp.types.includes("country"))
              components.country = comp.long_name;
            if (comp.types.includes("administrative_area_level_1"))
              components.administrativeArea = comp.long_name;
            if (comp.types.includes("administrative_area_level_2"))
              components.subAdministrativeArea = comp.long_name;
            if (comp.types.includes("locality"))
              components.locality = comp.long_name;
            if (comp.types.includes("postal_code"))
              components.postalCode = comp.long_name;
          });

          const placeId = results[0].place_id;
          const url = placeId
            ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
            : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

          const data = { lat, lng, address: formatted, components, url };

          setLocation(data);
          onAddressChange?.(data);
          setInputValue(data.address);
        }
      });
    },
    [onAddressChange]
  );

  //* ketika user mengetik
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setInputValue(value);

    if (value && serviceRef.current) {
      serviceRef.current.getPlacePredictions(
        { input: value, componentRestrictions: { country: "id" } },
        (predictions) => {
          setSuggestions(predictions || []);
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  //* ketika pilih suggestion
  const handleSelectSuggestion = (placeId: string, description: string) => {
    setInputValue(description);
    setSuggestions([]);

    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails({ placeId }, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const coords = { lat, lng };

          setMarkerPosition(coords);
          map?.panTo(coords);
          fetchAddress(lat, lng);
        }
      });
    }
  };

  //* ketika marker digeser
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    fetchAddress(lat, lng);
  };

  //* clear field
  const handleClear = () => {
    onAddressChange?.(null);
    setInputValue("");
    setSuggestions([]);
    setLocation(null);
    setMarkerPosition(FALLBACK_CENTER);
    map?.panTo(FALLBACK_CENTER);
  };

  return (
    <div>
      <SectionPoint text="Lokasi Proyek" className="mb-1" />

      <div className="relative mb-1">
        <TextField
          placeholder="Masukan alamat"
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            className="absolute w-5 h-5 right-2 top-1/2 -translate-y-1/2 text-white text-xs rounded-full bg-red-500 hover:bg-red-400"
            onClick={handleClear}
          >
            ✕
          </button>
        )}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow">
            {suggestions.map((sug) => (
              <li
                key={sug.place_id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  handleSelectSuggestion(sug.place_id, sug.description)
                }
              >
                {sug.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mb-3 text-gray-500 text-xs">
        Cari alamat melalui
        <span className="text-black font-medium"> form diatas </span>
        atau
        <span className="text-black font-medium"> geser pin </span>
        secara manual untuk menentukan posisi lokasi proyek
      </p>

      {isLoaded ? (
        <div className={className}>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={FALLBACK_CENTER}
            zoom={13.5}
            onLoad={(mapInstance) => setMap(mapInstance)}
            options={{
              disableDefaultUI: true,
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleDragEnd}
              />
            )}
          </GoogleMap>
        </div>
      ) : (
        <div className={`${className} flex items-center justify-center`}>
          <p className="text-gray-500 text-sm">Loading map..</p>
        </div>
      )}
      {location && <p className="text-sm mt-2">{location.address}</p>}

      {errorText && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
};

export default GoogleMapPicker;

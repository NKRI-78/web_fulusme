"use client";

import {
  Mail,
  Phone,
  User,
  Home,
  Locate,
  IdCard,
  PersonStanding,
  BaggageClaim,
  Linkedin,
  Facebook,
  Flag,
  Car,
  Building2,
  LinkedinIcon,
  Sword
} from 'lucide-react';

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";

import { LoadingSpinner } from "@components/loading/Spinner";
import moment from 'moment';

// import {
//   setIsLoading,
//   setError,
//   fetchContentListAsync,
// } from "@store/slices/contentSlice";

// const useDebouncedValue = (value: string, delay: number) => {
//   const [debounced, setDebounced] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebounced(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debounced;
// };

const ContentItems: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();

  const contents = useSelector((state: RootState) => state.content.contents);
  const isLoading = useSelector((state: RootState) => state.content.isLoading);
  
  // KEY UP ON SEARCH
  // const debouncedSearch = useDebouncedValue(search, 500);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!debouncedSearch.trim()) return;
      
  //     dispatch(setIsLoading(true));
  //     try {
  //       await dispatch(fetchContentListAsync(debouncedSearch));
  //     } catch (error) {
  //       dispatch(setError((error as Error).message));
  //     } finally {
  //       dispatch(setIsLoading(false));
  //     }
  //   };

  //   fetchData();
  // }, [debouncedSearch, dispatch]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 py-10 w-full">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Tokopedia Section */}
        {contents?.data.List?.Tokopedia?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Tokopedia</h2>
            <div className={
                contents.data.List.Tokopedia.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }
              >
              {contents.data.List.Tokopedia.Data.map((item, index) => (
                <div
                  key={`tokopedia-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Phone ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* RedDoorz Section */}
        {contents?.data.List?.RedDoorz?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">RedDoorz</h2>
            <div className={
                contents.data.List.RedDoorz.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.RedDoorz.Data.map((item, index) => (
                <div
                  key={`reddoorz-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Provider ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dukcapil Section */}
        {contents?.data.List?.Dukcapil?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Dukcapil</h2>
            <div className={
                contents.data.List.Dukcapil.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.Dukcapil.Data.map((item, index) => (
                <div
                  key={`dukcapil-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Address ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Locate className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Location ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <IdCard className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Passport ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <PersonStanding className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Gender ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bukalapak Section */}
        {contents?.data.List?.BukalaPak?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Bukalapak</h2>
            <div className={
                contents.data.List.BukalaPak.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.BukalaPak.Data.map((item, index) => (
                <div
                  key={`bukalapak-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apollo Section */}
        {contents?.data.List?.Apollo?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Apollo</h2>
            <div className={
                contents.data.List.Apollo.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.Apollo.Data.map((item, index) => (
                <div
                  key={`apollo-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <BaggageClaim className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Work ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Flag className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Country ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Linkedin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.LinkedinURL ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* People Data Labs Section */}
        {contents?.data.List?.PeopleDataLabs?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">People Data Labs</h2>
            <div className={
                contents.data.List.PeopleDataLabs.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.PeopleDataLabs.Data.map((item, index) => (
                <div
                  key={`people-data-labs-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Address ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Pertamina */}
        {contents?.data.List?.MyPertamina?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">My Pertamina</h2>
            <div className={
                contents.data.List.MyPertamina.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.MyPertamina.Data.map((item, index) => (
                <div
                  key={`my-pertamina-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Phone ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Phone ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 
        
        {/* Tk Indoscreen com */}
        {contents?.data.List?.['Tk.indoscreen.com']?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Tk.Indoscreen.com</h2>
            <div className={
                contents.data.List['Tk.indoscreen.com'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List['Tk.indoscreen.com'].Data.map((item, index) => (
                <div
                  key={`tk-indonesiascreen-com-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 

         {/* Instagram */}
         {contents?.data.List?.['Instagram Parsing']?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Instagram Parsing</h2>
            <div className={
                contents.data.List['Instagram Parsing'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List['Instagram Parsing'].Data.map((item, index) => (
                <div
                  key={`instagram-parsing-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Address ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 

        {/* Donjuji */}
        {contents?.data.List?.DonJuji?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Tk.Indoscreen.com</h2>
            <div className={
                contents.data.List.DonJuji.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.DonJuji.Data.map((item, index) => (
                <div
                  key={`donjuji-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <IdCard className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Data ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <IdCard className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.LeakBase ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 

        {/* Wattpad */}
        {contents?.data.List?.Wattpad?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Wattpad</h2>
            <div className={
                contents.data.List['Tk.indoscreen.com'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.Wattpad.Data.map((item, index) => (
                <div
                  key={`Wattpad-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Country ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{moment(item.BDay).format('YYYY-MM-DD') ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Location ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Facebook className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FacebookID ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}  

        {/* Trello */}
        {contents?.data.List?.Trello?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Trello</h2>
            <div className={
                contents.data.List.Trello.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.Trello.Data.map((item, index) => (
                <div
                  key={`trello-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}  

        {/* Twitter */}
        {contents?.data.List?.['Twitter 200M']?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Twitter 200M</h2>
            <div className={
                contents.data.List['Twitter 200M'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List['Twitter 200M'].Data.map((item, index) => (
                <div
                  key={`twitter-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 

        {/* Pizap */}
        {contents?.data.List?.Pizap?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Pizap</h2>
            <div className={
                contents.data.List.Pizap.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.Pizap.Data.map((item, index) => (
                <div
                  key={`pizap-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Facebook className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FacebookID ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Wahana Express */}
        {contents?.data.List?.['Wahana Express']?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Wahana Express</h2>
            <div className={
                contents.data.List['Wahana Express'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List['Wahana Express'].Data.map((item, index) => (
                <div
                  key={`wahana-express-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Phone ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Phone2 ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Address ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.City ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.ShippingAddress ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Region ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.CompanyName ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}  

        {/* Linkedin Scraped Data */}
        {contents?.data.List?.['LinkedIn Scraped Data']?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">LinkedIn Scraped Data</h2>
            <div className={
                contents.data.List['LinkedIn Scraped Data'].Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List['LinkedIn Scraped Data'].Data.map((item, index) => (
                <div
                  key={`linkedin-scraped-data-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Email ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Gender ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <LinkedinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.LinkedinID ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Sword className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Skills ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.CompanyName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Industry ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Region ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.GeoLocation ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indonesian Car Owner */}
        {contents?.data.List?.IndonesiaCarOwner?.Data?.length != null && (
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Indonesian Car Owner</h2>
            <div className={
                contents.data.List.IndonesiaCarOwner.Data.length === 1
                  ? "flex gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }>
              {contents.data.List.IndonesiaCarOwner.Data.map((item, index) => (
                <div
                  key={`indonesia-car-owner-${index}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.FullName ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Home className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Address ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <IdCard className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.NIK ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Car className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.BPKB ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Car className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.EngineNumber ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Car className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.Type ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <Car className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden whitespace-nowrap max-w-full block">{item.VehicleYear ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Handle if both are empty */}
        {(!contents?.data.List?.Tokopedia?.Data?.length &&
          !contents?.data.List?.RedDoorz?.Data?.length && 
          !contents?.data.List?.BukalaPak?.Data?.length &&
          !contents?.data.List?.Apollo?.Data?.length &&
          !contents?.data.List?.Pizap?.Data?.length && 
          !contents?.data.List?.Wattpad?.Data?.length && 
          !contents?.data.List?.PeopleDataLabs?.Data?.length && 
          !contents?.data.List?.IndonesiaCarOwner?.Data?.length && 
          !contents?.data.List?.Dukcapil?.Data?.length &&
          !contents?.data.List?.['Tk.indoscreen.com']?.Data?.length && 
          !contents?.data.List?.['Instagram Parsing']?.Data?.length && 
          !contents?.data.List?.['Twitter 200M']?.Data?.length && 
          !contents?.data.List?.['Wahana Express']?.Data?.length 
        ) && (
          <div className="text-center h-screen justify-center items-center flex text-gray-500 text-lg">
            No data available.
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ContentItems;

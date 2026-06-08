"use client";

import React from "react";

const SkeletonWaitingPayment = () => {
  return (
    <div className="py-28 flex flex-col items-center px-4 md:px-12 space-y-6">
      {/* Card 1 */}
      <div className="w-full md:w-1/2 rounded-xl border p-6 shadow-md bg-white">
        <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-3" />
        <div className="w-40 h-8 bg-gray-200 animate-pulse rounded mb-3 mx-auto" />
        <div className="w-28 h-4 bg-gray-200 animate-pulse rounded mx-auto" />
      </div>

      {/* Card 2 */}
      <div className="w-full md:w-1/2 rounded-xl border p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="w-full h-32 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex justify-between">
            <div className="w-14 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-28 h-5 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonWaitingPayment;

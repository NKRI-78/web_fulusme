"use client";

import React from "react";

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row animate-pulse">
        {/* Gambar skeleton */}
        <div className="md:w-1/2 h-48 md:h-60 bg-gray-200" />

        {/* Detail skeleton */}
        <div className="md:w-1/2 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />

            <div className="mt-4 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <div className="h-10 w-1/2 bg-gray-200 rounded" />
            <div className="h-10 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;

"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";

import { setShowLogoutModal } from "@store/slices/modalSlice";
import { removeAuthUser } from "@shared/lib/auth";

const ModalLogout: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

    const showLogoutModal = useSelector((state: RootState) => state.modal.showLogoutModal);

    const handleLogout = async () => {
      dispatch(setShowLogoutModal(false));

      // Clear auth cookies (httpOnly + session) then hard-reload so the server
      // re-renders logged-out and stale client state is torn down. Same flow as
      // the auto-logout path in SessionTimeoutProvider.
      try {
        await removeAuthUser();
      } catch {
        // force the user out even if the logout call fails
      }

      window.location.href = "/auth/login";
    };
 
    return (   
       showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
            <h3 className="text-md text-black font-semibold mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => dispatch(setShowLogoutModal(false))}
                className="px-4 py-2 bg-gray-600 rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )
    );
    
};

export default ModalLogout;
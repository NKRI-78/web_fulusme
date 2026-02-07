import React, { useState } from "react";
import { UserRound, UserRoundCheck } from "lucide-react";
import { PanelContainer } from "./PanelContainer";
import { PanelContent } from "./PanelContent";
import Modal from "@/app/helper/Modal";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import RegisterOtp from "../auth/register/RegisterOtp";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";

const DashboardUser: React.FC<{
  user: AuthDataResponse | null;
}> = ({ user }) => {
  const [step, setStep] = useState<"otp" | "role" | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleClose = () => {
    setShowOtpModal(false);
  };

  return (
    <>
      <PanelContainer clasName="flex flex-col items-center text-center">
        {user?.enabled ? (
          <PanelContent
            icon={<UserRoundCheck className="w-16 h-16" />}
            title="Peran Belum Dipilih"
            renderMessage={() => (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                Sebelum mulai menjelajahi aplikasi, yuk tentukan dulu peran yang
                sesuai dengan tujuan Anda. Jika ingin menawarkan proyek
                investasi, pilih sebagai{" "}
                <span className="font-semibold text-[#2e2275]">Penerbit</span>.
                Namun jika Anda ingin mencari peluang investasi dan menanamkan
                modal, pilih sebagai{" "}
                <span className="font-semibold text-[#2e2275]">Investor</span>.
              </p>
            )}
            buttonTitle="Pilih Peran"
            actionButton={() => {
              setStep("role");
              setShowOtpModal(true);
            }}
          />
        ) : (
          <PanelContent
            icon={<UserRound className="w-16 h-16" />}
            title="Akun Belum Terverifikasi"
            message="Akun ini perlu diverifikasi terlebih dahulu. Silakan masukkan kode OTP yang telah kami kirimkan ke email Anda agar dapat menggunakan aplikasi secara penuh."
            buttonTitle="Verifikasi Akun"
            actionButton={() => {
              setStep("otp");
              setShowOtpModal(true);
            }}
          />
        )}
      </PanelContainer>

      <Modal isOpen={showOtpModal} onClose={handleClose}>
        {step === "role" && <RegisterSelectRole onClose={handleClose} />}
        {step === "otp" && (
          <RegisterOtp onNext={() => setStep("role")} onClose={handleClose} />
        )}
      </Modal>
    </>
  );
};

export default DashboardUser;

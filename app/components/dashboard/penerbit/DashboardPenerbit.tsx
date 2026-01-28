import React, { useEffect, useState } from "react";
import { Building, UserSearch } from "lucide-react";
import { Step, Stepper } from "react-form-stepper";
import { PanelContent } from "../PanelContent";
import { PanelContainer } from "../PanelContainer";
import { User } from "@/app/interfaces/user/IUser";
import GridView from "../../GridView";
import { ProjectCard } from "../PenerbitProjectCard";

interface Props {
  profile: User | null;
  hasPaidAdministration: boolean;
  isUploadDokumenPelengkap: boolean;
}

export const DashboardPenerbit: React.FC<Props> = ({
  profile,
  hasPaidAdministration,
  isUploadDokumenPelengkap,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const projects = profile?.company.projects ?? [];

  const statusSteps: Record<string, number> = {
    UNVERIFIED: 0,
    VERIFIED: 1,
    PENDING: 1,
    UNPAID: 2,
    PAID: 2,
    APPROVED: 2,
    REJECTED: 3,
    PUBLISH: 3,
  };

  const projectStatus = profile?.company?.projects?.[0]?.status ?? "";

  //* set timeline project by status
  useEffect(() => {
    const statusProject = profile?.company?.projects
      ? projectStatus
      : profile?.verify_emiten
      ? "VERIFIED"
      : "UNVERIFIED";

    setCurrentStep(statusSteps[statusProject]);
  }, [profile]);

  const rejectedProject = projectStatus === "REJECTED";

  const renderPanelContent = (): React.ReactNode => {
    if (profile?.company.projects) {
      if (hasPaidAdministration) {
        return (
          <PanelContent
            title="Bukti Pembayaran Sudah Diterima"
            message="Mohon tunggu informasi dari admin yang akan memberikan 
            akses lanjutan terkait pengisian dokumen pelengkap maksimal kerja 2x24 jam. 
            Informasi tersebut akan dikirimkan melalui inbox, 
            silakan cek inbox Anda secara berkala. Terima kasih."
            buttonTitle="Inbox"
            navigateToPath={"/inbox"}
          />
        );
      } else if (isUploadDokumenPelengkap) {
        return (
          <PanelContent
            title="Upload Dokumen Pelengkap"
            message="Segera cek inbox email Anda, karena tim admin publish 
            telah mengirimkan akses form yang perlu Anda gunakan untuk 
            mengunggah dokumen pelengkap."
            buttonTitle="Inbox"
            navigateToPath={"/inbox"}
          />
        );
      } else {
        if (projectStatus === "APPROVED") {
          return (
            <PanelContent
              title="Pembayaran Administrasi Proyek"
              message="Selamat Proyek Anda berhasil di verifikasi oleh Admin. 
              Link pembayaran administrasi proyek telah dikirimkan oleh admin. 
              Harap baca dengan seksama informasi yang tertera pada invoice, 
              kemudian segera lakukan pembayaran agar proses penayangan proyek 
              dapat berlangsung lebih cepat. Terima kasih."
              buttonTitle="Inbox"
              navigateToPath={"/inbox"}
            />
          );
        } else {
          return (
            <PanelContent
              title="Proyek Sedang Direview"
              message="Proyek Anda sedang dalam tahap review oleh admin. Mohon tunggu, 
              tagihan pembayaran administrasi akan segera dikirimkan melalui menu inbox. 
              Pastikan Anda mengecek inbox secara berkala. Terima kasih."
              buttonTitle="Inbox"
              navigateToPath={"/inbox"}
            />
          );
        }
      }
    } else {
      if (profile?.company.name) {
        if (profile.verify_emiten) {
          return (
            <PanelContent
              title="Akun Berhasil Diverifikasi"
              message="Selamat! Akun Anda telah berhasil diverifikasi. Sekarang Anda sudah bisa mulai membuat project pertama Anda."
              buttonTitle="Buat Proyek"
              navigateToPath={"/create-project"}
            />
          );
        } else {
          return (
            <PanelContent
              icon={<UserSearch className="w-16 h-16" />}
              title="Akun Anda Sedang Direview"
              message="Tim kami sedang memproses data akun Anda. Mohon tunggu hingga selesai. Setelah itu, Anda dapat mulai mengajukan proyek."
            />
          );
        }
      } else {
        return (
          <PanelContent
            icon={<Building className="w-16 h-16" />}
            title="Lengkapi Data Perusahaan Anda"
            message="Untuk menayangkan proyek, Anda perlu menyelesaikan proses registrasi data perusahaan terlebih dahulu. Silakan lengkapi segera untuk melanjutkan."
            buttonTitle="Registrasi Perusahaan"
            navigateToPath={"/form-penerbit?form=complete-company"}
          />
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      {projectStatus !== "PUBLISH" && projectStatus !== "REJECTED" && (
        <PanelContainer clasName="flex flex-col items-center text-center">
          {renderPanelContent()}
        </PanelContainer>
      )}

      <PanelContainer>
        <h2 className="font-bold text-lg text-black">Status Proyek</h2>

        <div className="text-black">
          <Stepper
            activeStep={currentStep}
            connectorStateColors
            styleConfig={{
              size: "40px", // diameter lingkaran step
              circleFontSize: "16px", // font angka di dalam lingkaran
              borderRadius: "50%", // bentuk lingkaran (bisa "0" buat kotak)
              fontWeight: 500, // ketebalan label
              activeBgColor: rejectedProject ? "#FF0000" : "#10B981",
              activeTextColor: "#fff",
              completedBgColor: "#10B981",
              completedTextColor: "#fff",
              inactiveBgColor: "#E5E7EB",
              inactiveTextColor: "#9CA3AF",
              labelFontSize: "14px",
              // label colors
              activeLabelColor: "#000",
              completedLabelColor: "#000",
              inactiveLabelColor: "#000",
            }}
            connectorStyleConfig={{
              size: 3,
              activeColor: rejectedProject ? "#FF0000" : "#10B981", // garis menuju step aktif
              completedColor: "#10B981", // garis completed → hijau
              disabledColor: "#E5E7EB", // garis belum jalan
              style: "",
            }}
          >
            <Step label="Data Diproses" onClick={() => {}} />
            <Step label="Review Proyek" onClick={() => {}} />
            <Step label="Pembayaran Administrasi" onClick={() => {}} />
            {rejectedProject ? (
              <Step label="Proyek Ditolak" onClick={() => {}} />
            ) : (
              <Step label="Persetujuan Proyek" onClick={() => {}} />
            )}
          </Stepper>
        </div>
      </PanelContainer>

      {projects.length > 0 && (
        <PanelContainer>
          <h2 className="font-bold text-lg text-black mb-5">Proyek Saya</h2>

          {projects && (
            <GridView
              items={projects}
              gapClass="gap-4"
              breakpointCols={{ sm: 1, md: 2, lg: 4 }}
              itemKey={(p) => p.id}
              renderItem={(p, i) => {
                return <ProjectCard project={p} />;
              }}
            />
          )}
        </PanelContainer>
      )}
    </div>
  );
};

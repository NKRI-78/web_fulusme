import React from "react";
import { PanelContainer } from "../PanelContainer";
import { PanelContent } from "../PanelContent";
import { UserSearch, Infinity } from "lucide-react";
import { User } from "@/app/interfaces/user/IUser";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import { formatRupiah } from "@/app/lib/utils";
import { Project } from "@/app/interfaces/project/IProject";
import GridView from "../../GridView";
import { ProjectCard } from "../../project/ProjectCard";

interface Props {
  profile: User | null;
  data: InvestorData | null;
  projects: Project[];
}

const DashboardPemodalPerusahaan: React.FC<Props> = ({
  profile,
  data,
  projects,
}) => {
  return (
    <div className="mb-16">
      <div className="space-y-1 mb-4">
        <p className="text-xl font-bold">Pemodal Perusahaan</p>
        <p className="text-sm text-gray-500">
          Sebagai pemodal perusahaan, Anda tidak memiliki limit pembelian efek
          dan bebas berinvestasi di berbagai proyek tanpa batasan.
        </p>
      </div>

      {!profile?.verify_investor && (
        <PanelContainer clasName="flex flex-col items-center text-center">
          <PanelContent
            icon={<UserSearch className="w-16 h-16" />}
            title="Akun Anda Sedang Direview"
            message="Tim kami sedang memproses data akun Anda. Mohon tunggu hingga selesai. Setelah itu, Anda dapat mulai berinvestasi."
          />
        </PanelContainer>
      )}

      {profile?.verify_investor && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status Investasi */}
          <PanelContainer>
            <h1 className="text-gray-800 text-lg font-semibold mb-2">
              Status Investasi
            </h1>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumlah Proyek</span>
                <span className="font-semibold text-gray-900">
                  {data?.summary.projects_count}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Dana Investasi</span>
                <span className="font-semibold text-gray-900">
                  {formatRupiah(data?.summary.paid_all_time_idr)}
                </span>
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium gap-1">
                <Infinity className="w-4 h-4" />
                <span>Tidak ada batas kuota investasi</span>
              </div>
            </div>
          </PanelContainer>

          {/* Informasi */}
          <PanelContainer>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-gray-800 text-lg font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Informasi
                </h1>
              </div>
              <hr className="mb-4 border-gray-200" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Terpakai Tahun Ini</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(data?.summary.used_this_year_idr)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tagihan Aktif</span>
                  <span className="font-semibold text-gray-900">
                    {data?.summary.active_invoices}
                  </span>
                </div>
              </div>
            </div>
          </PanelContainer>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-4 mt-8">
          <p className="text-xl font-bold">Proyek yang sedang berjalan</p>
          <GridView
            items={projects}
            gapClass="gap-4"
            breakpointCols={{ sm: 2, md: 3, lg: 4 }}
            itemKey={(p) => p.id}
            renderItem={(p, i) => {
              return <ProjectCard project={p} />;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPemodalPerusahaan;

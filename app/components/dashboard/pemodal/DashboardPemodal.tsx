import React from "react";
import { PanelContainer } from "../PanelContainer";
import { PanelContent } from "../PanelContent";
import { Infinity, UserSearch } from "lucide-react";
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

const DashboardPemodal: React.FC<Props> = ({ profile, data, projects }) => {
  return (
    <div className="mb-16">
      <div className="space-y-1 mb-4">
        <p className="text-xl font-bold">
          Pemodal Pribadi{" "}
          {data?.rek_efek ? (
            <span className="text-green-600 text-base font-medium">
              (dengan Rekening Efek)
            </span>
          ) : (
            <span className="text-red-600 text-base font-medium">
              (tanpa Rekening Efek)
            </span>
          )}
        </p>
        <p className="text-sm text-gray-500">
          {data?.rek_efek
            ? "Anda tidak memiliki limit pembelian efek dan bebas berinvestasi di berbagai proyek tanpa batasan."
            : (data?.summary?.annual_income_idr ?? 0) >= 500_000_000
            ? "Limit pembelian efek Anda sebesar 10% dari pendapatan tahunan."
            : "Limit pembelian efek Anda sebesar 5% dari pendapatan tahunan."}
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
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PanelContainer>
              {data?.rek_efek ? (
                <>
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
                      <span className="text-gray-600">
                        Total Dana Investasi
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatRupiah(data?.summary.paid_all_time_idr)}
                      </span>
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium gap-1">
                      <Infinity className="w-4 h-4" />
                      <span>Tidak ada batas kuota investasi</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-gray-800 text-lg font-semibold mb-2">
                    Kuota Investasi Tersedia
                  </h1>
                  <p className="text-green-500 text-3xl font-bold">
                    {formatRupiah(data?.summary.remaining_quota_idr)}
                  </p>
                  {(() => {
                    const annual = data?.summary.annual_quota_idr || 0;
                    const remaining = data?.summary.remaining_quota_idr || 0;
                    const used = annual - remaining;
                    const percentage =
                      annual > 0 ? Math.min((used / annual) * 100, 100) : 0;

                    return (
                      <>
                        <p className="text-sm text-gray-500 mt-1">
                          {percentage.toFixed(0)}% Terpakai Tahun Ini
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}

                  <p className="text-sm text-gray-500 mt-2">
                    Limit Investasi:{" "}
                    {formatRupiah(data?.summary.annual_quota_idr)}
                  </p>
                </>
              )}
            </PanelContainer>

            <PanelContainer>
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-gray-800 text-lg font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Informasi
                  </h1>
                </div>
                <hr className="mb-4 border-gray-200" />

                {/* Body */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pendapatan Tahunan</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(data?.summary.annual_income_idr)}
                    </span>
                  </div>
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
        </>
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

export default DashboardPemodal;

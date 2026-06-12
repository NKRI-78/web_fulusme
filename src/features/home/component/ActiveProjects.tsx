import Link from "next/link";
import { ProjectCard } from "@features/project/components/project/ProjectCard";
import GridView from "@shared/ui/GridView";
import { fetchProjects } from "@/features/project/service";

const ActiveProjects = async () => {
  const projects = await fetchProjects();
  return (
    <section className="bg-white relative text-black py-12 px-6 text-center md:px-16">
      <h2 className="text-2xl font-bold text-center mb-2">
        Investasi Proyek Yang Sedang Berjalan
      </h2>
      <p className="text-center text-sm mb-10">
        Lihat daftar investasi bisnis terbaru yang sedang berlangsung dan
        temukan peluang untuk berinvestasi hari ini.
      </p>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#10565C]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#10565C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-semibold text-lg mb-1">
            Belum ada proyek yang berjalan
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            Saat ini belum tersedia proyek investasi aktif. Silakan cek kembali
            dalam waktu dekat untuk peluang investasi terbaru.
          </p>
        </div>
      ) : (
        <GridView
          items={projects}
          gapClass="gap-4"
          breakpointCols={{ sm: 2, md: 3, lg: 4 }}
          itemKey={(p) => p.id}
          renderItem={(p) => <ProjectCard project={p} />}
        />
      )}

      {projects.length > 1 && (
        <Link
          href="/business-list"
          className="inline-block bg-[#10565C] relative hover:bg-[#0d464b] text-white px-6 py-2 rounded-full font-semibold my-10"
        >
          Lihat Proyek Selengkapnya
        </Link>
      )}
    </section>
  );
};

export default ActiveProjects;

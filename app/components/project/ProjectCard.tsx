import ProgressBar from "@/app/(defaults)/sukuk/components/ProgressBar";
import { Project } from "@/app/interfaces/project/IProject";
import { formatRupiah } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const router = useRouter();

  console.log("project.user_paid_amount");
  console.log(project.user_paid_amount);
  console.log("project.target_amount");
  console.log(project.target_amount);

  const percentage = project.target_amount
    ? (project.user_paid_amount / project.target_amount) * 100
    : 0;

  console.log(percentage);

  return (
    <div
      onClick={() => {
        router.push(`/sukuk/${project.id}`);
      }}
      className="rounded-xl cursor-pointer overflow-hidden shadow"
    >
      <div className="relative h-40">
        <img
          src={
            project.medias.length !== 0
              ? project.medias[0].path
              : "/images/img.jpg"
          }
          alt={project.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/img.jpg";
          }}
        />
        <div className="absolute inset-0 bg-opacity-60 bg-[#10565C]/40" />

        {/* jenis proyek */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-white/90 text-[#10565C] text-xs font-semibold px-3 py-[2px] rounded-full">
            {project.type_of_project}
          </span>
        </div>
      </div>

      <div className="px-4 pt-2 pb-4 bg-[#10565C] w-full h-full text-white">
        {/* title proyek */}
        <p className="font-semibold text-lg text-start text-white mb-2 truncate">
          {project.title}
        </p>

        {/* nilai penawaran */}
        <p className="text-white text-xs text-start">
          Dana terkumpul{" "}
          <span className="font-semibold">
            {formatRupiah(project?.user_paid_amount)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold">
            {formatRupiah(project?.target_amount)}
          </span>
        </p>

        {/* progress bar */}
        <ProgressBar percentage={percentage} />

        <div className="w-full flex justify-between mt-3">
          <p className="text-white text-xs">Tersisa {project?.stok_lot} Lot</p>
          <p className="text-white/50 text-xs">
            {project.investor_paid} investor
          </p>
        </div>

        {/* sisa masa tayang */}
        <div className="w-full flex justify-end mt-3">
          <p className="text-white text-xs font-semibold">{`${project.remaining_days} hari lagi`}</p>
        </div>
      </div>
    </div>
  );
};

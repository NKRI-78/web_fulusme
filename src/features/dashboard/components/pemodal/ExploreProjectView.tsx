import { Project } from "@shared/types/project/IProject";
import React from "react";
import { PanelContainer } from "../PanelContainer";
import GridView from "@shared/ui/GridView";
import { ProjectCard } from "@features/project/components/project/ProjectCard";

interface Props {
  projects: Project[];
}

const ExploreProjectView: React.FC<Props> = ({ projects }) => {
  return (
    <PanelContainer>
      <h2 className="font-bold text-lg text-black mb-5">
        Proyek yang sedang berjalan
      </h2>

      <GridView
        items={projects}
        gapClass="gap-4"
        breakpointCols={{ sm: 2, md: 2, lg: 4 }}
        itemKey={(p) => p.id}
        renderItem={(p) => {
          return <ProjectCard project={p} />;
        }}
      />
    </PanelContainer>
  );
};

export default ExploreProjectView;

import { Metadata } from "next";

import { fetchDetailProject } from "../action/fetchDetailProject";
import { IDetailProjectData } from "../interface/IDetailProject";
import SukukClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}): Promise<Metadata> {
  const param = await params;
  const detail: IDetailProjectData = await fetchDetailProject(param.projectId);

  const APP_DEFAULT_TITLE = detail.title ?? "";
  const APP_DESCRIPTION = detail.desc_job;

  return {
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en-US",
        "de-DE": "/de-DE",
      },
    },
    openGraph: {
      title: APP_DEFAULT_TITLE,
      description: APP_DESCRIPTION,
      type: "article",
      locale: "en_US",
      siteName: "Fulusme",
      url: `/sukuk/${param.projectId}`,
      images:
        detail?.medias?.length > 0
          ? detail.medias
              .filter((media) => Boolean(media?.path))
              .map((media) => ({
                url: media.path.startsWith("http")
                  ? media.path
                  : media.path.startsWith("/")
                    ? media.path
                    : `/${media.path}`,
                width: 800,
                height: 600,
                alt: APP_DEFAULT_TITLE,
              }))
          : [
              {
                url: "/images/default-image.png",
                width: 800,
                height: 600,
                alt: APP_DEFAULT_TITLE,
              },
            ],
    },
  };
}
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return <SukukClient projectId={(await params).projectId} />;
}

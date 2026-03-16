"use client";

import {
  InvestorData,
  InvestorDataPortfolio,
} from "@/app/interfaces/investor/IInvestorData";
import React, { useEffect, useState } from "react";
import { PanelContainer } from "../PanelContainer";
import GridView from "../../GridView";
import PortfolioCard from "../../portfolio/PortfolioCard";
import { getUser } from "@/app/lib/auth";
import Center from "../../Center";
import CircularProgressIndicator from "../../CircularProgressIndicator";
import { AnimatedWrapper } from "../../AnimatedWrapper";
import { FolderOpen } from "lucide-react";
import api from "@/utils/axios";

const PortfolioView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);
  const [portfolios, setPortofolios] = useState<InvestorDataPortfolio[]>([]);

  //* fetch data
  useEffect(() => {
    setLoading(true);

    const user = getUser();

    if (user) {
      const fetchInvestorData = async () => {
        try {
          const res = await api.get(`/api/v1/dashboard/investor`);
          const data = res.data.data;
          setInvestorData(data);
          setPortofolios(data.portfolio ?? []);
        } catch (error) {
          setInvestorData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchInvestorData();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Center fullParent horizontal vertical>
          <CircularProgressIndicator />
        </Center>
      ) : portfolios.length > 0 ? (
        <AnimatedWrapper>
          <PanelContainer>
            <GridView
              items={portfolios}
              gapClass="gap-4"
              breakpointCols={{ sm: 2, md: 2, lg: 4 }}
              itemKey={(p) => p.project_uid}
              renderItem={(p) => {
                return (
                  <PortfolioCard
                    data={p}
                    hasRekeningEfek={investorData?.rek_efek}
                  />
                );
              }}
            />
          </PanelContainer>
        </AnimatedWrapper>
      ) : (
        <AnimatedWrapper>
          <div className="flex flex-col items-center text-gray-600 rounded-md py-40">
            <FolderOpen size={64} className="mb-4 text-gray-400" />
            <p className="text-lg font-medium">Belum ada portfolio</p>
            <p className="text-sm text-gray-500">
              Investasi kamu akan tampil di sini setelah membeli proyek dan
              sudah menandatangani surat Akad.
            </p>
          </div>
        </AnimatedWrapper>
      )}
    </>
  );
};

export default PortfolioView;

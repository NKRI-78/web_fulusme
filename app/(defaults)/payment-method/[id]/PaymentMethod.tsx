"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { API_BACKEND, API_PG } from "@/app/utils/constant";
import { getUser } from "@/app/lib/auth";
import { PaymentMethodType } from "./components/types";
import TransactionSummary from "./components/TransactionSummary";
import ConfirmButton from "./components/ConfirmButton";
import ProjectCardSkeleton from "./components/ProjectCardSkeleton";
import { Project } from "@/app/interfaces/project/IProject";
import Custom404 from "@/app/not-found";
import ProjectCardDummy from "./components/ProjectCardDummy";
import ProjectCardCheckout from "./components/ProjectCardDummy";

const PaymentMethod = ({ id }: { id: string }) => {
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [totalLot, setTotalLot] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [project, setProject] = useState<Project | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("invest_amount");
    if (saved) {
      const parsed = JSON.parse(saved);
      const { price, total_lot } = parsed;
      setAmount(Number(price));
      setTotalLot(Number(total_lot));
    }
  }, []);

  const baseAmount = amount;

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setLoading(true);
      axios
        .get(`${API_PG}/api/v1/channel`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((response) => {
          setMethods(response.data.data);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  //* fetch project detail by id
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(
            `${API_BACKEND}/api/v1/project/detail/${id}`,
          );
          setProject(response.data.data);
        } catch (error: any) {
          if (error.response?.status === 400) {
            setIsNotFound(true);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, []);

  const handleSelect = (method: PaymentMethodType) => {
    setSelectedMethod(method);
  };

  const handleStorePayment = async () => {
    if (!selectedMethod) return;
    setLoading(true);
    try {
      const payload = {
        project_id: id,
        payment_method: selectedMethod.id.toString(),
        amount: baseAmount,
        lot: totalLot,
      };

      const userData = getUser();
      if (userData) {
        const endpoint = `${API_BACKEND}/api/v1/project/payment`;
        const result = await axios.post(endpoint, payload, {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });
        router.replace(`/waiting-payment?orderId=${result.data.data.id}`);
      }
    } catch (err: any) {
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message || JSON.stringify(err.response.data);
        } else if (err.request) {
          errorMessage = "Tidak ada respon dari server.";
        } else {
          errorMessage = err.message;
        }
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        confirmButtonText: "Selesaikan Transaksi Sebelumnya",
      }).then((result) => {
        if (result.isConfirmed) router.push("/dashboard/investor-transaction");
      });
    }
    setLoading(false);
  };

  // skeleton shimmer card
  const SkeletonCard = () => (
    <div className="relative flex flex-col items-center justify-center rounded-xl border p-4 overflow-hidden">
      <div className="h-10 w-16 bg-gray-200 rounded mb-2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-1 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="h-2 w-12 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </div>
  );

  return isNotFound ? (
    <>
      <Custom404 />
    </>
  ) : (
    <div className="py-28 px-4 md:px-12 flex flex-col items-center">
      {/* Card Proyek */}
      {loading ? (
        <ProjectCardSkeleton />
      ) : (
        <>
          <ProjectCardCheckout
            title={project?.title ?? "-"}
            company={project?.company.name ?? "-"}
            location={project?.location.name ?? "-"}
            locationUrl={project?.location.url ?? "-"}
            unitPrice={Number(project?.unit_price ?? "-")}
            minInvest={Number(project?.min_invest ?? "-")}
            roi={project?.roi ?? "-"}
            tenor={project?.loan_term ?? "-"}
            image={project?.medias[0]?.path ?? "-"}
            amountInvested={amount ?? 0}
          />
        </>
      )}
      {/* Card Utama */}
      <div className="w-full bg-white rounded-2xl my-2 p-6 shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">
          Pilih Metode Pembayaran
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : methods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleSelect(method)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedMethod?.id === method.id
                      ? "border-[#10565C] bg-[#10565C]/10 shadow-md"
                      : "border-gray-200 hover:border-[#10565C]"
                  }`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-10 object-contain mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800 text-center">
                    {method.name}
                  </p>
                </div>
              ))}
        </div>

        {/* Rincian + Button */}
        {selectedMethod && (
          <div className="mt-6">
            <TransactionSummary
              method={selectedMethod}
              baseAmount={baseAmount ?? 0}
              onTotalChange={setTotalPrice}
            />

            <hr className="my-6 border-gray-200" />

            <div className="flex justify-end">
              <ConfirmButton
                onClick={() => handleStorePayment()}
                disabled={!selectedMethod || loading}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;

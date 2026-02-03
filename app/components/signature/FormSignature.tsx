"use client";

import React, { useState } from "react";
import ContainerSignature from "./component/ContainerSignature";
import DocumentPreview from "./component/DocumentPreview";
import { PDFDocument } from "pdf-lib";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { uploadMediaService } from "@/app/helper/mediaService";

interface FormData {
  signature: string;
}

const FormSignature: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pdfUrl = searchParams.get("pdf");
  const projectPaymentId = searchParams.get("field5");
  console.log("Project Payment ID:", projectPaymentId);

  const [formData, setFormData] = useState<FormData>({ signature: "" });

  const handleSignatureSave = (signatureUrl: string) => {
    setFormData((prev) => ({ ...prev, signature: signatureUrl }));
  };

  const handleSubmit = async () => {
    const userCookie = Cookies.get("user");
    let token: string | null = null;

    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        token = parsedUser.token;
      } catch (e) {
        console.error("Gagal parsing user cookie:", e);
      }
    }

    if (!token) {
      Swal.fire({
        title: "Gagal",
        text: "Token tidak ditemukan, silakan login ulang.",
        icon: "error",
      });
      return;
    }

    if (!formData.signature) {
      Swal.fire({
        title: "Tanda Tangan Wajib Diisi",
        text: "Silakan isi tanda tangan terlebih dahulu!",
        icon: "warning",
        timer: 2500,
      });
      return;
    }

    if (!pdfUrl) {
      Swal.fire({
        title: "Dokumen tidak ditemukan",
        text: "Tidak ada file PDF untuk ditandatangani.",
        icon: "error",
        timer: 2500,
      });
      return;
    }

    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const signatureRes = await fetch(formData.signature);
    const signatureBytes = await signatureRes.arrayBuffer();

    let signatureImage;
    try {
      signatureImage = await pdfDoc.embedPng(signatureBytes);
    } catch {
      signatureImage = await pdfDoc.embedJpg(signatureBytes);
    }

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width: sigW, height: sigH } = signatureImage.scale(0.1);

    lastPage.drawImage(signatureImage, {
      x: 65,
      y: 365,
      width: sigW,
      height: sigH,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const file = new File([blob], "signed.pdf", { type: "application/pdf" });

    const uploadMediaResult = await uploadMediaService(file);

    let signedPdfUrl = uploadMediaResult.data?.path;

    if (!signedPdfUrl) {
      Swal.fire({
        title: "Gagal",
        text: "Upload PDF gagal.",
        icon: "error",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/contract-letter-project-payment/upload`,
        {
          project_payment_id: projectPaymentId,
          path: signedPdfUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Tanda tangan berhasil ditempel & dikirim.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("signature");
        router.push("/dashboard");
      });
    } catch (err: any) {
      Swal.fire({
        title: "Gagal",
        text: err.response?.data?.message || "Submit gagal.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 pt-20">
      <h3 className="font-semibold text-gray-900 mt-3 text-lg">
        Form Tanda Tangan Pemodal
      </h3>

      <DocumentPreview fileUrl={pdfUrl ?? ""} />

      <ContainerSignature
        formData={formData}
        onSignatureSave={handleSignatureSave}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded bg-[#3C2B90] text-white hover:bg-[#2e2176]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormSignature;

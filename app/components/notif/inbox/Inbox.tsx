"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import InboxModalDialog from "../InboxModalDialog";
import Swal from "sweetalert2";
import { InboxResponse } from "../inbox-interface";
import InboxEmpty from "../InboxEmpty";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setBadge } from "@/redux/slices/badgeSlice";
import { getUser } from "@/app/lib/auth";
import InboxCard from "../InboxCard";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchInboxThunk, updateInboxes } from "@/redux/slices/inboxSlice";

const Inbox = () => {
  // data hook
  const [selectedInbox, setSelectedInbox] = useState<InboxResponse | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const {
    items: inboxes,
    loading,
    error,
  } = useSelector((state: RootState) => state.inbox);
  const user = getUser();

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchInboxThunk(user?.token));
    }
  }, [user?.token, dispatch]);

  // state hook
  const [dialogIsOpen, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();

  const roleCookie = Cookies.get("role");
  const userRoleCookie = Cookies.get("user");
  let role = null;

  if (roleCookie) {
    try {
      const parsed = JSON.parse(roleCookie);
      role = parsed.role;
    } catch (e) {
      console.error("Gagal parsing roleCookie", e);
    }
  }

  let roleUser = null;

  if (userRoleCookie) {
    try {
      const parsed = JSON.parse(userRoleCookie);
      roleUser = parsed.role;
    } catch (e) {
      console.error("Gagal parsing roleCookie", e);
    }
  }

  // update formKey liat: "app\(defaults)\form-penerbit\UpdateProfileInterface.ts" untuk detail key nya
  // admin mengirim key melalui field_4 yang nanti dicocokan dengan formKey
  const updateKey = selectedInbox?.field_4;

  //* set badge to reducer
  useEffect(() => {
    dispatch(
      setBadge(inboxes.filter((inbox) => inbox.is_read == false).length)
    );
  }, [inboxes]);

  //* mark as read
  const markAsRead = (inboxId: number) => {
    const updatedInboxes = inboxes.map((inbox) => {
      if (inbox.id === inboxId) {
        return {
          ...inbox,
          is_read: true,
        };
      }
      return inbox;
    });
    dispatch(updateInboxes(updatedInboxes));
  };

  //* navigate to billing info
  const navigateToBillingInfo = (inbox: InboxResponse) => {
    // raw payment detail dari api masih berupa data json dalam bentuk string
    // perlu dikonversi dulu ke json
    const rawPaymentDetail = inbox.data;
    const inboxId = inbox.id;
    const projectId = inbox.field_2;

    if (inboxId && rawPaymentDetail) {
      router.push(`/payment-manual/${inboxId}`);
    }
  };

  //* navigate to additional document
  const navigateToAddAditionalDocument = (
    projectId: string | undefined,
    inboxId: number
  ) => {
    if (projectId) {
      router.push(
        `/dokumen-pelengkap?projectId=${projectId}&inboxId=${inboxId}`
      );
    }
  };

  const handleInboxOnClick = (inbox: InboxResponse) => {
    markAsRead(inbox.id);

    setSelectedInbox(inbox);

    if (inbox.field_3 === "reupload-document") {
      setOpenDialog(true);
    } else if (inbox.field_3 === "additional-document") {
      navigateToAddAditionalDocument(inbox.field_2, inbox.id);
    } else if (inbox.field_3 === "uploaded-doc") {
      setOpenDialog(true);
    } else {
      navigateToBillingInfo(inbox);
    }
  };

  return (
    <>
      <div className="py-28 px-14 text-black">
        {loading ? (
          <InboxSkeleton />
        ) : inboxes.length ? (
          <div className="flex flex-col gap-y-3">
            {inboxes?.map((inbox) => {
              return (
                <InboxCard
                  key={inbox.id}
                  inbox={inbox}
                  onClick={() => {
                    handleInboxOnClick(inbox);
                  }}
                />
              );
            })}
          </div>
        ) : error ? (
          <>
            <InboxEmpty title="Ada masalah server" message={error} />
          </>
        ) : (
          <InboxEmpty
            title="Belum ada inbox"
            message="Kamu belum menerima pesan apa pun saat ini."
          />
        )}
      </div>

      {dialogIsOpen && user?.token && selectedInbox && (
        <InboxModalDialog
          role={user.role}
          inbox={selectedInbox}
          onAccept={() => {
            if (selectedInbox.field_3 === "reupload-document") {
              if (updateKey) {
                if (roleUser === "investor institusi") {
                  if (["photo_ktp", "surat-kuasa"].includes(updateKey)) {
                    router.push(
                      `/form-pemodal-perusahaan?update=true&form=${updateKey}`
                    );
                  } else if (
                    [
                      "akta-perubahan-terakhir",
                      "akta-pendirian-perusahaan",
                      "sk-pendirian-perusahaan",
                      "sk-kumham-path",
                      "npwp-perusahaan",
                    ].includes(updateKey)
                  ) {
                    router.push(
                      `/form-data-pemodal-perusahaan?update=true&form=${updateKey}`
                    );
                  } else {
                    router.push(
                      `/form-pemodal-perusahaan?update=true&form=${updateKey}`
                    );
                  }
                } else if (roleUser === "investor") {
                  if (updateKey === "slip-gaji") {
                    router.push(`/form-pemodal?update=true&form=slip-gaji`);
                  } else {
                    router.push(`/form-pemodal?update=true&form=${updateKey}`);
                  }
                } else {
                  router.push(
                    `/form-penerbit?update=true&form=${updateKey}&inbox-id=${selectedInbox.id}`
                  );
                }
              }
            } else if (selectedInbox.field_3 === "uploaded-doc") {
              const pdfUrl = selectedInbox.field_4;
              if (pdfUrl) {
                router.push(
                  `/form-signature?pdf=${encodeURIComponent(pdfUrl)}&inboxId=${
                    selectedInbox.id
                  }&field5=${selectedInbox.field_5}`
                );
              }
            }

            setOpenDialog(false);
          }}
          onReject={() => setOpenDialog(false)}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default Inbox;

function InboxSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg bg-white h-20 w-full" />
      ))}
    </div>
  );
}

"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { InboxResponse } from "../inbox-interface";
import EmptyTransaction from "../InboxEmpty";
import InboxCard from "../InboxCard";
import Swal from "sweetalert2";
import { getUser } from "@/app/lib/auth";
import TransactionInvestorPage from "../../dashboard/pemodal/TransactionInvestorView";
import Center from "../../Center";
import CircularProgressIndicator from "../../CircularProgressIndicator";
import { AnimatedWrapper } from "../../AnimatedWrapper";
import { AuthDataResponse } from "@/app/interfaces/auth/auth";

const Transaction = () => {
  // data hook
  const [transactions, setTransactions] = useState<InboxResponse[]>([]);
  const [user, setUser] = useState<AuthDataResponse | null>(null);

  // state hook
  const [loading, setLoading] = useState<boolean>(true);
  const isOnline = useOnlineStatus();

  //* use effect
  useEffect(() => {
    if (isOnline) {
      fetchTransaction();
    }
  }, [isOnline]);

  //* fetch inbox
  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const token = getUser()?.token;
      console.log("hastoken ", token);
      if (token) {
        const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data["data"]) {
          setTransactions([]);
          return;
        }
        const filteredTransactions = res.data["data"]
          .filter((inbox: InboxResponse) => inbox.type === "transaction")
          .reverse();
        setTransactions(filteredTransactions);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Transaksi",
        text: `Maaf saat ini tidak bisa mendapatkan data transaksi ${error}`,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  //* mark as read
  const markAsRead = (transactionId: number) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          is_read: true,
        };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  //* handle card on click
  const handleCardOnClick = (transaction: InboxResponse) => {
    markAsRead(transaction.id);

    if (transaction.status === "PAID") {
      Swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil Diverifikasi",
        text: "Terima kasih, pembayaran Anda sudah berhasil diverifikasi. Silakan cek Inbox untuk informasi selanjutnya.",
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Bukti Transfer Telah Diterima",
        text: "Terima kasih, bukti transfer Anda telah kami terima. Mohon menunggu hingga 2x24 jam untuk mendapatkan informasi selanjutnya melalui Inbox.",
      });
    }
  };

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  return user?.role == "investor" ? (
    <TransactionInvestorPage />
  ) : (
    <>
      {loading ? (
        <Center fullParent horizontal vertical>
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </Center>
      ) : (
        <AnimatedWrapper>
          <div className="text-black">
            {transactions.length ? (
              <div className="flex flex-col gap-y-3">
                {transactions?.map((transaction) => {
                  return (
                    <InboxCard
                      key={transaction.id}
                      inbox={transaction}
                      onClick={() => {
                        handleCardOnClick(transaction);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyTransaction
                title="Belum ada transaksi"
                message="Kamu belum menerima transaksi apa pun saat ini."
              />
            )}
          </div>
        </AnimatedWrapper>
      )}
    </>
  );
};

export default Transaction;

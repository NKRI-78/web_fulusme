import { TransactionResponse } from "@/app/interfaces/transaction/transaction";
import { API_BACKEND } from "@/app/utils/constant";
import api from "@/utils/axios";

export async function getTransactions(page: number = 1, limit: number = 5) {
  try {
    const res = await api.get<TransactionResponse>(
      `${API_BACKEND}/api/v1/transaction/project/list`,
      {
        params: {
          page,
          limit,
        },
      },
    );

    return res.data.data;
  } catch (error: any) {
    throw new Error("Gagal mengambil transaksi");
  }
}

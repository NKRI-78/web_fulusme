import { TransactionResponse } from "@shared/types/transaction/transaction";
import { API_BACKEND } from "@shared/lib/constant";
import { api } from "@shared/lib/api-client";

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

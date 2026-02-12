import axios from "axios";
import { TransactionResponse } from "@/app/interfaces/transaction/transaction";
import { API_BACKEND } from "@/app/utils/constant";

export async function getTransactions(
  token: string,
  page: number = 1,
  limit: number = 5,
) {
  try {
    const res = await axios.get<TransactionResponse>(
      `${API_BACKEND}/api/v1/transaction/project/list`,
      {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data;
  } catch (error: any) {
    throw new Error("Gagal mengambil transaksi");
  }
}

import axios from 'axios';
import Cookies from "js-cookie";

export const fetchContentList = async (search: string) => {
  const response = await axios.post(`https://api-sabi.langitdigital78.com/api/v1/get/data`, {
    query: search,
    key: "jkfldanwnwn33n4213",
  });
  return response.data;
};

export const fetchContentHistories = async () => {
  const token = Cookies.get("token");
  const response = await axios.post(
    `https://api-sabi.langitdigital78.com/api/v1/history/all-search`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.data;
};
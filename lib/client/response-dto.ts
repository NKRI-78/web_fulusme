export type ResponseDto<T> = {
  status: number;
  error: boolean;
  message: string;
  data: T;
};

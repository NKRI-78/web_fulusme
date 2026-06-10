import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama wajib diisi"),
    phone: z
      .string({ required_error: "No. Tlp wajib diisi" })
      .min(10, "No. Tlp minimal 10 digit")
      .max(13, "No. Tlp maksimal 13 digit"),
    email: z.string().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/^\S+$/, "Password tidak boleh mengandung spasi")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`]).{8,}$/,
        "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

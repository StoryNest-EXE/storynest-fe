"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GrFormView, GrFormViewHide } from "react-icons/gr";

import Loader from "@/components/Loader";
import RippleButton from "@/components/custom-ui/RippleButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation } from "@/queries/auth.queries";
import GradientText from "@/components/GradientText";

const formSchema = z
  .object({
    username: z.string().min(6, "Tên đăng nhập tối thiểu 6 ký tự").max(50),
    email: z.string().email("Email không hợp lệ."),
    fullName: z.string().min(3, "Họ tên tối thiểu 3 ký tự").max(50),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
    termsAgreement: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp.",
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useRegisterMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      termsAgreement: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    mutate(values, {
      onSuccess: () => router.push("/login"),
      onError: (err) => {
        setError(err?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      },
    });
  };

  return (
    <Form {...form}>
      <div className="w-full text-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Tạo tài khoản
        </h1>
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          className="!text-5xl flex justify-center font-semibold leading-[1.2]"
        >
          StoryNest
        </GradientText>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 space-y-5 max-w-md mx-auto px-4 sm:px-6 md:px-8"
      >
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <input
                  autoComplete="username"
                  disabled={isPending}
                  {...field}
                  className="peer block w-full border-b-2 border-gray-500 bg-transparent py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  placeholder=" "
                />
              </FormControl>
              <FormLabel className="absolute top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-violet-400">
                Tên đăng nhập
              </FormLabel>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <input
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                  className="peer block w-full border-b-2 border-gray-500 bg-transparent py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  placeholder=" "
                />
              </FormControl>
              <FormLabel className="absolute top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-violet-400">
                Email
              </FormLabel>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <input
                  autoComplete="name"
                  disabled={isPending}
                  {...field}
                  className="peer block w-full border-b-2 border-gray-500 bg-transparent py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  placeholder=" "
                />
              </FormControl>
              <FormLabel className="absolute top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-violet-400">
                Họ và tên
              </FormLabel>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                    className="peer block w-full border-b-2 border-gray-500 bg-transparent py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                    placeholder=" "
                  />
                  <FormLabel className="absolute top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-violet-400">
                    Mật khẩu
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <GrFormView size={22} />
                    ) : (
                      <GrFormViewHide size={22} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                    className="peer block w-full border-b-2 border-gray-500 bg-transparent py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                    placeholder=" "
                  />
                  <FormLabel className="absolute top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-violet-400">
                    Xác nhận mật khẩu
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <GrFormView size={22} />
                    ) : (
                      <GrFormViewHide size={22} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Terms */}
        <FormField
          control={form.control}
          name="termsAgreement"
          render={({ field }) => (
            <FormItem className="flex items-center mt-2 whitespace-nowrap">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className=""
                />
              </FormControl>
              <FormLabel className="text-sm text-gray-300 select-none">
                Tôi đồng ý với{" "}
                <Link
                  href="/privacy-policy"
                  className="text-violet-400 hover:text-violet-300 font-medium"
                >
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  href="/term-of-services"
                  className="text-violet-400 hover:text-violet-300 font-medium"
                >
                  Chính sách bảo mật
                </Link>
              </FormLabel>
            </FormItem>
          )}
        />

        {error && (
          <FormDescription className="text-left text-sm text-red-500">
            {error}
          </FormDescription>
        )}

        <RippleButton
          type="submit"
          disabled={isPending}
          className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-all text-sm sm:text-base"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader /> <span>Đang xử lý...</span>
            </div>
          ) : (
            "Đăng ký"
          )}
        </RippleButton>
      </form>

      <div className="mt-4 text-center text-sm text-gray-400">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-violet-400 underline">
          Đăng nhập
        </Link>
      </div>
    </Form>
  );
}

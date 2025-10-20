"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import Loader from "@/components/Loader";
import RippleButton from "@/components/custom-ui/RippleButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useResetPasswordMutation,
  useVerifyResetMutation,
} from "@/queries/auth.queries";
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("tk"); // 👈 lấy đúng query string bạn gửi trong mail
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const { mutateAsync: verifyReset, isPending: isVerifying } =
    useVerifyResetMutation();
  const { mutateAsync: resetPassword, isPending: isResetting } =
    useResetPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 👉 Kiểm tra token khi load trang
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        router.replace("/404");
        return;
      }
      try {
        const res = await verifyReset(token);
        // nếu BE trả lỗi thì ném qua catch
        if (!res || res?.status !== 200) throw new Error();
      } catch {
        router.replace("/404");
      }
    };
    verify();
  }, [token, router, verifyReset]);

  // 👉 Xử lý submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await resetPassword({
        token: token as string,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSuccess(true);
    } catch {
      form.setError("password", {
        message: "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
      });
    }
  };

  // 👉 Đếm ngược redirect sau khi reset thành công
  useEffect(() => {
    if (!success) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [success, router]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <p className="text-3xl font-semibold text-emerald-600">
          Đặt lại mất khẩu thành công
        </p>
        <p className="text-gray-500">
          Quay về trang đăng nhập sau{" "}
          <span className="text-emerald-500">{countdown}s</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Form {...form}>
        <div className="mb-4 flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Tạo mật khẩu mới</h1>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
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
                      disabled={isResetting}
                      {...field}
                      className="peer block w-full appearance-none border-0 border-b-2 border-black/20 bg-transparent px-0 py-3 text-sm focus:border-violet-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
                      placeholder=" "
                    />
                    <FormLabel className="pointer-events-none absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-violet-500">
                      Mật Khẩu
                    </FormLabel>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <GrFormView size={24} />
                      ) : (
                        <GrFormViewHide size={24} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
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
                      disabled={isResetting}
                      {...field}
                      className="peer block w-full appearance-none border-0 border-b-2 border-black/20 bg-transparent px-0 py-3 text-sm focus:border-violet-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
                      placeholder=" "
                    />
                    <FormLabel className="pointer-events-none absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-violet-500">
                      Xác nhận lại mật khẩu
                    </FormLabel>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <GrFormView size={24} />
                      ) : (
                        <GrFormViewHide size={24} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <RippleButton
            type="submit"
            disabled={isResetting}
            className="mt-2 w-full bg-[#5E49D8] text-white shadow-lg hover:bg-[#6B53F6] active:scale-95"
          >
            {isResetting ? (
              <div className="flex items-center gap-2">
                <Loader />{" "}
                <span>
                  <StoryNestLoader />
                </span>
              </div>
            ) : (
              "Xác nhận"
            )}
          </RippleButton>
        </form>
      </Form>
    </div>
  );
}

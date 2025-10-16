"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import RippleButton from "@/components/custom-ui/RippleButton";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPasswordMutation } from "@/queries/auth.queries";

// ✅ Schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormSchema = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const formattedCountdown = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;

  // ✅ Tanstack mutation
  const forgotPasswordMutation = useForgotPasswordMutation();

  // ✅ react-hook-form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // ✅ Submit
  const onSubmit = async (values: FormSchema) => {
    setErrorMessage(null);

    forgotPasswordMutation.mutate(values, {
      onSuccess: (res) => {
        // response structure tuỳ backend của bạn
        if (res?.status === 200) {
          setIsSuccess(true);
          setIsResend(false);
          setCountdown(300);
        } else {
          setErrorMessage("No user found with this email address");
        }
      },
      onError: () => {
        setErrorMessage("An error occurred. Please try again later");
      },
    });
  };

  // ✅ Countdown timer
  useEffect(() => {
    if (isSuccess && !isResend) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSuccess, isResend]);

  return (
    <div className="w-full">
      {isSuccess ? (
        <div className="mt-4 flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Check your email</h1>
          <p className="text-sm text-black/50">
            Please check your email for a link to reset your password. If you
            don&apos;t see it, check your spam
          </p>

          {!isResend && (
            <p className="text-md">
              If you didn&apos;t receive the email, try again in{" "}
              <span className="block text-center text-lg text-emerald-500">
                {formattedCountdown}s
              </span>
            </p>
          )}

          <RippleButton
            type="button"
            disabled={forgotPasswordMutation.isPending || !isResend}
            className="mt-2 w-full cursor-pointer border-transparent bg-[#5E49D8] text-white shadow-lg shadow-black/16 duration-200 hover:bg-[#6B53F6] active:scale-95"
            onClick={form.handleSubmit(onSubmit)}
          >
            {forgotPasswordMutation.isPending || !isResend ? (
              <div className="flex items-center gap-2">
                <Loader /> <span className="text-violet-300">Loading...</span>
              </div>
            ) : (
              "Send reset link"
            )}
          </RippleButton>

          <RippleButton
            onClick={() => router.push("/login")}
            className="mt-2 w-full cursor-pointer border-1 border-black/50 bg-transparent duration-200 active:scale-95"
          >
            <img src="/svg/arrow_back.svg" alt="Arrow Back" />
            Back to login
          </RippleButton>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-4 flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold">Forgot password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your registered email and we will send you a link to reset
              your password
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <input
                        type="email"
                        autoComplete="email"
                        disabled={forgotPasswordMutation.isPending}
                        {...field}
                        className="peer block w-full appearance-none border-0 border-b-2 border-black/20 bg-transparent px-0 py-3 text-sm focus:border-violet-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
                        placeholder=" "
                      />
                    </FormControl>
                    <FormLabel className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-violet-500">
                      Email
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="mt-2 text-center text-red-500">
                  <p>{errorMessage}</p>
                </div>
              )}

              <RippleButton
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full cursor-pointer border-transparent bg-[#5E49D8] text-white shadow-lg shadow-black/16 duration-200 hover:bg-[#6B53F6] active:scale-95"
              >
                {forgotPasswordMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader />{" "}
                    <span className="text-violet-300">Loading...</span>
                  </div>
                ) : (
                  "Send reset link"
                )}
              </RippleButton>
            </form>
          </Form>

          <RippleButton
            onClick={() => router.push("/login")}
            className="mt-2 w-full cursor-pointer border-1 border-black/50 bg-transparent duration-200 active:scale-95"
          >
            <img src="/svg/arrow_back.svg" alt="Arrow Back" />
            Back to login
          </RippleButton>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;

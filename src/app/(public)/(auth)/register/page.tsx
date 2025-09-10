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

const formSchema = z
  .object({
    username: z.string().min(6).max(50),
    email: z.string().email("Invalid email address."),
    fullName: z.string().min(3).max(50),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    termsAgreement: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterForm() {
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
      onSuccess: () => {
        router.push("/login");
      },
      onError: (err) => {
        setError(
          err?.message || "Something went wrong. Please try again later."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <div className="w-full">
        <h1 className="text-center text-3xl font-semibold">
          Create an account
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
                  className="peer block w-full border-b-2 border-gray-600 bg-transparent py-3 text-sm text-white focus:border-violet-400 focus:outline-none"
                  placeholder=" "
                />
              </FormControl>
              <FormLabel
                className="absolute top-3 text-sm text-gray-400 transform duration-300 
                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-400"
              >
                Username
              </FormLabel>
              <FormMessage />
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
                  className="peer block w-full border-b-2 border-gray-600 bg-transparent py-3 text-sm text-white focus:border-violet-400 focus:outline-none"
                  placeholder=" "
                />
              </FormControl>
              <FormLabel
                className="absolute top-3 text-sm text-gray-400 transform duration-300 
                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-400"
              >
                Email
              </FormLabel>
              <FormMessage />
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
                  autoComplete="fullName"
                  disabled={isPending}
                  {...field}
                  className="peer block w-full border-b-2 border-gray-600 bg-transparent py-3 text-sm text-white focus:border-violet-400 focus:outline-none"
                />
              </FormControl>
              <FormLabel
                className="absolute top-3 text-sm text-gray-400 transform duration-300 
                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-400"
              >
                Full Name
              </FormLabel>
              <FormMessage />
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
                    className="peer block w-full border-b-2 border-gray-600 bg-transparent py-3 text-sm text-white focus:border-violet-400 focus:outline-none"
                    placeholder=" "
                  />
                  <FormLabel
                    className="absolute top-3 text-sm text-gray-400 transform duration-300 
                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-400"
                  >
                    Password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <GrFormView size={24} />
                    ) : (
                      <GrFormViewHide size={24} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
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
                    className="peer block w-full border-b-2 border-gray-600 bg-transparent py-3 text-sm text-white focus:border-violet-400 focus:outline-none"
                    placeholder=" "
                  />
                  <FormLabel
                    className="absolute top-3 text-sm text-gray-400 transform duration-300 
                            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-400"
                  >
                    Confirm Password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
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

        {/* Terms */}
        <FormField
          control={form.control}
          name="termsAgreement"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-xs text-shadow-white">
                I agree to the Terms of Service and Privacy Policy
              </FormLabel>
            </FormItem>
          )}
        />

        {error && (
          <FormDescription className="text-left text-sm text-red-600">
            {error}
          </FormDescription>
        )}

        <RippleButton
          type="submit"
          disabled={isPending}
          className="w-full bg-violet-600 text-white"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader /> <span>Loading...</span>
            </div>
          ) : (
            "Register"
          )}
        </RippleButton>
      </form>

      <div className="mt-2 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-600 underline">
          Login
        </Link>
      </div>
    </Form>
  );
}

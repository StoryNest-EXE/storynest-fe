"use client";

import { useState } from "react";
import GoogleButton from "@/components/GoogleButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GrFormView } from "react-icons/gr";
import { GrFormViewHide } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
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
import { useAuth } from "@/context/AuthContext";
import { useLoginMutation } from "@/queries/auth.queries";

const formSchema = z.object({
  usernameOrEmail: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  remember: z.boolean().default(false).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: loginMutation, isPending } = useLoginMutation();
  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 1. Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        ...values,
        deviceId: null,
        ipAddress: null,
        userAgent: null,
      };
      const response = await loginMutation(payload);
      login(response.data.accessToken);
      router.push("/");
    } catch (err) {
      form.setError("root", {
        message: "Invalid username or password",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="w-full">
        <h1 className="text-3xl font-semibold">
          Welcome to <span className="text-gradient-2">StoryNest</span>
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <input
                    type="text"
                    autoComplete="username"
                    disabled={isLoading}
                    {...field}
                    className="peer block w-full appearance-none border-0 border-b-2 border-black/20 bg-transparent px-0 py-3 text-sm focus:border-violet-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
                    placeholder=" "
                  />
                </FormControl>
                <FormLabel className="pointer-events-none absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-violet-500">
                  Username or Email
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
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                      className="peer block w-full appearance-none border-0 border-b-2 border-black/20 bg-transparent px-0 py-3 text-sm focus:border-violet-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
                      placeholder=" "
                    />
                    <FormLabel className="pointer-events-none absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-80 peer-focus:text-violet-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-violet-500">
                      Password
                    </FormLabel>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-black/50 hover:text-black"
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

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer border border-[#71717B] duration-200 hover:border-zinc-500 data-[state=checked]:bg-black"
                    />
                  </FormControl>

                  <div className="leading-none text-shadow-white">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Link
              href="/forgot-password"
              tabIndex={-1}
              className="text-center text-sm text-gray-400 hover:text-black"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <FormDescription className="text-left text-sm text-red-500">
              {error}
            </FormDescription>
          )}

          {/* Submit button */}
          <RippleButton
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer border-transparent bg-[#5E49D8] text-white shadow-lg shadow-black/16 duration-200 hover:bg-[#6B53F6] active:scale-95"
            onClick={() => {
              console.log("text");
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader /> <span className="text-violet-300">Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </RippleButton>
        </form>

        <div className="my-4">
          <div className="flex items-center justify-between">
            <span className="w-1/3 border-t border-[#E1E0E5]"></span>
            <span className="text-xs text-[#737379]">Or login with</span>
            <span className="w-1/3 border-t border-[#E1E0E5]"></span>
          </div>
        </div>

        {/* Oauth 2 */}
        <div className="flex items-center gap-2">
          {/* <GoogleButton
            remember={form.getValues("remember")}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          /> */}
        </div>

        <div className="mt-2 text-center text-sm text-shadow-white">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#4C3CC6] underline underline-offset-4 hover:text-[#5756bb]"
          >
            Register
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default LoginPage;

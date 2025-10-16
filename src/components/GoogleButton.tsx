// import { useContext, useState } from "react";

// import { loginGoogleService } from "@/services/userService";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import RippleButton from "@/components/custom-ui/RippleButton";
// import { useAuth } from "@/context/AuthContext";

// interface AuthProps {
//   remember?: boolean;
//   setError?: React.Dispatch<React.SetStateAction<string | null>>;
//   isLoading?: boolean;
//   setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const GoogleButton = ({
//   remember = false,
//   setError,
//   isLoading,
//   setIsLoading,
// }: AuthProps) => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleGoogleLogin = useGoogleLogin({
//     onSuccess: async (response) => {
//       setIsLoading?.(true);
//       setError?.(null);
//       try {
//         const credential = response.access_token;
//         const isRemember = remember ?? false;

//         const res = await loginGoogleService(credential, isRemember);
//         console.log(res);

//         if (res.data.status === 200) {
//           login(res.data.data.accessToken);
//           navigate("/");
//         } else {
//           setError?.(
//             res.data.message || "An error occurred during Google login"
//           );
//         }
//       } catch (error: any) {
//         const errorMessage =
//           error?.response?.data?.message ||
//           error?.message ||
//           "An error occurred during Google login";

//         setError?.(errorMessage);
//       } finally {
//         setIsLoading?.(false);
//       }
//     },
//   });

//   return (
//     <RippleButton
//       disabled={isLoading}
//       onClick={() => handleGoogleLogin()}
//       className="flex w-full cursor-pointer items-center justify-center gap-3 border-1 border-[#E1E0E5] bg-transparent duration-100 duration-200 hover:bg-black/5 active:scale-95"
//     >
//       <img src="/svg/gmail.svg" alt="Gmail" className="h-5 w-5" />
//       <span>Google</span>
//     </RippleButton>
//   );
// };

// export default GoogleButton;

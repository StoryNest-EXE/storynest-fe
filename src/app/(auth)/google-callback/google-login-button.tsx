import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/google-login`;
  };

  return (
    <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
      Đăng nhập với Google
    </Button>
  );
}

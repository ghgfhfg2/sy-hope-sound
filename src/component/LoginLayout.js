import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function LoginLayout({ children }) {
  const userInfo = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  if (userInfo) {
    router.push("/");
  }
  return <>{children}</>;
}

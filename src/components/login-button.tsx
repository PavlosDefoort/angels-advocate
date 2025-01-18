import Link from "next/link";

const LoginButton = () => {
  return (
    <Link
      href="/api/auth/login"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login
    </Link>
  );
};
export default LoginButton;

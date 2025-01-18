import Link from "next/link";

const SignUpButton: React.FC = () => {
  return (
    <Link
      href="/api/auth/signup"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign Up
    </Link>
  );
};

export default SignUpButton;

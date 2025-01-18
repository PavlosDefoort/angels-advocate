import Link from "next/link";

const LogoutButton = () => {
  return (
    <Link
      href="/api/auth/logout"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </Link>
  );
};

export default LogoutButton;

const LoginButton = () => {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/auth/login"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login
    </a>
  );
};
export default LoginButton;

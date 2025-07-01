export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-fuchsia-100 to-pink-100 dark:from-gray-900 dark:to-purple-900">
      {children}
    </div>
  );
}

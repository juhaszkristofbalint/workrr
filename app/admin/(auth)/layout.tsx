export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-chrome px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-card">
        {children}
      </div>
    </div>
  );
}

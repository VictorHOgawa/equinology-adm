export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="max-w-screen flex min-h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <div className="flex h-full w-full flex-row">
        <div className="flex w-full bg-[#F8F9FA]">
          <div className="lg:w-5/5 w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}

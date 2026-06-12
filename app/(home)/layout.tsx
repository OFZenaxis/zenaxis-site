import { Header } from "@/components/Header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header variant="full" />
      <main className="flex-1">{children}</main>
    </>
  );
}

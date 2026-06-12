import { Header } from "@/components/Header";

export default function CotacaoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header variant="back" />
      <main className="flex-1">{children}</main>
    </>
  );
}

export default function TransactionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <TabsComponent tabsData={TransactionsTabs} /> */}
      {children}
    </section>
  );
}

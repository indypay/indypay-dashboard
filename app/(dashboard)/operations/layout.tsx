'use client';

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col  gap-4 py-8 md:py-10">
      {/* <TabsComponent tabsData={OperationsTabs}  /> */}
      {children}
    </section>
  );
}

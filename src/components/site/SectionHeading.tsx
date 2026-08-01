export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col items-center gap-2 text-center">
      <h2 className="font-script text-3xl text-gold-light sm:text-4xl">{children}</h2>
      <span className="h-px w-16 bg-gold/50" />
    </div>
  );
}

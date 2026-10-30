export function BrandFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 pt-12 pb-16 print:hidden">
      <p className="mx-auto max-w-7xl px-4 text-center text-sm text-brand-fg/50 sm:px-6">
        © {new Date().getFullYear()} Bookends Hospitality
      </p>
    </footer>
  );
}

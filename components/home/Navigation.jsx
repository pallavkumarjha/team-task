import Link from "next/link"

export function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="
      inline-flex
      items-center
      px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:border-slate-700"
    >
      {children}
    </a>
  )
}

export function MobileNavLink({ href, onClick, children }) {
  return (
    <a
      href={href}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 dark:hover:border-slate-600"
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export function getNavlinks() {
  const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED
  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8 px-4">
      <NavLink href="#key-features">Features</NavLink>
      <NavLink href="#how-it-works">How It Works</NavLink>
      {!isReleased && <NavLink href="#pricing">Pricing</NavLink>}
      <NavLink href="#contact">Contact</NavLink>
    </div>
  )
}

export function getMobileNavlinks({ isMenuOpen, toggleMenu }) {
  const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED
  if (!isMenuOpen) return null;
  
  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <MobileNavLink href="#key-features" onClick={toggleMenu}>
          Features
        </MobileNavLink>
        <MobileNavLink href="#how-it-works" onClick={toggleMenu}>
          How It Works
        </MobileNavLink>
        {!isReleased && (
          <MobileNavLink href="#pricing" onClick={toggleMenu}>
            Pricing
          </MobileNavLink>
        )}
        <MobileNavLink href="#contact" onClick={toggleMenu}>
          Contact
        </MobileNavLink>
      </div>
    </div>
  );
}
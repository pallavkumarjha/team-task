import { Menu, Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useDarkMode } from "../hooks/useDarkMode"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export const Header = ({ navlink, mobileNavLink, setDarkMode, isDarkMode, hideDarkMode = false }) => {
    const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED

    const [isGettingProfile, setIsGettingProfile] = useState(true)
    const { data: session, status: profileStatus } = useSession();

    useEffect(() => {
        if (profileStatus !== 'loading') {
          setIsGettingProfile(false)
        }
    }, [profileStatus])

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
      };

    const renderLoginArea = () => {
        if (isReleased) {
          return null
        }
    
        if (isGettingProfile) {
          return (
            <div className="flex items-center mr-8">
              <Loader2 className="animate-spin h-5 w-5" />
            </div>
          )
        }
    
        return user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className="hidden sm:inline-flex items-center justify-center w-10 h-10 mr-8 rounded-full border-2 border-emerald-500 hover:ring-2 hover:ring-emerald-300 transition-all"
              >
                <img 
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            </DropdownMenu.Trigger>
    
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 min-w-[200px] transition-colors duration-300"
                sideOffset={5}
              >
                <DropdownMenu.Item 
                  className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md cursor-pointer text-slate-900 dark:text-slate-200 transition-colors"
                  onSelect={handleLogout}
                >
                  Hello, {session.user.name}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1" />
                <DropdownMenu.Item 
                  className="flex items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-md cursor-pointer text-red-500 transition-colors"
                  onSelect={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenu.Item>
                <DropdownMenu.Arrow className="fill-slate-200 dark:fill-slate-700" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 mr-16 py-2 border border-transparent text-sm font-medium rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Login
          </Link>
        )
      }


    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-neomorphic-light dark:shadow-neomorphic-dark">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => redirect("/")}>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">SnapTask</span>
              </div>
             {navlink}
            </div>
            <div className="flex items-center">
              {renderLoginArea()}
             { !hideDarkMode && <Button
                onClick={setDarkMode}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 shadow-neomorphic-light dark:shadow-neomorphic-dark mr-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>}
              <div className="sm:hidden">
                <Button
                  onClick={setDarkMode}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </nav>
        {mobileNavLink}
      </header>

    )
}
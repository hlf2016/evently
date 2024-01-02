import Link from 'next/link'
import Image from 'next/image'
import { SignedIn,SignedOut, UserButton } from '@clerk/nextjs' 
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="flex justify-between items-center wrapper">
        <Link href='/' className='w-36'>
          <Image src='/assets/images/logo.svg' alt='Evently logo' width={128} height={38}/>
        </Link>

        {/* SignedIn 类似于条件 已登录的情况下的才会显示 SignedOut 则是条件 注销登录时候才会显示 */}
        <SignedIn>
          <nav className='md:flex-between hidden w-full max-w-xs'>
            <NavItems/>
          </nav>
        </SignedIn>

        <div className='flex justify-end w-32 gap-3'>
          <SignedIn>
            <UserButton afterSignOutUrl='/'/>
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className='rounded-full' size='lg'>
              <Link href='/sign-in'>
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header

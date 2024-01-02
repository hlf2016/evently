'use client'

import { headerLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = () => {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col md:flex-row md:flex-between w-full items-start gap-5">
      {headerLinks.map(link => {
        const isActive = pathname === link.route

        return (
        <li key={link.label}>
          <Link href={link.route} className={`${isActive && 'text-primary-500'} flex-center p-medium-16 whitespace-nowrap`} >{link.label}</Link>
        </li>
        )
      })}
    </ul>
  )
}

export default NavItems

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='sm:flex-row wrapper flex-between flex flex-col gap-4 p-5 text-center'>
        <Link href="/">
          <Image src="/assets/images/logo.svg" alt="logo" width={128} height={38} />
        </Link>

        <p className='text-sm'>2023 Eventify. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function hideBanner() {
  const store = await cookies()

  // 30 days in milliseconds: 30 * 24 * 60 * 60 * 1000
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

  store.set('banner-hidden', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + thirtyDaysInMs),
    path: '/',
  })

  revalidatePath('/', 'layout')
}
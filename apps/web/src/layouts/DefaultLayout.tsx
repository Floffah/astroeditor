import '../app/globals.css'
import { Nunito } from 'next/font/google'
import clsx from 'clsx'
import { PropsWithChildren } from 'react'

const nunito = Nunito({ subsets: ['latin'] })

export default function DefaultLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={clsx(nunito.className, 'h-screen w-full')}>
				{children}
			</body>
		</html>
	)
}

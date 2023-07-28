import '../app/globals.css'
import { Nunito } from 'next/font/google'
import clsx from 'clsx'
import { forwardRef, PropsWithChildren } from 'react'

const nunito = Nunito({ subsets: ['latin'] })

const DefaultLayout = forwardRef<HTMLHtmlElement, PropsWithChildren>(
	({ children }, ref) => {
		return (
			<html lang="en" ref={ref}>
				<body className={clsx(nunito.className, 'h-screen w-full')}>
					{children}
				</body>
			</html>
		)
	},
)

export default DefaultLayout

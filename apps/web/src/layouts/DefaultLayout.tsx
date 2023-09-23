import '../app/globals.css'
import { Nunito } from 'next/font/google'
import { forwardRef, PropsWithChildren } from 'react'

const nunito = Nunito({ subsets: ['latin'] })

const DefaultLayout = forwardRef<HTMLHtmlElement, PropsWithChildren>(
	({ children }, ref) => {
		return (
			<html lang="en" ref={ref}>
				<body className={nunito.className}>{children}</body>
			</html>
		)
	},
)

export default DefaultLayout

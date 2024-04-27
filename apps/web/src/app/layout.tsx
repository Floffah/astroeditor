import clsx from 'clsx'
import { Nunito } from 'next/font/google'
import { PropsWithChildren } from 'react'

import '@/app/globals.css'
import { populateMetadata } from '@/lib/populateMetadata'
import { EditorProvider } from '@/providers/EditorProvider'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = populateMetadata({
	title: 'Astroneer Save Editor',
	description: 'Save Editor for Astroneer (UNFINISHED)',
})

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={clsx(nunito.className, nunito.variable)}>
			<body>
				<EditorProvider>{children}</EditorProvider>
			</body>
		</html>
	)
}

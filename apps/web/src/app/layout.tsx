import { EditorProvider } from '@/providers/EditorProvider'
import { populateMetadata } from '@/lib/populateMetadata'
import DefaultLayout from '@/layouts/DefaultLayout'
import { PropsWithChildren } from 'react'

export const metadata = populateMetadata({
	title: 'Astroneer Save Editor',
	description: 'Save Editor for Astroneer (UNFINISHED)',
})

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<DefaultLayout>
			<EditorProvider>{children}</EditorProvider>
		</DefaultLayout>
	)
}

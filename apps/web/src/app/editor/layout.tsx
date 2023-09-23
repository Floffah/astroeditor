import { PropsWithChildren } from 'react'
import { EditorTabsProvider } from '@/providers/EditorTabsProvider'

export default function EditorLayout({ children }: PropsWithChildren) {
	return <EditorTabsProvider>{children}</EditorTabsProvider>
}

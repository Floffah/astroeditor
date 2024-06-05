import { PropsWithChildren } from 'react'

import { NavBar } from '@/app/editor/NavBar'

export default function EditorLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex h-screen w-screen p-5 space-x-5">
			<NavBar />
			<main className="flex-grow bg-white/10 rounded-xl flex flex-col space-y-5">
				{children}
			</main>
		</div>
	)
}

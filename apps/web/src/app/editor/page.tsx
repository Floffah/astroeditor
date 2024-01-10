import { EditorTabs } from '@/app/editor/EditorTabs'
import { NavBar } from '@/app/editor/NavBar'

export default function Editor() {
	return (
		<main className="flex h-screen w-screen p-5 space-x-5">
			<NavBar />
			<EditorTabs />
		</main>
	)
}

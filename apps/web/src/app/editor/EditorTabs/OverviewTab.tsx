'use client'

import { useEditor } from '@/app/providers/EditorProvider'

export function OverviewTab() {
	const editor = useEditor()

	return (
		<div className="flex flex-col h-full p-5">
			<div className="flex items-center space-x-5 text-lg">
				<div className="bg-black/20 px-4 py-3 rounded-2xl">V0.0.0</div>

				<p>Astroneer Save Editor</p>
			</div>
		</div>
	)
}

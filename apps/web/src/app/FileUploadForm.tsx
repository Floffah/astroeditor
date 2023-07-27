'use client'

import { useEditor } from '@/providers/EditorProvider'

export function FileUploadForm() {
	const editor = useEditor()

	return (
		<div className="bg-white/10 rounded-lg p-8 space-y-5 max-w-lg">
			<div>
				<h1>AstroEditor</h1>
				<p>Upload a .savegame file to start</p>
			</div>

			<input
				type="file"
				accept=".savegame"
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) {
						editor.importFile(file)
					}
				}}
			/>

			<div className="bg-white/20 w-full h-0.5" />

			<div>
				<p>
					<strong>DISCLAIMER: </strong>
					This is a fan-made tool and is not affiliated with or endorsed by the
					Astroneer team. To the respect of the Astroneer team, all save files
					will be set to creative mode with achievements disabled. So no one can
					get around this restriction, this tool is also <strong>
						NOT
					</strong>{' '}
					open source and I have no intention of making it open source unless
					requested by the Astroneer dev team.
				</p>
			</div>
		</div>
	)
}

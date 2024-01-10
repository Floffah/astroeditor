'use client'

import { Icon } from '@iconify/react'

import { useEditor } from '@/app/providers/EditorProvider'

export function FileUploadForm() {
	const { importFile, parsing, parseError } = useEditor()

	return (
		<div className="bg-white/10 rounded-lg p-8 space-y-5 max-w-lg">
			<div>
				<h1 className="font-bold text-2xl mb-2.5">AstroEditor</h1>
				<p>Upload a .savegame file to start</p>
			</div>

			{parsing ? (
				<p>
					<Icon
						icon="mdi:loading"
						className="animate-spin inline-block text-white text-xl"
					/>{' '}
					Parsing save file. This may take a while.
				</p>
			) : (
				<input
					type="file"
					accept=".savegame"
					onChange={async (e) => {
						const file = e.target.files?.[0]
						if (file) {
							await importFile(file)
						}
					}}
				/>
			)}

			{parseError && <p className="text-red-400">{parseError}</p>}

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

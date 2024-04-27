'use client'

import { Icon } from '@iconify/react'

import { useEditor } from '@/providers/EditorProvider'

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

			<div className="flex flex-col gap-2">
				<p>
					<strong>DISCLAIMER: </strong>
					This is a fan-made hobby project and is not affiliated with or
					endorsed by the Astroneer team. I reserve the right to withdraw
					service from anyone who uses this tool for malicious purposes.
				</p>
				<p>
					This tool is <strong>VERY WIP</strong> and should not be expected to
					work correctly. I don&apos;t have a lot of time to work on this, so
					expect slow updates. Follow updates on the GitHub repository
				</p>
				<a
					href="https://github.com/floffah/astroeditor"
					className="text-blue-300 hover:decoration-1 hover:underline"
				>
					GitHub repository
				</a>
			</div>
		</div>
	)
}

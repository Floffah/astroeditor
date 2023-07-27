'use client'

import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Editor, loadFile } from '@astroeditor/astroeditor'

interface EditorContextValue {
	importFile: (file: File) => Promise<void>
}

export const EditorContext = createContext<EditorContextValue>(null as any)

export const useEditor = () => useContext(EditorContext)

export function EditorProvider({ children }: PropsWithChildren<any>) {
	const router = useRouter()
	const editorRef = useRef<Editor>()

	const importFile = async (file: File) => {
		const buffer = await file.arrayBuffer()

		editorRef.current = new Editor(buffer)

		console.log(editorRef.current)
	}

	return (
		<EditorContext.Provider value={{ importFile }}>
			{children}
		</EditorContext.Provider>
	)
}

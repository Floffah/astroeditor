'use client'

import {
	createContext,
	MutableRefObject,
	PropsWithChildren,
	RefObject,
	useContext,
	useRef,
	useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { Editor } from '@astroeditor/astroeditor'

interface EditorContextValue {
	importFile: (file: File) => Promise<void>
	parsing: boolean
	editorRef: MutableRefObject<Editor | undefined>
}

export const EditorContext = createContext<EditorContextValue>(null as any)

export const useEditor = () => useContext(EditorContext)

export function EditorProvider({ children }: PropsWithChildren<any>) {
	const router = useRouter()
	const editorRef = useRef<Editor>()

	const [parsing, setParsing] = useState(false)

	const importFile = async (file: File) => {
		setParsing(true)

		const buffer = await file.arrayBuffer()

		editorRef.current = new Editor(buffer)

		console.log(editorRef.current)

		if (window.location.hostname !== 'localhost') {
			alert('Editor page is unfinished. See console for save data.')
		}
		setParsing(false)
	}

	return (
		<EditorContext.Provider value={{ importFile, parsing, editorRef }}>
			{children}
		</EditorContext.Provider>
	)
}

'use client'

import {
	createContext,
	MutableRefObject,
	PropsWithChildren,
	RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { Editor } from '@astroeditor/astroeditor'

interface EditorContextValue {
	importFile: (file: File) => Promise<void>
	parsing: boolean
	parseError: string | null
	editorRef: MutableRefObject<Editor | undefined>
}

export const EditorContext = createContext<EditorContextValue>(null as any)

export const useEditor = () => useContext(EditorContext)

export function EditorProvider({ children }: PropsWithChildren<any>) {
	const router = useRouter()
	const editorRef = useRef<Editor>()

	const [parsing, setParsing] = useState(false)
	const [parseError, setParseError] = useState<string | null>(null)

	console.log(editorRef.current)

	useEffect(() => {
		if (!editorRef.current && window.location.pathname === '/editor') {
			router.replace('/')
		}
	}, [editorRef.current])

	const importFile = async (file: File) => {
		setParsing(true)

		const buffer = await file.arrayBuffer()

		try {
			editorRef.current = new Editor(buffer)
		} catch (e: any) {
			console.error(e)
			setParseError(e.message ?? `${e}`)
			setParsing(false)
			return
		}

		router.push('/editor')

		setParsing(false)
		setParseError(null)
	}

	return (
		<EditorContext.Provider
			value={{ importFile, parsing, editorRef, parseError }}
		>
			{children}
		</EditorContext.Provider>
	)
}

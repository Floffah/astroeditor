'use client'

import { useRouter } from 'next/navigation'
import {
	MutableRefObject,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'

import initModule, { Editor } from '@astroeditor/astroeditor'

if (typeof window !== 'undefined') {
	initModule()
}

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
	}, [router])

	const importFile = async (file: File) => {
		setParsing(true)

		const bytes = new Uint8Array(await file.arrayBuffer())

		try {
			editorRef.current = new Editor()
			editorRef.current.load(BigInt(bytes.length), bytes)

			console.log(editorRef.current.toString())
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

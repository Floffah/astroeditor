'use client'

import { useRouter } from 'next/navigation'
import {
	MutableRefObject,
	PropsWithChildren,
	createContext,
	startTransition,
	useContext,
	useEffect,
	useRef,
	useState,
	useTransition,
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

	const [parsing, startParsingTransition] = useTransition()
	const [parseError, setParseError] = useState<string | null>(null)

	console.log(editorRef.current)

	useEffect(() => {
		if (!editorRef.current && window.location.pathname === '/editor') {
			router.replace('/')
		}
	}, [router])

	const importFile = (file: File) =>
		new Promise<void>((resolve) =>
			startTransition(async () => {
				const bytes = new Uint8Array(await file.arrayBuffer())

				try {
					editorRef.current = new Editor()
					editorRef.current.load(BigInt(bytes.length), bytes)

					console.log(editorRef.current.toString())
					console.log(editorRef.current.get_engine_version()?.version)
				} catch (e: any) {
					console.error(e)
					setParseError(e.message ?? `${e}`)
					resolve()
					return
				}

				router.push('/editor')

				setParseError(null)
				resolve()
			}),
		)

	return (
		<EditorContext.Provider
			value={{ importFile, parsing, editorRef, parseError }}
		>
			{children}
		</EditorContext.Provider>
	)
}

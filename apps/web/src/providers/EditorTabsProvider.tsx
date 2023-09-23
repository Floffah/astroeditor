'use client'

import {
	createContext,
	PropsWithChildren,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
	useTransition,
} from 'react'
import { nanoid } from 'nanoid'
import { OverviewTab } from '@/app/editor/EditorTabs/OverviewTab'

interface EditorTabsContextValue {
	addTab: (name: string, content: ReactNode, makeActive?: boolean) => EditorTab
	setActiveTab: (locator: number | string | EditorTab) => void
	closeTab: (tab: EditorTab) => void
	tabs: EditorTab[]
	activeTab: EditorTab | undefined
}

export const EditorTabsContext = createContext<EditorTabsContextValue>(
	null as any,
)

export const useEditorTabs = () => useContext(EditorTabsContext)

interface EditorTab {
	id: string
	name: string
	content: ReactNode
	preventClose?: boolean
}

export function EditorTabsProvider({ children }: PropsWithChildren<any>) {
	const [tabs, setTabs] = useState<EditorTab[]>([])
	const [activeTab, setActiveTab] = useState<EditorTab>()

	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		const tab = addTab('Overview', <OverviewTab />, true)

		return () => {
			closeTab(tab)
		}
	}, [])

	const getNextUniqueId = () => {
		let id = nanoid()

		while (tabs.some((tab) => tab.id === id)) {
			id = nanoid()
		}

		return id
	}

	const addTab: EditorTabsContextValue['addTab'] = (
		name,
		content,
		makeActive = false,
	) => {
		const index = tabs.length
		const tab = {
			id: getNextUniqueId(),
			name,
			content,
		}

		setTabs((tabs) => [...tabs, tab])

		if (makeActive) {
			startTransition(() => setActiveTab(tab))
		}

		return tab
	}

	const _setActiveTab: EditorTabsContextValue['setActiveTab'] = (locator) => {
		startTransition(() => {
			if (typeof locator === 'number') {
				setActiveTab(tabs[locator])
			} else if (typeof locator === 'string') {
				setActiveTab(tabs.find((tab) => tab.id === locator))
			} else {
				setActiveTab(locator)
			}
		})
	}

	const closeTab = (tab: EditorTab) => {
		const index = tabs.findIndex((t) => t.id === tab.id)

		startTransition(() => {
			if (activeTab?.id === tab.id) {
				console.log('len', tabs.length)
				if (tabs.length > 1) {
					setActiveTab(tabs[index - 1] ?? tabs[index + 1])
				} else {
					setActiveTab(undefined)
				}
			}

			setTabs((tabs) => tabs.filter((t) => tab.id !== t.id))
		})
	}

	return (
		<EditorTabsContext.Provider
			value={{
				addTab,
				setActiveTab: _setActiveTab,
				closeTab,
				tabs,
				activeTab,
			}}
		>
			{children}
		</EditorTabsContext.Provider>
	)
}

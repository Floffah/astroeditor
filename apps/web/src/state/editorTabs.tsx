'use client'

import { nanoid } from 'nanoid'
import {
	PropsWithChildren,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
	useTransition,
} from 'react'
import { create } from 'zustand'

import { OverviewTab } from '@/app/editor/EditorTabs/OverviewTab'

interface EditorTab {
	id: string
	name: string
	content: ReactNode
	preventClose?: boolean
}

interface EditorTabsState {
	tabs: EditorTab[]
	activeTab: EditorTab | undefined

	addTab: (name: string, content: ReactNode, makeActive?: boolean) => void
	setActiveTab: (locator: number | string | EditorTab) => void
	closeTab: (tab: EditorTab) => void
}

const overviewTab = {
	id: nanoid(),
	name: 'Overview',
	content: <OverviewTab />,
}

export const useEditorTabs = create<EditorTabsState>((set) => ({
	tabs: [overviewTab],
	activeTab: overviewTab,

	addTab: (name, content, makeActive) => {
		set((state) => {
			const tab = {
				id: nanoid(),
				name,
				content,
			}

			state.tabs.push(tab)

			if (makeActive) {
				state.activeTab = tab
			}

			return state
		})
	},
	setActiveTab: (locator) => {
		set((state) => {
			if (typeof locator === 'number') {
				state.activeTab = state.tabs[locator]
			} else if (typeof locator === 'string') {
				state.activeTab = state.tabs.find((tab) => tab.id === locator)
			} else {
				state.activeTab = locator
			}

			return state
		})
	},
	closeTab: (tab) => {
		set((state) => {
			const index = state.tabs.findIndex((t) => t.id === tab.id)

			if (state.activeTab?.id === tab.id) {
				if (state.tabs.length > 1) {
					state.activeTab = state.tabs[index - 1] ?? state.tabs[index + 1]
				} else {
					state.activeTab = undefined
				}
			}

			state.tabs = state.tabs.filter((t) => tab.id !== t.id)

			return state
		})
	},
}))

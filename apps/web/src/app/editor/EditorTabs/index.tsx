'use client'

import { useEditorTabs } from '@/providers/EditorTabsProvider'
import * as Tabs from '@radix-ui/react-tabs'
import clsx from 'clsx'
import { act } from 'react-dom/test-utils'
import { Icon } from '@iconify/react'

export function EditorTabs() {
	const { tabs, activeTab, setActiveTab, closeTab } = useEditorTabs()

	return (
		<Tabs.Root
			className="flex-grow bg-white/5 rounded-xl flex flex-col space-y-5"
			value={activeTab?.id ?? 'placeholder'}
			onValueChange={(id) => setActiveTab(id as any)}
		>
			<Tabs.List className="w-full flex-shrink-0 flex overflow-x-auto rounded-xl h-10 bg-white/5">
				{tabs.map((tab) => (
					<Tabs.Trigger
						key={tab.id}
						value={tab.id}
						className={clsx(
							'h-full pl-3.5 pr-2 flex group items-center justify-center space-x-2 font-medium text-sm',
							{
								'border-b-2 border-white/20 text-white':
									tab.id === activeTab?.id,
								'text-white/70': tab.id !== activeTab?.id,
							},
						)}
					>
						<p>{tab.name}</p>

						<Icon
							icon="mdi:close"
							className={clsx('w-4 h-4 hover:text-white', {
								'group-hover:text-white/50 text-transparent':
									activeTab?.id !== tab.id,
								'text-white/50': activeTab?.id === tab.id,
							})}
							onClick={() => closeTab(tab)}
						/>
					</Tabs.Trigger>
				))}
			</Tabs.List>

			<div className="w-full flex-grow rounded-xl relative bg-white/5">
				{!activeTab && (
					<div className="flex items-center h-full justify-center">
						<p className="text-white/70 text-lg font-semibold">No active tab</p>
					</div>
				)}

				{tabs.map((tab) => (
					<Tabs.Content key={tab.id} value={tab.id} asChild>
						{tab.content}
					</Tabs.Content>
				))}
			</div>
		</Tabs.Root>
	)
}

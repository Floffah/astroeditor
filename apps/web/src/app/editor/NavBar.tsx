'use client'

import { animated, useSpring, useTransition } from '@react-spring/web'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Icon } from '@/components/Icon'

const tabs = [
	{
		path: '',
		icon: 'mdi:home',
		title: 'Overview',
	},
]

const AnimatedIcon = animated(Icon)

function NavItem({
	link,
	expanded,
}: {
	link: (typeof tabs)[0]
	expanded: boolean
}) {
	const pathname = usePathname()

	const transitions = useTransition(expanded, {
		from: { translateX: 10 },
		enter: { translateX: 0 },
		leave: { translateX: 10 },
		config: {
			tension: 500,
			friction: 30,
		},
	})

	const containerSpring = useSpring({
		paddingX: expanded ? 0.5 : 0.9,
		config: {
			tension: 500,
			friction: 30,
		},
	})

	return (
		<animated.a
			href={link.path}
			className={clsx(
				'flex items-center space-x-2 py-2 h-8 min-w-0 rounded-md overflow-hidden text-white transition-colors duration-150 hover:bg-white/10',
				{
					'bg-white/10': pathname === '/editor' + link.path,
				},
			)}
			style={{
				paddingLeft: containerSpring.paddingX.to((value) => `${value}rem`),
				paddingRight: containerSpring.paddingX.to((value) => `${value}rem`),
			}}
		>
			<Icon
				label="nav icon"
				icon={link.icon}
				className="w-5 h-5 flex-shrink-0"
			/>

			{transitions(
				(style, expanded) =>
					expanded && (
						<animated.span className="flex-grow overflow-hidden" style={style}>
							{link.title}
						</animated.span>
					),
			)}
		</animated.a>
	)
}

export function NavBar() {
	const [isExpanded, setIsExpanded] = useState(false)

	const widthStyle = useSpring({
		width: isExpanded ? 16 : 4,
		rotate: isExpanded ? -180 : 0,
		config: {
			tension: 500,
			friction: 30,
		},
	})

	return (
		<animated.nav
			className="flex flex-col p-2 relative justify-between bg-white/10 h-full rounded-xl"
			style={{
				width: widthStyle.width.to((value) => `${value}rem`),
			}}
		>
			<div className="flex flex-col space-y-2">
				{tabs.map((tab, index) => (
					<NavItem key={index} link={tab} expanded={isExpanded} />
				))}
			</div>

			<div className="flex-grow" />
			<button
				className="cursor-pointer text-white p-0.5 bg-white/10 rounded-md flex items-center justify-center"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<AnimatedIcon
					icon="mdi:chevron-double-right"
					label="expand menu"
					className="w-5 h-5"
					style={{
						transform: widthStyle.rotate.to((value) => `rotate(${value}deg)`),
					}}
				/>
			</button>
		</animated.nav>
	)
}

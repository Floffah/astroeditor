import { defineConfig } from 'tsup'

export default defineConfig({
	name: 'commons',
	outDir: 'dist',
	entry: ['./src/index.ts'],
	target: ['chrome90', 'firefox88', 'safari14', 'edge90', 'node18'],
	bundle: true,
	format: 'cjs',
	splitting: false,
	dts: true,
	clean: false,
})

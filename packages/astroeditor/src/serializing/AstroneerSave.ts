export interface AstroneerSave {
	header: {
		formatType: number // saved just so we have it. This is actually the string "GVAS" as the decompressed version of .savefile is of the type GVAS
		saveVersion: number
		gameVersion: number
		engineVersion: {
			major: number
			minor: number
			patch: number
			build: number
			build_id: string
		}
		formatData: {
			version: number
			count: number
			entries: Record<string, number>
		}
		saveClass: string
		headerSuffixMessage: string
		headerSuffixInt: number
	}
}

export interface SaveFile {
	header: AstroHeader
	save: AstroSave
}

export interface AstroHeader {
	formatType: number // uint32 - saved just so we have it. This is actually the string "GVAS" as the decompressed version of .savefile is of the type GVAS
	saveVersion: number // int32
	gameVersion: number // int32
	engineVersion: AstroEngineVersion
	formatData: AstroCustomFormatData
	saveClass: string // utf8 string - almost always "AstroSave"
	headerSuffixMessage: string // utf8 string
	headerSuffixInt: number // int32
}

export interface AstroEngineVersion {
	major: number // uint16
	minor: number // uint16
	patch: number // uint16
	build: number // uint32
	buildId: string // utf8 string
}

export interface AstroCustomFormatData {
	version: number // int32
	entries: Record<number, number> // guid: uint128, value: uint32, count: uint32
}

// ----------------------------

export interface AstroSave {
	level: AstroLevelSaveChunk
	playerChunks: AstroRemotePlayerChunk[] // count: int32
}

export interface AstroLevelSaveChunk {
	saveVersion: number // uint32
	levelName: string // utf8 string
	data: AstroSaveChunk
	playerControllerRecords: AstroPlayerControllerRecord[] // count: int32
}

export interface AstroPlayerControllerRecord {
	actorIndex: number // uint32
	lastControllerPawn: number // uint32
	networkUuid: number // uint64
}

export interface AstroRemotePlayerChunk {
	data: AstroSaveChunk
	networkUuid: number // uint64
}

export interface AstroSaveChunk {
	saveVersion: number // uint32
	names: string[] // count: uint32, utf8 string
	objectRecords: AstroObjectSaveRecord[] // count: uint32
	actorRecords: AstroActorRecord[] // count: uint32
	rootLevelActorIndices: number[] // count: uint32, value: int32
	firstImportIndex: number // uint32
}

export interface AstroObjectSaveRecord {
	type: string // utf8 string
	nameIndex: number // int32
	flags: number // uint32
	saveFlags: number // uint8
	parentObjectIndex: number // int32
	customDataOffset: number // uint32
	data: number[] // count: uint32, uint8, count is tied to customData
	customData: number[] // count: uint32, uint8, count is tied to data
}

export interface AstroActorRecord {
	objectIndex: number // int32
	childActors: AstroChildActorRecord[] // count: uint32
	ownedComponents: AstroComponentRecord[] // count: uint32
	rootTransform: Transform
}

export interface AstroChildActorRecord {
	nameIndex: number // int32
	actorIndex: number // int32
}

export interface AstroComponentRecord {
	nameIndex: number // int32
	objectIndex: number // int32
}

export interface Transform {
	rotation: Quaternion
	translation: FloatVector
	scale: FloatVector
}

export interface FloatVector {
	x: number // float32
	y: number // float32
	z: number // float32
}

export interface Quaternion extends FloatVector {
	w: number // float32
}

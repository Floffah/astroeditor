import {
	AstroActorRecord,
	AstroChildActorRecord,
	AstroComponentRecord,
	AstroCustomFormatData,
	AstroEngineVersion,
	AstroHeader,
	AstroObjectSaveRecord,
	AstroPlayerControllerRecord,
	AstroRemotePlayerChunk,
	AstroSaveChunk,
	FloatVector,
	Quaternion,
	SaveFile,
	Transform,
} from '@/serializing/AstroSave'
import ByteBuffer from 'bytebuffer'
import { readUint128, readUTF8String } from '@/util/protocolFormats'

/**
 * see https://github.com/ricky-davis/astro_save_parser/blob/main/src/save.rs for reference
 */
export class SaveDeserializer {
	public static parseSaveFile(buf: ByteBuffer): SaveFile {
		return {
			header: this.parseHeader(buf),
			save: this.parseSave(buf),
		}
	}

	private static parseHeader(buf: ByteBuffer): AstroHeader {
		return {
			formatType: buf.readUint32(),
			saveVersion: buf.readInt32(),
			gameVersion: buf.readInt32(),
			engineVersion: this.parseEngineVersion(buf),
			formatData: this.parseFormatData(buf),
			saveClass: readUTF8String(buf),
			headerSuffixMessage: readUTF8String(buf),
			headerSuffixInt: buf.readInt32(),
		}
	}

	private static parseEngineVersion(buf: ByteBuffer): AstroEngineVersion {
		return {
			major: buf.readUint16(),
			minor: buf.readUint16(),
			patch: buf.readUint16(),
			build: buf.readUint32(),
			buildId: readUTF8String(buf),
		}
	}

	private static parseFormatData(buf: ByteBuffer): AstroCustomFormatData {
		const version = buf.readInt32()
		const count = buf.readUint32()

		const entries: Record<number, number> = {}

		for (let i = 0; i < count; i++) {
			// const most = buf.readUint64()
			// const least = buf.readUint64()
			// const uuid = `${most.toString(16)}${least.toString(16)}`
			const guid = readUint128(buf)
			const value = buf.readUint32()

			entries[guid] = value
		}

		return {
			version,
			entries,
		}
	}

	// -------

	private static parseSave(buf: ByteBuffer): any {
		const level = this.parseLevel(buf)
		const playerChunks = this.parsePlayerChunks(buf)

		return {
			level,
			playerChunks,
		}
	}

	private static parseLevel(buf: ByteBuffer): any {
		const saveVersion = buf.readUint32()
		const levelName = readUTF8String(buf)
		const data = this.parseSaveChunk(buf)
		const playerControllerRecords = this.parsePlayerControllerRecords(buf)

		return {
			saveVersion,
			levelName,
			data,
			playerControllerRecords,
		}
	}

	private static parsePlayerControllerRecords(
		buf: ByteBuffer,
	): AstroPlayerControllerRecord[] {
		const count = buf.readInt32()
		const records: AstroPlayerControllerRecord[] = []

		for (let i = 0; i < count; i++) {
			const actorIndex = buf.readUint32()
			const lastControllerPawn = buf.readUint32()
			const networkUuid = buf.readUint64().toNumber()

			records.push({
				actorIndex,
				lastControllerPawn,
				networkUuid,
			})
		}

		return records
	}

	private static parsePlayerChunks(buf: ByteBuffer): AstroRemotePlayerChunk[] {
		const count = buf.readInt32()
		const chunks: any[] = []

		for (let i = 0; i < count; i++) {
			const data = this.parseSaveChunk(buf)
			const networkUuid = buf.readUint64().toNumber()

			chunks.push({
				data,
				networkUuid,
			})
		}

		return chunks
	}

	private static parseSaveChunk(buf: ByteBuffer): AstroSaveChunk {
		const saveVersion = buf.readUint32()

		const nameCount = buf.readInt64().toNumber()
		const names: string[] = []

		for (let i = 0; i < nameCount - 1; i++) {
			names.push(readUTF8String(buf))
		}

		const objectRecords = this.parseObjectRecords(buf)
		const actorRecords = this.parseActorRecords(buf)

		const rootLevelActorIndicesCount = buf.readUint32()
		const rootLevelActorIndices: number[] = []

		for (let i = 0; i < rootLevelActorIndicesCount; i++) {
			rootLevelActorIndices.push(buf.readInt32())
		}

		const firstImportIndex = buf.readUint32()

		return {
			saveVersion,
			names,
			objectRecords,
			actorRecords,
			rootLevelActorIndices,
			firstImportIndex,
		}
	}

	private static parseObjectRecords(buf: ByteBuffer): AstroObjectSaveRecord[] {
		const count = buf.readUint32()
		const records: AstroObjectSaveRecord[] = []

		for (let i = 0; i < count; i++) {
			const type = readUTF8String(buf)
			const nameIndex = buf.readInt32()
			const flags = buf.readUint32()
			const saveFlags = buf.readUint8()
			const parentObjectIndex = buf.readInt32()
			const customDataOffset = buf.readUint32()

			let size = 0

			if ((saveFlags & 4) !== 0) {
				size = buf.readUint32()
			}

			let data: number[] = [],
				customData: number[] = []

			for (let j = 0; j < customDataOffset; j++) {
				data.push(buf.readUint8())
			}

			if (size > 0) {
				for (let j = 0; j < size - customDataOffset; j++) {
					customData.push(buf.readUint8())
				}
			}

			records.push({
				type,
				nameIndex,
				flags,
				saveFlags,
				parentObjectIndex,
				customDataOffset,
				data,
				customData,
			})
		}

		return records
	}

	private static parseActorRecords(buf: ByteBuffer): AstroActorRecord[] {
		const count = buf.readUint32()
		const records: AstroActorRecord[] = []

		for (let i = 0; i < count; i++) {
			const objectIndex = buf.readInt32()
			const childActors = this.parseChildActorRecords(buf)
			const ownedComponents = this.parseComponentRecords(buf)
			const rootTransform = this.parseTransform(buf)

			records.push({
				objectIndex,
				childActors,
				ownedComponents,
				rootTransform,
			})
		}

		return records
	}

	private static parseChildActorRecords(
		buf: ByteBuffer,
	): AstroChildActorRecord[] {
		const count = buf.readUint32()
		const records: AstroChildActorRecord[] = []

		for (let i = 0; i < count; i++) {
			const nameIndex = buf.readInt32()
			const actorIndex = buf.readInt32()

			records.push({
				nameIndex,
				actorIndex,
			})
		}

		return records
	}

	private static parseComponentRecords(
		buf: ByteBuffer,
	): AstroComponentRecord[] {
		const count = buf.readUint32()
		const records: AstroComponentRecord[] = []

		for (let i = 0; i < count; i++) {
			const nameIndex = buf.readInt32()
			const objectIndex = buf.readInt32()

			records.push({
				nameIndex,
				objectIndex,
			})
		}

		return records
	}

	private static parseTransform(buf: ByteBuffer): Transform {
		const rotation = this.parseQuaternion(buf)
		const translation = this.parseFloatVector(buf)
		const scale = this.parseFloatVector(buf)

		return {
			rotation,
			translation,
			scale,
		}
	}

	private static parseFloatVector(buf: ByteBuffer): FloatVector {
		const x = buf.readFloat32()
		const y = buf.readFloat32()
		const z = buf.readFloat32()

		return {
			x,
			y,
			z,
		}
	}

	private static parseQuaternion(buf: ByteBuffer): Quaternion {
		const x = buf.readFloat32()
		const y = buf.readFloat32()
		const z = buf.readFloat32()
		const w = buf.readFloat32()

		return {
			x,
			y,
			z,
			w,
		}
	}
}

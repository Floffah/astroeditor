import { AstroSave } from '@/serializing/AstroSave'
import ByteBuffer from 'bytebuffer'
import { readUTF8String } from '@/util/protocolFormats'

/**
 * see https://github.com/ricky-davis/astro_save_parser/blob/main/src/save.rs for reference
 */
export class SaveDeserializer {
	public static parseSave(buf: ByteBuffer): AstroSave {
		return {
			header: this.parseHeader(buf),
		}
	}

	private static parseHeader(buf: ByteBuffer): AstroSave['header'] {
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

	private static parseEngineVersion(
		buf: ByteBuffer,
	): AstroSave['header']['engineVersion'] {
		return {
			major: buf.readUint16(),
			minor: buf.readUint16(),
			patch: buf.readUint16(),
			build: buf.readUint32(),
			build_id: readUTF8String(buf),
		}
	}

	private static parseFormatData(
		buf: ByteBuffer,
	): AstroSave['header']['formatData'] {
		const version = buf.readInt32()
		const count = buf.readUint32()

		const entries: Record<number, number> = {}

		for (let i = 0; i < count; i++) {
			const most = buf.readUint64()
			const least = buf.readUint64()
			const uuid = `${most.toString(16)}${least.toString(16)}`
			const value = buf.readUint32()

			entries[uuid] = value
		}

		return {
			version,
			count,
			entries,
		}
	}
}
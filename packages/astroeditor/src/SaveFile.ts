import { Editor } from '@/Editor'
import ByteBuffer from 'bytebuffer'
import { Inflate } from 'pako'
import { SaveFile as AstroSaveFile } from '@/serializing/AstroSave'
import { SaveDeserializer } from '@/serializing/SaveDeserializer'
import { Interpolator } from '@/interpolation/Interpolator'

const fixedHeaderHex = 'BE 40 37 4A EE 0B 74 A3 01 00 00 00'
const fixedHeaderBytes = fixedHeaderHex
	.split(' ')
	.map((hex) => parseInt(hex, 16))

export class SaveFile {
	editor: Editor
	interpolator: Interpolator
	buf: ByteBuffer

	saveData: AstroSaveFile

	constructor(editor: Editor, buf: Buffer | ArrayBuffer) {
		this.editor = editor

		const compressedBuf = ByteBuffer.wrap(buf)
		const fixedHeaderBuf = compressedBuf.readBytes(12)
		const rawHeaderBuf = compressedBuf.readBytes(4)

		for (let i = 0; i < fixedHeaderBytes.length; i++) {
			if (fixedHeaderBytes[i] !== fixedHeaderBuf.readUint8(i)) {
				throw new Error(
					'Invalid save file header. Is this definitely a .savegame file?',
				)
			}
		}

		const inflate = new Inflate()
		inflate.push(compressedBuf.toArrayBuffer(), true)

		const decompressedBuf = ByteBuffer.wrap(inflate.result)
		decompressedBuf.littleEndian = true

		this.buf = decompressedBuf

		this.saveData = SaveDeserializer.parseSaveFile(this.buf)

		this.interpolator = new Interpolator(this)
	}
}

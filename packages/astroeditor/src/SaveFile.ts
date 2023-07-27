import { Editor } from '@/Editor'
import ByteBuffer from 'bytebuffer'
import { inflate } from 'pako'

export class SaveFile {
	editor: Editor
	buf: ByteBuffer

	constructor(editor: Editor, buf: Buffer | ArrayBuffer) {
		this.editor = editor

		const compressedBuf = ByteBuffer.wrap(buf)
		// remove the first 12 bytes
		// compressedBuf.skip(12)
		// compressedBuf.skip(4)

		// decompress the rest

		const decompressedBuf = ByteBuffer.wrap(
			inflate(compressedBuf.toBuffer(), {
				raw: true,
			}),
		)

		this.buf = decompressedBuf
	}
}

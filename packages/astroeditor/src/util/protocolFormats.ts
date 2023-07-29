import ByteBuffer from 'bytebuffer'

export function readUTF8String(buf: ByteBuffer): string {
	const length = buf.readInt32()
	const str = buf.readString(length - 1)
	const suffixByte = buf.readUint8()

	return str
}

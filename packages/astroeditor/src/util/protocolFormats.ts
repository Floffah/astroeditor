import ByteBuffer from 'bytebuffer'

export function readUTF8String(buf: ByteBuffer): string {
	const length = buf.readInt32()
	return buf.readString(length)
}

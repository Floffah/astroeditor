import ByteBuffer from 'bytebuffer'

export function readUTF8String(buf: ByteBuffer): string {
	const length = buf.readInt32()
	const str = buf.readString(length - 1)
	const suffixByte = buf.readUint8()

	return str
}

export function readUint128(buf: ByteBuffer): number {
	const most = buf.readUint64()
	const least = buf.readUint64()
	// const str = `${most.toString(16)}${least.toString(16)}`
	// const num = parseInt(str, 16)

	return most.toNumber() * 2 ** 64 + least.toNumber()
}

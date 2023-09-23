import ByteBuffer from 'bytebuffer'
import { SaveFile } from '@/SaveFile'
import { Interpolator } from '@/interpolation/Interpolator'
export class Editor {
	savefile: SaveFile

	constructor(buf: Buffer | ArrayBuffer) {
		this.savefile = new SaveFile(this, buf)
	}
}

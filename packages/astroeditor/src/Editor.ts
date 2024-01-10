import { SaveFile } from '@/SaveFile'

export class Editor {
	savefile: SaveFile

	constructor(buf: Buffer | ArrayBuffer) {
		this.savefile = new SaveFile(this, buf)
	}
}

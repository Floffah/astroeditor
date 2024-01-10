import { SaveFile } from '@/SaveFile'

interface LevelRecord {
	name: string
	objects: {
		type: string
	}[]
	actors: {
		type: number
	}[]
}

export class Interpolator {
	saveFile: SaveFile

	levelRecords: Map<string, LevelRecord>

	constructor(saveFile: SaveFile) {
		this.saveFile = saveFile

		this.levelRecords = new Map()

		for (const objectRecord of this.saveFile.saveData.save.level.data
			.objectRecords) {
			const name =
				this.saveFile.saveData.save.level.data.names[objectRecord.nameIndex]

			const object = {
				type: objectRecord.type,
			}

			const record = this.levelRecords.get(name) ?? {
				name,
				objects: [],
				actors: [],
			}

			record.objects.push(object)

			this.levelRecords.set(name, record)
		}

		for (const actorRecord of this.saveFile.saveData.save.level.data
			.actorRecords) {
			const name =
				this.saveFile.saveData.save.level.data.names[
					actorRecord.childActors[0].nameIndex
				]

			const actor = {
				type: actorRecord.childActors[0].nameIndex,
			}

			const record = this.levelRecords.get(name) ?? {
				name,
				objects: [],
				actors: [],
			}

			record.actors.push(actor)

			this.levelRecords.set(name, record)
		}
	}
}

// Modified from Ricky Davis https://github.com/ricky-davis/astro_save_parser
// MIT License
//
// Copyright (c) 2020 Ricky Davis
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

use std::fs::File;
use std::io::prelude::*;

use byteorder::{ByteOrder, LittleEndian};
use flate2::read::ZlibDecoder;

#[derive(Debug)]
pub(crate) struct SaveFileData {
    pub(crate) file: Option<File>,
    pub(crate) filesize: u64,
    pub(crate) header: Vec<u8>,
    pub(crate) compressed_data: Vec<u8>,
    pub(crate) decompressed_data: Vec<u8>,
    pub(crate) cursor: u64,
}

impl SaveFileData {
    pub(crate) fn new_bytes(file_size: u64, file_data: &[u8]) -> SaveFileData {
        let file = None;

        SaveFileData {
            file,
            filesize: file_size,
            header: Vec::new(),
            compressed_data: file_data.to_vec(),
            decompressed_data: Vec::new(),
            cursor: 0,
        }
    }

    pub(crate) fn get_next_x(&mut self, x: u64) -> Vec<u8> {
        let size = x;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        return d;
    }

    pub(crate) fn get_next_u8(&mut self) -> u8 {
        let size = 1;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = *d.get(0).unwrap();
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_u16(&mut self) -> u16 {
        let size = 2;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_u16(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_i16(&mut self) -> i16 {
        let size = 2;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_i16(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_u32(&mut self) -> u32 {
        let size = 4;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_u32(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_i32(&mut self) -> i32 {
        let size = 4;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_i32(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_u64(&mut self) -> u64 {
        let size = 8;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_u64(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_i64(&mut self) -> i64 {
        let size = 8;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_i64(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_u128(&mut self) -> u128 {
        let size = 16;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_u128(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_f32(&mut self) -> f32 {
        let size = 4;
        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + size) as usize)]
            .to_vec();
        self.cursor += size;
        let rtn = LittleEndian::read_f32(&d);
        // println!("{:?}",rtn);
        return rtn;
    }
    pub(crate) fn get_next_string(&mut self) -> String {
        let s: Vec<_> =
            self.decompressed_data[(self.cursor as usize)..((self.cursor + 4) as usize)].to_vec();
        let str_size = LittleEndian::read_i32(&s) as u64;
        // println!("{:?}",&str_size);
        self.cursor += 4;

        let d: Vec<_> = self.decompressed_data
            [(self.cursor as usize)..((self.cursor + str_size) as usize)]
            .to_vec();
        // println!("{:?}",&d);
        self.cursor += str_size;

        let rtn = String::from_utf8(d).expect("Found invalid UTF-8");
        // println!("{:?}",rtn);
        return rtn;
    }
}

#[derive(Debug)]
pub(crate) struct RawSave {
    pub(crate) structured_data: Option<DecompressedData>,
    pub(crate) raw_data: Option<SaveFileData>,
}

impl RawSave {
    pub(crate) fn new_bytes(file_size: u64, file_data: &[u8]) -> RawSave {
        let raw_data = Some(SaveFileData::new_bytes(file_size, &file_data.to_vec()));
        RawSave {
            raw_data,
            structured_data: None,
        }
    }
    pub(crate) fn load(&mut self) {
        let mut data: &mut SaveFileData = self.raw_data.as_mut().unwrap();
        let mut compressed = Vec::new();

        let header: Vec<_> = data.compressed_data.drain(0..16).collect();
        println!("Header: {:?}", &header);

        data.header = header.to_vec();

        // read everything else as zlib compressed data
        compressed = (*data.compressed_data).to_vec();
        println!("Compr: {:?}", &compressed[0..16]);
        let original_size = &compressed.len();
        data.compressed_data = compressed.clone();

        let mut decompressed = Vec::new();
        ZlibDecoder::new(&compressed[..])
            .read_to_end(&mut decompressed)
            .expect("decompressing file");
        data.compressed_data = Vec::new();
        data.decompressed_data = decompressed.clone();

        println!(
            "Decompressed from {0} to {1} bytes",
            original_size,
            decompressed.len()
        );

        println!("Deserializing data...");

        self.structured_data = Some(DecompressedData::deserialize(&mut data));
        self.raw_data = None;
        // println!("{:?}",self.structured_data);
    }
}

#[derive(Debug)]
pub(crate) struct DecompressedData {
    pub(crate) header: Header,
    pub(crate) astro_save: AstroSave,
}

impl DecompressedData {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> DecompressedData {
        let h = Header::deserialize(save);
        println!("here1");
        let s = AstroSave::deserialize(save);
        DecompressedData {
            header: h,
            astro_save: s,
        }
    }
}

#[derive(Debug)]
pub(crate) struct Header {
    pub(crate) format_tag: u32,
    pub(crate) save_game_version: i32,
    pub(crate) package_version: i32,
    pub(crate) engine_version: EngineVersion,
    pub(crate) custom_format_data: CustomFormatData,
    pub(crate) save_class: String,
    pub(crate) end_of_header1: String,
    pub(crate) end_of_header2: i32,
}

impl Header {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> Header {
        Header {
            format_tag: save.get_next_u32(),
            save_game_version: save.get_next_i32(),
            package_version: save.get_next_i32(),
            engine_version: EngineVersion::deserialize(save),
            custom_format_data: CustomFormatData::deserialize(save),
            save_class: save.get_next_string(),
            end_of_header1: save.get_next_string(),
            end_of_header2: save.get_next_i32(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct EngineVersion {
    pub(crate) major: u16,
    pub(crate) minor: u16,
    pub(crate) patch: u16,
    pub(crate) build: u32,
    pub(crate) build_id: String,
}

impl EngineVersion {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> EngineVersion {
        EngineVersion {
            major: save.get_next_u16(),
            minor: save.get_next_u16(),
            patch: save.get_next_u16(),
            build: save.get_next_u32(),
            build_id: save.get_next_string(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct CustomFormatData {
    pub(crate) version: i32,
    pub(crate) custom_format_count: u32,
    pub(crate) custom_format_datum: Vec<CustomFormatDatum>,
}

impl CustomFormatData {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> CustomFormatData {
        let vers = save.get_next_i32();
        let count = save.get_next_u32();
        let mut cfd = Vec::new();
        for _x in 0..count {
            cfd.push(CustomFormatDatum::deserialize(save));
        }
        CustomFormatData {
            version: vers,
            custom_format_count: count,
            custom_format_datum: cfd,
        }
    }
}

#[derive(Debug)]
pub(crate) struct CustomFormatDatum {
    pub(crate) id: u128,
    // Guid
    pub(crate) value: i32,
}

impl CustomFormatDatum {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> CustomFormatDatum {
        CustomFormatDatum {
            id: save.get_next_u128(),
            value: save.get_next_i32(),
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////

#[derive(Debug)]
pub(crate) struct AstroSave {
    pub(crate) level_chunk: AstroLevelSaveChunk,
    pub(crate) remote_player_chunks_count: i32,
    pub(crate) remote_player_chunks: Vec<AstroRemotePlayerChunk>,
}

impl AstroSave {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> AstroSave {
        let alsc = AstroLevelSaveChunk::deserialize(save);
        let rpc_count = save.get_next_i32();
        let mut rpc = Vec::new();
        for _x in 0..rpc_count {
            rpc.push(AstroRemotePlayerChunk::deserialize(save));
        }
        AstroSave {
            level_chunk: alsc,
            remote_player_chunks_count: rpc_count,
            remote_player_chunks: rpc,
        }
    }
}

#[derive(Debug)]
pub(crate) struct AstroLevelSaveChunk {
    pub(crate) astro_save_version: u32,
    pub(crate) level_name: String,
    pub(crate) data: AstroSaveChunk,
    pub(crate) player_controller_records_count: i32,
    pub(crate) player_controller_records: Vec<PlayerControllerRecord>,
}

impl AstroLevelSaveChunk {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> AstroLevelSaveChunk {
        let asv = save.get_next_u32();
        let ln = save.get_next_string();
        let data = AstroSaveChunk::deserialize(save);
        let pcr_count = save.get_next_i32();
        let mut pcr = Vec::new();
        for _x in 0..pcr_count {
            pcr.push(PlayerControllerRecord::deserialize(save));
        }
        AstroLevelSaveChunk {
            astro_save_version: asv,
            level_name: ln,
            data,
            player_controller_records_count: pcr_count,
            player_controller_records: pcr,
        }
    }
}

#[derive(Debug)]
pub(crate) struct PlayerControllerRecord {
    pub(crate) actor_index: u32,
    pub(crate) last_controller_pawn: u32,
    pub(crate) network_uuid: u64,
}

impl PlayerControllerRecord {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> PlayerControllerRecord {
        PlayerControllerRecord {
            actor_index: save.get_next_u32(),
            last_controller_pawn: save.get_next_u32(),
            network_uuid: save.get_next_u64(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct AstroRemotePlayerChunk {
    pub(crate) data: AstroSaveChunk,
    pub(crate) network_uuid: u64,
}

impl AstroRemotePlayerChunk {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> AstroRemotePlayerChunk {
        AstroRemotePlayerChunk {
            data: AstroSaveChunk::deserialize(save),
            network_uuid: save.get_next_u64(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct AstroSaveChunk {
    pub(crate) astro_save_version: u32,
    pub(crate) names: StringTable,
    pub(crate) object_records_count: u32,
    pub(crate) object_records: Vec<ObjectSaveRecord>,
    pub(crate) actor_records_count: u32,
    pub(crate) actor_records: Vec<ActorRecord>,
    pub(crate) root_level_actor_indices_count: u32,
    pub(crate) root_level_actor_indices: Vec<i32>,
    pub(crate) first_import_index: u32,
}

impl AstroSaveChunk {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> AstroSaveChunk {
        let asv = save.get_next_u32();
        let names = StringTable::deserialize(save);
        let or_count = save.get_next_u32();
        let mut or = Vec::new();
        for _x in 0..or_count {
            or.push(ObjectSaveRecord::deserialize(save));
        }
        let ar_count = save.get_next_u32();
        let mut ar = Vec::new();
        for _x in 0..ar_count {
            ar.push(ActorRecord::deserialize(save));
        }
        let rlai_count = save.get_next_u32();
        let mut rlai = Vec::new();
        for _x in 0..rlai_count {
            rlai.push(save.get_next_i32());
        }
        let fii = save.get_next_u32();

        AstroSaveChunk {
            astro_save_version: asv,
            names,
            object_records_count: or_count,
            object_records: or,
            actor_records_count: ar_count,
            actor_records: ar,
            root_level_actor_indices_count: rlai_count,
            root_level_actor_indices: rlai,
            first_import_index: fii,
        }
    }
}

#[derive(Debug)]
pub(crate) struct StringTable {
    pub(crate) count: i64,
    pub(crate) strings: Vec<String>,
}

impl StringTable {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> StringTable {
        let count = save.get_next_i64();
        let mut strings = Vec::new();
        for _x in 0..(count - 1) {
            strings.push(save.get_next_string());
        }
        StringTable {
            count,
            strings,
        }
    }
}

#[derive(Debug)]
struct ObjectSaveRecord {
    pub(crate) object_type: String,
    pub(crate) name_index: i32,
    pub(crate) flags: u32,
    pub(crate) save_flags: u8,
    pub(crate) outer_object_index: i32,
    // parent
    pub(crate) custom_data_offset: u32,
    pub(crate) size: u32,
    pub(crate) data: Vec<u8>,
    // length is size
    pub(crate) custom_data: Vec<u8>, // length is size - custom_data_offset
}

impl ObjectSaveRecord {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> ObjectSaveRecord {
        let ot = save.get_next_string();
        let ni = save.get_next_i32();
        let flags = save.get_next_u32();
        let save_flags = save.get_next_u8();
        let ooi = save.get_next_i32();
        let cdo = save.get_next_u32();
        let mut size: u32 = 0;
        if (save_flags & 4) != 0 {
            size = save.get_next_u32();
        }

        // println!("save_flags: {:?}",&save_flags);
        // println!("save_flags&4: {:?}",&save_flags&4);
        // println!("CDO: {:?}",&cdo);
        // println!("SIZE: {:?}",&size);

        let data = save.get_next_x(cdo as u64);
        // println!("datalen: {:?}",&data.len());
        let mut custom_data = Vec::new();
        if size != 0 {
            let t_size = (size - cdo) as u64;
            custom_data = save.get_next_x(t_size);
        }
        // println!("cdatalen: {:?}",&custom_data.len());

        ObjectSaveRecord {
            object_type: ot,
            name_index: ni,
            flags,
            save_flags,
            outer_object_index: ooi,
            custom_data_offset: cdo,
            size,
            data,
            custom_data,
        }
    }
}

#[derive(Debug)]
pub(crate) struct ActorRecord {
    pub(crate) object_index: i32,
    pub(crate) child_actor_count: i32,
    pub(crate) child_actor_records: Vec<ChildActorRecord>,
    pub(crate) owned_component_count: i32,
    pub(crate) owned_components: Vec<ComponentRecord>,
    pub(crate) root_transform: Transform,
}

impl ActorRecord {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> ActorRecord {
        let oi = save.get_next_i32();
        let ca_count = save.get_next_i32();
        let mut car = Vec::new();
        for _x in 0..ca_count {
            car.push(ChildActorRecord::deserialize(save));
        }
        let oc_count = save.get_next_i32();
        let mut oc = Vec::new();
        for _x in 0..oc_count {
            oc.push(ComponentRecord::deserialize(save));
        }
        let tnsfm = Transform::deserialize(save);

        ActorRecord {
            object_index: oi,
            child_actor_count: ca_count,
            child_actor_records: car,
            owned_component_count: oc_count,
            owned_components: oc,
            root_transform: tnsfm,
        }
    }
}

#[derive(Debug)]
pub(crate) struct ChildActorRecord {
    pub(crate) name_index: i32,
    pub(crate) actor_index: i32,
}

impl ChildActorRecord {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> ChildActorRecord {
        ChildActorRecord {
            name_index: save.get_next_i32(),
            actor_index: save.get_next_i32(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct ComponentRecord {
    pub(crate) name_index: i32,
    pub(crate) object_index: i32,
}

impl ComponentRecord {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> ComponentRecord {
        ComponentRecord {
            name_index: save.get_next_i32(),
            object_index: save.get_next_i32(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct Transform {
    pub(crate) rotation: Quaternion,
    pub(crate) translation: Vec<f32>,
    pub(crate) scale: Vec<f32>,
}

impl Transform {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> Transform {
        let quat = Quaternion::deserialize(save);
        let mut trns = Vec::new();
        for _x in 0..3 {
            trns.push(save.get_next_f32());
        }
        let mut scale = Vec::new();
        for _x in 0..3 {
            scale.push(save.get_next_f32());
        }
        Transform {
            rotation: quat,
            translation: trns,
            scale,
        }
    }
}

#[derive(Debug)]
pub(crate) struct Quaternion {
    pub(crate) x: f32,
    pub(crate) y: f32,
    pub(crate) z: f32,
    pub(crate) w: f32,
}

impl Quaternion {
    pub(crate) fn deserialize(save: &mut SaveFileData) -> Quaternion {
        Quaternion {
            x: save.get_next_f32(),
            y: save.get_next_f32(),
            z: save.get_next_f32(),
            w: save.get_next_f32(),
        }
    }
}

mod proxied_save;

use std::fmt::format;
use wasm_bindgen::prelude::wasm_bindgen;
use crate::raw_save::RawSave;

#[wasm_bindgen]
pub struct Editor {
    pub(crate) raw_save: Option<RawSave>
}

#[wasm_bindgen]
impl Editor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Editor {
        Editor {
            raw_save: None
        }
    }


    pub fn load(&mut self, file_size: u64, file_data: &[u8]) {
        let mut data = RawSave::new_bytes(file_size, file_data);

        data.load();

        self.raw_save = Some(data);
    }

    pub fn get_save_version(&self) -> Option<proxied_save::SaveGameVersion> {
        match &self.raw_save {
            Some(save) => {
                let structured_data = save.structured_data.as_ref().unwrap();
                let version = &structured_data.header.save_game_version;
                let package_version = &structured_data.header.package_version;

                Some(proxied_save::SaveGameVersion {
                    version: version.clone(),
                    package_version: package_version.clone()
                })
            },
            None => None
        }
    }

    pub fn get_engine_version(&self) -> Option<proxied_save::UnrealEngineVersion> {
        match &self.raw_save {
            Some(save) => {
                let structured_data = save.structured_data.as_ref().unwrap();
                let engine_version = &structured_data.header.engine_version;

                Some(proxied_save::UnrealEngineVersion::new(
                    format!("{}.{}.{}", engine_version.major, engine_version.minor, engine_version.patch),
                    engine_version.build_id.clone()
                ))
            },
            None => None
        }
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        format!("{:?}", self.raw_save)
    }
}
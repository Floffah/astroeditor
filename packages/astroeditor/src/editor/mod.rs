use wasm_bindgen::prelude::wasm_bindgen;
use crate::log;
use crate::raw_save::RawSave;

#[wasm_bindgen]
pub struct Editor {
    pub(crate) save: Option<RawSave>
}

#[wasm_bindgen]
impl Editor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Editor {
        Editor {
            save: None
        }
    }


    pub fn load(&mut self, file_size: u64, file_data: &[u8]) {
        let mut data = RawSave::new_bytes(file_size, file_data);

        data.load();

        self.save = Some(data);
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_str(&self) -> String {
        format!("{:?}", self.save)
    }
}
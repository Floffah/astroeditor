use wasm_bindgen::prelude::wasm_bindgen;
use crate::raw_save::RawSave;

#[wasm_bindgen]
#[no_mangle]
pub struct Editor {
    pub(crate) save: Option<RawSave>
}

#[wasm_bindgen]
#[no_mangle]
impl Editor {
    #[wasm_bindgen(constructor)]
    #[no_mangle]
    pub fn new() -> Editor {
        Editor {
            save: None
        }
    }


    pub fn load(&self, file_size: u64, file_data: &[u8]) {
        let mut data = RawSave::new_bytes(file_size, file_data);

        data.load();

        println!("{:?}", data);
    }
}
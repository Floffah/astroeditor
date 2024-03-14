use wasm_bindgen::prelude::wasm_bindgen;

mod raw_save;
mod editor;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
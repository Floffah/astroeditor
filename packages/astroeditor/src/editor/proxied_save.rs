use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen()]
pub struct SaveGameVersion {
    pub version: i32,
    pub package_version: i32
}

#[wasm_bindgen()]
pub struct UnrealEngineVersion {
    pub(crate) version: String,
    pub(crate) build_id: String
}

#[wasm_bindgen]
impl UnrealEngineVersion {
    #[wasm_bindgen(constructor)]
    pub fn new(version: String, build_id: String) -> UnrealEngineVersion {
        UnrealEngineVersion { version, build_id }
    }

    #[wasm_bindgen(getter)]
    pub fn version(&self) -> String {
        self.version.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn build_id(&self) -> String {
        self.build_id.clone()
    }
}
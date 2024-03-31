let save = window.prompt("Enter a save string.");
save = new Uint8Array(JSON.parse(save));

if (Iodine.saveExportHandler && !Iodine.faultFound && Iodine.loaded) {
    console.log("Save:", save);
    let saveType = Iodine.IOCore.saves.exportSaveType();
    if (save != null && saveType != null) {
        Iodine.saveExportHandler(Iodine.IOCore.cartridge.name, save);
        Iodine.saveExportHandler("TYPE_" + Iodine.IOCore.cartridge.name, saveType | 0);
        console.log("Save succeeded.");
    }
}

window.removeEventListener("unload", ExportSave);
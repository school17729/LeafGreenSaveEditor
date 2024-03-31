const emulatorTarget = document.querySelector("#emulator_target");
const tempMessage = document.querySelector("#tempMessage");
emulatorTarget.style.display = "none";
tempMessage.style.display = "none";
document.body.style.cursor = "default";

const saveStringDiv = document.createElement("div");
document.body.insertBefore(saveStringDiv, null);
const saveStringSpan = document.createElement("span");
saveStringDiv.insertBefore(saveStringSpan, null);

saveStringDiv.style.display = "block";
saveStringDiv.style.width = "100vw";
saveStringSpan.style.display = "block";
saveStringSpan.style.width = "100%";
saveStringSpan.style.fontFamily = "sans-serif";
saveStringSpan.style.fontSize = "20px";
saveStringSpan.style.overflowWrap = "break-word";

saveStringSpan.innerHTML = Iodine.saveImportHandler(Iodine.getGameName()).toString();
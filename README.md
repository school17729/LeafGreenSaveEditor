# LeafGreenSaveEditor
## Information
**LeafGreenSaveEditor currently does not work.**\
**There is currently no `resultText.txt` and `SaveWriter.js` is broken.**\
View and edit save data in [Pokemon Leaf Green from the MKGBA emulator](https://mkgamesdev.github.io/MKGBA2.0/launcher.html#pokemongreen)
## Instructions
- Install TypeScript and NodeJS
    - Follow the instructions at [www.typescriptlang.org](https://www.typescriptlang.org/download) to download TypeScript
    - Download NodeJS either through Node Version Manager ([Node Version Manager](https://github.com/nvm-sh/nvm) on MacOS/Linux, [NVM for Windows](https://github.com/coreybutler/nvm-windows) on Windows) or [by itself](https://nodejs.org/en/download)
- Make sure that the current checked-out branch is `master`
- Go to [Pokemon Leaf Green in the MKGBA emulator](https://mkgamesdev.github.io/MKGBA2.0/launcher.html#pokemongreen)
- Open inspect console with `Ctrl+Shift+i`
- Paste contents of `SaveReader.js` into the inspect console and hit enter
- Wait until "Loaded save." message disappears
- Paste website contents into `sourceText.txt`
- Run `Run.sh` on MacOS/Linux or `Run.bat` on Windows
- Reload website
- Open inspect console with `Ctrl+Shift+i`
- Paste contents of `SaveWriter.js` into the inspect console and hit enter
- Paste contents of `resultText.txt` into the window prompt and hit enter
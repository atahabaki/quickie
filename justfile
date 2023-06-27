alias f := firefox
alias c := chromium
VERSION := "0.2"

firefox:
	rm -rf ./manifest.json
	cp ./manifest.firefox.json ./manifest.json
	zip -0 "quickie.firefox.{{VERSION}}.zip" -r ./LICENSE ./manifest.json ./src/ ./_locales/ ./assets/
	rm -rf ./manifest.json

chromium:
	rm -rf ./manifest.json
	cp ./manifest.chrome.json ./manifest.json
	zip -0 "quickie.chromium.{{VERSION}}.zip" -r ./LICENSE ./manifest.json ./src/ ./_locales/ ./assets/
	rm -rf ./manifest.json

clean:
	rm -rf ./manifest.json

debug_firefox:
	cp ./manifest.firefox.json ./manifest.json

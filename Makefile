.PHONY: build-theme
build-theme:
	cd themes/docs && node scripts/build-css.mjs

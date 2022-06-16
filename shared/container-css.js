const outerStyleSheet = document.createElement('style');
outerStyleSheet.id = 'neural-container-style';
document.head.appendChild(outerStyleSheet);

outerStyleSheet.sheet.insertRule(`
	body { overflow: hidden; }
`, outerStyleSheet.sheet.cssRules.length);

const faFontsDir = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts';
outerStyleSheet.sheet.insertRule(`
	@font-face {
		font-family: 'FontAwesome';
		src: url('${faFontsDir}/fontawesome-webfont.eot?v=4.3.0');
		src: url('${faFontsDir}/fontawesome-webfont.eot?#iefix&v=4.3.0') format('embedded-opentype'),
			url('${faFontsDir}/fontawesome-webfont.woff2?v=4.3.0') format('woff2'),
			url('${faFontsDir}/fontawesome-webfont.woff?v=4.3.0') format('woff'),
			url('${faFontsDir}/fontawesome-webfont.ttf?v=4.3.0') format('truetype'),
			url('${faFontsDir}/fontawesome-webfont.svg?v=4.3.0#fontawesomeregular') format('svg');
		font-weight: normal;
		font-style: normal
	}
`, outerStyleSheet.sheet.cssRules.length);

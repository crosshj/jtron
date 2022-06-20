const outerStyleSheet = document.createElement('style');
outerStyleSheet.id = 'neural-container-style';
document.head.appendChild(outerStyleSheet);

const insertRule = (ruleText) => outerStyleSheet.sheet.insertRule(ruleText, outerStyleSheet.sheet.cssRules.length);

insertRule(`
	body { overflow: hidden; }
`);

const faFontsDir = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts';
insertRule(`
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
`);

insertRule(`
	#ErrorIndicator {
		position: absolute;
		bottom: 0px;
		right: 0px;
		margin: 4em;
		box-sizing: border-box;
		font-size: 0.1em;
		left: 0px;
		color: red;
		background: pink;
		padding: 5em;
		border: 0.5px solid;
		border-radius: 2px;
		font-family: monospace;
		white-space: pre-wrap;
	}
`);
module.exports = {
	"extends": "airbnb-base",
	"plugins": [
		"import"
	],
	"rules": {
		"no-tabs": "off",
		"quotes": ["error", "single"],
		// "indent": ["error", "tab"],
		"indent": ["error", "tab", {SwitchCase: 1}],
		"comma-dangle": "off",
		"no-underscore-dangle": "off",
		"no-console": "off",
		"spaced-comment": "off",
		"dot-notation": "off"
	}
};

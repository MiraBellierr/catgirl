import { Config } from "alex";

export const AlexJsOptions: {
	allowedWords: string[];
	alexWhitelist: Config;
} = {
	// words we allow even if AlexJS blocks (words are sometimes grouped by we want to be more granular)
	allowedWords: ["fellow"],
	alexWhitelist: {
		profanitySureness: 1,
		noBinary: true,
		// AlexJS to ignore these grouped words https://github.com/retextjs/retext-equality/blob/main/rules.md
		allow: [
			"aunt-uncle",
			"aunts-uncles",
			"gals-man",
			"boy-girl",
			"invalid",
			"dad-mom",
			"daft",
			"fellow",
			"fellowship",
			"gimp",
			"hero-heroine",
			"host-hostess",
			"hostesses-hosts",
			"husband-wife",
			"jesus",
			"king-queen",
			"kings-queens",
			"kingsize-queensize",
			"kushi",
			"latino",
			"long-time-no-see",
			"master",
			"postman-postwoman",
			"special",
			"superman-superwoman",
			"nephew-niece",
			"nephews-nieces",
		],
	},
};

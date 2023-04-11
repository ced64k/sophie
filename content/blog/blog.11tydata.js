module.exports = {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	"permalink": "/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.date | permalink_day }}/{{page.fileSlug}}/"
};

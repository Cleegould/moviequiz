$(function () {
	const apiKey = "bb20124838543378f16ab68d72df5e76";

	$("#searchBtn").click(function () {

		//build selection criteria
		var releaseDateStart = $("#release-start").val();
		var releaseDateEnd = $("#release-end").val();
		var runtimeLTE = $("#runtime").val();
		var genereIds = "";
		$("input[name='genres']:checked").each(function () {
			genereIds += $(this).val() + "|";
		});

		var certString = "";
		$("input[name='certifications']:checked").each(function () {
			certString += $(this).val() + "|";
		});

		/*
		{id: 28, name: 'Action'}
		{id: 12, name: 'Adventure'}
		{id: 16, name: 'Animation'}
		{id: 35, name: 'Comedy'}
		{id: 80, name: 'Crime'}
		{id: 99, name: 'Documentary'}
		{id: 18, name: 'Drama'}
		{id: 10751, name: 'Family'}
		{id: 14, name: 'Fantasy'}
		{id: 36, name: 'History'}
		{id: 27, name: 'Horror'}
		{id: 10402, name: 'Music'}
		{id: 9648, name: 'Mystery'}
		{id: 10749, name: 'Romance'}
		{id: 878, name: 'Science Fiction'}
		{id: 10770, name: 'TV Movie'}
		{id: 53, name: 'Thriller'}
		{id: 10752, name: 'War'}
		{id: 37, name: 'Western'}
		 */

		var baseURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_original_language=en&";
		var variables = "release_date.gte=" + releaseDateStart + "&release_date.lte=" + releaseDateEnd  + "&with_genres=" + genereIds  + "&with_runtime.lte=" + runtimeLTE + "&certification_country=US&certification=" + certString;

		const movieSettings = {
			"async": true,
			"crossDomain": true,
			"url": baseURL + variables,
			"method": "GET",
			"headers": {}
		};

		$.ajax(movieSettings).done(function (response) {
			displayResults(response);
		});
	});

	function displayResults(results) {
		//console.log(results);
		$("#results").empty();

		for (var i = 0; i < 5; i++) {
			var movieId = results.results[i].id;			

			const detailSettings = {
				"async": true,
				"crossDomain": true,
				"url": "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey + "&append_to_response=videos,images",
				"method": "GET",
				"headers": {}
			};

			$.ajax(detailSettings).done(function (response) {
				console.log(response);

				var title = response.title;
				var overview = response.overview;
				var releaseDate = response.release_date;
				var poster = response.poster_path;
				var count = i + 1;
				
				$("#results").append("<div class='pad-8'><img src='https://image.tmdb.org/t/p/original" + poster + "' class='poster'/></div>");
				$("#results").append("<div class='pad-8'>#" + count + ": " + title + "<span class='margin-left-10 small-text red-text'>Released: " + dayjs(releaseDate).format('MM/DD/YYYY') + "</span></div>");
				$("#results").append("<div class='pad-8'>" + overview + "</div>");
				if (response.videos.results.length != 0) {
					var youTubeKey = response.videos.results[0].key;
					$("#results").append("<div class='pad-8'><iframe width='560' height='315' src='https://www.youtube.com/embed/" + youTubeKey + "' frameborder='0' allowfullscreen></iframe></div><hr class='hr'>");
				} else {
					$("#results").append("<div class='pad-8 big-text red-text'>No Trailer</div><hr class='hr'>");
				}
			});									
		}
	}	
});
$(document).ready(function () {
    var tmdbApp = new Vue({
        el: "#tmdbDiv",
        enterApiKey: true,
        data: {
            enterApiKey: 1,
            genresList: 0,
            genres: [],
            movieList: [],
            currentMovie: null,
        },
        mounted: function() {
            $("#genres_list").fadeIn(1);
            // console.info("Vue App mounted");
        },
        methods: {
            checkApiKey: function(){
                theMovieDb.common.api_key = $("#api_key_id").val();
                theMovieDb.genres.getMovieList({}, this.genresSuccess, this.genresError);
            },
            genresSuccess: function(received_data) {
                parsedData = JSON.parse(received_data);
                this.genres = parsedData['genres'];
                $("#id_api_key_input").fadeIn(750);
                $("#genres_list").fadeOut(500);
                this.genresList = 1;
                this.enterApiKey = 0;
            },

            genresError: function() {
                alert("Entered API KEY is not valid");
                this.genresList = 0;
                this.enterApiKey = 1;
            },

            showByGenre: function(event) {
                console.info(event.target.id);
                the_genre_id = event.target.id;
                theMovieDb.genres.getMovies({"id":the_genre_id}, this.collectionSuccess, this.collectionError)
            },

            collectionSuccess: function(collectionString) {
                collectionData = JSON.parse(collectionString);
                console.info("total results", collectionData['total_results']);
                console.info("total pages", collectionData['total_pages']);
                console.info("all data", collectionData["results"]);
            },

            collectionError: function() {
                alert('Error searching movies collection');
            },
        },
    })

})

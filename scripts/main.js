$(document).ready(function () {
    var tmdbApp = new Vue({
        el: "#tmdbDiv",
        data: {
            showApiInput: 1,
            showGenres: 0,
            showMoviesList: 0,
            showMovieDetails: 0,
            genres: [],
            currentGenreId: "0",
            currentGenreTitle: "",
            currentGenrePages: "0",
            currentGenreResults: "0",
            currentGenreMoviesList: [],
            currentPage: 1,
            currentMovieId: "",
            currentMovieInfo: null,
            listLoading: 0,
        },
        mounted: function() {
            console.info("Vue App mounted");
        },
        methods: {
            checkApiKey: function(){
                theMovieDb.common.api_key = $("#api_key_id").val();
                theMovieDb.genres.getMovieList({}, this.genresSuccess, this.genresError);
            },
            genresSuccess: function(received_data) {
                parsedData = JSON.parse(received_data);
                this.genres = parsedData['genres'];
                this.genres.forEach(function(item, index){
                    item["id"] = "genre_" + item["id"];
                });
                this.showGenres = 1;
                this.showApiInput = 0;
            },

            genresError: function() {
                alert("Entered API KEY is not valid");
                this.showGenres = 0;
                this.showApiInput = 1;
            },

            toGenresList: function() {
                this.showGenres = 1;
                this.showMoviesList = 0;
                this.currentPage = 1;
            },

            showByGenre: function(event) {
                this.currentGenreId = event.target.id.replace("genre_", "");
                this.currentGenreTitle = event.target.innerText;
                theMovieDb.genres.getMovies({"id":this.currentGenreId, "page": this.currentPage}, this.collectionSuccess, this.collectionError)
            },

            collectionSuccess: function(collectionString) {
                collectionData = JSON.parse(collectionString);
                this.currentGenreResults = collectionData['total_results'];
                this.currentGenrePages = collectionData['total_pages'];
                this.currentGenreMoviesList = collectionData["results"];
                this.currentGenreMoviesList.forEach(function(item, index){
                    item["poster_url"] = "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + item["poster_path"];
                    item["movie_id"] = "movie_id_" + item["id"];
                })
                this.showGenres = 0;
                this.showMoviesList = 1;
            },

            firstPage: function() {
                this.currentPage = 1;
                theMovieDb.genres.getMovies({"id":this.currentGenreId, "page": this.currentPage}, this.collectionSuccess, this.collectionError)
            },

            previousPage: function() {
                this.currentPage -= 1;
                theMovieDb.genres.getMovies({"id":this.currentGenreId, "page": this.currentPage}, this.collectionSuccess, this.collectionError)
            },

            nextPage: function() {
                this.currentPage += 1;
                theMovieDb.genres.getMovies({"id":this.currentGenreId, "page": this.currentPage}, this.collectionSuccess, this.collectionError)
            },

            lastPage: function() {
                this.currentPage = this.currentGenrePages;
                theMovieDb.genres.getMovies({"id":this.currentGenreId, "page": this.currentPage}, this.collectionSuccess, this.collectionError)
            },

            movieShow: function(dataString) {
                movieData = JSON.parse(dataString);
            },

            movieError: function() {
                alert("Error trying to get movie info");
            },

            collectionError: function() {
                alert('Error searching movies collection');
            },

            getMovie: function(event) {
                this.currentMovieId = event.target.id.replace('movie_id_', '');
                theMovieDb.movies.getById({"id":this.currentMovieId }, this.movieSuccess, this.movieError);
            },

            movieSuccess: function(dataString) {
                this.showMoviesList = 0;
                this.showMovieDetails = 1;
                this.currentMovieInfo = JSON.parse(dataString);
                this.currentMovieInfo["poster_url"] = "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + this.currentMovieInfo["poster_path"];
                theMovieDb.movies.getVideos({"id": this.currentMovieInfo.id}, this.gotVideo, this.noVideo);
                // console.info(dataString);
            },

            movieError: function() {
                this.showMoviesList = 1;
                this.showMovieDetails = 0;
                alert('error of getting more info about movie');
            },

            backToList: function() {
                this.currentMovieId = "";
                this.showMoviesList = 1;
                this.showMovieDetails = 0;
                this.currentMovieInfo = null;
            },

            gotVideo: function(dataString){
                    videoData = JSON.parse(dataString);
                    this.currentMovieInfo['video'] = true;
                    this.currentMovieInfo['video_url'] = "https://www.youtube.com/embed/" + videoData["results"][0]["key"];
            },

            noVideo: function() {
                this.currentMovieInfo['video'] = false;
                this.currentMovieInfo['video_url'] = "";
            },
        },
    })

})

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
            currentMovie: null,
            listLoading: 0,
        },
        mounted: function() {
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

            collectionError: function() {
                alert('Error searching movies collection');
            },
        },
    })

})

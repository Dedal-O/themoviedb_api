$(document).ready(function () {
    //console.info('page ready');
    $("#api_key_ok").click(function(){
        apiKey = $("#api_key_id").val();
        if (apiKey.length){
            // console.info(the_key);
            $("#input_api_group").fadeOut(800);
            checkApiKey(apiKey);
        }
        else{
            alert("Пожалуйста укажите ключ");
        }
    });

    function checkApiKey(apiKey){
        theMovieDb.common.api_key = apiKey;
        theMovieDb.genres.getMovieList({}, genresSuccess, genresError);

        function genresSuccess(the_data){
            console.info(the_data);
        };

        function genresError(){
            console.info("wrong API KEY!!! Or some another error happpened...");
            $("#input_api_group").fadeIn(400);
        };
    };

})

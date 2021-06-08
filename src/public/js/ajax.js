const auth = require('../middleware/auth.middleware');

function createCards(){
    let results = window.confirm('Voulez-vraiment supprimer la commande ?')
    if(results){ 
        let route = "api/v1/cards/";
        $.ajax({
            url: route,
            method: 'POST',
            username: auth(),
            dataType: 'JSON',
            success(json){
                if(json){
                    console.log(json)
                }
            }
        });
    }
}
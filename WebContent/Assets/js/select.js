


$(function(){

    $(".checkspan-1").bind("click",function(){
        var ul = $(this).siblings('ul')
        if(ul.is(":hidden")){
            ul.slideDown('400', function() {
                $(this).find("li").bind("click",function(){
                    var selectLi=$(this).text();
                    $("#select-year span").text(selectLi);
                    $("#select-year ul").slideUp(400);
                })
                ul.mouseleave(function() {
                    $('#select-year ul').slideUp(400)
                });
            });
        }else{
            $(this).siblings('ul').slideUp(400)
        }
    })

    $(".checkspan-2").bind("click",function(){
        var ul = $(this).siblings('ul')
        if(ul.is(":hidden")){
            ul.slideDown('400', function() {
                $(this).find("li").bind("click",function(){
                    var selectLi=$(this).text();
                    $("#select-type span").text(selectLi);
                    $("#select-type ul").slideUp(400);
                })
                ul.mouseleave(function() {
                    $('#select-type ul').slideUp(400)
                });
            });
        }else{
            $(this).siblings('ul').slideUp(400)
        }
    })

    $(".checkspan-3").bind("click",function(){
        var ul = $(this).siblings('ul')
        if(ul.is(":hidden")){
            ul.slideDown('400', function() {
                $(this).find("li").bind("click",function(){
                    var selectLi=$(this).text();
                    $("#select-time span").text(selectLi);
                    $("#select-time ul").slideUp(400);
                })
                ul.mouseleave(function() {
                    $('#select-time ul').slideUp(400)
                });
            });
        }else{
            $(this).siblings('ul').slideUp(400)
        }
    })

    

    
})
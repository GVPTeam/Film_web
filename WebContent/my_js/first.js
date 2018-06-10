
function aa(){
    var xmlhttp;
	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    var haha = "";
    xmlhttp.onreadystatechange=function()
    {
        var templedssss = document.getElementsByClassName("grid")[0];
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {   
            var img_src = eval("("+xmlhttp.responseText+")"); //json娶过来
            for(var i = 0; i < img_src.length ; i++)
            {
                haha += "<a class='grid__item' href='#'><div class='loader'></div><div class='load_img'>";
                haha += "<img class='meta__avatar' src=' " + img_src[i].img + " '  />";
                haha += "</div></a>";
            }
            templedssss.innerHTML = haha;
        }
    }

    xmlhttp.open("GET","/Film_web/MyTest?t =" + Math.random(), true);    
    xmlhttp.send(null);

        /*
        var msg = "file="+nsame;
	xmlhttp.open("POST","/Balalala/importExcel",true);
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlhttp.send(msg);
    */
}
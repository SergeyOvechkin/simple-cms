const SITE_NAME = "simple-cms";
const HOST_NAME = "https://sergeyovechkin.github.io";



var mainTempl_1 = `<!DOCTYPE html>
 <html lang="ru">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/css/bootstrap.min.css">
		 <script src="https://unpkg.com/showdown/dist/showdown.min.js"></script>
		<link rel="stylesheet" href="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/css/main.css">
    </head>
<body>
<div class="container-fluid">`;


var mainTempl_2 =` 
</div><!-- container-fluid -->	

	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}dbase/CATEGORIES.js"></script>
	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}dbase/SECTIONS.js"></script>
	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}dbase/category_id.js"></script>
	
	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/template/template.js"></script>
	
	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/js/htmlix.js"></script>
	<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/js/front.js"></script>
		<script src="${HOST_NAME+"/"}${SITE_NAME ? SITE_NAME+"/" : ""}static/js/tagWraper.js"></script>
</body>
 </html>`;
 
 var settings = {
	 
	 site_name: SITE_NAME,
	 host_name: HOST_NAME,
	 templ_head: mainTempl_1,
	 templ_footer: mainTempl_2,
	  
 }
 
 
 module.exports = settings;
const SITE_NAME = "simple-cms"; // имя сайта на гитхаб


const http = require('http');
const formidable = require('formidable');
const fs_extra = require('fs-extra');
const fs = require("fs");
const path = require("path");
 
const server = http.createServer((req, res) => {

   var parsUrl  = path.parse(req.url);	
	
   //создаем либо обновляем пост	
  if (req.url.split("/")[1] == "create" && req.url.split("/")[2] == "post" && req.method.toLowerCase() === 'post') {
	  
    const form = formidable({ multiples: true });
	var post_id = req.url.split("/")[3]; //обновление поста
	var POST_ID = Math.floor(Math.random() * 100000);//создание нового
	
	if(post_id != undefined && post_id != "")POST_ID = post_id;
    
    form.parse(req, (err, fields, files) => {
		
		if(err){
			sendError(err, req, res, "не удалось сохранить пост_1");
			return;
		}
		
		var name = "./dbase/categories/"+fields.category+"/"+POST_ID+".txt";
		
		var desc = "";
		
		const CATEGORY_ID = fields.category;
		
		try {
			fs.statSync("./dbase/categories/"+fields.category); //проверяем существование папки с категорией
		}
		catch (err) {
				if (err.code === 'ENOENT') {
						fs.mkdirSync("./dbase/categories/"+fields.category); //создаем если нет
				}  
        }  		
		try {
			
			if(post_id == undefined || post_id == ""){ //если новый пост добавляем его в категорию
				
				var date = new Date().getTime();
				desc =  fs.readFileSync("./dbase/category_id.txt");
				desc = JSON.parse(desc);		
				if(desc[CATEGORY_ID] == undefined)desc[CATEGORY_ID] = [];				
				desc[CATEGORY_ID].push({  post_id: POST_ID, title: fields.title, date: date });	
				
				fs.writeFileSync("./dbase/category_id.txt",  JSON.stringify(desc) );
				
			}else{//если обновляем пост обновляем его название в категории
				
				desc =  fs.readFileSync("./dbase/category_id.txt");
				desc = JSON.parse(desc);
				desc[CATEGORY_ID].forEach((el)=>{
					
					if(el.post_id == post_id)el.title = fields.title;
					
				});
				fs.writeFileSync("./dbase/category_id.txt",  JSON.stringify(desc) );
				
			}
			delete fields.category;
			
			fs.writeFileSync(name, JSON.stringify( fields, null, 2) ); ///записываем пост в файл

		}
		catch(err){
			
			sendError(err, req, res, "не удалось сохранить пост_2"+name);
			return;
		}
		
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end(JSON.stringify({mess: "данные сохранены"}));

    });
 
    return;
  }
  //создаем категорию либо обновляем название 
  else if (req.url === '/create/category' && req.method.toLowerCase() === 'post') { 
  
		 const form = formidable({ multiples: true });
			
		 form.parse(req, (err, fields, files) => { 
		 
			if(err){
				sendError(err, req, res, "не удалось сохранить категорию_1");
				return;
			}
		 
					var category_id = fields.id; 
					var category_title = fields.title;
					var category_section = fields.section
					
					//создаем объект с настройками данной категории
					var category = {
						
						name: category_title,
						id: category_id
	                 				
					}
					
					try {
			           //добавляем новую категорию в объект со всеми категориями
						var CATEGORIES =  fs.readFileSync("./dbase/CATEGORIES.txt");
						CATEGORIES = JSON.parse(CATEGORIES);
						
						var update = false;
						
						if(CATEGORIES[category_id] != undefined)update = true; //если id такой категории уже существует значит обновляем категорию
						CATEGORIES[category_id] = category;
						
						//добавляем категорию в секцию 
						if(!update){
							var SECTIONS =  fs.readFileSync("./dbase/SECTIONS.txt");
							SECTIONS = JSON.parse(SECTIONS);
							SECTIONS[category_section].section_categories.push(category_id);
							fs.writeFileSync("./dbase/SECTIONS.txt",  JSON.stringify(SECTIONS) );
						}
						fs.writeFileSync("./dbase/CATEGORIES.txt", JSON.stringify(CATEGORIES));
					}
					catch(err){
						sendError(err, req, res, "не удалось создать категорию_2");
						return;
					}
					res.writeHead(200, { 'content-type': 'application/json' });
					res.end(JSON.stringify({mess: "категория сохранена"}));		 
		 });  
  }
  ///создаем раздел либо обновляем название
  else if (req.url === '/create/section' && req.method.toLowerCase() === 'post') { 
  
		 const form = formidable({ multiples: true });
			
		 form.parse(req, (err, fields, files) => {

     		if(err){
				sendError(err, req, res, "не удалось сохранить раздел_1");
				return;
			}			 
		 
					var section_id = fields.id; ///получаем название секции и ее id
					var section_title = fields.title;
					
					//создаем объект с настройками данной секции;
					var section = {
						
						section_id: section_id,
						section_title: section_title,
	                    section_categories: []					
					}
					
					try {
			
						var SECTIONS =  fs.readFileSync("./dbase/SECTIONS.txt");
						SECTIONS = JSON.parse(SECTIONS);
						
						var update = false;						
						if(SECTIONS[section_id] != undefined)update = true;//если секция с таким id уже есть значит обновляем название
						
						if(update){
							
							SECTIONS[section_id].section_title = section_title;
							
						}else{
							
							SECTIONS[section_id] = section;
						}
						
						fs.writeFileSync("./dbase/SECTIONS.txt",  JSON.stringify(SECTIONS) );
	
					}
					catch(err){
						
						sendError(err, req, res, "ошибка создания нового раздела_2");
						return;
					}
					res.writeHead(200, { 'content-type': 'application/json' });
					res.end(JSON.stringify({mess: "секция сохранена"}));	 
		 }); 
  }
  /////отдаем представление админки
  else if(req.url === '/admin' && req.method.toLowerCase() === 'get'){	

          readFile(req, res, "./admin.html");  
		  
  }
  //отдаем представление index на локальном сервере
  else if(req.url === '/' && req.method.toLowerCase() === 'get'){	  
	  
            readFile(req, res, "./index.html");
  }
//отдаем представление index на рабочем сервере 
  else if (parsUrl.dir.split("/")[1] == SITE_NAME && parsUrl.dir.split("/")[2] != "dbase" && parsUrl.dir.split("/")[2] != "static" ){	  
 
         readFile(req, res, "./index.html");		
  }
  ////отдаем статические файлы и файлы из базы данных на любом сервере
  else if(parsUrl.dir.split("/")[1] == "static" || parsUrl.dir.split("/")[1] == "dbase" || parsUrl.dir.split("/")[1] == SITE_NAME){
	  
	  // console.log(`Запрошенный адрес: ${parsUrl.dir} / ${parsUrl.base}`);
	  
	  var dir = parsUrl.dir;
	  
	  if(parsUrl.dir.split("/")[1] == SITE_NAME){
		  
		  var re = new RegExp("/"+SITE_NAME);
		  
		  dir = parsUrl.dir.replace(re, "" );
		  
	  }
	  
	  var nameFile = "."+dir+"/"+parsUrl.base;
	  
	  readFile(req, res, nameFile);
	
	
  }
  //ищем категорию 
  else if ( parsUrl.dir.split("/")[1] == "find" && parsUrl.dir.split("/")[2] == "category" ){	

         var category_id =   req.url.split("/")[3]; 
 
				try {
			           //добавляем новую категорию в объект со всеми категориями
						var categoryAll =  fs.readFileSync("./dbase/category_id.txt");
							
						categoryAll = JSON.parse(categoryAll);
						
						postsArray = categoryAll[category_id];
						if(postsArray == undefined)postsArray = [];
					}
					catch(err){
					            sendError(err, req, res, "ошибка поиска категории", 404);
								return;


					}
				res.writeHead(200, { 'content-type': 'application/json' });
				res.end(JSON.stringify(postsArray) );
							
		
		 
  } //ищем обновляемый пост в базе данных
  else if ( parsUrl.dir.split("/")[1] == "update" && parsUrl.dir.split("/")[2] == "post" ){	

         var category_id =   req.url.split("/")[3]; 
		var post_id =   req.url.split("/")[4];
		var path_to_file = "dbase/categories/"+category_id+"/"+post_id+".txt";
		
					try {
						var post =  fs.readFileSync(path_to_file);							
						post = JSON.parse(post);
						
					}
					catch(err){
						sendError(err, req, res, "ошибка поиска поста для обновления");
						return;
						
					}
         			res.writeHead(200, { 'content-type': 'application/json' });
					res.end(JSON.stringify({post: post}) );
       		 
  }
  //удаляем пост из базы данных и из категории
  else if ( parsUrl.dir.split("/")[1] == "remove" && parsUrl.dir.split("/")[2] == "post" ){	

         var category_id =   req.url.split("/")[3]; 
		var post_id =   req.url.split("/")[4];
		var path_to_file = "dbase/categories/"+category_id+"/"+post_id+".txt";
		
					try {
						var categoryAll =  fs.readFileSync("./dbase/category_id.txt");							
						categoryAll = JSON.parse(categoryAll);
						
						var postsArray = categoryAll[category_id];
						if(postsArray == undefined)postsArray = [];
						var indexInCat = null;
						for(var i=0; i<postsArray.length; i++){
							
							if(postsArray[i].post_id == post_id)indexInCat = i;
						}
						if(indexInCat != null)categoryAll[category_id].splice(indexInCat, 1);
						fs.writeFileSync("./dbase/category_id.txt",  JSON.stringify(categoryAll) );
						fs.unlinkSync(path_to_file);//удаляем пост
					}
					catch(err){
						sendError(err, req, res, "ошибка удаления файла");
						return;
						
					}
					res.writeHead(200, { 'content-type': 'application/json' });
					res.end(JSON.stringify({mess: "файл "+post_id+ " удален"}) );
		 
	}  
	//удаляем категорию вместе с постами
    else if ( parsUrl.dir.split("/")[1] == "remove" && parsUrl.dir.split("/")[2] == "category" ){	

         var category_id =   req.url.split("/")[3]; 
			var path_to_folder = "./dbase/categories/"+category_id;
		
					try {
						var categoryAll =  fs.readFileSync("./dbase/category_id.txt");							
						categoryAll = JSON.parse(categoryAll);						
						delete categoryAll[category_id];//удаляем категорию из файла category_id.txt
						
						
					    var CATEGORIES =  fs.readFileSync("./dbase/CATEGORIES.txt");							
						CATEGORIES = JSON.parse(CATEGORIES);
					
						if(CATEGORIES[category_id] == undefined)throw "не получеется найти категорию "+category_id;						
						delete CATEGORIES[category_id];// удаляем категорию из файла CATEGORIES.txt
						
					    var SECTIONS =  fs.readFileSync("./dbase/SECTIONS.txt");							
						SECTIONS = JSON.parse(SECTIONS);
						
						for(var key in SECTIONS){
				        
							 var index = SECTIONS[key].section_categories.indexOf(category_id);

							if(index != -1 ){
								SECTIONS[key].section_categories.splice(index, 1);//удаляем категорию из списка категорий секции
								isRemove = true;
							} 
							
						}	
						
						
						fs.writeFileSync("./dbase/category_id.txt",  JSON.stringify(categoryAll) );
                        fs.writeFileSync("./dbase/CATEGORIES.txt",  JSON.stringify(CATEGORIES) );						
						fs.writeFileSync("./dbase/SECTIONS.txt",  JSON.stringify(SECTIONS) );							

					}
					catch(err){
						
						sendError(err, req, res, "не удалось удалить категорию_из файлов");
						return;

					}
			//удаляем папку с категорией из базы данных вместе с постами
			fs_extra.remove(path_to_folder, function(err) { 
			
					if (err){
						sendError(err, req, res, "не удалось удалить категорию_папку");
					 
					}else{
					 
					       res.writeHead(200, { 'content-type': 'application/json' });
						   res.end(JSON.stringify({mess: "категория "+category_id+ " удалена"}) );				 
					}
				 
				});	
  //удаляем секцию (без категорий)				
  }else if ( parsUrl.dir.split("/")[1] == "remove" && parsUrl.dir.split("/")[2] == "section" ){	
				
				  var section_id =   req.url.split("/")[3]; 
		
					try {


					    var SECTIONS =  fs.readFileSync("./dbase/SECTIONS.txt");							
						SECTIONS = JSON.parse(SECTIONS);
						if(SECTIONS[section_id] == undefined) throw "не получеется найти секцию "+section_id;
						delete SECTIONS[section_id];					
						fs.writeFileSync("./dbase/SECTIONS.txt",  JSON.stringify(SECTIONS) );							

					}
					catch(err){
						
						sendError(err, req, res, "не удалось удалить категорию");
						return;

					}
					res.writeHead(200, { 'content-type': 'application/json' });
			         res.end(JSON.stringify({mess: "секция "+section_id+ " удалена"}) );	
  }
  else {	 
                console.log(req.url+"not found");
                res.statusCode = 404;
                res.end("Resourse not found!");
  }
 // console.log(`Запрошенный адрес: ${parsUrl.dir.split("/")[1]}`);
});
//функция пишит ошибки в консоль и отправляетих клиенту
function sendError(err, req, res, mess, statusCode){
	    console.log(err);
		console.log(mess);
		
		if(statusCode){
			res.statusCode = statusCode;
		}else{
			res.statusCode = 200;
		}
		res.end(JSON.stringify({err: mess}));
	
}
//функция читает файл и отправляет его клиенту
function readFile(req, res, nameFile){
	
		 fs.readFile(nameFile, function(error, data){
                 
            if(error){
                     
                res.statusCode = 404;
                res.end("Resourse not found!");
            }   
            else{
                res.end(data);
            }			
        });		
}


server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/ ...');
});
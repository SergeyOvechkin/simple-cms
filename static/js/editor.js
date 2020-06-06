var converter = new showdown.Converter(); //markdown форматирование
  
    

var StateMap = {
	/*
		"current_operation", // компонент - верхнее меню с разделами: страница, категория, пост		
		"variant", //текущий отображаемый компонент: editor, category_editor, section_editor		
		"page_btn", ["page_btn_class", "class", 'a[data-current_operation-page_btn="click"]'], //кнопка переключения страници и класс для нее 		
		"category_btn",  ["category_btn_class", "class", "a[data-current_operation-category_btn='click']"], //кнопка переключения  категории и класс для нее
		"section_btn", ["section_btn_class", "class", "a[data-current_operation-section_btn='click']"], //кнопка переключения раздела и класс для нее
		["listen_class_btn", "emiter-class-btn", ""] //слушает событие клика по кнопке и добавляет класс к активной, затем убирает классы с неактивных кнопок
	*/
	current_operation: {
		container: "current_operation",
		
		props: [ "variant",
		        //сдесь чтобы уменьшить количество data свойств в html разметке мы добавляем одно свойство в тег разметки, а в остальных свойствах в том-же теге ссылаемся на него с помощью селектора
				"page_btn", ["page_btn_class", "class", 'a[data-current_operation-page_btn="click"]'],				
				"category_btn",  ["category_btn_class", "class", "a[data-current_operation-category_btn='click']"],
				"section_btn", ["section_btn_class", "class", "a[data-current_operation-section_btn='click']"],
				["listen_class_btn", "emiter-class-btn", ""] ],
		methods: {
			listen_class_btn: function(){
				
				var props =this.parent.props;
				
				props.page_btn_class.removeProp("active");
				props.category_btn_class.removeProp("active");
				props.section_btn_class.removeProp("active");
				
				props[this.emiter.prop].setProp("active");
				
			},	
            //отображаем соответствующий компонент и вызываем событие emiter-class-btn чтобы добавить класс активной кнопке и снять с неактивной			
			page_btn: function(){
				
				this.parent.props.variant.setProp("editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("page_btn_class");
				
			},
			category_btn: function(){
				
				this.parent.props.variant.setProp("category_editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("category_btn_class");
				
				this.rootLink.state["category_editor"].props.style.setProp("");
			},	
			section_btn: function(){
				
				this.parent.props.variant.setProp("section_editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("section_btn_class");
				
				this.rootLink.state["section_editor"].props.style.setProp("");			
				
			},			
		}
		
	},
	/*
	 category_editor - компонент для создания, обновления и удаления категорий
	 ["style", "style", ""], // изначально компонент скрыт, после клика по соотв. кнопке в компоненте current_operation мы удаляем данные из этого свойства
	 "find_categ_btn", ["find_categ_btn_text", "text", "a[data-category_editor-find_categ_btn='click']"], //кнопка для поиска категорий, а также свойство с текстом для данной кнопке, с селектором ссылающимся на кнопку
	 "form_style", //свойство для скрытия формы при поиске категориий
	 "group_sect", "section", "section_style", 	группа для отображения списка разделов, свойство с выбранным разделом, и свойство для отмены изменений раздела при обновлении группы, у второго и третьего свойства селектор указывает на группу в том-же теге	
	 "title", //свойства к доступу названия категории
	 "id", ["id_style", - //свойство - доступ к id категории а также свойство для отмены изменения id категории при обновлении
	 "submit", - свойство стипо click для отправки данных формы на сервер
	 "category_group", ["category_group_style" - свойство для отображения списка категориий в поиске для обновления или удаления, а также свойство для скрытия данного списка при редактировании категории
	 ["listen_load_sect" - обновляет select  список выбора секций при создании категории 
	 ["listen_update_category" - загружает выбранную для обновления категорию в форму, а также отключает некоторые поля и воспоизводит событие клика по кнопке find_categ_btn 
	
	*/
	category_editor: {
		container: "category_editor",
		props: [
				["style", "style", ""],	
				"find_categ_btn", ["find_categ_btn_text", "text", "a[data-category_editor-find_categ_btn='click']"],
				"form_style",
				"group_sect", ["section", "select", "select[data-category_editor-group_sect='group']"], ["section_style", "disabled", "select[data-category_editor-group_sect='group']"	],		
				"title",
				"id", ["id_style", "disabled", "input[data-category_editor-id='inputvalue']"],
				"submit",  			 
				"category_group", ["category_group_style", "style", "ul[data-category_editor-category_group='group']"],
				["listen_load_sect", "emiter-load-sections", ""],				
				["listen_update_category", "emiter-update-category", ""] 
		],
		methods: {
			//загружает данные обновляемой категории в форму и переключает кнопку find_categ_btn
			listen_update_category: function(){
				var props = this.parent.props;
				
				props.find_categ_btn.events["click"]();
				props.title.setProp(this.emiter.prop.name);
				props.id.setProp(this.emiter.prop.id);
				props.section_style.setProp("disabled");
				props.id_style.setProp("disabled");
			},
			//при первом клике показывает список всех категорий и скрывает форму, при втором наоборот 
			find_categ_btn: function(){
				var props = this.parent.props;
				
				props.title.setProp("");
				props.id.setProp("");
				props.section_style.removeProp();
				props.id_style.removeProp();
									
				if(this.prop == null){
					
					props.form_style.setProp("display: none");
					props.find_categ_btn_text.setProp("Вернуться к созданию");
					props.category_group_style.setProp("");
					
					var catArr2 = [];
					var catOld = this.rootLink.stateProperties.CATEGORIES;
					for(var key in catOld){

						catArr2.push({id: catOld[key].id, title: catOld[key].name, data: "/category/", });
					}
					this.prop =1;

					this.parent.props.category_group.setProp(catArr2);
					
				}else{
					
					props.form_style.setProp("");
					props.find_categ_btn_text.setProp("Смотреть все категории");
                    ///
					props.category_group_style.setProp("display: none;");
					
					this.prop = null;
				}				
			},
			//создает список select секций из полученных из события данных 
			listen_load_sect: function(){
				
				var sect = this.emiter.getEventProp();
				
				var sectArr =[];
				
				for(var key in sect){
					sectArr.push({name: sect[key].section_title, value: sect[key].section_id});

				}	
				this.parent.props.group_sect.setProp(sectArr);
				
				
			},
			//отправляет данные на сохранение при этом проведя валидацию
			submit: function(){
				event.preventDefault();
				
				var props = this.parent.props;
				
				var title = props.title.getProp();
				if(title.trim() == ""){
					alert("забыли указать название");
					return;
				}
				
				var id = props.id.getProp();
				if(!this.rootLink.stateMethods.testId(id))return;
			    
				var section = props.section.getProp();
				if(section  == "" || section  == null || section  == undefined){
					alert("выберите раздел");
					return;					
				}	
					
				
				var oldForm = document.forms["create_category"];
			    var formData  = new FormData(oldForm);
				
				if(!formData.has("id") || !formData.has("section")){
					
					formData.append("id", id);
					formData.append("section", section);
				}
				
				
				var HM = this.rootLink;
				
				//обновляет список с найдеными категориями вызвав событие emiter-load-categories  после сохранения категории на сервере
				function callb(json){
								
					console.log(json);					

					
				    HM.stateMethods.fetchItems("/dbase/CATEGORIES.txt").then(json=>{
		
								HM.stateProperties.CATEGORIES = json;
								HM.eventProps["emiter-load-categories"].setEventProp(json); 
		
					});
					if(json.err){
						
						alert(json.err);
						return
					}
					alert(json.mess);
					props.title.setProp("");
					props.id.setProp("");
					props.section_style.removeProp();
					props.id_style.removeProp();
					
				}

					
					this.rootLink.stateMethods.send_POST("/create/category", formData, callb);
					
							
				
			},		
		}
		
	},
	/*
	 section_editor- компонент для создания, редактирования и удаления разделов
	 ["style", - свойство для скрытия и отображения компонента
	 "find_sect_btn", ["find_sect_btn_text", - кнопка для поиска всех секций и свойство для изменения ее текста при клике
	 "form_style" , - свойства для скрытия формы при отображении списка всех разделов
	 "title", - название раздела введеное пользователем в форме
	 "id", ["id_style",  - доступ к id секции введеное пользователем а также свойство для отмены изменения id при обновлении секции
	 "submit", отправка данных формы на сервер
	 "section_group", ["section_group_style", - свойство для отображения списка разделов, а также свойство для скрытия списка при редактировании формы
	 ["listen_update_section", - загружает данные из события в форму при обновлении раздела
	*/
	section_editor: {
		container: "section_editor",
				props: [
					["style", "style", ""],
					 "find_sect_btn", ["find_sect_btn_text", "text", "a[data-section_editor-find_sect_btn='click']"],
					 "form_style" ,
					 "title", 
					"id", ["id_style", "disabled", "input[data-section_editor-id='inputvalue']"],
					"submit", 
					"section_group", ["section_group_style", "style", "ul[data-section_editor-section_group='group']"],
					["listen_update_section", "emiter-update-section", ""]],
		methods: {
			//загружает данные из события в форму при обновлении раздела
			listen_update_section: function(){
				var props = this.parent.props;
					
				props.find_sect_btn.events["click"]();
				props.title.setProp(this.emiter.prop.section_title);
				props.id.setProp(this.emiter.prop.section_id);
				props.id_style.setProp("disabled");
				
			},
			//при первом клике отображает список найденных разделов, при втором форму для создания секции
			find_sect_btn: function(){
				var props = this.parent.props;
				
				props.title.setProp("");
				props.id.setProp("");
				props.id_style.removeProp();
				
				if(this.prop == null){
					
					props.form_style.setProp("display: none");
					props.find_sect_btn_text.setProp("Вернуться к созданию");

					var sectArr = [];
					var sectOLd = this.rootLink.stateProperties.SECTIONS;
					
					for(var key in sectOLd){

						sectArr.push({id: sectOLd[key].section_id, title: sectOLd[key].section_title, data: "/section/", });
					}
					this.prop =1;
					
					////
					this.parent.props.section_group_style.setProp("display: '';");
					this.parent.props.section_group.setProp(sectArr);
					
				}else{
					
					props.form_style.setProp("display: '' ");
					props.find_sect_btn_text.setProp("Смотреть все разделы");
                    ///
					this.parent.props.section_group_style.setProp("display: none;");
					
					this.prop = null;
				}
				
				
			},
			//производим валидацию формы и отправляем данные на сервер 
			submit: function(){
				event.preventDefault();
				
				var props = this.parent.props;
				
				var title = props.title.getProp();
				if(title.trim() == ""){
					alert("забыли указать название");
					return;
				}
				
				var id = props.id.getProp();
				if(!this.rootLink.stateMethods.testId(id))return;
				

				
				var oldForm = document.forms["create_section"];
			    var formData  = new FormData(oldForm);
				if(!formData.has("id")){
					
					formData.append("id", id);
		
				}
				var HM = this.rootLink;
				
				//вызываем событик emiter-load-sections чтобы обновить список в поиске секций
				function callb(json){
					
					console.log(json);	
				    HM.stateMethods.fetchItems("/dbase/SECTIONS.txt").then(json=>{
						
						
						HM.stateProperties.SECTIONS = json;
						HM.eventProps["emiter-load-sections"].setEventProp(json); 
		
					}); 

					if(json.err){
						
						alert(json.err);
						return
					}					
					alert(json.mess);
				
					props.title.setProp("");
					props.id.setProp("");
					props.id_style.removeProp();
					
				}
				this.rootLink.stateMethods.send_POST("/create/section", formData, callb);


			},		
		}
		
	},
	/*
	  editor компонент для создания, удаления и редактирования постов
	  "convent_btn", "convent_btn_text", "convent_btn_style", - кнопка просмотра html создаваемого поста, а также свойство для доступа к тексту кнопки и стилям кнопки
	  "find_by_cat_btn", "find_by_cat_btn_style", ["find_by_cat_btn_text", - кнопка для поиска постов по категории, а также доступ к тексу и стилям кнопки
	  "category_click", "category", "category_click_style", "group_categ" - кнопка выбора категории поста, свойство - доступ к выбранной категории,
	  свойство для отмены изменения категории при обновлении и свойство с группой для списка категориий 
	   "title", "title_style", - свойство для доступа к названию поста введеное пользователем и свойство для скрытия названия при поиске по категории
	   "input", "input_style", - свойство для доступа к контену страници введеному пользователем и свойство для его скрытия при поиске по категории
	  "save_btn", - кнопка для отправки данных формы на сервер
	  "output_html", ["output_style", - свойство для предварительного отображения html разметки и свойства для ее скрытия при редактировании
	  "post_group", ["post_group_style", - свойство для отображения найденных постов в поиске по группе, и свойство для скрытия данного поиска при редактировании поста
	 ["listen_load_cat", - обновляет список категорий в select form 
	 ["listen_find_posts" - обновляет список найденных постов в поиске по категории
	 ["listen_update_post" - загружает данные обновляемого поста в форму, скрывает поле для выбора категории и кликает по кнопке find_by_cat_btn
	*/
	editor: {
		container: "editor",
		props: [
			"convent_btn",  "convent_btn_style", ["convent_btn_text", "text", "a[data-editor-convent_btn='click']"],
		    "find_by_cat_btn", "find_by_cat_btn_style", ["find_by_cat_btn_text", "text", "a[data-editor-find_by_cat_btn='click']"], 
			"category_click", ["category", "select", "select[data-editor-category_click='click']"],  
			["category_click_style", "disabled", "select[data-editor-category_click='click']"], 
			["group_categ", "group", "select[data-editor-category_click='click']"],
			
			"title", "title_style",
			 "input", "input_style",
			 "save_btn",
			 "output_html",	 ["output_style", "style", "[data-editor-output_html='html']"],  	  			
			"post_group", ["post_group_style", "style", "ul[data-editor-post_group='group']"], 
			["listen_load_cat", "emiter-load-categories", ""],
			["listen_find_posts", "emiter-find-posts", ""], 
			["listen_update_post", "emiter-update-post", ""],
		],
		methods: {
			//обновляет список категорий в select form
			listen_load_cat: function(){
				
				var categ = this.emiter.getEventProp();
				
				var catArr = [];
				
				for(var key in categ){
					
					catArr.push({name: categ[key].name, value: categ[key].id});

				}
				this.parent.props.group_categ.setProp(catArr);
			},
			//обновляет список найденных постов в поиске по категории
			listen_find_posts: function(){
				
					var category = this.parent.props.category.getProp();
					
					var post_group = this.parent.props.post_group;
					
					if(category == "")return;

					var url = "/find/category/"+category+"/";
					
					var context = this.rootLink;
					
					this.rootLink.stateMethods.fetchItems(url).then(data=>{
						
						var postsArr = [];
						
						for(var i=0; i<data.length; i++){
							postsArr.push({ id: data[i].post_id, title: data[i].title, data: "/post/"+category+"/"  })
						}
						
						post_group.setProp(postsArr);
						
					});
				
				
			},
			//загружает данные обновляемого поста в форму, скрывает поле для выбора категории и кликает по кнопке find_by_cat_btn
			listen_update_post: function(){
				
				this.parent.props.find_by_cat_btn.events["click"]();
				this.parent.props.title.setProp(this.emiter.prop.title);
				this.parent.props.input.setProp(this.emiter.prop.text);				
				this.parent.props.save_btn.prop = this.emiter.prop.id;
				this.parent.props.category_click_style.setProp("disabled");
				
			},
			//вызываем событие emiter-find-posts при клике по select form чтобы изменить список найденных постов по категории
			category_click: function(){
				
				    this.rootLink.eventProps["emiter-find-posts"].emit();
				
			},
			//кнопка поиска по категории при первом клике отображает список найденных постов, при втором форму для редактирования поста
			find_by_cat_btn: function(){
				var props = this.parent.props;
				
				props.title.setProp("");
				props.input.setProp("");	
				props.save_btn.prop = null;
				props.category_click_style.removeProp("");
				
				
				
				
				if(this.prop == null){
					
					props.title_style.setProp("display: none");
					props.input_style.setProp("display: none");
					
					props.find_by_cat_btn_text.setProp("Вернуться к созданию записи");
					props.convent_btn_style.setProp("display: none;");
					props.post_group_style.setProp("");
					this.prop =1;


					this.rootLink.eventProps["emiter-find-posts"].emit();

				}else{
					
					props.title_style.setProp("");
					props.input_style.setProp("");
					props.post_group_style.setProp("display: none;");
					props.convent_btn_style.setProp("");
					props.find_by_cat_btn_text.setProp("Искать по категории");
					this.prop = null;
				}
				
				
			},
			///кнопка при первом клике отображает предварительную html разметку, при втором форму для редактирования поста
			convent_btn: function(){

				var props = this.parent.props;
				if(this.prop == null){
					
						var code = props.input.getProp();
				
						var html   = converter.makeHtml(code);
						
						
				
				            props.output_html.setProp(html);
							
							colorTagsAndComents(); //tagWraper.js
							
							props.input_style.setProp("display: none;")
							props.output_style.setProp("display: ;")
							props.convent_btn_text.setProp("Вернуться к редактированию");
							props.find_by_cat_btn_style.setProp("display: none;");
							
							this.prop = 1;
					
				}else{
					props.output_style.setProp("display: none;")
					props.input_style.setProp("display: ;")
					props.convent_btn_text.setProp("Смотреть HTML");
					props.find_by_cat_btn_style.setProp("display: '';");
					this.prop = null;
				}

			},
			//валидация данных и отправка на сервер
			save_btn: function(){
				
				
				event.preventDefault();
				
				var props = this.parent.props;
				
				var title = props.title.getProp();
				if(title.trim() == ""){
					alert("забыли указать название");
					return;
				}
				
				var postText = props.input.getProp();
				if(postText  == ""){
					alert("запись не должна быть пустой");
					return;					
				}	

				var category = props.category.getProp();
				if(category  == "" || category  == null || category  == undefined){
					alert("выберите категорию");
					return;					
				}				
				
				var oldForm = document.forms["create_post"];
			    var formData  = new FormData(oldForm);
				
				if(!formData.has("category")){
					
					formData.append("category", category);
		
				}
							
				function callb(json){
					
					console.log(json);
					if(json.err){
						
						alert(json.err);
						return
					}					
					alert(json.mess);
					props.title.setProp("");
					props.input.setProp("");
					props.category_click_style.removeProp();
				}
				if(this.prop != null){
					this.rootLink.stateMethods.send_POST("/create/post/"+this.prop, formData, callb);
					this.prop = null;
					
				}else{
					
					 this.rootLink.stateMethods.send_POST("/create/post", formData, callb);
				}
				

				
			}
			
		}		
	},
	virtualArrayComponents: {
		
		selects_arr: { //виртуальный массив со всеми контейнерами в select свойствах
			
			container: "select_item",
			props: ["name", "value"],
			methods: {
				
				
			}
		
		},
		find_arr: { //массив с найдеными постами, категориями и секциями в поиске
			
			container: "find_item",
			props: ["remove", "update", "title", "id", "data"],
			methods: {
				
				remove: function(){
					
					var id = this.parent.props.id.getProp();
					var url1 = this.parent.props.data.getProp();
				
					var context = this;

					 var url = "/remove"+url1+id;
				
					this.rootLink.stateMethods.fetchItems(url).then(data=>{	
				
					if(data.err == undefined){
						
						context.parent.groupParent.removeFromGroup(context.parent.groupId);
						
						if(url1 == "/remove/category/"){
							delete context.rootLink.stateProperties.CATEGORIES[id];
							context.rootLink.eventProps["emiter-load-categories"].setEventProp(context.rootLink.stateProperties.CATEGORIES); 
						}
						if(url1 == "/remove/section/"){
							delete context.rootLink.stateProperties.SECTIONS[id];
							context.rootLink.eventProps["emiter-load-sections"].setEventProp(context.rootLink.stateProperties.SECTIONS);
						}

						
					}else{
						
						console.log(data.err);
					}
				}); 
					
					
				},
				update: function(){
				
					var id = this.parent.props.id.getProp();
					var url1 = this.parent.props.data.getProp();				
					var context = this;
					var url = "/update"+url1+id;
					
					if(url1.search("/post/") == 0){
						
						
						this.rootLink.stateMethods.fetchItems(url).then(data=>{	
				
							if(data.err == undefined){
												
								data.post.id = id;              
								context.rootLink.eventProps["emiter-update-post"].setEventProp(data.post);
							
							}else{
						
								console.log(data.err);
							}
						}); 					
				
					}else if(url1 == "/category/"){
							
						             
							this.rootLink.eventProps["emiter-update-category"].setEventProp(this.rootLink.stateProperties.CATEGORIES[id]);
							
					}else if(url1 == "/section/"){
							
							          
							this.rootLink.eventProps["emiter-update-section"].setEventProp(this.rootLink.stateProperties.SECTIONS[id]);
							
					}
				
				}			
		}
		
	   },
		
	},
	eventEmiters: {
		
		["emiter-load-categories"]:{ prop: ""},
		["emiter-load-sections"]:{ prop: ""},
		["emiter-class-btn"]: {prop: ""},
		["emiter-find-posts"]: {prop: ""},
		["emiter-update-post"]: {prop: ''},
		["emiter-update-category"]: {prop: ''},
		["emiter-update-section"]: {prop: ''},
		
	},
	stateMethods: {
		
        //получет данные с сервера методом get 
		fetchItems: async function(url){
			
			var resp = await fetch(url);			
			try{
				
				var json = await resp.json();
            }			
			catch(err){				
				console.log(err);				
			}
			
			return json;		
		},
		//функция отправляет данные методом post на сервер
        send_POST: function(url, formDATA, callb){
			
					fetch(url, {
						
						method: 'POST',
						body: formDATA
					})
					
					.then((response) => {
						if(response.ok) {
							return response.json();
						}	
						//console.log(response);
						throw new Error('Network response was not ok');
					})
					.then((json) => {

						callb(json);

					})
					.catch((error) => {
							console.log(error);
							alert(error);
					});	
	
		},	
		//валидация id 
		testId: function(id){
			    if(id.trim() == ""){
					alert("забыли указать id");
					return false;					
				}			
				var kiril = /[а-я]/i.test(id);
				if(kiril){
					alert("только латиницей");
					return false;						
				}
				var space = /\s/.test(id);
				if(space){
					alert("без пробелов");
					return false;						
				}
			    return true;
		}

		
	},
	stateProperties: {
		
		CATEGORIES: {},
		SECTIONS: {},
		
	}

	
}

window.onload = function(){
	
	
	var HM = new HTMLixState(StateMap);
	
	HM.stateMethods.fetchItems("/dbase/CATEGORIES.txt").then(json=>{
		
		HM.stateProperties.CATEGORIES = json;
		HM.eventProps["emiter-load-categories"].setEventProp(json); 
		
	});

	
    HM.stateMethods.fetchItems("/dbase/SECTIONS.txt").then(json=>{
		
		HM.stateProperties.SECTIONS = json;
		HM.eventProps["emiter-load-sections"].setEventProp(json); 
		
	}); 
		
	console.log(HM);
}
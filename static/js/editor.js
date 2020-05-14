var converter = new showdown.Converter();
  
    

var StateMap = {
	
	current_operation: {
		container: "current_operation",
		props: [ "variant", "page_btn", "category_btn", "section_btn", 
		["listen_class_btn", "emiter-class-btn", ""],
		"page_btn_class", "category_btn_class", "section_btn_class"],
		methods: {
			listen_class_btn: function(){
				
				var props =this.parent.props;
				
				props.page_btn_class.removeProp("active");
				props.category_btn_class.removeProp("active");
				props.section_btn_class.removeProp("active");
				
				props[this.emiter.prop].setProp("active");
				
			},		
			page_btn: function(){
				
				this.parent.props.variant.setProp("editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("page_btn_class");
				
			},
			category_btn: function(){
				
				this.parent.props.variant.setProp("category_editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("category_btn_class");
				
				this.rootLink.state["category_editor"].props.style.setProp("display: '';");
			},	
			section_btn: function(){
				
				this.parent.props.variant.setProp("section_editor");
				this.rootLink.eventProps["emiter-class-btn"].setEventProp("section_btn_class");
				
				this.rootLink.state["section_editor"].props.style.setProp("display: '';");			
				
			},			
		}
		
	},
	category_editor: {
		container: "category_editor",
				props: ["style","title", "id", "submit", "section", "group_sect", ["listen_load_sect", "emiter-load-sections", ""],
				"find_categ_btn_text", "find_categ_btn", "form_style",
				"category_group", "category_group_style"],
		methods: {
			find_categ_btn: function(){
				
				var props = this.parent.props;
					
					if(this.prop == null){
					
					props.form_style.setProp("display: none");
					props.find_categ_btn_text.setProp("Вернуться к созданию");
					this.parent.props.category_group_style.setProp("display: '';");
					
					var catArr2 = [];
					var catOld = this.rootLink.stateProperties.CATEGORIES;
					for(var key in catOld){

						catArr2.push({id: catOld[key].id, title: catOld[key].name, data: "/remove/category/", });
					}
					this.prop =1;

					this.parent.props.category_group.setProp(catArr2);
					
				}else{
					
					props.form_style.setProp("display: '' ");
					props.find_categ_btn_text.setProp("Смотреть все категории");
                    ///
					this.parent.props.category_group_style.setProp("display: none;");
					
					this.prop = null;
				}
				
				
			},
			listen_load_sect: function(){
				
				var sect = this.emiter.getEventProp();
				
				var sectArr =[];
				
				for(var key in sect){
					sectArr.push({name: sect[key].section_title, value: sect[key].section_id});

				}	
				this.parent.props.group_sect.setProp(sectArr);
				
				
			},
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
				
				var HM = this.rootLink;
				
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
					
				}
				
				this.rootLink.stateMethods.send_POST("/create/category", formData, callb);
				
			},		
		}
		
	},
	section_editor: {
		container: "section_editor",
				props: ["style","title", "id", "submit", "section_group", "section_group_style",
				"find_sect_btn_text", "find_sect_btn", "form_style"],
		methods: {
			find_sect_btn: function(){
				
				var props = this.parent.props;
					
					if(this.prop == null){
					
					props.form_style.setProp("display: none");
					props.find_sect_btn_text.setProp("Вернуться к созданию");

					var sectArr = [];
					var sectOLd = this.rootLink.stateProperties.SECTIONS;
					
					for(var key in sectOLd){

						sectArr.push({id: sectOLd[key].section_id, title: sectOLd[key].section_title, data: "/remove/section/", });
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
				var HM = this.rootLink;
				
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

					
				}
				this.rootLink.stateMethods.send_POST("/create/section", formData, callb);

			},		
		}
		
	},
	editor: {
		container: "editor",
		props: ["convent_btn", "convent_btn_text", "convent_btn_style", "save_btn", "title", "input", "output_html",
		"category", "category_click", "group_categ", ["listen_load_cat", "emiter-load-categories", ""],
		"input_style", "output_style", "find_by_cat_btn", "title_style", "find_by_cat_btn_text", "find_by_cat_btn_style",
		"post_group", "post_group_style", ["listen_find_posts", "emiter-find-posts", ""]],
		methods: {
			
			listen_load_cat: function(){
				
				var categ = this.emiter.getEventProp();
				
				var catArr = [];
				
				for(var key in categ){
					
					catArr.push({name: categ[key].name, value: categ[key].id});

				}
				this.parent.props.group_categ.setProp(catArr);
			},
			listen_find_posts: function(){
				
					var category = this.parent.props.category.getProp();
					
					var post_group = this.parent.props.post_group;
					
					if(category == "")return;

					var url = "/find/category/"+category+"/";
					
					var context = this.rootLink;
					
					this.rootLink.stateMethods.fetchItems(url).then(data=>{
						
						var postsArr = [];
						
						for(var i=0; i<data.length; i++){
							postsArr.push({ id: data[i].post_id, title: data[i].title, data: "/remove/post/"+category+"/"  })
						}
						
						post_group.setProp(postsArr);
						
					});
				
				
			},
			category_click: function(){
				
				    this.rootLink.eventProps["emiter-find-posts"].emit();
				
			},
			find_by_cat_btn: function(){
				
				var props = this.parent.props;
				
				if(this.prop == null){
					
					props.title_style.setProp("display: none");
					props.input_style.setProp("display: none");
					
					props.find_by_cat_btn_text.setProp("Вернуться к созданию записи");
					props.convent_btn_style.setProp("display: none;");
										props.post_group_style.setProp("display: '';");
					this.prop =1;


					this.rootLink.eventProps["emiter-find-posts"].emit();

				}else{
					
					props.title_style.setProp("display: ''");
					props.input_style.setProp("display: ''");
					props.post_group_style.setProp("display: none;");
					props.convent_btn_style.setProp("display: '';");
					props.find_by_cat_btn_text.setProp("Искать по категории");
					this.prop = null;
				}
				
				
			},
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
				
				
				function callb(json){
					
					console.log(json);
					if(json.err){
						
						alert(json.err);
						return
					}					
					alert(json.mess);
					props.title.setProp("");
					props.input.setProp("");
					
				}
				 this.rootLink.stateMethods.send_POST("/create/post", formData, callb);

				
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
			props: ["click","title", "id", "data"],
			methods: {
				
				click: function(){
					
					var id = this.parent.props.id.getProp();
					var url1 = this.parent.props.data.getProp();
				
					var context = this;

					 var url = url1+id;
				
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
					
					
				}
				
			}
			
		}
		
	},
	eventEmiters: {
		
		["emiter-load-categories"]:{ prop: ""},
		["emiter-load-sections"]:{ prop: ""},
		["emiter-class-btn"]: {prop: ""},
		["emiter-find-posts"]: {prop: ""},
		
	},
	stateMethods: {
		
		replaceAngles: function(text){
			
		var newText = 	text.replace(/</gi, "&lt;");
			newText = newText.replace(/>/gi, "&gt;");
			
			return newText;
		},
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

const SITE_NAME = "simple-cms"; // имя репозитория на гитхаб
const HOME_PAGE_NAME = "Home";
const CONTACTS_PAGE_NAME = "Контакты";
var NAV_TYPE = "left-menu"; //top-menu

var converter = new showdown.Converter(); //конертация markdown формата

var StateMap = {
    
	/*
	  menu - компонент меню для переключения разделов сайта
	*/
	menu:{
		selector: "ul:first-of-type",
		arrayProps: ["click_left_menu", "click_top_menu", ["listen_load_section", "emiter-load-section", ""], ["listen_change_section_in_arr", "emiter-change-section", ""]],
		arrayMethods: {
			click_left_menu: function(){
				
				this.rootLink.stateProperties.NAVIGATION_TYPE = "left-menu";
				this.rootLink.eventProps["emiter-navigation-type"].setEventProp(this.rootLink.stateProperties.NAVIGATION_TYPE);
				this.rootLink.eventProps["emiter-change-section"].setEventProp(this.rootLink.stateProperties.CURRENT_SECTION);
			},
			click_top_menu: function(){
				
				if(window.innerWidth < 600)return;
				this.rootLink.stateProperties.NAVIGATION_TYPE = "top-menu";
				this.rootLink.eventProps["emiter-navigation-type"].setEventProp(this.rootLink.stateProperties.NAVIGATION_TYPE);
			},
			///обновляем список разделов меню присланных с сервера при первой загрузке
			listen_load_section: function(){
								
				var sections = this.emiter.getEventProp();
				
				var sectionNew = [{title: HOME_PAGE_NAME, data: "home"}];
				
				for(var key in sections){
					
					sectionNew.push({title: sections[key].section_title, data: sections[key].section_id});
				}
				sectionNew.push({title: CONTACTS_PAGE_NAME, data: "contacts"});
				
				this.component().reuseAll(sectionNew);
				
			},
			///меняем url и отображаемый компонент при наступлении события, которое мы вызываем при клике по секции в меню либо при первой загрузке страници
			listen_change_section_in_arr: function(){
				
				var sect_id = this.emiter.prop;
				
				var historyURL = "/"+SITE_NAME+"/" + sect_id+"/";
		    	if(sect_id == "home")historyURL = "/"+SITE_NAME+"/";
				
				
				this.rootLink.router.setRout(historyURL);
				
				
			}
		},			
		container: "menu_item",
		props: [ 
			"click", "class", "data", "title",
            ["hover_on", "mouseover", ""], ["hover_out", "mouseout", ""], ["listen_navigation_type", "emiter-navigation-type", ""],			
			["group_items", "group", "ul:first-of-type"], ["group_ul_class", "class", "ul:first-of-type"], 
			["listen_change_section_in_cont", "emiter-change-section", ""], 
			["listen_load_cat", "emiter-load-categories", ""]
			],
		methods: {
			hover_on: function(){
				var sectionId = this.parent.props.data.getProp();
				if( sectionId == "home" || sectionId == "contacts")return;
				this.parent.props.group_ul_class.removeProp("hover-non");
				
			},
			hover_out: function(){
				var sectionId = this.parent.props.data.getProp();
				if( sectionId == "home" || sectionId == "contacts")return;
				this.parent.props.group_ul_class.setProp("hover-non");
				
			},
			listen_navigation_type: function(){
				
				var nav_type = this.emiter.prop;
				var props= this.parent.props;
				
				if(nav_type == "left-menu"){
									
					props.hover_on.disableEvent("mouseover");
					props.hover_out.disableEvent("mouseout");
					
				}else{
					
					props.hover_on.enableEvent("mouseover");
					props.hover_out.enableEvent("mouseout");
				}
				
			},				
            //вызываем событие emiter-change-section которое слушаем в мсвойстве массива 
			//и событие emiter-load-categories для обновления списка левого меню в компоненте left_menu 
			click: function(){
				event.preventDefault();
				
				var sect_id = this.parent.props.data.getProp();
				
				this.rootLink.stateProperties.CURRENT_SECTION = sect_id;
				this.rootLink.eventProps["emiter-change-section"].setEventProp(sect_id);
								
				if(sect_id == "home" || sect_id == "contacts"){
										
					return;
				}else{					
					if(this.rootLink.stateProperties.NAVIGATION_TYPE != "left-menu")return;
					this.rootLink.eventProps["emiter-load-categories"].setEventProp(sect_id);
				}
			},
			//слушаем событие смены раздела для снятия и добавления активного класса на соответствующих кнопках
			listen_change_section_in_cont: function(){
			
				if(this.parent.props.data.getProp() == this.emiter.prop){
					
					this.parent.props.class.setProp("active");
					
				}else{
					this.parent.props.class.removeProp("active");
				}
			},
			listen_load_cat: function(){
				
					var sectionId = this.parent.props.data.getProp();
					if(sectionId == undefined || sectionId == "" || sectionId == "home" || sectionId == "contacts")return;
							
					var group_array = this.rootLink.stateMethods.createItemLevel_2_data.call(this, sectionId);
			
				    //console.log(array);	
			        this.parent.props.group_items.setProp({componentName: "menu_level_2", group: group_array});
			},			
		}		
	},
	/*
	  page_single - компонент отображает текущий пост.
	
	*/
	page_single: {
		
		container: "page_single",
		props: ["description", "title", ["listen_load_page", "emiter-load-page", ""]],
		methods: {
			
			//слушает событие загрузки поста с сервера которое мы вызываем в компоненте left_menu_level_2 и методе onLoadAll при первой загрузке,  и отображает пост
			listen_load_page: function(){
				
				var post = this.emiter.getEventProp();
				
				this.parent.props.title.setProp( post.title);
				
				var text = converter.makeHtml(post.text);
				
				this.parent.props.description.setProp(text);
				
				 colorTagsAndComents(); //tagWraper.js 
				
			}			
		}		
	},
	virtualArrayComponents: {
			/*
		menu_level_2 - компонент левое меню для переключения отображаемых постов
	*/
	menu_level_2: {
		
		container: "item_level_2",
		props: ["click", "title", "class", "data", "post_group", "post_group_style", "simbol",
		 ["hover_on", "mouseover", ""], ["hover_out", "mouseout", ""], ["post_group_class", "class", "[data-item_level_2-post_group='group']"],
		["simbol_style", "style", '[data-item_level_2-simbol="text"]' ],
		["listen_navigation_type", "emiter-navigation-type", ""],
		],
		methods: {
			listen_navigation_type: function(){
				
				var nav_type = this.emiter.prop;
				var props= this.parent.props;
				
				if(nav_type == "left-menu"){
					
					props.simbol_style.setProp("");
					//props.click.enableEvent("click");
					props.hover_out.disableEvent("mouseout");
					props.hover_on.disableEvent("mouseover");
					
				}else{
					
					props.simbol_style.setProp("display: none;");
					//props.click.disableEvent("click");
					props.hover_out.enableEvent("mouseout");
					props.hover_on.enableEvent("mouseover");
				}
				
				
			},
			hover_on: function(){
					
					this.parent.props.post_group_class.removeProp("hover-non");
				
			},
			hover_out: function(){
				
				this.parent.props.post_group_class.setProp("hover-non");
				
			},
			//при клике по категории списка меню скрываем либо отбражаем дочерний список постов
			click: function(){
				
				event.preventDefault();
				
				if(this.rootLink.stateProperties.NAVIGATION_TYPE != "left-menu")return;
				
				if(this.prop == null){
					
					//console.log(this.prop);
					this.parent.props.post_group_style.setProp("display: none;");
					this.parent.props.simbol.setProp("+");
					this.prop = 1;
					
					
				}else{
					
				     this.parent.props.post_group_style.setProp("display: '';");
					 this.parent.props.simbol.setProp("-");
					
					this.prop = null;
					
				}
				
				
				
				//console.log(this);
			},
			//метод вызываетсся при создании контейнера
			oncCreatedContainer(){
				
					if(this.props.post_group.groupArray == undefined){
					

					
					//this.props.post_group.groupArray = this.rootLink.state["left_menu_level_2"];
					}
				
				}
			}

		},		
		/*
		 left_menu_level_2 - компонент - виртуальный массив для отображения списка постов в левом меню
		*/
		menu_level_3: {
		
			container: "item_level_3", 
			props: ["click", "title", "class", "data"],
			methods: {
				//метод меняет текущий роут, а также отправляет запрос с поиском соотв. поста на сервер, после загрузки поста вызывает событие emiter-load-page
				//которое слушает компонент page_single 
				click: function(){
				
						var post_id = this.parent.props.data.getProp();
						var category_id = this.parent.groupParent.parent.props.data.getProp();
						
						var path = "/"+SITE_NAME+"/dbase/categories/"+category_id+"/"+post_id+".txt";
						
						var historyURL = "/"+SITE_NAME+"/post/"+category_id+"/"+post_id;
		    	     	
					    // console.log(this);
						if(this.rootLink.stateProperties.NAVIGATION_TYPE != "left-menu"){
							
							this.rootLink.stateProperties.CURRENT_SECTION = this.parent.groupParent.parent.groupParent.parent.props.data.getProp();
							this.rootLink.eventProps["emiter-change-section"].setEventProp(this.rootLink.stateProperties.CURRENT_SECTION);	
							 this.rootLink.router.setRout(historyURL);
						}
						this.rootLink.router.setRout(historyURL);
				       //
						
						//console.log(this.rootLink.state["left_menu"].getAll({title: "", simbol: "", post_group: {title: "", data: ""}   }));
						
						
						this.rootLink.stateMethods.fetchAll(path).then((json)=>{  
						
						     this.rootLink.eventProps["emiter-load-page"].setEventProp(json);  
							 
						}); 
				},				
			
			}			
		}
	},
	//компонент для отображения страниц с постами и левого меню
	sections: {
			container: "sections",
			props: ["group_items", "right_coll_class", "left_coll_style", ["listen_load_cat", "emiter-load-categories", ""],
			["listen_navigation_type", "emiter-navigation-type", ""],
			
			],
			methods: {
				listen_navigation_type: function(){
					
						var nav_type = this.emiter.prop;
						var props= this.parent.props;
				
						if(nav_type == "left-menu"){
					
							props.left_coll_style.setProp("");
							props.right_coll_class.setProp(["col-sm-12", "col-md-9"]);
					
						}else{
					
							props.left_coll_style.setProp("display: none;");
							props.right_coll_class.setProp(["col-sm-12", "col-md-12"]);
						}
					
					
				},
				listen_load_cat: function(){
				    if(this.rootLink.stateProperties.NAVIGATION_TYPE != "left-menu")return;
					var sectionId = this.emiter.prop;
					if(sectionId == undefined || sectionId == "" || sectionId == "home")return;
							
					var group_array = this.rootLink.stateMethods.createItemLevel_2_data.call(this, sectionId);
			
				    //console.log(array);	
			        this.parent.props.group_items.setProp({componentName: "menu_level_2", group: group_array});
				},
								
			}
			
	},
	//компонент для отображения домашней страници
	home: {
			container: "home",
			props: [],
			methods: {
				
				
			}
			
	},
	//компонент для отображения страници контактов
	contacts: {
			container: "contacts",
			props: [],
			methods: {
				
				
			}
			
		},
stateMethods: {
	
	createItemLevel_2_data: function(sectionId){
					
				var sections = this.rootLink.stateProperties.SECTIONS[sectionId].section_categories;
				
				var categ = {};
				
				for(var y=0; y < sections.length; y++){
					
					categ[ sections[y] ] = this.rootLink.stateProperties.CATEGORIES[ sections[y] ];
					
				}
							
				var cat_id = this.rootLink.stateProperties.category_id;	

    		    var array = [];
				
				for(var key in categ){
					
					var level_2 = {title: categ[ key ].name, data: categ[ key ].id, post_group: [], simbol: "-", post_group_style: "display: ''"};
					
					if(cat_id[categ[ key ].id] != undefined){
						
						for(var k=0; k < cat_id[categ[ key ].id].length; k++){
						
							level_2.post_group.push({title: cat_id[categ[ key ].id][k].title, data: cat_id[categ[key].id][k].post_id });
						}
					}
				   array.push(level_2);

			     }
               
             return array;			   
		
	},	
	//получает данные с сервера методом get
	fetchAll: async function(url){
			
			var resp = await fetch(url);
			
			try{
				
				var json = await resp.json();
            }
			
			catch(err){				
				console.log(err);
			}
			
			return json;		
		},
		//метод - событие, вызывается после дозагрузки шаблонов и создания соответствующих компонентов
		onLoadAll: function(){ 
			
			var currentUrl = window.location.pathname;
			var urlArr = currentUrl.split("/");
			var section = "home";
				
			if(urlArr.length > 2){
		
				if(urlArr[2] == this.stateProperties.SECTIONS[urlArr[2] ] != undefined)section = urlArr[2];
				if(urlArr[2] == "contacts")section = "contacts";
				if(urlArr[2] == "post"){
			
					for(var key in this.stateProperties.SECTIONS){
				
						if(this.stateProperties.SECTIONS[key].section_categories.indexOf( urlArr[3]) != -1 ){
					
							section = key;
						}
					}
				}
			}
				this.eventProps["emiter-load-section"].setEventProp(this.stateProperties.SECTIONS);
				
				if(section != "contacts" && section != "home"){
			
					this.eventProps["emiter-load-categories"].setEventProp(section);
			
				}else if(this.stateProperties.NAVIGATION_TYPE == "top-menu"){
					
					this.eventProps["emiter-load-categories"].setEventProp(section);
				}
				this.stateProperties.CURRENT_SECTION = section;
				this.eventProps["emiter-change-section"].setEventProp(section);	
				
				this.eventProps["emiter-navigation-type"].setEventProp(this.stateProperties.NAVIGATION_TYPE);
				
				if(urlArr[2] == "post"){
					this.router.setRout("/"+SITE_NAME+"/post/"+urlArr[3]+"/"+urlArr[4]);
					
					this.eventProps["emiter-load-page"].setEventProp(this.stateProperties.POST);
				}

			
		},	
},		
	stateProperties: {
		CATEGORIES: "",
		SECTIONS: "",
		category_id: "",
		//posts_id: "",
		POST: "",
	},
    eventEmiters: {
		
		["emiter-load-categories"]: {prop: ""},
		["emiter-load-page"]: {prop: ""},
		["emiter-load-section"] : {prop: ""},
		["emiter-change-section"] : {prop: ""},
		["emiter-navigation-type"] : {prop: ""},
		
	}	
}

var routes = {
	
	 ["/"]:  {  first: [ "home", "menu"],
	           routComponent: {
			
					router_main: "home",   //компоненты соответствующие данному роуту
			
				},
		
				templatePath: "/"+SITE_NAME+"/static/template/template.html" // папка для загрузки шаблонов
	          },
	
	["/"+SITE_NAME+"/"]:  {  first: [ "home", "menu"],
	           routComponent: {
			
					router_main: "home",   //компоненты соответствующие данному роуту
			
				},
		
				templatePath: "/"+SITE_NAME+"/static/template/template.html" // папка для загрузки шаблонов
	        },	
     ["/"+SITE_NAME+"/post/:categoryID/:postID/*"]	:{
		 
				first: ["home", "menu"],
					routComponent: {
			
						router_main: "sections",   //компоненты соответствующие данному роуту
			
					},
		
				templatePath: "/"+SITE_NAME+"/static/template/template.html" // папка для загрузки шаблонов
		 
	 },			
	["/"+SITE_NAME+"/contacts/*"]:  {  first: ["home", "menu"],
	
	           routComponent: {
			
					router_main: "contacts",   //компоненты соответствующие данному роуту
			
				},
		
				templatePath: "/"+SITE_NAME+"/static/template/template.html" // папка для загрузки шаблонов
	        }			

}
function addSectionToRoutes(routes, sections){
	
	for(var key in sections){
		
		routes["/"+SITE_NAME+"/"+key+"/*"] = {  
	
	           first: ["home", "menu"],
	           routComponent: {
			
					router_main: "sections",   //компоненты соответствующие данному роуту
			
				},
		
				templatePath: "/"+SITE_NAME+"/static/template/template.html" // папка для загрузки шаблонов
	        }
	}
		
}
// т. к. сервер не поддерживает php и node.js создаем страницу на клиенте, сперва загрузив все необходимые данные с сервера.
window.onload = function(){
	

	var currentUrl = window.location.pathname;
	
	var urlArr = currentUrl.split("/");

	var SERVER_DATA = {
		CATEGORIES: CATEGORIES_JS,
		category_id: category_id_js,
		SECTIONS: SECTIONS_JS,
		POST: {title: "title", text: "click on page..."},
		NAVIGATION_TYPE: NAV_TYPE,
		CURRENT_SECTION: "",
	};
	var HM = "";

	async function add1(){		

		var resp4 = {title: "title", text: "click on page..."};
		
		if(urlArr[2] == "post"){
		    resp4 = await fetch("/"+SITE_NAME+"/dbase/categories/"+urlArr[3]+"/"+urlArr[4]+".txt");
			resp4 = await resp4.json();
		}	
		return resp4
	}	
	add1().then(obj => {

		SERVER_DATA.POST = obj;
		
		addSectionToRoutes(routes, SERVER_DATA.SECTIONS);
			
		HM = HTMLixRouter(StateMap, routes);
		
		HM.stateProperties = SERVER_DATA;

		console.log(HM);
		
	});
	

}



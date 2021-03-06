
const SITE_NAME = "simple-cms"; // имя репозитория на гитхаб
const HOME_PAGE_NAME = "Htmlix"; //название главной страници
const CONTACTS_PAGE_NAME = "Контакты"; //название страници с контактами
var NAV_TYPE = "left-menu"; //top-menu -тип навигации
var converter = new showdown.Converter(); //конвертация markdown формата

var StateMap = { 

	/*
	  menu - компонент меню для переключения разделов сайта
	*/
	menu:{
		selector: "ul:first-of-type",
		arrayProps: ["mobail_toggler", "mobail_toggler_style", "toggle_nav_type", ["listen_load_section", "emiter-load-section", ""], ["listen_change_section_in_arr", "emiter-change-section", ""]],
		arrayMethods: {
			mobail_toggler: function(){
				
				if(this.prop == null){
					
					this.parent.props.mobail_toggler_style.setProp("display: none;");
					this.prop = 1;
					
				}else{
					
					this.parent.props.mobail_toggler_style.setProp("");
					this.prop = null;					
				}				
			},
			//переключает тип навигации
			toggle_nav_type: function(){
				
				if(this.prop != null){
					
					this.rootLink.eventProps["emiter-navigation-type"].setEventProp("left-menu");
					this.rootLink.eventProps["emiter-change-section"].setEventProp(this.rootLink.stateProperties.CURRENT_SECTION);
					this.rootLink.eventProps["emiter-load-categories"].setEventProp(this.rootLink.stateProperties.CURRENT_SECTION);				
					this.prop = null;
					
				}else{
					
					this.rootLink.eventProps["emiter-navigation-type"].setEventProp("top-menu");
					this.prop = 1;
				}
				

			},
			///обновляем список разделов меню присланных с сервера при первой загрузке
			listen_load_section: function(){
								
				var sections = this.emiter.getEventProp();
				
				var sectionNew = [{title: HOME_PAGE_NAME, data: "home", href: "/"+SITE_NAME+"/"+HOME_PAGE_NAME+"/#"}];
				
				for(var key in sections){
					
					sectionNew.push({title: sections[key].section_title, data: sections[key].section_id, href: "/"+SITE_NAME+"/"+sections[key].section_id+"/#"});
				}
				sectionNew.push({title: CONTACTS_PAGE_NAME, data: "contacts", href: "/"+SITE_NAME+"/contacts/#"});
				
				this.component().reuseAll(sectionNew);
				
			},
			///меняем url и отображаемый компонент при наступлении события, которое мы вызываем при клике по секции в меню либо при первой загрузке страници 
			///либо по пункту меню 3 уровня для top-menu навигации
			listen_change_section_in_arr: function(){
				
				var sect_id = this.emiter.prop;
				
				var historyURL = "/"+SITE_NAME+"/" + sect_id+"/";
		    	if(sect_id == "home")historyURL = "/"+SITE_NAME+"/";
				
				
				this.rootLink.router.setRout(historyURL);
								
			}
		},			
		container: "menu_item", ///контейнер компонента menu для каждого раздела сайта
		props: [ 
		     //data свойство содержит id секции в html разметке
			"click", "class", "data", "title",
            ["hover_on", "mouseover", ""], ["hover_out", "mouseout", ""], ["listen_navigation_type", "emiter-navigation-type", ""],			
			["group_items", "group", "ul:first-of-type"], ["group_ul_class", "class", "ul:first-of-type"], 
			["listen_change_section_in_cont", "emiter-change-section", ""], 
			["listen_load_cat", "emiter-load-categories", ""],
			["listen_width_display", "emiter-width-display", ""],
			["toggle_hover", "aux"], //вспомогательный метод
			["href", "href", "a:first-of-type" ],
			],
		methods: {
			toggle_hover: function(action){//вспомогательный метод - включает или выключает события наведения курсора мыши										
					this.props.hover_on[action+"Event"]("mouseover");
					this.props.hover_out[action+"Event"]("mouseout");								
			},
			///слушаем изменение ширины экрана
			listen_width_display: function(){
				if(this.emiter.prop == "mobail"){					
					this.parent.methods.toggle_hover("disable");
				}else{
					this.parent.methods.toggle_hover("enable");
				}							
			},
			///слушаем изменение типа навигации и включаем либо выключаем соответствующие обработчики стандартных событий			
			listen_navigation_type: function(){			
				if(this.emiter.prop == "left-menu"){					
					this.parent.methods.toggle_hover("disable");
				}else{
					this.parent.methods.toggle_hover("enable");
				}					
			},	
			//наведение курсора на секцию  для top-menu навигации
			//удаляем класс чтобы отобразить дочерний список
			hover_on: function(){
				var sectionId = this.parent.props.data.getProp();
				if( sectionId == "home" || sectionId == "contacts")return;
				this.parent.props.group_ul_class.removeProp("hover-non");
				
			},
			//удаление курсора с секции для top-menu навигации
			//добавляем класс чтобы скрыть дочерний список
			hover_out: function(){
				var sectionId = this.parent.props.data.getProp();
				if( sectionId == "home" || sectionId == "contacts")return;
				this.parent.props.group_ul_class.setProp("hover-non");
				
			},
            //вызываем событие emiter-change-section которое слушаем в свойстве массива 
			//и событие emiter-load-categories для обновления списка левого меню в компоненте sections
			click: function(){
				event.preventDefault();
				
				var sect_id = this.parent.props.data.getProp();			
				//this.rootLink.stateProperties.CURRENT_SECTION = sect_id;
				this.rootLink.eventProps["emiter-change-section"].setEventProp(sect_id);
								
				if(sect_id == "home" || sect_id == "contacts"){										
					return;
				}else{					
					//if(this.rootLink.stateProperties.NAVIGATION_TYPE != "left-menu")return;
					this.rootLink.eventProps["emiter-load-categories"].setEventProp(sect_id);
				}
			},			
			//слушаем событие смены раздела для снятия и добавления активного класса на соответствующих кнопках
			listen_change_section_in_cont: function(){
			
				if(this.parent.props.data.getProp() == this.emiter.prop){
					
					this.parent.props.class.setProp("active");
					if(this.rootLink.eventProps["emiter-width-display"].prop == "mobail"){
						this.parent.props.group_ul_class.removeProp("hover-non");
						
					}									
				}else{
					this.parent.props.class.removeProp("active");
					if(this.rootLink.eventProps["emiter-width-display"].prop == "mobail"){
						this.parent.props.group_ul_class.setProp("hover-non");
					}
				}
			},
			//слушаем событие загрузки категоий чтобы создать список для секций меню top-menu 
			///которое мы вызываем при первой загрузке сайта			
			listen_load_cat: function(){				    
					///если список уже создан выходим из функции, чтобы не создавать его повторно
				    if(this.prop != null)return;
				
					var sectionId = this.parent.props.data.getProp();
					if(sectionId == undefined || sectionId == "" || sectionId == "home" || sectionId == "contacts")return;
							
					var group_array = this.rootLink.stateMethods.createItemLevel_2_data.call(this, sectionId, "top_menu");
			
			        this.parent.props.group_items.setProp({componentName: "menu_level_2_top", group: group_array});
					
					this.prop = 1;
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
			//слушает событие загрузки поста с сервера которое мы вызываем в компоненте menu_level_3 и методе onLoadAll при первой загрузке,  и отображает пост
			listen_load_page: function(){
				
				var post = this.emiter.getEventProp();
				
				this.parent.props.title.setProp( post.title);
				
				var text = converter.makeHtml(post.text);
				
				this.parent.props.description.setProp(text);
				
				 colorTagsAndComents(); //tagWraper.js 
				 	 window.scrollTo(0, 0);
				 //сохраняет статическую страницу в папке post
					if(window.location.href.search('http://localhost:3000') == 0){
		
					this.rootLink.stateMethods.save_page();
				}
				
			}			
		}		
	},
	virtualArrayComponents: {
			/*
		menu_level_2 - компонент  меню - уровень 2 для левого меню left_menu
	*/
	menu_level_2: {
		
		container: "item_level_2",
		share_props: 4,
		props: ["title",  "data", "post_group", ["href", "href", "a:first-of-type"], //разрешаем наследовать только первые три свойства	
				"post_group_style", "simbol", "click", 
		],
		methods: {
			
			//при клике по категории списка меню скрываем либо отбражаем дочерний список постов в режиме left-menu
			click: function(){
				
				event.preventDefault();

				if(this.prop == null){				
					this.parent.props.post_group_style.setProp("display: none;");
					this.parent.props.simbol.setProp("+");
					this.prop = 1;								
				}else{					
				     this.parent.props.post_group_style.setProp("");
					 this.parent.props.simbol.setProp("-");				
					this.prop = null;					
				}			
			},
			//метод вызываетсся при создании контейнера
			oncCreatedContainer(){			
					if(this.props.post_group.groupArray == undefined){

					//this.props.post_group.groupArray = this.rootLink.state["left_menu_level_2"];
					}				
				}
			}
		},
	///второй уровень навигации для верхнего меню top_menu	
	menu_level_2_top: {
		
		container: "item_level_2_top",
		container_extend: "menu_level_2", //"title",  "data", "post_group", href наследуем 4 свойства из контейнера компонента menu_level_2 
		props: [ 
		   "click",
		   ["hover_on", "mouseover", ""], ["hover_out", "mouseout", ""], ["post_group_class", "class", "ul:first-of-type"],
		   ["listen_width_display", "emiter-width-display", ""],
		   ["listen_change_level_2_item", "emiter-change-level_2_item", ""],
		],
		methods: {
			listen_width_display: function(){//преключаем мобильную и обычную версию top-menu
	
				if(this.emiter.prop == "mobail"){
					this.parent.props.hover_on.disableEvent("mouseover");
					this.parent.props.hover_out.disableEvent("mouseout");
				}else{
					
					this.parent.props.hover_on.enableEvent("mouseover");
					this.parent.props.hover_out.enableEvent("mouseout");
				}							
			},
			//удаляем класс чтобы отобразить дочернюю группу в режиме top-menu
			hover_on: function(){
							
					this.parent.props.post_group_class.removeProp("hover-non");				
			},
			//добавляем класс чтобы скрыть дочернюю группу в режиме top-menu
			hover_out: function(){
						
				this.parent.props.post_group_class.setProp("hover-non");				
			},
			//при клике по категории списка меню мобильной версии
			click: function(){
				
				event.preventDefault();
				
				this.component().data.forEach(container=>{
					
					 container.props.post_group_class.setProp("hover-non");
					
					if(container.index == this.parent.index){
						
						container.props.post_group_class.removeProp("hover-non");
					}					
				});							
			},		
		  }
		},		
		/*
		 menu_level_3 - компонент - виртуальный массив для отображения списка постов в меню
		*/
		menu_level_3: {
		
			container: "item_level_3", 
			props: ["click", "title", "class", "data", "href", ["main_title", "title", "a:first-of-type"]],
			methods: {
				//метод меняет текущий роут, а также отправляет запрос с поиском соотв. поста на сервер, после загрузки поста вызывает событие emiter-load-page
				//которое слушает компонент page_single 
				click: function(){
				        event.preventDefault();
						var post_id = this.parent.props.data.getProp();
						var category_id = this.parent.groupParent.parent.props.data.getProp();
						
						var path = "/"+SITE_NAME+"/dbase/categories/"+category_id+"/"+post_id+".txt";
						
						var historyURL = "/"+SITE_NAME+"/post/"+category_id+"/"+post_id;
		    	     	
						//в режиме top меню также переключает секцию, чтобы сменить класс у активной секции
						if(this.rootLink.eventProps["emiter-navigation-type"].prop != "left-menu"){
							
							if(this.rootLink.eventProps["emiter-width-display"].prop == "mobail"){
								
								this.rootLink.state["menu"].props.mobail_toggler.emitEvent("click");
							}
							
							this.rootLink.eventProps["emiter-change-section"].setEventProp(this.parent.groupParent.parent.groupParent.parent.props.data.getProp());	
							 this.rootLink.router.setRout(historyURL);
							 
						}else{
	
							
							this.rootLink.router.setRout(historyURL);
						}				
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
				///слушаем событие изменения типа навигации и скрываем либо отображаем левую секцию
				//а также включаем либо выключаем слушатель события listen_load_cat 
				listen_navigation_type: function(){
					
						var nav_type = this.emiter.prop;
						var props= this.parent.props;
				
						if(nav_type == "left-menu"){
							
							props.listen_load_cat.enableEvent();
							props.left_coll_style.setProp("");
							props.right_coll_class.setProp(["col-sm-12", "col-md-9"]);
												
						}else{
							
							props.listen_load_cat.disableEvent();
							props.left_coll_style.setProp("display: none;");
							props.right_coll_class.setProp(["col-sm-12", "col-md-12"]);
						}
										
				},
				//слушем событие смены категорий и создаем соответствующий список в левом меню.
				//метод работает только когда тип навигации = left-menu т. к. для top-menu он выключается в методе выше
				listen_load_cat: function(){
					//console.log(this);
					var sectionId = this.emiter.prop;
					if(sectionId == undefined || sectionId == "" || sectionId == "home" || sectionId == "contacts")return;
					
                    //формируем массив для создания списка					
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
	
	//метод формирует массив с объектами для списка меню второго и терьего уровня, примнимает в качестве аргумента id секции для которой создается список
	createItemLevel_2_data: function(sectionId, menu_type){
					
				var sections = this.rootLink.stateProperties.SECTIONS[sectionId].section_categories;
				
				var categ = {};
				//создаем объект с категориями выбранной секции
				for(var y=0; y < sections.length; y++){
					
					categ[ sections[y] ] = this.rootLink.stateProperties.CATEGORIES[ sections[y] ];
					
				}							
				var cat_id = this.rootLink.stateProperties.category_id;	

    		    var array = [];
				
				for(var key in categ){
					//создаем объект со свойствами для второго уровня меню
					var level_2 = "";
					
					if(menu_type == "top_menu"){
						
						level_2 = {title: categ[ key ].name, data: categ[ key ].id, post_group: [],  href: "/"+SITE_NAME+"/"+sectionId+"/"+categ[key].id+"/#"};
					}else{
						
						level_2 = {title: categ[ key ].name, data: categ[ key ].id, post_group: [], simbol: "-", post_group_style: "display: ''", href: "/"+SITE_NAME+"/"+sectionId+"/"+categ[key].id+"/#"};
					}					
					if(cat_id[categ[ key ].id] != undefined){
						
						for(var k=0; k < cat_id[categ[ key ].id].length; k++){
						    ///создаем объект со свойствами для третьего уровня меню
							level_2.post_group.push({title: cat_id[categ[ key ].id][k].title, 
							                         main_title: cat_id[categ[ key ].id][k].title+" htmlix",
							                         data: cat_id[categ[key].id][k].post_id, 
													 href: "/"+SITE_NAME+"/post/"+categ[key].id+"/"+cat_id[categ[key].id][k].post_id });
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
		//метод - событие, вызывается после дозагрузки шаблонов и создания всех компонентов
		///сдесь в зависимости от url переключаем события чтобы создать необходимое представление и отобразить нужные компоненты 		
		onLoadAll: function(){

			var currentUrl = window.location.pathname;
			var urlArr = currentUrl.split("/");
			var section = "home";
				
			if(urlArr.length > 2){
		
				if(urlArr[2] == this.stateProperties.SECTIONS[urlArr[2] ] != undefined)section = urlArr[2];
				if(urlArr[2] == "contacts")section = "contacts";
				
				//если отображается пост то ищем нужную секцию чтобы отобразить для нее навигацию в левом меню
				if(urlArr[2] == "post"){
			
					for(var key in this.stateProperties.SECTIONS){
				
						if(this.stateProperties.SECTIONS[key].section_categories.indexOf( urlArr[3]) != -1 ){
					
							section = key;
						}
					}
				}
			}
			    //вызываем событие создание секций меню (пункты первого уровня)
				this.eventProps["emiter-load-section"].setEventProp(this.stateProperties.SECTIONS);
				
				//вызываем событие для создания категорй меню(пункты меню 2-го уровня и 3-го)					
				this.eventProps["emiter-load-categories"].setEventProp(section);
				
				//вызываем событие для изменения секции  
				this.eventProps["emiter-change-section"].setEventProp(section);	
				
				///вызываем события изменения типа навигации
				if(window.innerWidth < 600){
					this.eventProps["emiter-width-display"].emit();
					
				}else{
					
					this.eventProps["emiter-navigation-type"].setEventProp(this.stateProperties.NAVIGATION_TYPE);
				}				
				///вызываем событие отображения поста 
				if(urlArr[2] == "post"){
					this.router.setRout("/"+SITE_NAME+"/post/"+urlArr[3]+"/"+urlArr[4]);
					
					this.eventProps["emiter-load-page"].setEventProp(this.stateProperties.POST);
				}		
		},
        save_page: function(){
					  
					  var html = document.querySelector('.container-fluid').innerHTML;
					  
					  var path = window.location.pathname.split("/");
					  
					  if(path[2] != "post")return;
					  
					  var newPath = "/"+path[2]+"/"+path[3]+"/"+path[4];
					//  console.log(newPath);
					//  console.log(html);
					  var formData  = new FormData();
					  formData.append("content", html);
					fetch(newPath, {					
						method: 'POST',
						body: formData
					})				
					.then((response) => {
						if(response.ok) {
							return response.json();
						}	
						//console.log(response);
						throw new Error('Network response was not ok');
					})
					.then((json) => {
						console.log(json);
					})
					.catch((error) => {
							console.log(error);
							alert(error);
					});		
			
	        },	
     },	
	stateProperties: {
		
		CATEGORIES: CATEGORIES_JS, //из файла dbase/CATEGORIES.js
		category_id: category_id_js, //из файла /dbase/category_id.js
		SECTIONS: SECTIONS_JS, //из файла /dbase/SECTIONS.js
		POST: {title: "title", text: "click on page..."},
		NAVIGATION_TYPE: NAV_TYPE, //тип навигации 
		CURRENT_SECTION: "", //текущая секция
	},
	stateSettings: {		
		///имя переменной из файла template.js где искать недостающие шаблоны
		templateVar: template,		
	},
    eventEmiters: {
		
		["emiter-load-categories"]: {prop: ""}, //событие для создания второго и  третьго уровня меню
		["emiter-load-page"]: {prop: ""}, //событие дя отображения загруженого с сервера поста
		["emiter-load-section"] : {prop: ""}, //событие для создания секций меню (1-го уровня)
		["emiter-width-display"] : {	//событие изменения мобильной версии сайта	
			prop: "desktop",
			behavior: function(){ 
			       
				   if(window.innerWidth < 600 && this.prop == "desktop"){
					  
					   this.rootLink.eventProps["emiter-navigation-type"].setEventProp("top-menu");					   
					   this.prop = "mobail";
					   return true;	
					   
				   }else if(window.innerWidth > 600 && this.prop == "mobail"){
					   
					   this.prop = "desktop";
					   return true;	
					   
				   }else{					   
					   return false;
				   }				
				   		
			}			
		}, 		
		["emiter-change-section"] : { //событие для смены секции меню 
			prop: "setionId",
			behavior: function(){
				
				this.rootLink.stateProperties.CURRENT_SECTION = this.prop;				
				return true;
			}
		},
		["emiter-navigation-type"] : {//событие для смены типа навигации
			prop: "",
			
			behavior: function(){
				//если ширина экрана меньше 600 px событие не сработает
				if(window.innerWidth < 600 && this.prop == "left-menu")return false;
				
				this.rootLink.stateProperties.NAVIGATION_TYPE = this.prop;				
				return true;
			}			
		}, 		
	}	
}
///перечень всех возможных роутов для данного приложения
///при использовании 	stateSettings: { templateVar - поля first и templatePath можно не указывать т. к. компоненты загружаются из скрипта template.js
var routes = {	
	 ["/"]:  {  
	           routComponent: {			
					router_main: "home",   //компоненты соответствующие данному роуту			
				},
	        },	
	["/"+SITE_NAME+"/"]:  {  
	           routComponent: {			
					router_main: "home",   //компоненты соответствующие данному роуту			
				},
	        },	
     ["/"+SITE_NAME+"/post/:categoryID/:postID/*"]	:{

					routComponent: {			
						router_main: "sections",   //компоненты соответствующие данному роуту			
					},		 
	 },			
	["/"+SITE_NAME+"/contacts/*"]:  {  
	
	           routComponent: {			
					router_main: "contacts",   //компоненты соответствующие данному роуту			
				},
	        }			
}
//добавляет созданные в админке секции к роутам
function addSectionToRoutes(routes, sections){
	
	for(var key in sections){
		
		routes["/"+SITE_NAME+"/"+key+"/*"] = {  //
	
	           routComponent: {
			
					router_main: "sections",   //компоненты соответствующие данному роуту
			
				},
	        }
	}		
}
// т. к. сервер не поддерживает php и node.js создаем страницу на клиенте, сперва загрузив все необходимые данные с сервера.
window.onload = function(){
	
	var currentUrl = window.location.pathname;
	
	var urlArr = currentUrl.split("/");
	
	var HM = "";

	async function add1(){		

		var resp4 = {title: "title", text: "click on page..."};
		
		if(urlArr[2] == "post"){
		    resp4 = await fetch("/"+SITE_NAME+"/dbase/categories/"+urlArr[3]+"/"+urlArr[4]+".txt");
			resp4 = await resp4.json();
		}	
		return resp4
	}	
	add1().then(post => {
		
		//SECTIONS_JS - из файла /dbase/SECTIONS.js
		addSectionToRoutes(routes, SECTIONS_JS);
			
		HM = HTMLixRouter(StateMap, routes);
		
		HM.stateProperties.POST = post;

		console.log(HM);		
		///вызываем данный метод в ручную, т. к.  метод - событие срабатывает автоматически только после дозагрузки шаблонов в fetch запросе асинхронно,
		//приобычной загрузке компонентов или при загрузке их из переменной stateSettings.templateVar (как в данном случае) он не вызовется автоматически
		HM.stateMethods.onLoadAll.call(HM);
		
	});	
	window.onresize = function(){
		
			HM.eventProps["emiter-width-display"].emit();
	}

	
}



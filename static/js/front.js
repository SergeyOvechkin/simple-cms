
const SITE_NAME = "simple-cms"; // имя репозитория на гитхаб

var converter = new showdown.Converter();

var StateMap = {

	menu:{
		arrayProps: [["listen_load_section", "emiter-load-section", ""], ["listen_change_section_in_arr", "emiter-change-section", ""]],
		arrayMethods: {
			
			listen_load_section: function(){
				
				
				var sections = this.emiter.getEventProp();
				
				var sectionNew = [{title: "Home", data: "home"}];
				
				for(var key in sections){
					
					sectionNew.push({title: sections[key].section_title, data: sections[key].section_id});
				}
				sectionNew.push({title: "Контакты", data: "contacts"});
				
				this.component().reuseAll(sectionNew);
				
			},
			listen_change_section_in_arr: function(){
				
				var sect_id = this.emiter.prop;
				
				var historyURL = "/"+SITE_NAME+"/" + sect_id+"/";
		    	if(sect_id == "home")historyURL = "/"+SITE_NAME+"/";
				
				
				this.rootLink.router.setRout(historyURL);
				
				
			}
		},			
		container: "menu_item",
		props: [ "click", "class", "data", "title", ["listen_change_section_in_cont", "emiter-change-section", ""]],
		methods: {
			

			click: function(){
				event.preventDefault();
				
				var sect_id = this.parent.props.data.getProp();
				this.rootLink.eventProps["emiter-change-section"].setEventProp(sect_id);
				
				
				if(sect_id == "home" || sect_id == "contacts"){
										
					return;
				}else{					
					
					this.rootLink.eventProps["emiter-load-categories"].setEventProp(sect_id);
				}

			},
			listen_change_section_in_cont: function(){
				
			
				
				if(this.parent.props.data.getProp() == this.emiter.prop){
					
					this.parent.props.class.setProp("active");
					
				}else{
					this.parent.props.class.removeProp("active");
				}


				

			}

			
		}
		
	},
	page_single: {
		
		container: "page_single",
		props: ["description", "title", ["listen_load_page", "emiter-load-page", ""]],
		methods: {
			
			listen_load_page: function(){
				
				var post = this.emiter.getEventProp();
				
				this.parent.props.title.setProp( post.title);
				
				var text = converter.makeHtml(post.text);
				
				this.parent.props.description.setProp(text);
				
				 colorTagsAndComents(); //tagWraper.js
				
			}			
		}		
	},
	left_menu: {
		
		arrayProps: [ ["listen_load_cat", "emiter-load-categories", ""] ],
		arrayMethods: {
			
			listen_load_cat: function(){
				
				var sectionId = this.emiter.prop;
				
			//	console.log(sectionId);
				
				var sections = this.rootLink.stateProperties.SECTIONS[sectionId].section_categories;
				
				var categ = {};
				
				for(var y=0; y < sections.length; y++){
					
					categ[ sections[y] ] = this.rootLink.stateProperties.CATEGORIES[ sections[y] ]
					
				}
				
				
				var cat_id = this.rootLink.stateProperties.category_id;	

    		    var array = [];
				
				for(var key in categ){
					
					var level_1 = {title: categ[ key ].name, data: categ[ key ].id, post_group: [], simbol: "-", post_group_style: "display: ''"};
					
					if(cat_id[categ[ key ].id] != undefined){
						
						for(var k=0; k < cat_id[categ[ key ].id].length; k++){
						
							level_1.post_group.push({title: cat_id[categ[ key ].id][k].title, data: cat_id[categ[key].id][k].post_id });
						}
					}
				   array.push(level_1);

			     }		
				    //console.log(array);	
			        this.parent.reuseAll(array);
		      },
		},
		container: "left_item_level_1",
		props: ["click", "title", "class", "data", "post_group", "post_group_style", "simbol"],
		methods: {
			
			click: function(){
				
				event.preventDefault();
				
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
			createdContainer(){
				
				if(this.props.post_group.groupArray == undefined){
					

					
					//this.props.post_group.groupArray = this.rootLink.state["left_menu_level_2"];
				}
				
			}
		}

	},
	virtualArrayComponents: {
		
		left_menu_level_2: {
		
			container: "left_item_level_2",
			props: ["click", "title", "class", "data"],
			methods: {
				
				click: function(){
				
						var post_id = this.parent.props.data.getProp();
						var category_id = this.parent.groupParent.parent.props.data.getProp();
						
						var path = "/"+SITE_NAME+"/dbase/categories/"+category_id+"/"+post_id+".txt";
						
						var historyURL = "/"+SITE_NAME+"/post/"+category_id+"/"+post_id;
		    	     				
				        this.rootLink.router.setRout(historyURL);
						
						//console.log(this.rootLink.state["left_menu"].getAll({title: "", simbol: "", post_group: {title: "", data: ""}   }));
						
						
						this.rootLink.stateMethods.fetchAll(path).then((json)=>{  
						
						     this.rootLink.eventProps["emiter-load-page"].setEventProp(json);  
							 
						}); 
				},				
			
			}			
		}
	},
	sections: {
			container: "sections",
			props: [],
			methods: {
				
				
			}
			
	},
	home: {
			container: "home",
			props: [],
			methods: {
				
				
			}
			
	},
	contacts: {
			container: "contacts",
			props: [],
			methods: {
				
				
			}
			
		},
stateMethods: {
	
	
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
		onLoadAll: function(){ //метод событие вызывается после загрузки и создания всех коомпонентов
			
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
			
				}
				this.eventProps["emiter-change-section"].setEventProp(section);	
				
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
		posts_id: "",
		POST: "",
	},
    eventEmiters: {
		
		["emiter-load-categories"]: {prop: ""},
		["emiter-load-page"]: {prop: ""},
		["emiter-load-section"] : {prop: ""},
		["emiter-change-section"] : {prop: ""},
		
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
window.onload = function(){
	

	var currentUrl = window.location.pathname;
	
	var urlArr = currentUrl.split("/");

	var SERVER_DATA = {};
	
	var HM = "";

	async function add1(){		

		let resp1 = await fetch("/"+SITE_NAME+"/dbase/CATEGORIES.txt");
		let resp2 = await fetch("/"+SITE_NAME+"/dbase/category_id.txt");
		let resp3 = await fetch("/"+SITE_NAME+"/dbase/SECTIONS.txt");
		
		var resp4 = {title: "title", text: "click on page..."};
		
		if(urlArr[2] == "post"){
		    resp4 = await fetch("/"+SITE_NAME+"/dbase/categories/"+urlArr[3]+"/"+urlArr[4]+".txt");
			resp4 = await resp4.json();
		}	

		return {cat_all: await	resp1.json(), cat_id: await	resp2.json(), sections: await resp3.json(), post: resp4 };
	}
	
	add1().then(obj => {
		
		SERVER_DATA.CATEGORIES = obj.cat_all;
		SERVER_DATA.category_id = obj.cat_id;
		SERVER_DATA.SECTIONS = obj.sections;
		SERVER_DATA.POST = obj.post;
		
		addSectionToRoutes(routes, SERVER_DATA.SECTIONS);
		
		
		HM = HTMLixRouter(StateMap, routes);
		
		HM.stateProperties = SERVER_DATA;

		console.log(HM);
	});
	

}



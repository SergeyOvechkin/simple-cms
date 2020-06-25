var template = `
<!--------компонент для отображения домашней страници-------------->
<div data-home="container" style="margin-top: 20px;"  class="card" >
  <div class="card-body">
  

    <h2> Htmlix </h2>
		

    <p> <a href="https://github.com/SergeyOvechkin/htmlix">Htmlix</a> - javascript frontend framework основанный на data- свойствах html документа. </p>

    <p>Особенности:</p>
	<ul>
		<li>объектно-ориенитрованный подход построения приложения, наличие структуры и иерархии компонентов, возможность наследования свойств компонентов,</li>
		<li>наличие пользовательских событий для обновления интерфейса и передачи данных между компонентами,</li>
		<li>встраивается в уже отданную сервером страницу, не требует серверного рендеринга,</li>
		<li>возможность строить приложения используя роутер и html шаблоны,</li>
		<li>типизация свойств, сокращает количество используемых методов и уменьшает объем кода требуемого для написания и запоминания.</li>
	</ul>
	
	<p>Примеры приложений на Htmlix:</p> 
	<ul>

		<li><a href="https://github.com/SergeyOvechkin/lesson_2.2/">Прототип SPA интернет магазина</a></li>		
		<li><a href="https://github.com/SergeyOvechkin/tests/">tests - тестовые приложения для фреймворка</a></li>

	</ul>
	
	
	
		
	
  </div>
</div>

<!--------------------компонент для отображения контактов ----------->
<div style="margin-top: 20px;" class="card" data-contacts="container">
  <div class="card-body">
          maksaev.mikhail@inbox.ru
  </div>
</div>


<!-----------компонент для отображения левого меню и выбранного поста-------------->
<div data-sections="container" class="container-fluid" style="margin-top: 10px;">
	    <div class="row">
		
			<div data-sections-left_coll_style="style" class="col-sm-12 col-md-3">
				<section class="categories" >
					<ul data-sections-group_items="group" class="nav flex-column">
					
						<li  class="nav-item" data-item_level_2="container">
							<a  class="nav-link "  href="/api/category/:postId"
							data-item_level_2-click="click"  							 
							data-item_level_2-class="class" 
							data-item_level_2-data="category" 
							
							>   <span data-item_level_2-title="text">
							       пункт меню 1
								</span>
								<span data-item_level_2-simbol="text" style="color: red;">-</span>
							</a>
							<ul data-item_level_2-post_group="group" data-item_level_2-post_group_style="style" class="hover-non">
							
							<li style="display: none;" data-item_level_3="template">
									<a href="#" 
									data-item_level_3-click="click"
									data-item_level_3-title="text"
									data-item_level_3-class="class"
									data-item_level_3-data="postId"
									data-item_level_3-href="href"
									>Строка меню</a>
							</li>
				
							
							</ul>
						</li>

					</ul><!-- end categories="array" -->
				</section>
			</div>
			
			
			<div data-sections-right_coll_class="class" class="col-sm-12 col-md-9" >
			
				<div class="body" data-page_single="container" >
				
					<h1 data-page_single-title="text" class="mb20" style="margin-bottom: 20px;">Htmlix api</h1>
	
					<div data-page_single-description="html" style="margin-bottom: 15px;">
								...
					</div>			
					
				</div><!-- end page_single -->
			</div>	<!-- end router_page -->  			
			
			
			

		</div><!-- row -->
</div><!-- sections -->


<!------ контейнер item_level_2_top для отображения пунктов меню второго уровня при навигации = top_menu-->
<!-- также устанавливаем ему шаблон чтобы записать ссылку на виртуальный массив groupArray группы post_group -->

						<li  class="nav-item" data-item_level_2_top="container">
							<a  class="nav-link "  href="/api/category/:postId"
							data-item_level_2_top-click="click"  							 
							data-item_level_2_top-data="category" 
							
							>   <span data-item_level_2_top-title="text">
							       пункт меню 1
								</span>
								
							</a>
							<ul data-item_level_2_top-post_group="group"  class="hover-non">
							
								<li style="display: none;" data-item_level_3="template">
									<a href="#" 
									data-item_level_3-click="click"
									data-item_level_3-title="text"
									data-item_level_3-class="class"
									data-item_level_3-data="postId"
									data-item_level_3-href="href"
									>Строка меню</a>
							   </li>
				
							
							</ul>
						</li>

`;

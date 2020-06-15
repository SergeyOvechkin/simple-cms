var template = `
<!--------компонент для отображения домашней страници-------------->
<div data-home="container" style="margin-top: 20px;"  class="card" >
  <div class="card-body">
  
  <p style="margin-top: 20px; ">Данный ресурс является одновреммено, демонстрационным сайтом работы <a href="https://github.com/SergeyOvechkin/simple-cms">simple-cms</a>, а также здесь можно почитать api и уроки фреймворка <a href="https://github.com/SergeyOvechkin/htmlix">Htmlix.</a> </p>
  <hr style="margin-top: 20px; margin-bottom: 40px;"> 
  <h2> Simple-cms </h2>
	
	<p><a href="https://github.com/SergeyOvechkin/simple-cms">simple-cms</a> это простая cms использующая в качестве базы данных обычные .txt файлы с содержимым текстом в формате markdown, что позволяет запустить её на любом хостинге, который умеет
	отдавать статические файлы.</p>
	<p>сms - поддерживает создание, редактирование и удаление постов, категорий и разделов. 
	Предназначена в первую очередь для написания учебного материала к проектам на github.
	Позволяет добавлять стили страницам, а также работает в формате SPA что ускоряет загрузку страниц и навигацию по пунктам меню.</p>
	<p>Фронтенд для данного api написан на htmlix, админка работает только на локальном сервере, т.к. написана для создания страниц на github (gh-pages).
	</p>
	<p>Для работы админки локальный сервер должен поддерживать node.js </p>
  	<p><b>Использование в качестве cms на github:</b></p>
	  <ul>
        <li>Для использования в качестве CMS необходимо скачать данный репозиторий, заменить переменную SITE_NAME="simple-cms" на свое название проекта на гитхаб
		в файлах app.js, /static/js/front.js, index.html, 404.html.</li>
		<li>Запустить сервер из папки проекта node app, затем перейти в админку: localhost:3000/admin  и удалить все ненужные категории и разделы, после чего создать новые.</li> 
		<li>Далее сделать commit и выложить в ветку gh-pages своего проекта.</li>
		<li>Страницу Home и Контакты можно отредактировать в файле /static/template/template.html</li>
		<li>В качестве css фреймворка используется bootstrap_4, добавить или отредактировать стили можно в файле /static/css/main.css</li>
       </ul>
	<hr style="margin-top: 40px; margin-bottom: 40px;"> 		   
  
    <h2> Htmlix </h2>
		

    <p> <a href="https://github.com/SergeyOvechkin/htmlix">Htmlix</a> - javascript frontend framework основанный на data- свойствах html документа. </p>

    <p>Особенности:</p>
	<ul>
		<li>объектно-ориенитрованный подход построения приложения, наличие структуры и иерархии компонентов,</li>
		<li>наличие пользовательских событий для обновления интерфейса и передачи данных между компонентами,</li>
		<li>создание приложения после отданной с сервера страници не отнимает время на загрузку компонентов и не требует серверного рендеринга,</li>
		<li>возможность строить приложения используя роутер и html шаблоны,</li>
		<li>типизация свойств, сокращает количество используемых методов и уменьшает объем кода требуемого для написания и запоминания.</li>
	</ul>
	
	<p>Примеры приложений на Htmlix:</p> 
	<ul>
		<li><a href="https://sergeyovechkin.github.io/tests/top-menu/index.html">Навигация для сайта</a></li>
		<li><a href="https://sergeyovechkin.github.io/tests/todo/index.html">Todo mvc</a></li>
		<li><a href="https://github.com/SergeyOvechkin/lesson_2.2/">Прототип SPA интернет магазина</a></li>

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
									>Строка меню</a>
							</li>
				
							
							</ul>
						</li>

					</ul><!-- end categories="array" -->
				</section>
			</div>
			
			
			<div data-sections-right_coll_class="class" class="col-sm-12 col-md-9" >
			
				<div class="body" data-page_single="container" >
				
					<h1 data-page_single-title="text" class="mb20" style="margin-bottom: 20px;">Название страници</h1>
	
					<p data-page_single-description="html" style="margin-bottom: 15px;">
								Описание страници
					</p>			
					
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
									>Строка меню</a>
							   </li>
				
							
							</ul>
						</li>

`;
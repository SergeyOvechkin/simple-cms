
<a href="https://sergeyovechkin.github.io/simple-cms//">Htmlix api в SPA формате</a> 

  <h2> Simple-cms </h2>
  
  	<p>Использование в качестве cms на github</p>
	  <ul>
	    <li><a href="https://github.com/SergeyOvechkin/simple-cms">simple-cms</a> - поддерживает создание, редактирование и удаление постов, категорий и разделов.</li>
		<li>Фронтенд для данного api написан на htmlix, админка работает только на локальном сервере, т.к. написана для создания страниц на github (gh-pages).</li>
        <li>Для использования в качестве CMS необходимо скачать данный репозиторий, заменить переменную SITE_NAME="simple-cms" на свое название проекта на гитхаб
		в файлах app.js, /static/js/front.js, index.html, 404.html.</li>
		<li>Запустить сервер из папки проекта node app, затем перейти в админку: localhost:3000/admin  и удалить все ненужные категории и разделы, после чего создать новые.</li> 
		<li>Далее сделать commit и выложить в ветку gh-pages своего проекта.</li>
		<li>Страницу Home и Контакты можно отредактировать в файле /static/template/template.html</li>
		<li>В качестве css фреймворка используется bootstrap_4, добавить или отредактировать стили можно в файле /static/css/main.css</li>
       </ul>	






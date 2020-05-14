

 function colorTagsAndComents (){
				
			var pre =  document.querySelectorAll("pre");
			
			for(var i=0; i< pre.length; i++){
				
				var text_1 = pre[i].innerHTML;
				
				text_1 = replaceAll(text_1);
				
				pre[i].innerHTML = text_1
				
			}
			function replaceAll(text){
				var newText = 	text.replace(/\/\/.+/g, "<span class='js-comments'>$&</span>");
				newText = newText.replace(/(\s?)(var)(\s)/g, "$1<span class='js-vars'>$2</span>$3");
				newText = newText.replace(/(\s)(=)(\s)/g, "$1<span class='js-vars'>$2</span>$3");
				newText = newText.replace(/(\s)?(:)(\s)/g, "$1<span class='js-vars'>$2</span>$3");
				newText = newText.replace(/(\s)(new)(\s)/g, "$1<span class='js-vars'>$2</span>$3");
				newText = newText.replace(/(\s)(function)(\s)?(\()/g, "$1<span class='js-vars-2'>$2</span>$3$4");
				newText = newText.replace(/(\.)(setProp)(\()/g, "$1<span class='js-vars-2'>$2</span>$3");
				newText = newText.replace(/(\.)(getProp)(\()/g, "$1<span class='js-vars-2'>$2</span>$3");
				newText = newText.replace(/(\.)(removeProp)(\()/g, "$1<span class='js-vars-2'>$2</span>$3");
				newText = newText.replace(/(\.)(parent)(\.)/g, "$1<span class='tag'>$2</span>$3");
				
				newText = newText.replace(/(\s)(console)(\.)/g, "$1<span class='js-vars-2'>$2</span>$3");
				newText = newText.replace(/(\s)(this)(\.)/g, "$1<span class='js-vars-2'>$2</span>$3");
				newText = newText.replace(/(\s)?(&lt;\/div&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;div)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;\/ul&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;ul)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;\/li&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;li)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;\/p&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;p)/g, "$1<span class='tag'>$2</span>");	
				newText = newText.replace(/(\s)?(&lt;\/span&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;span)/g, "$1<span class='tag'>$2</span>");	
				newText = newText.replace(/(\s)?(&lt;\/button&gt;)/g, "$1<span class='js-vars'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;button)/g, "$1<span class='js-vars'>$2</span>");	
				newText = newText.replace(/(\s)?(&lt;\/form&gt;)/g, "$1<span class='js-vars'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;form)/g, "$1<span class='js-vars'>$2</span>");	
				newText = newText.replace(/(\s)?(&lt;\/textarea&gt;)/g, "$1<span class='input-vars'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;textarea)/g, "$1<span class='input-vars'>$2</span>");	
				newText = newText.replace(/(\s)?(&lt;\/nav&gt;)/g, "$1<span class='tag'>$2</span>");
				newText = newText.replace(/(\s)?(&lt;nav)/g, "$1<span class='tag'>$2</span>");	
				//newText = newText.replace(/(\s)(data-)(\S+)(=)/g, "$1$2<span class='data-attr'>$3</span>$4");
				newText = newText.replace(/(\s)(data-)(\w+)(-)?(\w+)?(=)/g, "$1$2<span class='data-main-attr'>$3</span>$4<span class='data-attr'>$5</span>$6");
				newText = newText.replace(/(\s)(&lt;!--)(.+)(--&gt;)/g, "$1<span class='js-comments'>$&</span>");
				
				return newText;	
			}

}
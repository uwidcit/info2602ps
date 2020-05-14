$(document).ready(() => {
	$('#searchForm').on('submit', (e) => {
		var searchText = $('#searchText').val();
		getBooks(searchText);
		e.preventDefault();
	})
});

function getBooks(searchText) {
	$('#preloader').removeClass('hidden');
	axios.get('https://www.googleapis.com/books/v1/volumes?q=' + searchText)
	.then((response) => {
		console.log(response);
		var books = response.data.items;
		var output = '';
		$.each(books, (index, book) => {
			//console.log(book.accessInfo)
			output += "<div class='col-md-3'>";
			output += "<div class='well text-center'>";
			if (book.volumeInfo.imageLinks != undefined) {
				output += "<img src= " + book.volumeInfo.imageLinks.thumbnail + " />";
			} else {
				output += "<img src= 'img/book.jpg' />";
			}
			var book_title =  book.volumeInfo.title.length > 35 ? book.volumeInfo.title.substring(0, 35) + '...' : book.volumeInfo.title;
			output += "<h3 class='text-center'>" + book_title +"</h3>";
			output += "<a class='btn btn-danger' href='#' onclick= bookselected('"+ book.id +"')>View</a>";
			output += "<a class='btn btn-danger href='#' onclick= addbook('"+ book.id +"')>Add</a>";
			output += "</div>";
			output += "</div>";
		});
		$('#preloader').addClass('hidden');
		$('#books').html(output);
	})
	.catch((err) => {
		console.log(err);
	});
}

function bookselected(id) {
	//alert(id)
	sessionStorage.setItem('bookId' , id);
	window.open('book.html', '_blank');
	return false;
}

function getbook() {
	var id = sessionStorage.getItem('bookId');
	axios.get('https://www.googleapis.com/books/v1/volumes/' + id)
	.then((response) => {
		$('#book').removeClass('hidden');
		console.log(response);	
		var info = response.data.volumeInfo;
		var cat = info.categories;
		console.log(cat);
		var authors = info.authors;
		var output = '';
		output += "<div class='row'>"; 
		output += "<div class='col-md-4'>";
		if (info.imageLinks != undefined) {
			output += "<img src= " + info.imageLinks.thumbnail + " /><br/>";
		}
		output += "<a class='btn btn-danger' id='go_button' href='app.html'>Go Back To Search</a>";
		output += "</div>";
		output += "<div class='col-md-8'>";
		output += "<h2><strong>Title:</strong>"+ info.title + "</h2>";
		output += "<h3><strong>SubTitle:</strong>" + info.subtitle + "</h3>";
		output += "<h3>Authors: ";
		for (var i = 0; i < authors.length; i++) {
			output += authors[i] + " ";
		}
		output += "</h3>";
		output += "<ul class='list-group'>";
		output += "<li class='list-group-item'><strong>Categories</strong></li>";
		for (var j = 0; j < cat.length; j++) {
			output += "<li class='list-group-item'>"+ (j+1) + ". " + cat[j] +"</li>";
		}
		output += "</ul>"
		output += "<p><strong>Description:</strong>";
		var dis = info.description.length > 250 ? info.description.substring(0, 250) + '...' : info.description;
		output += dis +  "</p>";
		output += "</div>";
		output += "</div>";
		$('#preloader').addClass('hidden');
		$('#book').html(output);
	})
	.catch((err) => {
		console.log(err);
    });
}
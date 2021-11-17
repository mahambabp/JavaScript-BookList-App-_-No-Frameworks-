//Book Class: Represents a Book
class Book {
  //runs when we instatiate the books
  constructor(title, author, isbn) {
    this.title = title; //take whatever is passed in as parameters
    this.author = author; //assign it to the property of that object
    this.isbn = isbn;
  }
}

//UI CLass: Handle UI tasks
class UI {
  //display books:
  //to avoid instantating the UI class use static
  static displayBooks() {
    
    const books = Store.getBooks();
    //add books to list
    books.forEach((book) => UI.addBookToList(book));
    // remove books from list
    // alert/show alert
  }

  static addBookToList(book) {
    //select list
    const list = document.getElementById("book-list");
    //create a table row/ insert 'tr' tag
    const row = document.createElement("tr");
    //add html in the columns
    row.innerHTML = `
       <td>${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
       <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
    list.appendChild(row);
    
  }

  static deleteBook(el) {
    //pass in target element
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }



  static showAlert(message, className){
      //create element
    const newDiv = document.createElement('div');
      //Add class to it
    newDiv.className=`alert alert-${className}`;
    newDiv.appendChild(document.createTextNode(message));
    //inserting the alert
    const container = document.querySelector('.main-container > .container');
    const form = document.querySelector('#book-form')
    container.insertBefore(newDiv,form);

    //Vanish in 3 seconds
    setTimeout(()=>document.querySelector('.alert').remove(),2000 );

  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }


}

//Store Class: Handles Storage

/* Cant store objects to local storage
has to be a string and when you pull it
out you parse it*/
class Store{
    static getBooks(){
        let books; 
        //check to see if theres a book item in storage
        if(localStorage.getItem('books') === null){
            books = [];
            //else 
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        //get books from local storage
        const books = Store.getBooks();
        //push on whatever is passed in as book
        books.push(book);
        //reset it to local storage and the item we setting
        //is books

        /*local storage is strings, hence need to wrap the array
         of objects with JSON.stringify*/
        localStorage.setItem('books', JSON.stringify(books))

    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books:

//As soon as the DOM loads
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //prevent actual submit
  e.preventDefault();
  //Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert('Please fill in all fields','danger');
  } else {
    //instantiate book
    const book = new Book(title, author, isbn);
    // ADD BOOK to UI
    UI.addBookToList(book);
    //Add Book to store
    Store.addBook(book);
    //Show success message
    UI.showAlert('Book Added', 'success');
    //clear fields
    UI.clearFields();
  }
});




//Event: Remove a Book using event propagation

document.getElementById("book-list").addEventListener("click", (e) => {
  //pass target to a method on a UI
  //remove book from UI
  UI.deleteBook(e.target);

  //remove book from store 
    console.log(Store.removeBook(e.target.parentElement.previousElementSibling.textContent));
      //Show success message
      UI.showAlert('Book Removed', 'warning');
 
});

var filter = document.getElementById("filter"); //get input element
filter.addEventListener("keyup", filterItems); //add event listner


function filterItems(){
  //declare vars
    let input,filter,table,tr,td,i,txtValue;

    input = document.getElementById("filter"); //select input
    filter = input.value.toUpperCase(); //
    tbody = document.getElementById("book-list")
    tr = tbody.getElementsByTagName("tr");


  // Loop through all tbody rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0]; //search by title
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}


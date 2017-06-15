var searchurl = 'https://www.googleapis.com/books/v1/volumes?q='

class Book {

  constructor (volumeInfo) {
    this.title = volumeInfo.title
    this.subtitle = volumeInfo.subtitle
    this.authors = volumeInfo.authors
    this.date = volumeInfo.publishedDate
    this.picture = volumeInfo.imageLinks.thumbnail
    this.isbn = volumeInfo.industryIdentifiers

  }

  render () {
    return (`
      <div class="card">
        <div class="image">
          <img src="${this.picture}">
        </div>
        <div class="content">
          <a class="header">${this.title}</a>
          <div class="meta">
            <span class="date">${this.date}</span>
          </div>
          <div class="description">
            ${this.subtitle}
          </div>
        </div>
        <div class="extra content">
          <a>
            ${this.authors}
          </a>
        </div>
      </div>
    `)
  }
}



class BookList {

  constructor () {
    this.adapter = new googleBooksAdapter()
    this.booklist = []
    this.listContainer = document.querySelector('#books-list')

  }

  search (text) {
    this.adapter.searchBooks(text)
      .then(r => r.json())
      .then(r => this.booklist = r.items)   
      .then(this.createBooks.bind(this))
      .then(this.render.bind(this))
  }

  createBooks () {
    this.booklist = this.booklist.map(book => new Book(book.volumeInfo))
  }

  render () {
    this.listContainer.innerHTML = this.booklist.map(book => book.render()).join('')
  }

}


class App {

  constructor () {
    this.searchIcon = document.querySelector('#searchIcon')
    this.searchBar = document.querySelector('#searchBar')
    this.bookList = new BookList()
    this.searchIcon.addEventListener('click', () => {
      this.bookList.search(this.searchBar.value)
      this.searchBar.value = ""
    })
    document.addEventListener('keydown', (e) => {
      if (e.which === 13 || e.detail === 13) {
        this.bookList.search(this.searchBar.value)
        this.searchBar.value = ""
      }
    })
  }

  render () {
    this.bookList.render()
  }

}



class googleBooksAdapter {
  constructor () {
    this.base_uri = 'https://www.googleapis.com/books/v1/volumes'
    this.search_uri = this.base_uri + '?q='
    this.index = 0
  }
  getVolumes (index) {

  }
  searchBooks (text) {
    return fetch(this.search_uri + text)
  }
}

const app = new App()
app.render()
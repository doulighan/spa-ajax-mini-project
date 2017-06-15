var searchurl = 'https://www.googleapis.com/books/v1/volumes?q='

class Book {

  constructor (volumeInfo) {
    this.title = volumeInfo.title || 'Title not available'
    this.subtitle = volumeInfo.subtitle || 'Subtitle not available'
    this.authors = volumeInfo.authors || 'Author not available'
    this.date = volumeInfo.publishedDate || 'Date not available'
    this.picture = volumeInfo.imageLinks || {thumnail: 'http://www.freeiconspng.com/uploads/no-image-icon-23.jpg'}
    this.isbn = volumeInfo.industryIdentifiers || 'ISBN not available'
    this.info = volumeInfo.infoLink
  }

  render () {
    return (`
      <div class="card">
        <div class="blurring dimmable image">
          <div class="ui dimmer">
            <div class="content">
              <div class="center">
                <div class="ui inverted button"><a href="${this.info}" target="_blank">View Info</a></div>
              </div>
            </div>
          </div>
          <img src="${this.picture.thumbnail}">
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
          <i class='bookmark icon'></i>
          <a>
            ${this.authors}
          </a>
        </div>
      </div>
    `)
  }
}



class BookList {

  constructor (adapter) {
    this.adapter = adapter
    this.booklist = []
    this.savedList = []
    this.listContainer = document.querySelector('#books-list')
    this.next = document.getElementById('next')
    this.back = document.getElementById('back')
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

  renderSaved () {
    var uniqSave = [...new Set(this.savedList)]
    this.listContainer.innerHTML = uniqSave.map( (html) => {
      return `<div class="card">${html}</div>`
    }).join('')
  }

  render () {
    if (this.booklist.length < 10) {
      this.next.style.display = 'none'
    } else {
      this.next.style.display = 'inline-block'
    }
    if (this.adapter.index === 0) {
      this.back.style.display = 'none'
    } else {
      this.back.style.display = 'inline-block'
    }
    this.listContainer.innerHTML = this.booklist.map(book => book.render()).join('')
    $('.special.cards .image').dimmer({
      on: 'hover'
    })
  }

}


class App {

  constructor (adapter) {
    this.adapter = adapter
    this.searchIcon = document.querySelector('#searchIcon')
    this.searchBar = document.querySelector('#searchBar')
    this.currentSearch
    this.bookList = new BookList(this.adapter)
    this.back = document.querySelector('#back')
    this.next = document.querySelector('#next')
    this.searchIcon.addEventListener('click', () => {
      this.currentSearch = this.searchBar.value
      this.bookList.search(this.currentSearch)
      this.searchBar.value = ""
    })
    this.back.addEventListener('click', () => {
      this.adapter.index -= 10
      this.bookList.search(this.currentSearch)
    })
    this.next.addEventListener('click', () => {
      this.adapter.index += 10
      this.bookList.search(this.currentSearch)
    })
    document.addEventListener('keydown', (e) => {
      if (e.which === 13 || e.detail === 13) {
        this.currentSearch = this.searchBar.value
        this.bookList.search(this.currentSearch)
        this.searchBar.value = ""
      }
    })
  }

  render () {
    this.bookList.render()
  }

}



class GoogleBooksAdapter {
  constructor () {
    this.index = 0
    this.base_uri = 'https://www.googleapis.com/books/v1/volumes'
    this.search_uri = this.base_uri + '?q='
  }



  searchBooks (text) {
    return fetch(this.search_uri + text + '&startIndex=' + this.index)
  }

  changeIndex(n) {
    this.index += n
  }
}


var adapter = new GoogleBooksAdapter()
const app = new App(adapter)
app.render()
document.getElementById('books-list').addEventListener("click", (e) => {
  target = e.target 
  if (target.className === 'bookmark icon') {
    target.classList.add('big', 'loading', 'purple')
    app.bookList.savedList.push(target.parentNode.parentNode.innerHTML)
  }
})

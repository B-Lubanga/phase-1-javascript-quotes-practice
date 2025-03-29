document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    // Fetch and display the quotes on page load
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quoteList.innerHTML = '';  // Clear the current list of quotes
  
          quotes.forEach(quote => {
            const li = document.createElement('li');
            li.classList.add('quote-card');
            li.innerHTML = `
              <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn btn-success like-button' data-id="${quote.id}">
                  Likes: <span>${quote.likes.length}</span>
                </button>
                <button class='btn btn-danger delete-button' data-id="${quote.id}">
                  Delete
                </button>
              </blockquote>
            `;
            quoteList.appendChild(li);
          });
  
          addEventListeners();
        })
        .catch(error => console.error('Error fetching quotes:', error));
    }
  
    // Add event listeners for like and delete buttons
    function addEventListeners() {
      // Like button functionality
      document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', likeQuote);
      });
  
      // Delete button functionality
      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteQuote);
      });
    }
  
    // Like a quote
    function likeQuote(event) {
      const quoteId = event.target.getAttribute('data-id');
  
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: parseInt(quoteId),
          createdAt: Math.floor(Date.now() / 1000)  // Optional: track when the like was created
        })
      })
        .then(response => response.json())
        .then(() => {
          fetchQuotes();  // Refresh the list after liking the quote
        })
        .catch(error => console.error('Error liking quote:', error));
    }
  
    // Delete a quote
    function deleteQuote(event) {
      const quoteId = event.target.getAttribute('data-id');
  
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
      })
        .then(() => {
          fetchQuotes();  // Refresh the list after deleting the quote
        })
        .catch(error => console.error('Error deleting quote:', error));
    }
  
    // Add a new quote
    newQuoteForm.addEventListener('submit', event => {
      event.preventDefault();
  
      const quoteText = document.getElementById('new-quote').value;
      const authorName = document.getElementById('author').value;
  
      const newQuote = {
        quote: quoteText,
        author: authorName
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      })
        .then(() => {
          fetchQuotes();  // Refresh the list after adding a new quote
        })
        .catch(error => console.error('Error adding new quote:', error));
  
      newQuoteForm.reset();  // Reset the form inputs
    });
  
    // Initial call to fetch and display the quotes
    fetchQuotes();
  });
  
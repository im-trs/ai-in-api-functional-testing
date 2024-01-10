Feature: Book Catalogue API
As a user interacting with the Book Catalogue API
I want to manage my collection of books effectively
So that I can maintain a comprehensive library

Scenario: Get a list of all books
Given I am authenticated and authorized
When I send GET request to "/api/books"
Then I receive HTTP status code 200
And the response body contains valid JSON array schema

Scenario: Add a new book
Given I am authenticated and authorized
When I send POST request to "/api/books" with valid payload
Then I receive HTTP status code 201
And the response body contains valid "Book" object schema

Scenario: Fetch details about a specific book
Given I am authenticated and authorized
When I send GET request to "/api/books/{bookId}" with valid integer value for "{bookId}" parameter
Then I receive HTTP status code 200
And the response body contains valid "Book" object schema

Scenario: Delete a specific book
Given I am authenticated and authorized
When I send DELETE request to "/api/books/{bookId}" with valid integer value for "{bookId}" parameter
Then I receive HTTP status code 204

Scenario: Handle invalid book ID while deleting
Given I am authenticated and authorized
When I send DELETE request to "/api/books/{bookId}" with non-existing integer value for "{bookId}" parameter
Then I receive HTTP status code 404

Scenario: Handle missing book during retrieval
Given I am authenticated and authorized
When I send GET request to "/api/books/{bookId}" with non-existing integer value for "{bookId}" parameter
Then I receive HTTP status code 404
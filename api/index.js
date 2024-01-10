import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

// Load books.json
let books = [];
try {
    const rawdata = fs.readFileSync('books.json');
    books = JSON.parse(rawdata);
} catch (err) {
    console.error(`Error reading or parsing 'books.json': ${err}`);
}

const app = express();
app.use(bodyParser.json());

// Define endpoints
app.get('/api', (req, res) => {
    res.send({message: 'Welcome to our Book Catalogue!'});
});

app.get('/api/books/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const requestedBook = books.find(({id}) => id === bookId);

    if (!requestedBook) {
        return res.status(404).send({error: 'Book not found.'});
    }

    res.send(requestedBook);
});

app.post('/api/books', (req, res) => {
    const newBook = req.body;
    if (!newBook || !newBook.title || !newBook.author) {
        return res.status(400).send({error: 'Missing title or author'});
    }
    newBook.id = Math.floor(Math.random() * 1000); // Generate random ID
    books.push(newBook);
    saveBooksToJson();
    res.status(201).send(newBook);
});

app.delete('/api/books/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const index = books.findIndex(({id}) => id === bookId);
    if (index < 0) {
        return res.status(404).send({error: 'Book not found'});
    }
    books.splice(index, 1);
    saveBooksToJson();
    res.status(204).end();
});

function saveBooksToJson() {
    try {
        fs.writeFileSync('books.json', JSON.stringify(books));
    } catch (err) {
        console.error(`Error writing to 'books.json': ${err}`);
    }
}

// Setup Swagger UI
const SWAGGER_DOC = {
    openapi: '3.0.0', info: {
        version: '1.0.0', title: 'Book Catalogue API', description: 'An example API for managing a list of books.',
    }, servers: [{url: '/'}], paths: {
        '/api/books': {
            get: {
                summary: 'Get a list of all books', tags: ['Book'], responses: {
                    200: {
                        description: 'A list of books', content: {
                            'application/json': {
                                schema: {
                                    type: 'array', items: {$ref: '#/components/schemas/Book'},
                                },
                            },
                        },
                    },
                },
            }, post: {
                summary: 'Add a new book', requestBody: {
                    required: true, content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/NewBook',
                            },
                        },
                    },
                }, responses: {
                    201: {
                        description: 'Created', content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Book',
                                },
                            },
                        },
                    },
                },
            },
        }, '/api/books/{bookId}': {
            get: {
                summary: 'Fetch details about a specific book', parameters: [{
                    name: 'bookId', in: 'path', description: 'ID of the book to fetch', required: true, schema: {
                        type: 'integer',
                    },
                },], responses: {
                    200: {
                        description: 'Details of the specified book', content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Book',
                                },
                            },
                        },
                    }, 404: {
                        description: 'Book not found',
                    },
                },
            }, delete: {
                summary: 'Delete a specific book', parameters: [{
                    name: 'bookId', in: 'path', description: 'ID of the book to delete', required: true, schema: {
                        type: 'integer',
                    },
                },], responses: {
                    204: {
                        description: 'Deleted successfully',
                    }, 404: {
                        description: 'Book not found',
                    },
                },
            },
        },
    }, components: {
        schemas: {
            Book: {
                type: 'object', properties: {
                    id: {
                        type: 'integer',
                    }, title: {
                        type: 'string',
                    }, author: {
                        type: 'string',
                    },
                },
            }, NewBook: {
                type: 'object', properties: {
                    title: {
                        type: 'string',
                    }, author: {
                        type: 'string',
                    },
                }, required: ['title', 'author'],
            },
        },
    },
};

app.get("/api-docs/swagger.json", (req, res) => res.json(SWAGGER_DOC));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOC));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
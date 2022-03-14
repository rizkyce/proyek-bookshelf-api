const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else {
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }

  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// const getAllBooksHandler = () => ({
//   status: "success",
//   data: {
//     books: books.map((book) => ({
//       id: book.id,
//       name: book.name,
//       publisher: book.publisher,
//     })),
//   },
// });

// eslint-disable-next-line consistent-return
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const booksName = books
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      // eslint-disable-next-line arrow-body-style
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        };
      });
    const response = h.response({
      status: "success",
      data: {
        books: booksName,
      },
    });
    response.code(200);
    return response;
  }
  if (reading !== undefined) {
    let booksReading = [];
    if (reading === "0") {
      booksReading = books
        .filter((book) => book.reading === false)
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        });
    } else if (reading === "1") {
      booksReading = books
        .filter((book) => book.reading === true)
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        });
    } else {
      booksReading = [...books];
    }
    const response = h.response({
      status: "success",
      data: {
        books: booksReading,
      },
    });
    response.code(200);
    return response;
  }
  if (finished !== undefined) {
    let booksFinished = [];
    if (finished === "0") {
      booksFinished = books
        .filter((book) => book.finished === false)
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        });
    } else if (finished === "1") {
      booksFinished = books
        .filter((book) => book.finished === true)
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        });
    } else {
      booksFinished = [...books];
    }
    const response = h.response({
      status: "success",
      data: {
        books: [...booksFinished],
      },
    });
    response.code(200);
    return response;
  }

  // eslint-disable-next-line arrow-body-style
  const bookShelf = books.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  const response = h.response({
    status: "success",
    data: {
      books: bookShelf,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else {
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };

      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return {
      status: "success",
      message: "Buku berhasil dihapus",
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

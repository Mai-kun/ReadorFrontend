// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookRegistry {
    struct Book {
        uint256 id;
        string title;
        string fileHash;
    }
    
    // Хранилище книг
    Book[] public books;
    
    // Счетчик книг
    uint256 public bookCount;
    
    // Событие добавления книги
    event BookAdded(uint256 id, string title, string fileHash);

    // Добавление новой книги
    function addBook(
        uint256 _id, 
        string memory _title, 
        string memory _fileHash
    ) public {
        books.push(Book(_id, _title, _fileHash));
        bookCount++;
        emit BookAdded(_id, _title, _fileHash);
    }

    // Получение книги по ID
    function getBook(uint256 _id) public view returns (
        uint256, 
        string memory, 
        string memory
    ) {
        require(_id < books.length, "Book does not exist");
        Book memory book = books[_id];
        return (book.id, book.title, book.fileHash);
    }
}
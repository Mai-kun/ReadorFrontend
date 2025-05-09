export default function BookCard({ book, showActions }) {
    return (
        <div className="book-card">
            <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="book-cover"
            />
            <div className="book-details">
                <h3>{book.title}</h3>
                <div className="book-meta">
          <span className="upload-date">
            {new Date(book.uploadDate).toLocaleDateString()}
          </span>
                    {showActions && (
                        <div className="book-actions">
                            <button className="btn-edit">Edit</button>
                            <button className="btn-delete">Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
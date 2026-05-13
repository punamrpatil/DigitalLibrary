package com.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@SpringBootApplication
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class DigitalLibraryApplication {
    
    private static Map<Long, Book> books = new ConcurrentHashMap<>();
    private static AtomicLong nextId = new AtomicLong(1);
    
    public static void main(String[] args) {
        SpringApplication.run(DigitalLibraryApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("?? DIGITAL LIBRARY BACKEND IS RUNNING!");
        System.out.println("========================================");
        System.out.println("API URL: http://localhost:8080/api/books");
        System.out.println("========================================\n");
        
        // Add sample books
        addSampleBook("Spring Boot in Action", "Craig Walls", "Technology", 5);
        addSampleBook("Clean Code", "Robert Martin", "Programming", 3);
        addSampleBook("The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 2);
        addSampleBook("1984", "George Orwell", "Fiction", 4);
        addSampleBook("Atomic Habits", "James Clear", "Self Development", 7);
        
        System.out.println("? Loaded " + books.size() + " sample books");
    }
    
    static void addSampleBook(String title, String author, String category, int copies) {
        Book book = new Book(nextId.getAndIncrement(), title, author, category, copies);
        books.put(book.getId(), book);
    }
    
    @GetMapping
    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }
    
    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return books.get(id);
    }
    
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        book.setId(nextId.getAndIncrement());
        book.setAvailableCopies(book.getTotalCopies());
        books.put(book.getId(), book);
        return book;
    }
    
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        book.setId(id);
        books.put(id, book);
        return book;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, String> deleteBook(@PathVariable Long id) {
        books.remove(id);
        return Map.of("message", "Book deleted");
    }
    
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String q) {
        return books.values().stream()
            .filter(b -> b.getTitle().toLowerCase().contains(q.toLowerCase()) ||
                        b.getAuthor().toLowerCase().contains(q.toLowerCase()))
            .toList();
    }
    
    // Inner Book class
    static class Book {
        private Long id;
        private String title;
        private String author;
        private String category;
        private Integer totalCopies;
        private Integer availableCopies;
        
        public Book() {}
        
        public Book(Long id, String title, String author, String category, Integer totalCopies) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.category = category;
            this.totalCopies = totalCopies;
            this.availableCopies = totalCopies;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getTotalCopies() { return totalCopies; }
        public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }
        public Integer getAvailableCopies() { return availableCopies; }
        public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }
    }
}

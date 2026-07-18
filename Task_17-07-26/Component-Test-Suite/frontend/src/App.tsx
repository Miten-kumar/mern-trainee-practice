import { useState } from "react";
import "./App.css";

import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import SearchBar from "./components/SearchBar";
import TodoItem from "./components/TodoItem";
import ProductCard from "./components/ProductCard";

function App() {
  const [searchValue, setSearchValue] = useState("");

  const handleLogin = (email: string, password: string) => {
    alert(`Login Successful!\nEmail: ${email}`);
    console.log(email, password);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleDelete = () => {
    alert("Todo Deleted Successfully");
  };

  const handleAddToCart = () => {
    alert("Product Added To Cart");
  };

  return (
    <div className="app">
      <h1 className="title">
        Component Test Suite Demo
      </h1>

      {/* Login Form */}
      <section className="card">
        <h2>1. Login Form</h2>

        <LoginForm onSubmit={handleLogin} />
      </section>

      {/* User List */}
      <section className="card">
        <h2>2. User List (Async Data Fetching)</h2>

        <UserList />
      </section>

      {/* Search Bar */}
      <section className="card">
        <h2>3. Search Bar</h2>

        <SearchBar onSearch={handleSearch} />

        <p className="search-result">
          <strong>Search Value:</strong>{" "}
          {searchValue || "No Search"}
        </p>
      </section>

      {/* Todo Item */}
      <section className="card">
        <h2>4. Todo Item</h2>

        <TodoItem
          text="Complete Component Testing Assignment"
          onDelete={handleDelete}
        />
      </section>

      {/* Product Card */}
      <section className="card">
        <h2>5. Product Card</h2>

        <ProductCard
          title="Apple iPhone 15 Pro"
          price={999}
          inStock={true}
          image="https://picsum.photos/300"
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}

export default App;
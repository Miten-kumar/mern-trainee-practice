import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ProductCard from "../components/ProductCard";

describe("ProductCard", () => {
  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  const renderComponent = (
    inStock = true,
    image = "https://picsum.photos/300"
  ) =>
    render(
      <ProductCard
        title="Apple iPhone 15 Pro"
        price={999}
        inStock={inStock}
        image={image}
        onAddToCart={mockOnAddToCart}
      />
    );

  test("renders product title", () => {
    renderComponent();

    expect(
      screen.getByText("Apple iPhone 15 Pro")
    ).toBeInTheDocument();
  });

  test("renders product price", () => {
    renderComponent();

    expect(screen.getByText("$999")).toBeInTheDocument();
  });

  test("renders product image", () => {
    renderComponent();

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://picsum.photos/300"
    );
  });

  test("renders In Stock text", () => {
    renderComponent(true);

    expect(
      screen.getByText("In Stock")
    ).toBeInTheDocument();
  });

  test("renders Add To Cart button", () => {
    renderComponent(true);

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeInTheDocument();
  });

  test("calls onAddToCart when button is clicked", async () => {
    const user = userEvent.setup();

    renderComponent(true);

    await user.click(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    );

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test("renders Out Of Stock text", () => {
    renderComponent(false);

    expect(
      screen.getByText("Out Of Stock")
    ).toBeInTheDocument();
  });

  test("disables button when product is out of stock", () => {
    renderComponent(false);

    const button = screen.getByRole("button", {
      name: /unavailable/i,
    });

    expect(button).toBeDisabled();
  });

  test("does not call onAddToCart when out of stock", async () => {
    const user = userEvent.setup();

    renderComponent(false);

    const button = screen.getByRole("button", {
      name: /unavailable/i,
    });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(mockOnAddToCart).not.toHaveBeenCalled();
  });

  test("uses fallback image when image prop is empty", () => {
    renderComponent(true, "");

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute(
      "src",
      "https://picsum.photos/300"
    );
  });

  test("renders price zero correctly", () => {
    render(
      <ProductCard
        title="Free Product"
        price={0}
        inStock={true}
        image="https://picsum.photos/300"
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  test("renders long product title", () => {
    const longTitle =
      "Apple MacBook Pro M4 Max 64GB RAM 2TB SSD Space Black";

    render(
      <ProductCard
        title={longTitle}
        price={3999}
        inStock={true}
        image="https://picsum.photos/300"
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test("button is enabled when product is in stock", () => {
    renderComponent(true);

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeEnabled();
  });
});
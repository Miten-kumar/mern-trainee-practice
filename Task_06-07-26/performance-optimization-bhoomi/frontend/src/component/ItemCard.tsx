import React from "react";

interface ItemProps {
  id: number;
  name: string;
  category: string;
  price: number;
}

const ItemCard: React.FC<ItemProps> = ({
  id,
  name,
  category,
  price,
}) => {
  console.log("Rendering Item:", id);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        margin: "8px",
        borderRadius: "8px",
      }}
    >
      <h3>{name}</h3>
      <p>Category: {category}</p>
      <p>Price: ₹{price}</p>
    </div>
  );
};

export default React.memo(ItemCard);
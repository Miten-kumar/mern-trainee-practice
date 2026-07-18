import { useState } from "react";

interface Props {
  text: string;
  onDelete: () => void;
}

export default function TodoItem({
  text,
  onDelete,
}: Props) {
  const [completed, setCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [todoText, setTodoText] = useState(text);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => setCompleted(!completed)}
      />

      {isEditing ? (
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      ) : (
        <span
          style={{
            textDecoration: completed
              ? "line-through"
              : "none",
          }}
        >
          {todoText}
        </span>
      )}

      {isEditing ? (
        <button onClick={handleSave}>
          Save
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      )}

      <button onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
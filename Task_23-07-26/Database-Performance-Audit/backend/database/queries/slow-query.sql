-- Slow Query 1
-- Problem: No index on user_id

SELECT 
    *
FROM 
    "Order"
WHERE 
    user_id = 10;



-- Slow Query 2
-- Problem: Sorting large data without index

SELECT
    *
FROM
    "Order"
ORDER BY
    created_at DESC;



-- Slow Query 3
-- Problem: Searching user by email without index

SELECT
    *
FROM
    "User"
WHERE
    email = 'test@gmail.com';
-- Optimized Query 1

SELECT
    *
FROM
    "Order"
WHERE
    user_id = 10;



-- Optimized Query 2

SELECT
    *
FROM
    "Order"
ORDER BY
    created_at DESC;



-- Optimized Query 3

SELECT
    *
FROM
    "User"
WHERE
    email='test@gmail.com';
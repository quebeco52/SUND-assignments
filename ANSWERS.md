# Assignment Answers

## Exercise 1

## Step 3

The schema that stopped it was PizzaSchema. TypeScript type checking happens at compile time, whereas Zod performs runtime data validation on actual values as the code executes.

## Step 5

It belongs in pizzashop.integration.test.ts. This is because `orderPizza` is an orchestrator function, making it an integration test.



## Exercise 2


The bug was a typo in the error message: `"cutomer"` instead of `"customer"`.

It shows that just checking if code throws isn't enough. You need to test the exact message, otherwise typos or completely wrong errors can slip through.



## Exercise 3

In JavaScript and Vitest, `toBe` checks referential identity, `toEqual` performs deep equality inspection.




## Exercise 5


Yes, a single test run can pass by luck

To make the test more trustworthy we could mock up math.random, so it is not random



## Exercise 6

Errors automatically go up through the call stack. When an inner function like checkOutBook throws, it travels up to borrowBook and halts execution unless caught.


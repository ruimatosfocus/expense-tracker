using System;
using System.Linq;
using System.Collections.Generic;
using BCrypt.Net;

public static class SeedData
{
    public static void Seed(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        // Seed Users
        if (!context.Users.Any())
        {
            context.Users.AddRange(new List<User>
            {
                new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    Email = "admin@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("teste123")
                },
            });
            context.SaveChanges();

        }

        // Seed Expense Categories
        if (!context.ExpenseCategories.Any())
        {
            context.ExpenseCategories.AddRange(new List<ExpenseCategory>
            {
                new ExpenseCategory { Id = Guid.NewGuid(), Name = "Supermarket" },
                new ExpenseCategory { Id = Guid.NewGuid(), Name = "Transport" },
                new ExpenseCategory { Id = Guid.NewGuid(), Name = "Restaurants" }
            });

            context.SaveChanges(); // Save Users to the database
        }

        // Seed Expenses
        if (!context.Expenses.Any())
        {
            context.Expenses.AddRange(new List<Expense>
            {
                new Expense
                {
                    Id = Guid.NewGuid(),
                    Description = "Groceries",
                    Amount = 50.25m,
                    PaymentMethod = PaymentMethod.Card,
                    UserId = context.Users.First().Id,
                    ExpenseCategoryId = context.ExpenseCategories.First().Id,
                    Created = DateTime.UtcNow,
                    LastModified = DateTime.UtcNow
                },
                new Expense
                {
                    Id = Guid.NewGuid(),
                    Description = "Bus ticket",
                    Amount = 2.75m,
                    PaymentMethod = PaymentMethod.Cash,
                    UserId = context.Users.First().Id,
                    ExpenseCategoryId = context.ExpenseCategories.Skip(1).First().Id,
                    Created = DateTime.UtcNow,
                    LastModified = DateTime.UtcNow
                }
            });
        }

        context.SaveChanges();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum PaymentMethod
{
    Card,
    Cash,
    Crypto
}


public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime Created { get; set; }

    [Required]
    public DateTime LastModified { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    [Required]
    public string Description { get; set; }

    // Foreign Key for User
    public Guid UserId { get; set; }
    public User User { get; set; }

    // Foreign Key for ExpenseCategory
    public Guid ExpenseCategoryId { get; set; }
    public ExpenseCategory ExpenseCategory { get; set; }
}

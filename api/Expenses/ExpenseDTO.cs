using System.ComponentModel.DataAnnotations;

public class ExpenseDto
{
    public Guid Id { get; set; }
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string PaymentMethod { get; set; }
    [Required]
    public CategoryDTO Category { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateExpenseDTO
{
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string PaymentMethod { get; set; }
    [Required]
    public Guid Category { get; set; }
}

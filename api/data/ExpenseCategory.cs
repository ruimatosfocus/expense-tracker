using System.ComponentModel.DataAnnotations;

public class ExpenseCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}

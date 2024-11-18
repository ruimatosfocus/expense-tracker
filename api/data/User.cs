using System.ComponentModel.DataAnnotations;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "Username is required.")]
    [StringLength(25, ErrorMessage = "Username must not exceed 25 characters.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; } // Store hashed password

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

}

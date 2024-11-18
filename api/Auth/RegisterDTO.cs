using System.ComponentModel.DataAnnotations;

public record RegisterUserDto(
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, ErrorMessage = "Username must not exceed 25 characters.")]
    string Username,

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    string Email,

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    string Password
);
// File: /Controllers/AuthController.cs
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class RefreshTokenDTO
{
    public string RefreshToken { get; set; } = string.Empty;
}

public record TokenResponse(string AccessToken, string RefreshToken);


[ApiController]
[Route("/api")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto userDto)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
        {
            return BadRequest(new { error = "EmailAlreadyExists", message = "This email is already registered." });
        }

        // Hash the password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        // Create a new user
        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            PasswordHash = hashedPassword
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful!" });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginDto loginDto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return BadRequest(new { message = "Invalid credentials" });
        }

        var accessToken = _jwtTokenService.GenerateToken(user.Id, user.Username);
        var refreshToken = _jwtTokenService.GenerateRefreshToken(user.Id, user.Username);
        return Ok(new TokenResponse(accessToken, refreshToken));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public IActionResult Refresh([FromBody] RefreshTokenDTO refreshToken)
    {
        // Validate the refresh token
        var principal = _jwtTokenService.ValidateRefreshToken(refreshToken.RefreshToken);
        if (principal == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        // Extract claims from the validated refresh token
        var userId = Guid.Parse(principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value);
        var username = principal.FindFirst(JwtRegisteredClaimNames.UniqueName)?.Value;

        // Generate new tokens
        var newAccessToken = _jwtTokenService.GenerateToken(userId, username);
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken(userId, username);

        return Ok(new TokenResponse(newAccessToken, newRefreshToken));
    }
}

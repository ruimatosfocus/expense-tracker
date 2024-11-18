
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/expenses")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExpensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetExpenses()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var expenses = _context.Expenses
            .Where(e => e.UserId == userId)
            .Include(e => e.ExpenseCategory)
            .Select(e => new ExpenseDto
            {
                Id = e.Id,
                Amount = e.Amount,
                Description = e.Description,
                PaymentMethod = e.PaymentMethod.ToString(),
                Category = new CategoryDTO(e.ExpenseCategory.Id, e.ExpenseCategory.Name),
                Created = e.Created,
                LastModified = e.LastModified
            })
            .ToList();

        return Ok(expenses);
    }

    [HttpGet("pie")]
    public IActionResult GetPieChartData()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var pieChartData = _context.Expenses
            .Where(e => e.UserId == userId)
            .GroupBy(e => e.ExpenseCategory.Name)
            .Select(g => new
            {
                Category = g.Key,
                TotalAmount = g.Sum(e => e.Amount)
            })
            .ToList();

        return Ok(pieChartData);
    }

    [HttpGet("{id}")]
    public IActionResult GetExpense(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var expense = _context.Expenses.FirstOrDefault(e => e.Id == id && e.UserId == userId);
        if (expense == null) return NotFound();

        return Ok(expense);
    }

    [HttpPost]
    public IActionResult CreateExpense([FromBody] CreateExpenseDTO createExpenseDTO)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        if (!Enum.TryParse<PaymentMethod>(createExpenseDTO.PaymentMethod, true, out var paymentMethod))
        {
            return BadRequest(new { error = "Invalid payment method" });
        }

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Amount = createExpenseDTO.Amount,
            Description = createExpenseDTO.Description,
            PaymentMethod = paymentMethod,
            ExpenseCategoryId = createExpenseDTO.Category,
            UserId = userId.Value,
            Created = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateExpense(Guid id, [FromBody] ExpenseDto updatedExpense)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var expense = _context.Expenses.FirstOrDefault(e => e.Id == id && e.UserId == userId);
        if (expense == null) return NotFound();

        expense.Description = updatedExpense.Description;
        expense.Amount = updatedExpense.Amount;

        // Convert PaymentMethod string to enum
        if (!Enum.TryParse<PaymentMethod>(updatedExpense.PaymentMethod, true, out var paymentMethod))
        {
            return BadRequest(new { message = "Invalid payment method value." });
        }
        expense.PaymentMethod = paymentMethod;

        expense.ExpenseCategoryId = updatedExpense.Category.Id;
        expense.LastModified = DateTime.UtcNow;

        _context.SaveChanges();

        return NoContent();
    }

    // Delete an expense
    [HttpDelete("{id}")]
    public IActionResult DeleteExpense(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var expense = _context.Expenses.FirstOrDefault(e => e.Id == id && e.UserId == userId);
        if (expense == null) return NotFound();

        _context.Expenses.Remove(expense);
        _context.SaveChanges();

        return NoContent();
    }

    private Guid? GetUserId()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return null;

        return Guid.Parse(userIdClaim.Value);
    }

}
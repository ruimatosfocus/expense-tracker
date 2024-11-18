using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetCategories()
    {
        var categories = _context.ExpenseCategories
            .Select(c => new CategoryDTO(c.Id, c.Name))
            .ToList();

        return Ok(categories);
    }
}

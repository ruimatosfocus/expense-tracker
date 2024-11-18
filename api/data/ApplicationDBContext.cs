using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<ExpenseCategory> ExpenseCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User - Expenses relationship
        modelBuilder.Entity<Expense>()
            .HasOne(e => e.User)
            .WithMany(u => u.Expenses)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ExpenseCategory - Expenses relationship
        modelBuilder.Entity<Expense>()
            .HasOne(e => e.ExpenseCategory)
            .WithMany(ec => ec.Expenses)
            .HasForeignKey(e => e.ExpenseCategoryId);

        //save payment method as string instead of intenger
        modelBuilder.Entity<Expense>()
        .Property(e => e.PaymentMethod)
        .HasConversion<string>();

        // Configure UUID for all primary keys
        modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .HasColumnType("uuid")
        .ValueGeneratedNever();

        modelBuilder.Entity<Expense>()
            .Property(e => e.Id)
            .HasColumnType("uuid")
        .ValueGeneratedNever();

        modelBuilder.Entity<ExpenseCategory>()
            .Property(c => c.Id)
            .HasColumnType("uuid")
        .ValueGeneratedNever();
    }
}

namespace Reviews.Models.Dto;

public class UserDto
{
    public string Email { get; set; } = default!;
    public Guid Id { get; set; }
    public string UserName { get; set; } = default!;
}
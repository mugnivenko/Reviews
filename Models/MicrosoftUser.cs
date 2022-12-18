
namespace Reviews.Models;

public class MicrosoftUser
{
    public string DisplayName { get; set; } = default!;
    public string Surname { get; set; } = default!;
    public string GivenName { get; set; } = default!;
    public string Id { get; set; } = default!;
    public string UserPrincipalName { get; set; } = default!;
}
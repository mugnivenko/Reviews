using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class CredentialsDto
{

    [Required]
    [DataType(DataType.Text)]
    public string IdToken { get; set; } = default!;


    [Required]
    [DataType(DataType.Text)]
    public string Provider { get; set; } = default!;

    public string? AuthToken { get; set; } = default!;
}
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using Reviews.Models;
using Microsoft.IdentityModel.Tokens;

namespace Reviews.Services;

public class JwtService
{
    private readonly IConfigurationSection _jwtSettings;


    public JwtService(IConfiguration configuration)
    {
        _jwtSettings = configuration.GetSection("Jwt");
    }

    public string GenerateToken(ApplicationUser user)
    {
        SecurityTokenDescriptor tokenDescriptor = GetSecurityTokenDescriptor(user);
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private (string issuer, string audience, byte[] key) GetConfigValues()
    {
        string issuer = _jwtSettings.GetValue<string>("Issuer") ?? "";
        string audience = _jwtSettings.GetValue<string>("Audience") ?? "";
        byte[] key = Encoding.ASCII.GetBytes(_jwtSettings.GetValue<string>("Key") ?? "");
        return (issuer, audience, key);
    }

    private ClaimsIdentity GetClaimsIdentity(ApplicationUser user)
    {
        return new ClaimsIdentity(new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("userName", user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        });
    }

    private SecurityTokenDescriptor GetSecurityTokenDescriptor(ApplicationUser user)
    {
        var (issuer, audience, key) = GetConfigValues();
        return new SecurityTokenDescriptor
        {
            Subject = GetClaimsIdentity(user),
            Expires = DateTime.UtcNow.AddMinutes(60),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature
            )
        };
    }
}
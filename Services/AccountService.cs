using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

using Reviews.Models;

namespace Reviews.Services;

public class AccountService
{

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    private readonly IConfigurationSection _goolgeSettings;
    private readonly IConfigurationSection _microsoftSettings;

    private readonly HttpClient _httpClient;
    private readonly JwtService _jwtService;

    public AccountService(
        IConfiguration configuration,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        HttpClient httpClient,
        JwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _goolgeSettings = configuration.GetSection("Authentication:Google");
        _microsoftSettings = configuration.GetSection("Authentication:Microsoft");
        _httpClient = httpClient;
        _jwtService = jwtService;
    }

    public async Task<string?> ExternalLogin(CredentialsDto credentials) =>
        credentials.Provider switch
        {
            ExternalProvider.Google => await GoogleExternalLogin(credentials),
            ExternalProvider.Microsoft => await MicrosoftExternalLogin(credentials),
            _ => null
        };

    private async Task<string?> GoogleExternalLogin(CredentialsDto credentials)
    {
        GoogleJsonWebSignature.Payload? payload = await ValidateGoogleToken(credentials.IdToken);
        if (payload is null)
        {
            return null;
        }
        ApplicationUser user = await AddOrCreateUserOrAddLogin(credentials.Provider, payload.Subject, payload.Email);
        return _jwtService.GenerateToken(user);
    }

    private async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleToken(string IdToken)
    {
        try
        {
            return await GoogleJsonWebSignature.ValidateAsync(IdToken);
        }
        catch (InvalidJwtException)
        {
            return null;
        }
    }

    private async Task<string?> MicrosoftExternalLogin(CredentialsDto credentials)
    {
        JwtSecurityTokenHandler tokendHandler = new JwtSecurityTokenHandler();
        TokenValidationResult result = await tokendHandler.ValidateTokenAsync(
            credentials.IdToken,
            GetTokenValidationParameters()
        );
        if (result.IsValid)
        {
            return await LoginMicrosoftUser(credentials);
        }
        return null;
    }

    private async Task<string?> LoginMicrosoftUser(CredentialsDto credentials)
    {
        MicrosoftUser? microsoftUser = await GetMicrosoftUser(credentials.AuthToken ?? "");
        if (microsoftUser is null)
        {
            return null;
        }
        ApplicationUser user = await AddOrCreateUserOrAddLogin(
            credentials.Provider,
            microsoftUser.Id,
            microsoftUser.UserPrincipalName
        );
        return _jwtService.GenerateToken(user);
    }

    private async Task<MicrosoftUser?> GetMicrosoftUser(string authToken)
    {
        var request = new HttpRequestMessage
        {
            RequestUri = new Uri(MicrosoftOptions.UserInfoEndpoint),
            Method = HttpMethod.Get,
        };
        request.Headers.Add("Authorization", $"Bearer {authToken}");
        using HttpResponseMessage response = _httpClient.SendAsync(request).GetAwaiter().GetResult();
        using HttpContent content = response.Content;
        return await content.ReadFromJsonAsync<MicrosoftUser>();
    }

    private TokenValidationParameters GetTokenValidationParameters()
    {
        OpenIdConnectConfiguration config = GetOpenIdConnectConfiguration();
        return new TokenValidationParameters()
        {
            ValidIssuer = config.Issuer,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = _microsoftSettings.GetValue<string>("ClientId"),
            IssuerSigningKeys = config.SigningKeys
        };
    }

    private OpenIdConnectConfiguration GetOpenIdConnectConfiguration()
    {
        ConfigurationManager<OpenIdConnectConfiguration> configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
            string.Format(
                MicrosoftOptions.OpenIdConfigurationEndpoint,
                _microsoftSettings.GetValue<string>("DirectoryID")
            ),
            new OpenIdConnectConfigurationRetriever()
        );
        return configManager.GetConfigurationAsync().Result;
    }

    private async Task<ApplicationUser> AddOrCreateUserOrAddLogin(string provider, string providerKey, string email)
    {
        UserLoginInfo info = new UserLoginInfo(provider, providerKey, provider);
        ApplicationUser? userLoginInfo = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        ApplicationUser? user = await _userManager.FindByEmailAsync(email);
        if (user is not null && userLoginInfo is null)
        {
            await _userManager.AddLoginAsync(user, info);
            return user;
        }
        if (user is null)
        {
            return await CreateUserAndLogin(email, info);
        }
        return user;
    }

    private async Task<ApplicationUser> CreateUserAndLogin(string email, UserLoginInfo info)
    {
        ApplicationUser user = new ApplicationUser
        {
            Email = email,
            UserName = email.Split("@").First(),
        };
        await _userManager.CreateAsync(user);
        await _userManager.AddLoginAsync(user, info);
        return user;
    }
}
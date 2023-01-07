using Microsoft.AspNetCore.SignalR;

using Reviews.Models.Dto;

namespace Reviews.Hubs;

public class CommentariesHub : Hub
{

    public async Task AddToGroup(Guid reviewId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, reviewId.ToString());
    }

    public async Task SendCommentary(Guid reviewId, CommentaryDto commentary)
    {
        await Clients.Group(reviewId.ToString()).SendAsync("ReceiveCommentary", commentary);
    }
}

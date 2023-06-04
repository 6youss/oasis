using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthentication(option =>
{
  option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  option.DefaultChallengeScheme = "nike";
  option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(option =>
{
  option.Authority = "http://localhost:8080/realms/Tricksept";
  option.Audience = "oasis-api";
  option.RequireHttpsMetadata = false;
}).AddOAuth("nike", option =>
{
  option.AuthorizationEndpoint = "http://localhost:8080/realms/Tricksept/protocol/openid-connect/auth";
  option.TokenEndpoint = "http://localhost:8080/realms/Tricksept/protocol/openid-connect/certs";
  option.CallbackPath = "/weather-forcast";
  option.ClientId = "oasis-api";
  option.ClientSecret = "wR3TQHNmTYnrh8XLsHO7JukhgOpEER9b";
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["./SShop.BackEndAPI/SShop.BackEndAPI.csproj", "SShop.BackEndAPI/"]
COPY ["./SShop.Repositories/SShop.Repositories.csproj", "SShop.Repositories/"]
COPY ["./SShop.Domain/SShop.Domain.csproj", "SShop.Domain/"]
COPY ["./SShop.Services/SShop.Services.csproj", "SShop.Services/"]
COPY ["./SShop.ViewModels/SShop.ViewModels.csproj", "SShop.ViewModels/"]
COPY ["./SShop.Utilities/SShop.Utilities.csproj", "SShop.Utilities/"]
RUN dotnet restore "/src/SShop.BackEndAPI/SShop.BackEndAPI.csproj"
COPY . .
WORKDIR "/src/SShop.BackEndAPI"
RUN dotnet build "SShop.BackEndAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SShop.BackEndAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SShop.BackEndAPI.dll"]
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT [name]
        FROM sys.databases
        WHERE [name] = N'FurnitureDB'
)
CREATE DATABASE FurnitureDB
GO
USE [FurnitureDB]
GO
/****** Object:  Table [dbo].[Address]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Address](
	[AddressId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NULL,
	[FirstName] [nvarchar](200) NOT NULL,
	[LastName] [nvarchar](200) NOT NULL,
	[ProvinceId] [int] NOT NULL,
	[WardId] [int] NOT NULL,
	[DistrictId] [int] NOT NULL,
	[Phone] [nvarchar](200) NOT NULL,
	[SpecificAddress] [nvarchar](200) NOT NULL,
	[IsDefault] [bit] NOT NULL,
 CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED 
(
	[AddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Brand]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Brand](
	[BrandId] [int] IDENTITY(1,1) NOT NULL,
	[BrandName] [nvarchar](100) NOT NULL,
	[Origin] [nvarchar](100) NOT NULL,
	[Image] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_Brand] PRIMARY KEY CLUSTERED 
(
	[BrandId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CartItem]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CartItem](
	[CartItemId] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[Quantity] [int] NOT NULL,
	[DateAdded] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_CartItem] PRIMARY KEY CLUSTERED 
(
	[CartItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[ParentCategoryId] [int] NULL,
	[Content] [nvarchar](max) NULL,
	[Image] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeliveryMethod]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeliveryMethod](
	[DeliveryMethodId] [int] IDENTITY(1,1) NOT NULL,
	[DeliveryMethodName] [nvarchar](100) NOT NULL,
	[Price] [decimal](18, 0) NOT NULL,
	[Image] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_DeliveryMethod] PRIMARY KEY CLUSTERED 
(
	[DeliveryMethodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discount]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discount](
	[DiscountId] [int] IDENTITY(1,1) NOT NULL,
	[DiscountCode] [nvarchar](20) NOT NULL,
	[DiscountValue] [decimal](10, 5) NOT NULL,
	[StartDate] [datetime2](7) NOT NULL,
	[EndDate] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
 CONSTRAINT [PK_Discount] PRIMARY KEY CLUSTERED 
(
	[DiscountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[District]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[District](
	[DistrictId] [int] IDENTITY(1,1) NOT NULL,
	[DistrictCode] [int] NOT NULL,
	[DistrictName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_District] PRIMARY KEY CLUSTERED 
(
	[DistrictId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order](
	[OrderId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[DiscountId] [int] NULL,
	[TotalItemPrice] [decimal](18, 0) NOT NULL,
	[TotalPrice] [decimal](18, 0) NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateDone] [datetime2](7) NULL,
	[PaymentMethodId] [int] NOT NULL,
	[OrderStateId] [int] NOT NULL,
	[AddressId] [int] NOT NULL,
	[DeliveryMethodId] [int] NOT NULL,
	[DatePaid] [datetime2](7) NULL,
 CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderItem]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItem](
	[OrderItemId] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](18, 0) NOT NULL,
	[TotalPrice] [decimal](18, 0) NOT NULL,
	[ReviewItemId] [int] NULL,
 CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED 
(
	[OrderItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderState]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderState](
	[OrderStateId] [int] IDENTITY(1,1) NOT NULL,
	[OrderStateName] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_OrderState] PRIMARY KEY CLUSTERED 
(
	[OrderStateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentMethod]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentMethod](
	[PaymentMethodId] [int] IDENTITY(1,1) NOT NULL,
	[PaymentMethodName] [nvarchar](100) NOT NULL,
	[Image] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_PaymentMethod] PRIMARY KEY CLUSTERED 
(
	[PaymentMethodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[ProductId] [int] IDENTITY(1,1) NOT NULL,
	[BrandId] [int] NOT NULL,
	[CategoryId] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[Price] [decimal](18, 0) NOT NULL,
	[Quantity] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[Origin] [nvarchar](30) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductImage]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductImage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Path] [nvarchar](max) NOT NULL,
	[IsDefault] [bit] NOT NULL,
	[ProductId] [int] NOT NULL,
 CONSTRAINT [PK_ProductImage] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Province]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Province](
	[ProvinceId] [int] IDENTITY(1,1) NOT NULL,
	[ProvinceCode] [int] NOT NULL,
	[ProvinceName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Province] PRIMARY KEY CLUSTERED 
(
	[ProvinceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Review]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Review](
	[ReviewItemId] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
	[Rating] [int] NOT NULL,
	[Content] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_Review] PRIMARY KEY CLUSTERED 
(
	[ReviewItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleClaims]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_RoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [nvarchar](450) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[DateOfBirth] [datetime2](7) NOT NULL,
	[Gender] [nvarchar](max) NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
	[Avatar] [nvarchar](max) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[RefreshToken] [nvarchar](max) NULL,
	[RefreshTokenExpiredTime] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserClaims]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_UserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserLogins]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_UserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoles]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserTokens]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_UserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ward]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ward](
	[WardId] [int] IDENTITY(1,1) NOT NULL,
	[WardCode] [int] NOT NULL,
	[WardName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Ward] PRIMARY KEY CLUSTERED 
(
	[WardId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WishListItem]    Script Date: 5/15/2023 6:35:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WishListItem](
	[WishItemId] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[Status] [int] NOT NULL,
	[DateAdded] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_WishListItem] PRIMARY KEY CLUSTERED 
(
	[WishItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Address] ON 

INSERT [dbo].[Address] ([AddressId], [UserId], [FirstName], [LastName], [ProvinceId], [WardId], [DistrictId], [Phone], [SpecificAddress], [IsDefault]) VALUES (1, N'48200de6-8eb5-4640-9c04-1b298d7c6678', N'Nguyễn', N'Sơn', 2, 2, 2, N'0354964840', N'Thôn Đại Hữu', 1)
INSERT [dbo].[Address] ([AddressId], [UserId], [FirstName], [LastName], [ProvinceId], [WardId], [DistrictId], [Phone], [SpecificAddress], [IsDefault]) VALUES (1004, N'dce9cb18-fb64-43c5-b0de-1958fac41599', N'Nha', N'Tram', 1017, 1017, 1017, N'0359027263', N'Lã Xuân Oai', 1)
SET IDENTITY_INSERT [dbo].[Address] OFF
GO
SET IDENTITY_INSERT [dbo].[Brand] ON 

INSERT [dbo].[Brand] ([BrandId], [BrandName], [Origin], [Image]) VALUES (4, N'CITIZEN', N'Nhật Bản', N'/user-content/20c29de2-13bc-4023-82ac-22e133117ad1.png')
INSERT [dbo].[Brand] ([BrandId], [BrandName], [Origin], [Image]) VALUES (7, N'Roberto Cavalli', N'Ý', N'/user-content/e599eee9-8c4f-4176-9475-c511d303258b.png')
INSERT [dbo].[Brand] ([BrandId], [BrandName], [Origin], [Image]) VALUES (8, N'G-SHOCK', N'Nhật Bản', N'/user-content/26c166e7-9808-44f5-b28a-ef42df6b2800.png')
INSERT [dbo].[Brand] ([BrandId], [BrandName], [Origin], [Image]) VALUES (9, N' ORIENT', N'
Nhật Bản', N'/user-content/be9895bd-037c-4a4d-ade6-bd3bb3d303ae.png')
SET IDENTITY_INSERT [dbo].[Brand] OFF
GO
SET IDENTITY_INSERT [dbo].[CartItem] ON 

INSERT [dbo].[CartItem] ([CartItemId], [ProductId], [UserId], [Quantity], [DateAdded], [Status]) VALUES (1081, 1, N'dce9cb18-fb64-43c5-b0de-1958fac41599', 1, CAST(N'2023-04-24T15:33:17.2877266' AS DateTime2), 1)
INSERT [dbo].[CartItem] ([CartItemId], [ProductId], [UserId], [Quantity], [DateAdded], [Status]) VALUES (1082, 4, N'dce9cb18-fb64-43c5-b0de-1958fac41599', 1, CAST(N'2023-04-24T15:33:19.0439841' AS DateTime2), 1)
INSERT [dbo].[CartItem] ([CartItemId], [ProductId], [UserId], [Quantity], [DateAdded], [Status]) VALUES (1086, 3, N'48200de6-8eb5-4640-9c04-1b298d7c6678', 4, CAST(N'2023-05-12T23:53:42.9032869' AS DateTime2), 1)
INSERT [dbo].[CartItem] ([CartItemId], [ProductId], [UserId], [Quantity], [DateAdded], [Status]) VALUES (1088, 4, N'48200de6-8eb5-4640-9c04-1b298d7c6678', 6, CAST(N'2023-05-13T21:56:17.7286865' AS DateTime2), 1)
SET IDENTITY_INSERT [dbo].[CartItem] OFF
GO
SET IDENTITY_INSERT [dbo].[Category] ON 

INSERT [dbo].[Category] ([CategoryId], [Name], [ParentCategoryId], [Content], [Image]) VALUES (4, N'Cơ tự động', NULL, N'Đồng hồ cơ (còn gọi là đồng hồ máy cơ) là loại đồng hồ đeo tay được lắp ráp hoàn toàn từ các chi tiết thuần cơ khí, hoạt động dựa trên nguồn năng lượng dưới dạng cơ năng do dây cót sinh ra. Khác với các loại đồng hồ khác, đồng hồ cơ không sử dụng pin hay bất kỳ thiết bị điện tử nào.', N'/user-content/1fecc918-ea92-4696-b2ac-4a9981c44122.jpg')
INSERT [dbo].[Category] ([CategoryId], [Name], [ParentCategoryId], [Content], [Image]) VALUES (9, N'Pin', NULL, N'Đồng hồ pin hay còn gọi là đồng hồ Quartz được giới thiệu đến công chúng vào năm 1969. Đồng hồ sử dụng bộ dao động điện tử để hoạt động. Pin của loại đồng hồ này có thời gian sử dụng khá lâu lên đến vài năm mới thay pin một lần.', N'/user-content/f0bcde3d-8fc3-4655-a2fa-064c2684c7bf.jpg')
SET IDENTITY_INSERT [dbo].[Category] OFF
GO
SET IDENTITY_INSERT [dbo].[DeliveryMethod] ON 

INSERT [dbo].[DeliveryMethod] ([DeliveryMethodId], [DeliveryMethodName], [Price], [Image]) VALUES (1, N'Fast Delivery', CAST(48000 AS Decimal(18, 0)), N'/user-content/8982f23e-74ac-417d-8c84-23466b48055d.jpg')
INSERT [dbo].[DeliveryMethod] ([DeliveryMethodId], [DeliveryMethodName], [Price], [Image]) VALUES (2, N'Standard Delivery', CAST(30000 AS Decimal(18, 0)), N'/user-content/db35534d-a22c-4cc5-adb1-55b1a812704b.jpg')
SET IDENTITY_INSERT [dbo].[DeliveryMethod] OFF
GO
SET IDENTITY_INSERT [dbo].[District] ON 

INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (2, 574, N'Huyện Diên Khánh')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (16, 568, N'Thành phố Nha Trang')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (18, 769, N'Thành phố Thủ Đức')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (21, 1, N'Quận Ba Đình')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (1013, 769, N'Thành phố Thủ Đức')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (1014, 769, N'Thành phố Thủ Đức')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (1015, 769, N'Thành phố Thủ Đức')
INSERT [dbo].[District] ([DistrictId], [DistrictCode], [DistrictName]) VALUES (1017, 494, N'Quận Ngũ Hành Sơn')
SET IDENTITY_INSERT [dbo].[District] OFF
GO
SET IDENTITY_INSERT [dbo].[Order] ON 

INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (4, N'dce9cb18-fb64-43c5-b0de-1958fac41599', NULL, CAST(23423 AS Decimal(18, 0)), CAST(63423 AS Decimal(18, 0)), CAST(N'2023-04-15T17:39:39.6824090' AS DateTime2), NULL, 1, 2, 1004, 2, CAST(N'2023-04-15T17:39:39.6899626' AS DateTime2))
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (5, N'dce9cb18-fb64-43c5-b0de-1958fac41599', NULL, CAST(71503 AS Decimal(18, 0)), CAST(111503 AS Decimal(18, 0)), CAST(N'2023-04-16T12:03:51.3544986' AS DateTime2), NULL, 2, 3, 1004, 2, NULL)
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (6, N'48200de6-8eb5-4640-9c04-1b298d7c6678', NULL, CAST(110808 AS Decimal(18, 0)), CAST(140808 AS Decimal(18, 0)), CAST(N'2023-04-16T22:08:48.5118169' AS DateTime2), CAST(N'2023-04-22T18:00:48.0078789' AS DateTime2), 2, 4, 1, 1, CAST(N'2023-04-22T18:00:48.0078789' AS DateTime2))
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (7, N'48200de6-8eb5-4640-9c04-1b298d7c6678', NULL, CAST(98496 AS Decimal(18, 0)), CAST(128496 AS Decimal(18, 0)), CAST(N'2023-04-16T22:10:25.8066685' AS DateTime2), CAST(N'2023-04-22T18:05:18.4320249' AS DateTime2), 1, 4, 1, 1, CAST(N'2023-04-16T22:10:25.8133505' AS DateTime2))
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (8, N'48200de6-8eb5-4640-9c04-1b298d7c6678', NULL, CAST(73872 AS Decimal(18, 0)), CAST(103872 AS Decimal(18, 0)), CAST(N'2023-04-16T22:11:40.4924316' AS DateTime2), NULL, 1, 5, 1, 1, CAST(N'2023-04-16T22:11:40.5166363' AS DateTime2))
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (9, N'dce9cb18-fb64-43c5-b0de-1958fac41599', NULL, CAST(23456 AS Decimal(18, 0)), CAST(63456 AS Decimal(18, 0)), CAST(N'2023-04-22T18:42:37.7450146' AS DateTime2), NULL, 2, 3, 1004, 1, NULL)
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (10, N'48200de6-8eb5-4640-9c04-1b298d7c6678', NULL, CAST(6868345 AS Decimal(18, 0)), CAST(6916345 AS Decimal(18, 0)), CAST(N'2023-05-12T23:42:15.0455491' AS DateTime2), NULL, 1, 3, 1, 1, CAST(N'2023-05-12T23:42:15.0564298' AS DateTime2))
INSERT [dbo].[Order] ([OrderId], [UserId], [DiscountId], [TotalItemPrice], [TotalPrice], [DateCreated], [DateDone], [PaymentMethodId], [OrderStateId], [AddressId], [DeliveryMethodId], [DatePaid]) VALUES (11, N'48200de6-8eb5-4640-9c04-1b298d7c6678', NULL, CAST(23423 AS Decimal(18, 0)), CAST(71423 AS Decimal(18, 0)), CAST(N'2023-05-12T23:51:48.9282949' AS DateTime2), NULL, 1, 1, 1, 1, CAST(N'2023-05-12T23:51:48.9328053' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Order] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderItem] ON 

INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (6, 4, 3, 1, CAST(12312 AS Decimal(18, 0)), CAST(12312 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (7, 4, 2, 1, CAST(11111 AS Decimal(18, 0)), CAST(11111 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (8, 5, 2, 2, CAST(11111 AS Decimal(18, 0)), CAST(22222 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (9, 5, 1, 1, CAST(12345 AS Decimal(18, 0)), CAST(12345 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (10, 5, 3, 3, CAST(12312 AS Decimal(18, 0)), CAST(36936 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (11, 6, 3, 9, CAST(12312 AS Decimal(18, 0)), CAST(110808 AS Decimal(18, 0)), 1)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (12, 7, 3, 8, CAST(12312 AS Decimal(18, 0)), CAST(98496 AS Decimal(18, 0)), 2)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (13, 8, 3, 6, CAST(12312 AS Decimal(18, 0)), CAST(73872 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (14, 9, 1, 1, CAST(12345 AS Decimal(18, 0)), CAST(12345 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (15, 9, 2, 1, CAST(11111 AS Decimal(18, 0)), CAST(11111 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (16, 10, 4, 1, CAST(6856000 AS Decimal(18, 0)), CAST(6856000 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (17, 10, 1, 1, CAST(12345 AS Decimal(18, 0)), CAST(12345 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (18, 11, 2, 1, CAST(11111 AS Decimal(18, 0)), CAST(11111 AS Decimal(18, 0)), NULL)
INSERT [dbo].[OrderItem] ([OrderItemId], [OrderId], [ProductId], [Quantity], [UnitPrice], [TotalPrice], [ReviewItemId]) VALUES (19, 11, 3, 1, CAST(12312 AS Decimal(18, 0)), CAST(12312 AS Decimal(18, 0)), NULL)
SET IDENTITY_INSERT [dbo].[OrderItem] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderState] ON 

INSERT [dbo].[OrderState] ([OrderStateId], [OrderStateName]) VALUES (1, N'Pending')
INSERT [dbo].[OrderState] ([OrderStateId], [OrderStateName]) VALUES (2, N'Ready to ship')
INSERT [dbo].[OrderState] ([OrderStateId], [OrderStateName]) VALUES (3, N'On the way')
INSERT [dbo].[OrderState] ([OrderStateId], [OrderStateName]) VALUES (4, N'Delivered')
INSERT [dbo].[OrderState] ([OrderStateId], [OrderStateName]) VALUES (5, N'Cancelled')
SET IDENTITY_INSERT [dbo].[OrderState] OFF
GO
SET IDENTITY_INSERT [dbo].[PaymentMethod] ON 

INSERT [dbo].[PaymentMethod] ([PaymentMethodId], [PaymentMethodName], [Image]) VALUES (1, N'PayPal', N'/user-content/41f0658e-e6e8-4a4b-99bf-5314fc9e83d8.png')
INSERT [dbo].[PaymentMethod] ([PaymentMethodId], [PaymentMethodName], [Image]) VALUES (2, N'COD', N'/user-content/6765e6b8-f430-471e-9c9a-1a9908022382.png')
SET IDENTITY_INSERT [dbo].[PaymentMethod] OFF
GO
SET IDENTITY_INSERT [dbo].[Product] ON 

INSERT [dbo].[Product] ([ProductId], [BrandId], [CategoryId], [Name], [Description], [Price], [Quantity], [DateCreated], [Origin], [Status]) VALUES (1, 7, 9, N'Đồng hồ Roberto Cavalli 42 mm Nam RC5G048L0035', N'<h3 style="text-align: center;"><strong>Quyến rũ v&agrave; độc đ&aacute;o</strong></h3>
<p>Ở lĩnh vực đồng hồ, c&aacute;c kiểu thiết kế m&agrave; Roberto Cavalli mang lại được thừa hưởng từ ch&iacute;nh c&aacute;c đặc điểm của tinh thần nghệ thuật tự do -&nbsp; hoang dại v&agrave; ph&oacute;ng kho&aacute;ng. Những mẫu m&atilde; v&agrave; kiểu d&aacute;ng độc đ&aacute;o, kh&oacute; trộn lẫn được lấy &yacute; tưởng từ sự y&ecirc;u th&iacute;ch đặc biệt về những họa tiết về thi&ecirc;n nhi&ecirc;n c&acirc;y cỏ, động vật hoang d&atilde;. C&aacute;c sản phẩm của thương hiệu đ&atilde; trở th&agrave;nh dấu ấn đặc trưng v&agrave; đem đến nguồn cảm hứng bất tận cho người d&ugrave;ng trong việc phối hợp với trang phục trong nhiều ho&agrave;n cảnh kh&aacute;c nhau.</p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-21.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Tổng quan về thương hiệu của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-21.jpg" alt="Tổng quan về thương hiệu của mẫu đồng hồ " width="571" height="319" data-src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-21.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-22.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Chất liệu mặt k&iacute;nh v&agrave; khung viền của mẫu đồng hồ" src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-22.jpg" alt="Chất liệu mặt k&iacute;nh v&agrave; khung viền của mẫu đồng hồ" width="567" height="317" data-src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-22.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-23.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Chất liệu d&acirc;y đeo của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-23.jpg" alt="Chất liệu d&acirc;y đeo của mẫu đồng hồ " width="565" height="316" data-src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-23.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-24.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Khả năng kh&aacute;ng nước của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-24.jpg" alt="Khả năng kh&aacute;ng nước của mẫu đồng hồ " width="564" height="315" data-src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-24.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-25.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Tiện &iacute;ch của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-25.jpg" alt="Tiện &iacute;ch của mẫu đồng hồ " width="566" height="316" data-src="https://cdn.tgdd.vn/Products/Images/7264/305946/roberto-cavalli-rc5g048l0035-nam-25.jpg"></a></p>
<p>&bull; C&aacute;c mẫu <a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ Roberto Cavalli tại Thế Giới Di Động" href="https://www.thegioididong.com/dong-ho-deo-tay-roberto-cavalli" target="_blank" rel="noopener">đồng hồ Roberto Cavalli</a><strong>&nbsp;</strong>đến từ &Yacute; l&agrave; sự kết hợp ho&agrave;n hảo giữa nghệ thuật v&agrave; kỹ thuật, được sản xuất với chất lượng tốt v&agrave; c&aacute;c chi tiết tinh tế. Từ khi th&agrave;nh lập đến nay, thương hiệu đ&atilde; lu&ocirc;n tạo ra những bộ sưu tập thời trang ti&ecirc;n tiến v&agrave; đầy phong c&aacute;ch ph&ugrave; hợp với những ai y&ecirc;u th&iacute;ch sự sang trọng v&agrave; đẳng cấp.&nbsp;</p>
<div>
<p>&bull;<strong>&nbsp;</strong><a title="Đồng hồ Roberto Cavalli 42 mm Nam RC5G048L0035" href="https://www.thegioididong.com/dong-ho-deo-tay/roberto-cavalli-rc5g048l0035-nam" target="_blank" rel="noopener">Đồng hồ Roberto Cavalli 42 mm Nam RC5G048L0035</a>&nbsp;được thiết kế với sự kết hợp giữa cọc số h&igrave;nh nhọn hướng về ph&iacute;a trung t&acirc;m v&agrave; họa tiết mũi t&ecirc;n kh&ocirc;ng chỉ l&agrave;m điểm nhấn thu h&uacute;t &aacute;nh nh&igrave;n m&agrave; c&ograve;n gi&uacute;p cho việc đọc giờ v&agrave; ph&uacute;t tr&ecirc;n đồng hồ trở n&ecirc;n dễ d&agrave;ng v&agrave; ch&iacute;nh x&aacute;c hơn.</p>
<div>
<p>&bull;&nbsp;<a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ kh&aacute;c tại Thế Giới Di Động " href="https://www.thegioididong.com/dong-ho-deo-tay" target="_blank" rel="noopener">Đồng hồ</a>&nbsp;n&agrave;y sở hữu thiết kế d&acirc;y đeo bằng da tổng hợp. Một trong những đặc t&iacute;nh nổi trội của chất liệu n&agrave;y l&agrave; độ bền kh&aacute; v&agrave; tạo &ecirc;m nhẹ tạo cảm gi&aacute;c thoải m&aacute;i khi đeo. Hơn nữa, sản phẩm&nbsp;c&ograve;n được trang bị phần khung viền bằng chất liệu th&eacute;p kh&ocirc;ng gỉ, c&oacute; khả năng hạn chế ăn m&ograve;n cao trước t&aacute;c động từ m&ocirc;i trường mang lại sự sang trọng v&agrave; bền bỉ theo năm th&aacute;ng cho người d&ugrave;ng.&nbsp;</p>
<div>
<p>&bull;&nbsp;Sản phẩm n&agrave;y kh&ocirc;ng chỉ ph&ugrave; hợp với những anh ch&agrave;ng c&oacute; size cổ tay mảnh khảnh, m&agrave; c&ograve;n l&agrave; sự lựa chọn th&ocirc;ng minh cho những bạn c&oacute; đ&ocirc;i tay đầy đặn v&igrave; đường k&iacute;nh mặt&nbsp;<strong>42 mm</strong>. Ngo&agrave;i ra, h&atilde;ng đ&atilde; lựa chọn k&iacute;nh kho&aacute;ng (Mineral) l&agrave;m chất liệu cho phần mặt k&iacute;nh nhờ c&oacute; độ cứng, khả năng chịu va đập kh&aacute; v&agrave; độ trong suốt cao cho ph&eacute;p người d&ugrave;ng dễ d&agrave;ng quan s&aacute;t mặt đồng hồ.</p>
<div>
<p>&bull;&nbsp;Hệ số chống nước của sản phẩm l&agrave;&nbsp;<strong>10 ATM</strong>, c&aacute;c bạn nam c&oacute; thể sử dụng thường xuy&ecirc;n kể cả khi rửa tay, đi mưa, tắm, bơi lội.&nbsp;<strong>Lưu &yacute;</strong>: kh&ocirc;ng đeo khi đi lặn.&nbsp;</p>
<div>
<p>&bull;&nbsp;Mẫu&nbsp;<a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ nam tại Thế Giới Di Động" href="https://www.thegioididong.com/dong-ho-deo-tay-nam" target="_blank" rel="noopener">đồng hồ nam</a>&nbsp;n&agrave;y c&ograve;n được h&atilde;ng t&iacute;ch hợp c&aacute;c tiện &iacute;ch như lịch ng&agrave;y gi&uacute;p c&aacute;c ch&agrave;ng trai c&oacute; thể theo d&otilde;i thời gian biểu v&agrave; sắp xếp c&ocirc;ng việc một c&aacute;ch nhanh ch&oacute;ng, linh hoạt.</p>
<p>&nbsp;</p>
</div>
</div>
</div>
</div>
</div>', CAST(5200000 AS Decimal(18, 0)), 1005, CAST(N'2023-02-19T17:02:32.7872910' AS DateTime2), N'Trung Quốc', 0)
INSERT [dbo].[Product] ([ProductId], [BrandId], [CategoryId], [Name], [Description], [Price], [Quantity], [DateCreated], [Origin], [Status]) VALUES (2, 8, 9, N'Đồng hồ G-SHOCK 43.2 mm Nam GM-5600-1DR', N'<div class="short-article">
<p class="short-article__title">Đặc điểm nổi bật</p>
<ul>
<li>Đồng hồ G-SHOCK 43.2 mm Nam GM-5600-1DR thuộc thương hiệu G-SHOCK của Nhật Bản.</li>
<li>Đồng hồ sở hữu đường k&iacute;nh mặt 43.2 mm, ph&ugrave; hợp với c&aacute;c bạn nam.</li>
<li>Chất liệu mặt k&iacute;nh l&agrave; k&iacute;nh kho&aacute;ng (Mineral), c&oacute; độ cứng v&agrave; độ chịu lực tốt khi bị va đập, dễ d&agrave;ng đ&aacute;nh b&oacute;ng khi bị trầy xước nhẹ.</li>
<li>Khung viền của đồng hồ l&agrave;m từ th&eacute;p kh&ocirc;ng gỉ - s&aacute;ng b&oacute;ng, hạn chế chống ăn m&ograve;n v&agrave; trầy xước.</li>
<li>Chất liệu d&acirc;y đeo được l&agrave;m từ nhựa - an to&agrave;n v&agrave; bền bỉ, mang lại cảm gi&aacute;c nhẹ tay cho người d&ugrave;ng khi đeo.</li>
</ul>
</div>
<div class="Intro-des">
<h2><strong>Casio G-Shock</strong></h2>
<h3><strong>Khỏe khoắn, cuốn h&uacute;t v&agrave; dũng m&atilde;nh</strong></h3>
<p>Chữ G trong từ G-Shock được bắt nguồn từ chữ c&aacute;i đầu của từ Gravity, nghĩa l&agrave; kh&ocirc;ng trọng lực. G-Shock được hiểu với khả năng chống va đập, rơi vỡ. C&aacute;i t&ecirc;n đ&atilde; n&oacute;i r&otilde; về t&iacute;nh năng v&agrave; thiết kế của chiếc đồng hồ.</p>
</div>', CAST(4905000 AS Decimal(18, 0)), 541, CAST(N'2023-02-25T11:16:58.9692183' AS DateTime2), N'Thái Lan', 0)
INSERT [dbo].[Product] ([ProductId], [BrandId], [CategoryId], [Name], [Description], [Price], [Quantity], [DateCreated], [Origin], [Status]) VALUES (3, 9, 9, N'Đồng hồ Orient 39 mm Nam RF-QD0002B10B ', N'<h2><strong>Orient</strong></h2>
<h3><strong>Sang trọng v&agrave; đẳng cấp</strong></h3>
<p>Đồng hồ Orient đem đến những sản phẩm ấn tượng chinh phục người nh&igrave;n một c&aacute;ch nhanh ch&oacute;ng. Đồng hồ Orient với những chất liệu cao cấp b&oacute;ng bẩy n&acirc;ng tầm đẳng cấp cho người sở hữu, ph&ugrave; hợp với doanh nh&acirc;n th&agrave;nh đạt, d&acirc;n văn ph&ograve;ng hay c&aacute;c gi&aacute;m đốc c&ocirc;ng ty. Phong c&aacute;ch thời thượng, sang trọng đầy sức thu h&uacute;t đến từ đồng hồ Orient chắc chắn sẽ khiến bạn lu&ocirc;n h&atilde;nh diện với những người xung quanh.</p>
<h3 class="article__content__title">Th&ocirc;ng tin sản phẩm</h3>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-20.jpg"><img class=" ls-is-cached lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Tổng quan về thương hiệu của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-20.jpg" alt="Tổng quan về thương hiệu của mẫu đồng hồ " width="635" height="355" data-src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-20.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-21.jpg"><img class=" ls-is-cached lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Chất liệu mặt k&iacute;nh v&agrave; khung viền của mẫu đồng hồ" src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-21.jpg" alt="Chất liệu mặt k&iacute;nh v&agrave; khung viền của mẫu đồng hồ" width="635" height="355" data-src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-21.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-22.jpg"><img class=" ls-is-cached lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Chất liệu d&acirc;y đeo của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-22.jpg" alt="Chất liệu d&acirc;y đeo của mẫu đồng hồ " width="637" height="356" data-src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-22.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-23.jpg"><img class=" lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Khả năng kh&aacute;ng nước của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-23.jpg" alt="Khả năng kh&aacute;ng nước của mẫu đồng hồ " width="637" height="356" data-src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-23.jpg"></a></p>
<p><a class="preventdefault" href="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-24.jpg"><img class=" ls-is-cached lazyloaded" style="display: block; margin-left: auto; margin-right: auto;" title="Tiện &iacute;ch của mẫu đồng hồ " src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-24.jpg" alt="Tiện &iacute;ch của mẫu đồng hồ " width="642" height="359" data-src="https://cdn.tgdd.vn/Products/Images/7264/304015/orient-rf-qd0002b10b-nam-24.jpg"></a></p>
<p>&bull; Orient l&agrave; thương hiệu l&acirc;u năm tại Nhật Bản, đồng thời h&atilde;ng c&ograve;n l&agrave; c&aacute;i t&ecirc;n được ưa chuộng tr&ecirc;n 100 quốc gia trong đ&oacute; c&oacute; Việt Nam. Hầu hết những sản phẩm đến từ nh&atilde;n hiệu n&agrave;y lu&ocirc;n tập trung v&agrave;o lối thiết kế giản dị, mộc mạc để l&agrave;m bật l&ecirc;n phong c&aacute;ch lịch l&atilde;m hiện đại của những người sở hữu ch&uacute;ng.</p>
<p>&bull;&nbsp;<a title="Đồng hồ Orient 39 mm Nam RF-QD0002B10B" href="https://www.thegioididong.com/dong-ho-deo-tay/orient-rf-qd0002b10b-nam" target="_blank" rel="noopener">Đồng hồ Orient 39 mm Nam RF-QD0002B10B</a>&nbsp;c&oacute; phần thiết kế m&agrave;u sắc ấn tượng khi sử dụng 2 gam m&agrave;u tương phản l&agrave; đen cho phần d&acirc;y đeo v&agrave; v&agrave;ng cho phần khung viền tạo n&ecirc;n những sắc th&aacute;i kh&aacute;c biệt, mới lạ gi&uacute;p cho bạn trở n&ecirc;n nổi bật v&agrave; đầy c&aacute; t&iacute;nh khi đeo.</p>
<div>
<p>&bull;&nbsp;<a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ kh&aacute;c tại Thế Giới Di Động " href="https://www.thegioididong.com/dong-ho-deo-tay" target="_blank" rel="noopener">Đồng hồ</a>&nbsp;c&oacute; k&iacute;ch thước&nbsp;<strong>39 mm</strong>&nbsp;ph&ugrave; hợp với bạn nam c&oacute; cổ tay nhỏ hoặc th&iacute;ch đường k&iacute;nh mặt gọn. Phần mặt k&iacute;nh vốn l&agrave; nơi đa phần người d&ugrave;ng thường lo lắng sẽ bị ảnh hưởng khi va chạm, ch&iacute;nh v&igrave; vậy, h&atilde;ng đ&atilde; lựa chọn k&iacute;nh kho&aacute;ng (Mineral), chất liệu c&oacute; khả năng chịu lực kh&aacute; ổn định v&agrave; đ&aacute;nh b&oacute;ng những vết trầy xước nhỏ gi&uacute;p bạn y&ecirc;n t&acirc;m khi d&ugrave;ng.</p>
<div>
<p>&bull;&nbsp;Với những sản phẩm lấy cảm hứng từ sự thanh lịch th&igrave; chắc chắn kh&ocirc;ng thể thiếu sự g&oacute;p mặt của d&acirc;y đeo bằng da tổng hợp. Kh&ocirc;ng b&oacute;ng bẩy như kim loại, bộ d&acirc;y da với gam m&agrave;u đen truyền thống kh&ocirc;ng qu&aacute; ph&ocirc; trương nhưng đủ để thu h&uacute;t được sự ch&uacute; &yacute;, b&ecirc;n cạnh đ&oacute; chất liệu n&agrave;y c&ograve;n tạo cảm gi&aacute;c nhẹ nh&agrave;ng hay thoải m&aacute;i khi đeo.</p>
<div>
<p>&bull;&nbsp;Ngo&agrave;i ra,&nbsp;<a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ Orient tại Thế Giới Di Động" href="https://www.thegioididong.com/dong-ho-deo-tay-orient" target="_blank" rel="noopener">đồng hồ Orient</a>&nbsp;c&ograve;n được trang bị phần khung viền bằng chất liệu th&eacute;p kh&ocirc;ng gỉ, c&oacute; khả năng hạn chế ăn m&ograve;n trước t&aacute;c động từ m&ocirc;i trường mang lại sự sang trọng v&agrave; bền bỉ theo năm th&aacute;ng cho người d&ugrave;ng.</p>
<div>
<p>&bull;&nbsp;Ngo&agrave;i ra, mẫu&nbsp;<a title="Xem th&ecirc;m c&aacute;c mẫu đồng hồ nam tại Thế Giới Di Động" href="https://www.thegioididong.com/dong-ho-deo-tay-nam" target="_blank" rel="noopener">đồng hồ nam</a>&nbsp;n&agrave;y c&ograve;n c&oacute; độ kh&aacute;ng nước&nbsp;<strong>3 ATM</strong>&nbsp;để c&oacute; thể đồng h&agrave;nh cũng bạn trong c&aacute;c hoạt động như rửa tay hay đi mưa nhỏ.&nbsp;<strong>Lưu &yacute;</strong>: kh&ocirc;ng sử dụng khi đi tắm, đi bơi.</p>
<div>&bull;&nbsp;Với cuộc sống bận rộn như hiện nay, việc t&iacute;ch hợp bộ lịch ng&agrave;y tại vị tr&iacute; 3 giờ của h&atilde;ng sẽ gi&uacute;p bạn c&oacute; thể chủ động sắp xếp được c&aacute;c c&ocirc;ng việc cũng như lịch tr&igrave;nh của m&igrave;nh sao cho hợp l&yacute;.</div>
</div>
</div>
</div>
</div>', CAST(2814000 AS Decimal(18, 0)), 243, CAST(N'2023-03-06T01:17:13.2783619' AS DateTime2), N'Thái Lan', 0)
INSERT [dbo].[Product] ([ProductId], [BrandId], [CategoryId], [Name], [Description], [Price], [Quantity], [DateCreated], [Origin], [Status]) VALUES (4, 4, 4, N'Đồng hồ CITIZEN 40 mm Nam NH8391-51X', N'<h2><strong>Citizen</strong></h2>
<p>&nbsp;</p>
<h3><strong>Đơn giản v&agrave; thanh lịch&nbsp;</strong></h3>
<p>&nbsp;</p>
<p>Xu hướng thiết kế ch&iacute;nh của đồng hồ Citizen l&agrave; đơn giản v&agrave; thanh lịch. Citizen lu&ocirc;n ch&uacute; trọng đến việc đổi mới v&agrave; tạo sự phong ph&uacute; cho c&aacute;c mẫu thiết kế. C&aacute;c chi tiết cũng được Citizen đầu tư kỹ lưỡng trong kh&acirc;u chế t&aacute;c.</p>
<p>&nbsp;</p>
<p>&bull; Đồng hồ Citizen&nbsp;đến từ xứ sở hoa anh đ&agrave;o - Nhật Bản. Mỗi d&ograve;ng đồng hồ Citizen đều c&oacute;&nbsp;kiểu thiết kế độc đ&aacute;o, nh&agrave; sản xuất lu&ocirc;n cập nhật c&aacute;c xu hướng hiện đại nhưng vẫn duy tr&igrave; được n&eacute;t đặc trưng ri&ecirc;ng của mỗi d&ograve;ng sản phẩm từ trước đến nay. Mẫu đồng hồ n&agrave;y ph&ugrave; hợp với những ai th&iacute;ch sự thanh lịch v&agrave; sang trọng.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.tgdd.vn/Products/Images/7264/287028/citizen-nh8391-51x-nam-14.jpg" alt="Citizen NH8391-51X - Nam-4" width="478" height="478"></p>
<p>&bull; Đường k&iacute;nh mặt của mẫu&nbsp;đồng hồ CITIZEN 40 mm Nam NH8391-51X&nbsp;n&agrave;y l&agrave;&nbsp;<strong>40 mm</strong>, độ rộng d&acirc;y l&agrave;&nbsp;<strong>20 mm</strong>.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.tgdd.vn/Products/Images/7264/287028/citizen-nh8391-51x-nam-9.jpg" alt="Citizen NH8391-51X - Nam-3" width="478" height="478"></p>
<p>&bull; Khung viền v&agrave; d&acirc;y đeo&nbsp;đồng hồ&nbsp;l&agrave;m từ th&eacute;p kh&ocirc;ng gỉ 316L cứng c&aacute;p, bền bỉ v&agrave; c&oacute; khả năng chống chịu mọi thời tiết, chống oxi ho&aacute;.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.tgdd.vn/Products/Images/7264/287028/citizen-nh8391-51x-nam-8.jpg" alt="Citizen NH8391-51X - Nam-2" width="480" height="480"></p>
<p>&bull; Khả năng chống nước của mẫu&nbsp;đồng hồ nam&nbsp;n&agrave;y l&agrave;&nbsp;<strong>5</strong><strong>&nbsp;ATM</strong>, người d&ugrave;ng ho&agrave;n to&agrave;n c&oacute; thể sử dụng khi đi tắm, đi mưa. Kh&ocirc;ng n&ecirc;n sử dụng khi đi bơi, lặn.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.tgdd.vn/Products/Images/7264/287028/citizen-nh8391-51x-nam-7.jpg" alt="Citizen NH8391-51X - Nam-1" width="479" height="479"></p>
<p>&bull; Lịch ng&agrave;y v&agrave; lịch thứ được t&iacute;ch hợp ngay tr&ecirc;n mặt đồng hồ khiến người d&ugrave;ng nắm bắt thời gian một c&aacute;ch thuận tiện. Kim dạ quang gi&uacute;p người d&ugrave;ng theo d&otilde;i thời gian trong b&oacute;ng tối dễ d&agrave;ng hơn.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.tgdd.vn/Products/Images/7264/287028/citizen-nh8391-51x-nam-15.jpg" alt="Citizen NH8391-51X - Nam-5" width="478" height="478"></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>', CAST(6856000 AS Decimal(18, 0)), 119, CAST(N'2023-04-17T19:53:06.6610780' AS DateTime2), N'Trung Quốc', 0)
SET IDENTITY_INSERT [dbo].[Product] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductImage] ON 

INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (1, N'/user-content/a20d742b-4986-4b88-a310-5786b40a6ec7.jpg', 1, 1)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (2, N'/user-content/171bc159-58a1-44cc-ab6e-5bd549384edd.jpg', 0, 1)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (4, N'/user-content/34bd268a-bf28-4d45-8558-800afa7ec101.jpg', 0, 1)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (5, N'/user-content/d632829b-8ca4-48cd-b21c-7c3134012e51.jpg', 1, 2)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (6, N'/user-content/41a4be1c-d382-4261-9e47-9edd65ad861f.jpg', 0, 2)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (7, N'/user-content/a7c11910-54f5-4284-807b-02421c9b6104.jpg', 0, 2)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (8, N'/user-content/50ea5d30-4cfc-454f-bfd4-f88a7123f17e.jpg', 1, 3)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (9, N'/user-content/7bcc87ce-9ce5-4c53-bf6b-cd764229202f.jpg', 0, 3)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (10, N'/user-content/055add62-b335-46d7-8067-faf27d40b317.jpg', 1, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (11, N'/user-content/cb64e17c-82b5-4836-9cd5-049bbc72c4f4.jpg', 0, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (12, N'/user-content/fa6a78e0-f26a-4076-b643-8d3fbf4af476.jpg', 0, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (13, N'/user-content/1a43f0ac-0a51-47b7-a8a2-056509507e74.jpg', 0, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (14, N'/user-content/98f4c8fd-d9a2-493f-91b8-4621f7596ed1.jpg', 0, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (15, N'/user-content/c7bc7a6a-8411-438d-ad3e-ece261b2a2c4.jpg', 0, 4)
INSERT [dbo].[ProductImage] ([Id], [Path], [IsDefault], [ProductId]) VALUES (17, N'/user-content/606493fe-b2fb-4d3c-82d5-d70345078024.jpg', 0, 3)
SET IDENTITY_INSERT [dbo].[ProductImage] OFF
GO
SET IDENTITY_INSERT [dbo].[Province] ON 

INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (2, 56, N'Tỉnh Khánh Hoà')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (16, 56, N'Tỉnh Khánh Hòa')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (18, 79, N'Thành phố Hồ Chí Minh')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (21, 1, N'Thành phố Hà Nội')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (1013, 79, N'Thành phố Hồ Chí Minh')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (1014, 79, N'Thành phố Hồ Chí Minh')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (1015, 79, N'Thành phố Hồ Chí Minh')
INSERT [dbo].[Province] ([ProvinceId], [ProvinceCode], [ProvinceName]) VALUES (1017, 48, N'Thành phố Đà Nẵng')
SET IDENTITY_INSERT [dbo].[Province] OFF
GO
SET IDENTITY_INSERT [dbo].[Review] ON 

INSERT [dbo].[Review] ([ReviewItemId], [ProductId], [UserId], [DateCreated], [DateUpdated], [Status], [Rating], [Content]) VALUES (1, 3, N'48200de6-8eb5-4640-9c04-1b298d7c6678', CAST(N'2023-04-23T12:27:48.9576539' AS DateTime2), CAST(N'2023-04-23T16:47:00.5396559' AS DateTime2), 1, 1, N'bad product')
INSERT [dbo].[Review] ([ReviewItemId], [ProductId], [UserId], [DateCreated], [DateUpdated], [Status], [Rating], [Content]) VALUES (2, 3, N'48200de6-8eb5-4640-9c04-1b298d7c6678', CAST(N'2023-04-23T15:53:11.9883431' AS DateTime2), CAST(N'2023-04-23T15:53:11.9883956' AS DateTime2), 0, 4, N'I like it')
SET IDENTITY_INSERT [dbo].[Review] OFF
GO
INSERT [dbo].[Roles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'be51e5f7-f1ac-4c92-bfa2-b257b6d1072e', N'Customer', N'CUSTOMER', N'd6940f1e-27ad-4f47-b5da-a941f8ab072c')
INSERT [dbo].[Roles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'f900f6d9-9e6b-4c6f-a711-09fdfd84e9be', N'Admin', N'ADMIN', N'ddce119f-bef0-4f8b-905c-7012f848c0d7')
GO
INSERT [dbo].[User] ([Id], [FirstName], [LastName], [DateOfBirth], [Gender], [DateCreated], [DateUpdated], [Status], [Avatar], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [RefreshToken], [RefreshTokenExpiredTime]) VALUES (N'48200de6-8eb5-4640-9c04-1b298d7c6678', N'Nguyễn', N'Minh Sơn', CAST(N'2002-10-10T00:00:00.0000000' AS DateTime2), N'Nam', CAST(N'2022-12-23T20:59:34.7311430' AS DateTime2), CAST(N'2023-03-06T11:33:46.8248770' AS DateTime2), 1, N'/user-content/fb7e18fc-ab43-4e61-9453-eee44b17089c.jpg', N'nms1010', N'NMS1010', N'nguyenminhson102002@gmail.com', N'NGUYENMINHSON102002@GMAIL.COM', 1, N'AQAAAAEAACcQAAAAEA8IQvfyTufjaRbwnotypUR5xWIzwsKehlyZnTXI5APoD5CCQEAiC37rczTGrIAamw==', N'2YIAQQE33SV6QW6OHTGRNRP3GBIVVT6B', N'059653cd-b14e-4073-aaaa-94e1d3e23b78', N'0354964840', 0, 0, CAST(N'2023-03-05T17:53:03.5020500+00:00' AS DateTimeOffset), 1, 0, N'R2aqXtmypsRUvZl4laG1ZJpfgmGTK+Jl6XHrsgSmxiZ9VTZ3iH8XQlumgLMEV/GuWMxygr/ZbK2Uughf0lAhpg==', CAST(N'2023-05-20T23:07:01.2278717' AS DateTime2))
INSERT [dbo].[User] ([Id], [FirstName], [LastName], [DateOfBirth], [Gender], [DateCreated], [DateUpdated], [Status], [Avatar], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [RefreshToken], [RefreshTokenExpiredTime]) VALUES (N'dce9cb18-fb64-43c5-b0de-1958fac41599', N'Nguyễn', N'Sơn', CAST(N'2023-04-15T00:00:00.0000000' AS DateTime2), N'Nam', CAST(N'2023-04-15T17:33:58.1841118' AS DateTime2), CAST(N'2023-04-15T17:33:58.1841147' AS DateTime2), 0, N'/user-content/365fc3ba-aa68-47e5-8f10-932eab6ca126.jpg', N'test3', N'TEST3', N'20110713@student.hcmute.edu.vn', N'20110713@STUDENT.HCMUTE.EDU.VN', 1, N'AQAAAAEAACcQAAAAEOqlctM3QVILff+6eXK8pNmip6udW6lfgTvrxRzmqSE19F7QDz/75cSidHlsCtgbTQ==', N'T6AZIN5JZFOC7YOTHDLJ2K37BHLXNIZ7', N'7adcc099-bbcd-4464-bda6-acd54ae68299', N'0354964843', 0, 0, NULL, 1, 0, NULL, CAST(N'2023-05-19T18:43:52.3641870' AS DateTime2))
GO
INSERT [dbo].[UserLogins] ([LoginProvider], [ProviderKey], [ProviderDisplayName], [UserId]) VALUES (N'Google', N'101583216491818405737', N'Google', N'dce9cb18-fb64-43c5-b0de-1958fac41599')
INSERT [dbo].[UserLogins] ([LoginProvider], [ProviderKey], [ProviderDisplayName], [UserId]) VALUES (N'Google', N'106272368456595085295', N'Google', N'48200de6-8eb5-4640-9c04-1b298d7c6678')
GO
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (N'48200de6-8eb5-4640-9c04-1b298d7c6678', N'be51e5f7-f1ac-4c92-bfa2-b257b6d1072e')
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (N'dce9cb18-fb64-43c5-b0de-1958fac41599', N'be51e5f7-f1ac-4c92-bfa2-b257b6d1072e')
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (N'48200de6-8eb5-4640-9c04-1b298d7c6678', N'f900f6d9-9e6b-4c6f-a711-09fdfd84e9be')
GO
SET IDENTITY_INSERT [dbo].[Ward] ON 

INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (2, 22696, N'Xã Bình Lộc')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (16, 22384, N'Xã Vĩnh Lương')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (18, 26815, N'Phường Linh Chiểu')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (21, 1, N'Phường Phúc Xá')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (1013, 26842, N'Phường Tăng Nhơn Phú A')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (1014, 26821, N'Phường Linh Đông')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (1015, 26842, N'Phường Tăng Nhơn Phú A')
INSERT [dbo].[Ward] ([WardId], [WardCode], [WardName]) VALUES (1017, 20287, N'Phường Hoà Quý')
SET IDENTITY_INSERT [dbo].[Ward] OFF
GO
SET IDENTITY_INSERT [dbo].[WishListItem] ON 

INSERT [dbo].[WishListItem] ([WishItemId], [ProductId], [UserId], [Status], [DateAdded]) VALUES (30, 4, N'48200de6-8eb5-4640-9c04-1b298d7c6678', 0, CAST(N'2023-04-17T21:03:28.6157959' AS DateTime2))
INSERT [dbo].[WishListItem] ([WishItemId], [ProductId], [UserId], [Status], [DateAdded]) VALUES (31, 3, N'48200de6-8eb5-4640-9c04-1b298d7c6678', 0, CAST(N'2023-04-23T16:47:29.6457857' AS DateTime2))
INSERT [dbo].[WishListItem] ([WishItemId], [ProductId], [UserId], [Status], [DateAdded]) VALUES (32, 1, N'48200de6-8eb5-4640-9c04-1b298d7c6678', 0, CAST(N'2023-05-13T19:55:31.5557604' AS DateTime2))
SET IDENTITY_INSERT [dbo].[WishListItem] OFF
GO
ALTER TABLE [dbo].[DeliveryMethod] ADD  DEFAULT (N'') FOR [Image]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT ((0)) FOR [AddressId]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT ((0)) FOR [DeliveryMethodId]
GO
ALTER TABLE [dbo].[PaymentMethod] ADD  DEFAULT (N'') FOR [Image]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT ('0001-01-01T00:00:00.0000000') FOR [RefreshTokenExpiredTime]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_District_DistrictId] FOREIGN KEY([DistrictId])
REFERENCES [dbo].[District] ([DistrictId])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_District_DistrictId]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_Province_ProvinceId] FOREIGN KEY([ProvinceId])
REFERENCES [dbo].[Province] ([ProvinceId])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_Province_ProvinceId]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_User_UserId]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_Ward_WardId] FOREIGN KEY([WardId])
REFERENCES [dbo].[Ward] ([WardId])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_Ward_WardId]
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD  CONSTRAINT [FK_CartItem_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
GO
ALTER TABLE [dbo].[CartItem] CHECK CONSTRAINT [FK_CartItem_Product_ProductId]
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD  CONSTRAINT [FK_CartItem_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[CartItem] CHECK CONSTRAINT [FK_CartItem_User_UserId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Address_AddressId] FOREIGN KEY([AddressId])
REFERENCES [dbo].[Address] ([AddressId])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Address_AddressId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_DeliveryMethod_DeliveryMethodId] FOREIGN KEY([DeliveryMethodId])
REFERENCES [dbo].[DeliveryMethod] ([DeliveryMethodId])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_DeliveryMethod_DeliveryMethodId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Discount_DiscountId] FOREIGN KEY([DiscountId])
REFERENCES [dbo].[Discount] ([DiscountId])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Discount_DiscountId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_OrderState_OrderStateId] FOREIGN KEY([OrderStateId])
REFERENCES [dbo].[OrderState] ([OrderStateId])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_OrderState_OrderStateId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_PaymentMethod_PaymentMethodId] FOREIGN KEY([PaymentMethodId])
REFERENCES [dbo].[PaymentMethod] ([PaymentMethodId])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_PaymentMethod_PaymentMethodId]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_User_UserId]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderItem_Order_OrderId] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Order] ([OrderId])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Order_OrderId]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderItem_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Product_ProductId]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderItem_Review_ReviewItemId] FOREIGN KEY([ReviewItemId])
REFERENCES [dbo].[Review] ([ReviewItemId])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Review_ReviewItemId]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_Brand_BrandId] FOREIGN KEY([BrandId])
REFERENCES [dbo].[Brand] ([BrandId])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Brand_BrandId]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([CategoryId])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Category_CategoryId]
GO
ALTER TABLE [dbo].[ProductImage]  WITH CHECK ADD  CONSTRAINT [FK_ProductImage_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
GO
ALTER TABLE [dbo].[ProductImage] CHECK CONSTRAINT [FK_ProductImage_Product_ProductId]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_Product_ProductId]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_User_UserId]
GO
ALTER TABLE [dbo].[RoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_RoleClaims_Roles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[RoleClaims] CHECK CONSTRAINT [FK_RoleClaims_Roles_RoleId]
GO
ALTER TABLE [dbo].[UserClaims]  WITH CHECK ADD  CONSTRAINT [FK_UserClaims_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserClaims] CHECK CONSTRAINT [FK_UserClaims_User_UserId]
GO
ALTER TABLE [dbo].[UserLogins]  WITH CHECK ADD  CONSTRAINT [FK_UserLogins_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserLogins] CHECK CONSTRAINT [FK_UserLogins_User_UserId]
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD  CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[UserRoles] CHECK CONSTRAINT [FK_UserRoles_Roles_RoleId]
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD  CONSTRAINT [FK_UserRoles_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserRoles] CHECK CONSTRAINT [FK_UserRoles_User_UserId]
GO
ALTER TABLE [dbo].[UserTokens]  WITH CHECK ADD  CONSTRAINT [FK_UserTokens_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserTokens] CHECK CONSTRAINT [FK_UserTokens_User_UserId]
GO
ALTER TABLE [dbo].[WishListItem]  WITH CHECK ADD  CONSTRAINT [FK_WishListItem_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
GO
ALTER TABLE [dbo].[WishListItem] CHECK CONSTRAINT [FK_WishListItem_Product_ProductId]
GO
ALTER TABLE [dbo].[WishListItem]  WITH CHECK ADD  CONSTRAINT [FK_WishListItem_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[WishListItem] CHECK CONSTRAINT [FK_WishListItem_User_UserId]
GO

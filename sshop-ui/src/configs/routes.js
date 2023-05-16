const client = {
    home: '/',
    shop: '/shop',
    auth: '/auth',
    signup: '/signup',
    forbidden: '/forbidden',
    cart: '/cart',
    wish_list: '/wish-list',
    product_detail: '/products/:productId',
    checkout: '/checkout',
    profile: '/user/account/profile',
    orders: '/user/purchase/orders',
    order_items: '/user/purchase/orders/:orderId',
    verify: '/register-confirm',
    forgot_password: '/forgot-password',
    reset_password: '/reset-password',
};
const admin = {
    admin_home: '/admin/',
    admin_users: '/admin/users',
    admin_roles: '/admin/roles',
    admin_categories: '/admin/categories',
    admin_brands: '/admin/brands',
    admin_profile: '/admin/profile',
    admin_products: '/admin/products',
    admin_orders: '/admin/orders',
    admin_order_detail: '/admin/orders/:orderId',
    admin_deliveryMethod: '/admin/deliveries',
    admin_reviews: '/admin/reviews',
};
const routes = {
    ...client,
    ...admin,
};
export default routes;

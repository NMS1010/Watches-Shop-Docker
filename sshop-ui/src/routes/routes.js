import {
    Home,
    Shop,
    Login,
    Register,
    Cart,
    WishList,
    ProductDetail,
    Checkout,
    Profile,
    Order,
    OrderItem,
    RegisterConfirm,
    ForgotPassword,
    ChangePassword,
} from '../pages/Client';
import {
    Dashboard,
    User,
    Brand,
    Category,
    Product,
    AdminProfile,
    Role,
    Forbidden,
    OrderAdmin,
    OrderDetail,
    Delivery,
    ReviewAdmin,
} from '../pages/Admin';
import { AdminLayout, ClientLayout } from '../layouts';
import config from '../configs/index';
import ProductForm from '../pages/Admin/components/ProductForm';
//not login
const publicRoutes = [
    { path: config.routes.home, component: Home, layout: ClientLayout, private: false, roles: [] },
    { path: config.routes.shop, component: Shop, layout: ClientLayout, private: false, roles: [] },
    { path: config.routes.auth, component: Login, layout: ClientLayout, private: false, roles: [] },
    { path: config.routes.signup, component: Register, layout: ClientLayout, private: false, roles: [] },
    { path: config.routes.forbidden, component: Forbidden, layout: null, private: false, roles: [] },
    { path: config.routes.product_detail, component: ProductDetail, layout: ClientLayout, private: false, roles: [] },
    { path: config.routes.verify, component: RegisterConfirm, layout: null, private: false, roles: [] },
    { path: config.routes.reset_password, component: ChangePassword, layout: null, private: false, roles: [] },
    { path: config.routes.forgot_password, component: ForgotPassword, layout: ClientLayout, private: false, roles: [] },
];

//must login
const privateRoutes = [
    { path: config.routes.admin_home, component: Dashboard, layout: AdminLayout, private: true, roles: ['admin'] },
    { path: config.routes.admin_users, component: User, layout: AdminLayout, private: true, roles: ['admin'] },
    { path: config.routes.admin_roles, component: Role, layout: AdminLayout, private: true, roles: ['admin'] },
    { path: config.routes.admin_categories, component: Category, layout: AdminLayout, private: true, roles: ['admin'] },
    { path: config.routes.admin_brands, component: Brand, layout: AdminLayout, private: true, roles: ['admin'] },
    {
        path: config.routes.admin_deliveryMethod,
        component: Delivery,
        layout: AdminLayout,
        private: true,
        roles: ['admin'],
    },
    {
        path: config.routes.admin_profile,
        component: AdminProfile,
        layout: AdminLayout,
        private: true,
        roles: ['admin'],
    },
    { path: config.routes.admin_products, component: Product, layout: AdminLayout, private: true, roles: ['admin'] },
    {
        path: config.routes.admin_product_detail,
        component: ProductForm,
        layout: AdminLayout,
        private: true,
        roles: ['admin'],
    },
    { path: config.routes.admin_orders, component: OrderAdmin, layout: AdminLayout, private: true, roles: ['admin'] },
    { path: config.routes.admin_reviews, component: ReviewAdmin, layout: AdminLayout, private: true, roles: ['admin'] },
    {
        path: config.routes.admin_order_detail,
        component: OrderDetail,
        layout: AdminLayout,
        private: true,
        roles: ['admin'],
    },

    { path: config.routes.cart, component: Cart, layout: ClientLayout, private: true, roles: ['customer', 'admin'] },
    {
        path: config.routes.checkout,
        component: Checkout,
        layout: ClientLayout,
        private: true,
        roles: ['customer', 'admin'],
    },
    {
        path: config.routes.wish_list,
        component: WishList,
        layout: ClientLayout,
        private: true,
        roles: ['customer', 'admin'],
    },
    {
        path: config.routes.profile,
        component: Profile,
        layout: ClientLayout,
        private: true,
        roles: ['customer', 'admin'],
    },
    {
        path: config.routes.orders,
        component: Order,
        layout: ClientLayout,
        private: true,
        roles: ['customer', 'admin'],
    },
    {
        path: config.routes.order_items,
        component: OrderItem,
        layout: ClientLayout,
        private: true,
        roles: ['customer', 'admin'],
    },
];

const routes = [...publicRoutes, ...privateRoutes];
export default routes;

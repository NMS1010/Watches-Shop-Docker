import dashboardIcon from '../../../assets/images/admin/icons/dashboard.svg';
import userIcon from '../../../assets/images/admin/icons/user.svg';
import categoryIcon from '../../../assets/images/admin/icons/category.svg';
import brandIcon from '../../../assets/images/admin/icons/brand.svg';
import productIcon from '../../../assets/images/admin/icons/product.png';
import roleIcon from '../../../assets/images/admin/icons/role.png';
import inventoryIcon from '../../../assets/images/admin/icons/inventory.png';
import deliveryIcon from '../../../assets/images/admin/icons/fast-delivery.png';
import reviewIcon from '../../../assets/images/admin/icons/reviews.png';
import config from '../../../configs';

const sideBarItemList = [
    {
        path: config.routes.admin_home,
        content: 'Dashboard',
        icon: dashboardIcon,
    },
    {
        path: config.routes.admin_users,
        content: 'Users',
        icon: userIcon,
    },
    {
        path: config.routes.admin_roles,
        content: 'Roles',
        icon: roleIcon,
    },
    {
        path: config.routes.admin_categories,
        content: 'Categories',
        icon: categoryIcon,
    },
    {
        path: config.routes.admin_brands,
        content: 'Brands',
        icon: brandIcon,
    },
    {
        path: config.routes.admin_products,
        content: 'Products',
        icon: productIcon,
    },
    {
        path: config.routes.admin_orders,
        content: 'Orders',
        icon: inventoryIcon,
    },
    {
        path: config.routes.admin_deliveryMethod,
        content: 'Deliveries',
        icon: deliveryIcon,
    },
    {
        path: config.routes.admin_reviews,
        content: 'Review',
        icon: reviewIcon,
    },
];

export default sideBarItemList;

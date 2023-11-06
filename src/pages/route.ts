export const ROUTES ={
    HOME: '/',
    PAYMENT_SUCCESS: '/payment-success',
    ORDER: '/orders',
    ORDER_DETAIL: (id)=> `/orders/${id}`,
    PRODUCT_DETAIL :(id) => `/products/${id}`,
    USER_ADDRESS: '/addresses',
    USER_ADDRESS_ADD: '/addresses-add',
    NOT_FOUND: '*'
}
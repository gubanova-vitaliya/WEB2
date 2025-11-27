import React from 'react';
import ShoppingCart from '../components/ShoppingCart';

export function ShoppingCartPage() {
    return (
        <div className="container">
            <h1>Корзина товаров</h1>
            <ShoppingCart />
        </div>
    );
}

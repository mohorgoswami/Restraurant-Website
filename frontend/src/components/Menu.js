import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from './MenuItem';
import Cart from './Cart';
import './Menu.css';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const userId = 'user123'; // In a real app, this would come from authentication

    useEffect(() => {
        fetchMenuItems();
        fetchCart();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (menuItemId) => {
        try {
            await axios.post(`http://localhost:5000/api/cart/${userId}/add`, {
                menuItemId,
                quantity: 1
            });
            fetchCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (menuItemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${userId}/remove/${menuItemId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <div className="menu-container">
            <div className="menu-items">
                {menuItems.map(item => (
                    <MenuItem 
                        key={item._id}
                        item={item}
                        onAddToCart={() => addToCart(item._id)}
                    />
                ))}
            </div>
            <Cart 
                cart={cart}
                onRemoveFromCart={removeFromCart}
            />
        </div>
    );
};

export default Menu;
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.removeItem('@GoMarketplace:cart');
      const cartProducts = await AsyncStorage.getItem('@GoMarketplace:cart');
      // console.log(cartProducts);
      if (cartProducts) {
        setProducts(JSON.parse(cartProducts));
      }
      // console.log(products);
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const productAlreadyInTheCart = products.find(
        listProduct => listProduct.id === product.id,
      );
      if (!productAlreadyInTheCart) {
        const newProduct: Product = { ...product, quantity: 1 };
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify([...products, newProduct]),
        );
        setProducts([...products, newProduct]);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex) {
        products[productIndex].quantity += 1;
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify([...products]),
        );
        setProducts([...products]);
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex && products[productIndex].quantity > 0) {
        products[productIndex].quantity -= 1;

        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify([...products]),
        );
        setProducts([...products]);
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

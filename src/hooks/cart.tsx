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

      if (cartProducts) {
        setProducts([...JSON.parse(cartProducts)]);
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const productExists = products.find(
        cartProduct => cartProduct.id === product.id,
      );

      if (productExists) {
        setProducts(
          products.map(cartProduct =>
            cartProduct.id === product.id
              ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
              : cartProduct,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      setProducts(
        products.map(cartProduct =>
          cartProduct.id === id
            ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
            : cartProduct,
        ),
      );
      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify([...products]),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      setProducts(
        products.map(cartProduct =>
          cartProduct.id === id
            ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
            : cartProduct,
        ),
      );
      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify([...products]),
      );
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

import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (products.length > 0) {
      const cartTotalSum = products
        .map(product => product.quantity * product.price)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
      return formatValue(cartTotalSum);
    }
    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products.length > 0) {
      const totalItemsInCartSum = products
        .map(product => product.quantity)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });

      return totalItemsInCartSum;
    }
    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;

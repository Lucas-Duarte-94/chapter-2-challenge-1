import { render } from '@testing-library/react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const res = await (
        await api.get(`/products/${productId}`)).data as {
          id: number;
          title: string;
          price: number;
          image: string;
          amount: number;
        }
      const stockAmount = await (
        await api.get(`/stock/${productId}`)
      ).data as {id: number; amount: number}


      console.log('estoque maximo: ' + stockAmount.amount)                                            // falta verificar quantidade no estoque

      if(cart.find(x => x.id === productId) === undefined) {
        setCart([...cart, {...res, amount:1}])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, {...res, amount:1}]))
      } else {
        updateProductAmount({productId, amount:1})
      }
        
      

    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const removedItem = cart.reduce((filtered, product) => {
        if(productId !== product.id) {
          filtered.push(product)
        }
        
        return filtered;
      }, [] as Product[]) 
      setCart(removedItem)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(removedItem))
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      cart.forEach(product => {
        if(product.id === productId) {
          product.amount += amount
          console.log('passou')
        }
      })
      setCart(cart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

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

export const CartContext = createContext<CartContextData>({} as CartContextData);

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
      const info = await api.get(`/products/${productId}`)

      const res = info.data as Product

      const updatedCart = [...cart]

      const product = updatedCart.find(x => x.id === productId)
      const productAmount = product ? product.amount : 0;

      const stock = await api.get<Stock>(`/stock/${productId}`)
      const stockAmount = stock.data.amount

      if(productAmount >= stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(product) {
          product.amount = productAmount +1

      } else {
        updatedCart.push({...res, amount:1})
      }
      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      
        
    } catch {
      // TODO
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      if(cart.findIndex(product => product.id === productId) < 0) {
        throw Error()
      }

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
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const stock = await api.get<Stock>(`/stock/${productId}`)
      const stockAmount = stock.data.amount

      const updatedCart = [...cart]

      if(amount <=0) {
        return;
      }

      if(amount > stockAmount ) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      updatedCart.forEach(product => {
        if(product.id === productId) {
          product.amount = amount
        }
      })

      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      
    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
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
